// pages/tabbar/user/orders/orders.js
import http from '../../../utils/http';
import login from '../../../stores/Login';
const { regeneratorRuntime } = global;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nvabarData: {
      showCapsule: true, //是否显示左上角图标
      title: '我的订单', //导航栏 中间的标题
      transparent: false, //透明导航栏
    },
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
    http.request({
      url: '/api/user/allorder',
      method: 'POST',
      header: {
        token: result.user_token
      },
      showLoading: true,
      data: {
        page: this.data.page,
        otype: status
      },
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
            case 3:
              item.status = '交易成功';
              break;
          }
          item.goods.forEach(g => {
            g.price = Number.parseFloat(g.price).toFixed(2)
          })
        });
        this.setData({ list: list.concat(data), end, loading: false, page: this.data.page + 1 })
      }
    });
  },

  onReachBottom() {
    if (this.data.loading || this.data.end) return;
    this.setData({ loading: true }, () => {
      this.fetchList(this.data.selectedÍ);
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
  },

  //支付订单
  payOrder(e) {
    const { id } = e.currentTarget.dataset;
  },

  //确认收货
  confirmOrder(e) {
    const { id } = e.currentTarget.dataset;
  }
})