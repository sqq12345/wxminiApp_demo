import http from '../utils/http';
import login from './Login';
/**
 * 购物车
 */
const { regeneratorRuntime } = global;
const extendObservable = require('../utils/mobx/mobx').extendObservable;
let Cart = function () {
    extendObservable(this, {
        totalNumber: 0, //商品总个数
        list: [],
        allSelected: false,
        //计算总金额
        get total() {
            return this.list.reduce((total, item) => {
                return total + item.goods.reduce((itemTotal, goods) => {
                    if (!goods.selected) return itemTotal;
                    return itemTotal + goods.price * goods.count;
                }, 0)
            }, 0).toFixed(2)
        }
    })
}
function select(token, selected, ids) {
    console.log(selected,ids)
    http.request({
        url: selected ? '/api/order/cartselect' : '/api/order/cartnoselect',
        method: 'POST',
        header: {
            token: token,
        },
        data: {
            cartid: ids,
        },
        success: (response) => {

        }
    });
}
Cart.prototype.fetchData = async function () {
    const result = await login();
    const list = [];
    this.totalNumber = 0;
    await http.request({
        url: '/api/order/cartlist',
        header: {
            token: result.user_token,
        },
        showLoading: true,
        success: (response) => {
            const data = response.data.data;
            let allSelected = true;
            for (const key in data) {
                const item = data[key];
                const json = { shop: {}, goods: [] };
                json.shop.id = key;
                json.shop.name = item.mid.name;
                json.shop.logo = item.mid.logo;
                item.gid.forEach(g => {
                    const goods = {};
                    goods.cartid = g.cartid;
                    goods.image = g.image;
                    goods.name = g.title;
                    goods.price = g.price;
                    // goods.price = Number.parseFloat(g.price);
                    goods.unit = g.specification;
                    goods.count = g.num;
                    goods.selected = g.status == 1;
                    goods.id = g.id;
                    goods.num = 1;
                    //库存为零不选中
                    if(g.stock == 0){
                        // goods.selected=0;
                        //禁用
                        goods.disabled = true;
                    }
                    if (!goods.selected) {
                        allSelected = false;
                    }
                    json.goods.push(goods);
                    //总个数
                    this.totalNumber += goods.num;
                });
                Store.allSelected = allSelected
                list.push(json);
            }
            const _this = this;
            list.map(item => {
                let item_selected = true;
                //选中商家
                item.select = function () {
                    this.selected = !this.selected;
                    let ids = '';
                    this.goods.map(item => {
                        if(item.disabled){
                            return false;
                        }
                        ids += item.cartid + ',';
                        item.selected = this.selected;
                    });
                    Store.allSelected = !Store.list.some((item) => {
                        return !item.selected;
                    });
                    select(result.user_token, this.selected, ids);
                }
                item.goods.map(goods => {
                    if (!goods.selected) {
                        item_selected = false;
                    }
                    //购物车加一
                    goods.increase = async function () {
                        if(this.disabled){
                            return false;
                        }
                        // _this.totalNumber++;
                        //显示角标
                        _this.setTabbar();
                        this.count = this.count + 1;
                        const result = await login();
                        http.request({
                            url: '/api/order/addcart',
                            method: 'POST',
                            header: {
                                token: result.user_token,
                            },
                            data: {
                                cartid: this.cartid,
                            },
                            success: (response) => {
                                //加一成功
                            }
                        });
                    };
                    //购物车减一
                    goods.reduce = async function () {
                        if(this.disabled){
                            return false;
                        }
                        //为零
                        if (this.count == 1) return;
                        // _this.totalNumber--;
                        //显示角标
                        _this.setTabbar();
                        this.count = this.count - 1;
                        const result = await login();
                        http.request({
                            url: '/api/order/minuscart',
                            method: 'POST',
                            header: {
                                token: result.user_token,
                            },
                            data: {
                                cartid: this.cartid,
                            },
                            success: (response) => {
                                //减一成功
                            }
                        });
                    };
                    //选中商品
                    goods.select = async function () {
                        if(this.disabled) return false;
                        this.selected = !this.selected;
                        Store.allSelected = !Store.list.some((item) => {
                            const b = item.goods.some((goods) => {
                                return !goods.selected
                            });
                            item.selected = !b;
                            return b;
                        });

                        const result = await login();
                        select(result.user_token, this.selected, this.cartid);
                    };
                    goods.total = 0;
                    Object.defineProperty(goods, 'total', {
                        get() {
                            return (this.price * this.count).toFixed(2);
                        }
                    })
                })
                item.selected = item_selected;
                //是否结算
                item.settle = false;
                Object.defineProperty(item, 'settle', {
                    get() {
                        //有一个商品选中
                        return this.goods.some(g => {
                            return g.selected
                        })
                    }
                })
            });
        }
    });
    //显示角标
    this.setTabbar();
    Store.list = list;
}
//设置角标数量
Cart.prototype.setTabbar = function () {
    if (this.totalNumber == 0) {
        wx.removeTabBarBadge(
            { index: 2 },
        )
        return
    }
    wx.setTabBarBadge({
        index: 2,
        text: this.totalNumber + ''
    })
}
//全选
Cart.prototype.selectAll = async function () {
    this.allSelected = !this.allSelected;
    let ids = '';
    this.list.map(item => {
        item.selected = this.allSelected;
        item.goods.map(goods => {
            if(!goods.disabled){
                ids += goods.cartid + ',';
                goods.selected = this.allSelected;
            }
        })
    })
    const result = await login();
    select(result.user_token, this.allSelected, ids);
}
//删除
Cart.prototype.delete = async function () {
    const list = this.list;
    let ids = '';
    this.list.forEach((item, index) => {
        const goods = [];
        item.goods.forEach(g => {
            if (!g.selected) {
                goods.push(g)
            } else {
                ids += g.cartid + ',';
            }
        })
        list[index].goods = goods;
    })
    const list2 = [];
    list.forEach(item => {
        if (item.goods.length != 0) {
            list2.push(item);
        }
    })
    this.list = list2;
    let totalNumber = 0;
    this.list.forEach(item => {
        item.goods.forEach(goods => {
            totalNumber += goods.count
        })
    });
    this.totalNumber = totalNumber;
    this.setTabbar();
    const result = await login();
    http.request({
        url: '/api/order/minus',
        method: 'POST',
        header: {
            token: result.user_token,
        },
        data: { cartids: ids },
        success: (response) => {
            //删除成功
        }
    });
}
const Store = new Cart();
module.exports = Store
