// pages/tabbar/user/orders/orders.js
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
      { text: '全部', value: '0' },
      { text: '待付款', value: '1' },
      { text: '待发货', value: '2' },
      { text: '待收货', value: '3' },
      { text: '待评价', value: '4' },
    ],
    selected: '0'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.status) {
      this.setData({ selected: options.status });
    }
  },
  switchStatus(e) {
    const { status } = e.currentTarget.dataset;
    this.setData({ selected: status });
  }
})