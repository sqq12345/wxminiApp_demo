// pages/login/login.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
/*
    nvabarData: {
      showCapsule: true, //是否显示左上角图标
      title: '用户授权', //导航栏 中间的标题
      transparent: false //透明导航栏
    },
    occupation: app.globalData.height + 46,
*/
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  bindGetUserInfo: function (e) {
    var that = this;
    //最后，记得返回刚才的页面
    wx.navigateBack({
      delta: 1
    })
  },
    //分享
    onShareAppMessage: function () {
        return app.share('', '/pages/tabbar/home/home', 'default')
    },
})
