// pages/tabbar/user/orders/orders.js
const app = getApp();
import { observer } from '../../../utils/mobx/observer';
import http from '../../../utils/http';
import login from '../../../stores/Login';
const { regeneratorRuntime } = global;
Page(observer({
    props: {
        order: require('../../../stores/Order'),
    },
    data: {
        /*
            nvabarData: {
              showCapsule: true, //是否显示左上角图标
              title: '我的订单', //导航栏 中间的标题
              transparent: false, //透明导航栏
            },
        */
        status: [
            { text: '全部', value: '' },
            { text: '待付款', value: '0' },
            { text: '待发货', value: '1' },
            { text: '待收货', value: '2' },
            { text: '待评价', value: '3' },
        ],
        selected: '',
        //当前页数
        page: 1,
        list: [],
        loading: false,
        //没有更多数据了
        end: false,
        // occupation: app.globalData.height + 46,
    },
    onLoad: function (options) {
        let status = '';
        if (options.status) {
            status = options.status;
        }
        this.setData({ selected: status }, () => {
            this.fetchList()
        });
    },

    onShow(){
        //todo
    },

    async fetchList() {
        const result = await login();

        http.request({
            url: '/api/user/allorder',
            method: 'POST',
            header: {
                token: result.user_token
            },
            showLoading: true,
            data: {
                page: this.data.page,
                otype: this.data.selected
            },
            success: (response) => {
                const list = this.data.list;
                //没有更多了
                const end = response.data.data.totalpage == this.data.page;
                const data = response.data.data.list;
                data.forEach(item => {
                    item.status = this.getStatusText(item.order_status);
                    item.items_info.forEach(i => {
                        i.goods.forEach(g => {
                            g.price = Number.parseFloat(g.price).toFixed(2)
                        });
                        i.status = this.getStatusText(i.item_status);
                    })
                    item.price = Number.parseFloat(item.money).toFixed(2);
                });
                this.setData({ list: list.concat(data), end, loading: false, page: this.data.page + 1 })
            }
        });
    },

    getStatusText(num) {
        switch (num) {
            case 0:
                return '待付款';
            case 1:
                return '已付款';
            case 2:
                return '已发货';
            case 3:
                return '交易完成';
            case 4:
                return '已评价';
            case -1:
                return '已取消';
            case -11:
                return '申请退款';
            case -12:
                return '退款中';
            case -13:
                return '退款驳回';
            case -14:
                return '退款完成';
        }
    },

    onReachBottom() {
        if (this.data.loading || this.data.end) return;
        this.setData({ loading: true }, () => {
            this.fetchList(this.data.selected);
        });
    },

    switchStatus(e) {
        const { status } = e.currentTarget.dataset;
        //切换分类 重置页数
        this.setData({ selected: status, page: 1, list: [] }, () => {
            this.fetchList(status)
        });
    },

    //刷新数据
    refresh() {
        this.setData({ list: [], page: 1 }, () => {
            this.fetchList()
        })
    },

    //取消订单
    async cancelOrder(e) {
        const { id } = e.currentTarget.dataset;
        const result = await login();
        http.request({
            url: '/api/user/cancelorder',
            method: 'POST',
            header: {
                token: result.user_token
            },
            data: { orderid: id },
            success: (response) => {
                wx.showToast({
                    title: '订单已取消',
                    icon: 'success',
                    duration: 1500,
                    mask: false,
                });
                this.refresh()
            }
        })
    },

    //删除订单
    async deleteOrder(e) {
        const { id } = e.currentTarget.dataset;
        const result = await login();
        wx.showModal({
            title: '提示',
            content: '确认删除该订单吗？',
            showCancel: true,
            cancelText: '取消',
            cancelColor: '#000000',
            confirmText: '确定',
            confirmColor: '#3CC51F',
            success: (result) => {
                if (result.confirm) {
                    http.request({
                        url: '/api/user/deleteorder',
                        method: "POST",
                        header: {
                            token: result.user_token
                        },
                        data: {
                            item_id: id
                        },
                        success: (response) => {
                            if (response.data.code == 1) {
                                //删除成功
                                wx.showToast({
                                    title: '删除成功',
                                    icon: 'success',
                                    duration: 1500,
                                    mask: false,
                                });
                                this.refresh()
                            }
                        }
                    });
                }
            },
            fail: () => { },
            complete: () => { }
        });
    },

    //退款订单
    async refundOrder(e) {
        const oVal=e.currentTarget.dataset.item;
        this.props.order.refundOrder = oVal;
        wx.setStorageSync('refundOrder', oVal)
        wx.navigateTo({
            url: '/pages/user/orders/refund/refund'
        })
    },

    //支付订单
    async payOrder(e) {
        const { id } = e.currentTarget.dataset;
        const result = await login();
        http.request({
            url: '/api/order/topay',
            method: 'POST',
            showLoading: true,
            data: {
                orderid: id
            },
            header: {
                token: result.user_token
            },
            success: (response) => {
                wx.requestPayment({
                    timeStamp: response.data.data.timeStamp,
                    nonceStr: response.data.data.nonceStr,
                    package: response.data.data.package,
                    signType: response.data.data.signType,
                    paySign: response.data.data.paySign,
                    success(res) {
                        wx.redirectTo({
                            url: '/pages/tabbar/cart/success/success',
                        });
                    },
                    fail(res) {
                        //取消支付
                        if (res.errMsg == 'requestPayment:fail cancel') {
                            wx.showModal({
                                title: '提示',
                                content: '您取消了支付，请及时支付',
                                showCancel: true,
                                cancelText: '取消',
                                cancelColor: '#000000',
                                confirmText: '确定',
                                confirmColor: '#3CC51F',
                                success: (result) => {
                                    this.refresh()
                                },
                                fail: () => { },
                            });
                        }
                    },
                    complete: function (res) {

                    }
                })
            }
        })
    },

    //确认收货
    async confirmOrder(e) {
        const { id } = e.currentTarget.dataset;
        const result = await login();
        http.request({
            url: '/api/user/confirmgoods',
            method: 'POST',
            header: {
                token: result.user_token
            },
            data: {
                orderid: id
            },
            success: (response) => {
                wx.showToast({
                    title: '已收货',
                    icon: 'success',
                    duration: 1500,
                    mask: false,
                });
                this.refresh()
            }
        })
    }
}))
