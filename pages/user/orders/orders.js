// pages/tabbar/user/orders/orders.js
const app = getApp();
import http from '../../../utils/http';
import login from '../../../stores/Login';
const { regeneratorRuntime } = global;
Page({

  /**
   * 页面的初始数据
   */
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.status) {
      this.setData({ selected: options.status });
    }
    this.fetchList(options.status || '')
  },
  async fetchList(status) {
    const result = await login();
    const data = { page: this.data.page };
    if(status != ''){
      data.otype = status;
    }
    http.request({
      url: '/api/user/allorder',
      method: 'POST',
      header: {
        token: result.user_token
      },
      showLoading: true,
      data: data,
      success: (response) => {
        const list = this.data.list;
        //没有更多了
        const end = response.data.data.totalpage == this.data.page;
        const data = response.data.data.list;
        data.forEach(item => {
          switch (item.order_status) {
            case 0:
              item.status = '待付款';
              break;
            case 1:
              item.status = '已付款';
              break;
            case 2:
              item.status = '已发货';
              break;
            case -1:
              item.status = '已取消';
              break;
            case -11:
              item.status = '申请退款';
              break;
            case -12:
              item.status = '退款中';
              break;
            case -13:
              item.status = '退款驳回';
              break;
            case -14:
              item.status = '退款完成';
              break;
          }
          item.items_info.forEach(i=>{
            i.goods.forEach(g => {
              g.price = Number.parseFloat(g.price).toFixed(2)
            }); 
          })
          item.price = Number.parseFloat(item.money).toFixed(2);
        });
        this.setData({ list: list.concat(data), end, loading: false, page: this.data.page + 1 })
      }
    });
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

  //取消订单
  cancelOrder(e) {
    const { id } = e.currentTarget.dataset;
  },

  //删除订单
  deleteOrder(e) {
    const { id } = e.currentTarget.dataset;
    http.request({
      url: '/api/user/deleteorder',
      method: "POST",
      data: {

      },
      success: (response) => {

      }
    });
  },

  //支付订单
  async payOrder(e) {
    const { id } = e.currentTarget.dataset;
    const result = await login();
    http.request({
      url: '/api/order/topay',
      method: 'POST',
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
            // wx.redirectTo({
            //   url: '/pages/user/orders/orders',
            // });
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
                  wx.redirectTo({
                    url: '/pages/user/orders/orders',
                  });
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
  confirmOrder(e) {
    const { id } = e.currentTarget.dataset;
  }
})