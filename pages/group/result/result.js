// pages/group/result/result.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nvabarData: {
      showCapsule: true, //是否显示左上角图标
      title: '开团商品', //导航栏 中间的标题
      transparent: false //透明导航栏
    },
    query: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.query) {
      this.setData({
        query: options.query
      });
    }
  },
  search(e) {
    console.log(e.detail.value);
  }
})