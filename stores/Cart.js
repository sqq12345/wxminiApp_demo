/**
 * 购物车
 */
const { regeneratorRuntime } = global;
const extendObservable = require('../utils/mobx/mobx').extendObservable;
const autorun = require('../utils/mobx/mobx').autorun;
let Cart = function () {
    extendObservable(this, {
        list: [],
        allSelected: true,
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
//全选
Cart.prototype.selectAll = function () {
    this.allSelected = !this.allSelected;
    this.list.map(item => {
        item.selected = this.allSelected;
        item.goods.map(goods => {
            goods.selected = this.allSelected;
        })
    })
}
const Store = new Cart();
//模拟请求
setTimeout(function () {
    const json = [
        {
            shop: { id: 1, name: '农场名1' },
            goods: [
                {
                    thumb: '', name: 'goods1', price: 24, unit: '规格', count: 2,
                },
                {
                    thumb: '', name: 'goods2', price: 8, unit: '规格', count: 1
                },
            ]
        },
        {
            shop: { id: 1, name: '农场名2' },
            goods: [
                {
                    thumb: '', name: 'goods3', price: 36, unit: '规格', count: 1
                },
            ]
        },
        {
            shop: { id: 1, name: '农场名3' },
            goods: [
                {
                    thumb: '', name: 'goods3', price: 36, unit: '规格', count: 1
                },
            ]
        },
        {
            shop: { id: 1, name: '农场名4' },
            goods: [
                {
                    thumb: '', name: 'goods3', price: 36, unit: '规格', count: 1
                },
            ]
        },
    ];
    json.map(item => {
        item.selected = true;
        item.select = function () {
            this.selected = !this.selected;
            this.goods.map(item => { item.selected = this.selected });
            Store.allSelected = !Store.list.some((item)=>{
                return !item.selected; 
            });
        }
        item.goods.map(goods => {
            goods.selected = true;
            goods.increase = function () {
                this.count = this.count + 1
            };
            goods.reduce = function () {
                if (this.count == 1) return;
                this.count = this.count - 1
            };
            goods.select = function () {
                this.selected = !this.selected;
                Store.allSelected = !Store.list.some((item)=>{
                    const b = item.goods.some((goods)=>{
                        return !goods.selected
                    });
                    item.selected = !b;
                    return b; 
                });
            };
            goods.total = 0;
            Object.defineProperty(goods,'total',{
                get(){
                    return (this.price * this.count).toFixed(2);
                }
            })
        })
    });
    Store.list = json;
}, 1000);

module.exports = Store