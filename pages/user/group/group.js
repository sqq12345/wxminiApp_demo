// pages/group/my/my.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nvabarData: {
      showCapsule: true, //是否显示左上角图标
      title: '我的接龙', //导航栏 中间的标题
      transparent: false, //透明导航栏
    },
    occupation: app.globalData.height + 46,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
})