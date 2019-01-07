// pages/tabbar/user/orders/order/order.js
const app = getApp();

import http from '../../../../utils/http';
import login from '../../../../stores/Login';
const { regeneratorRuntime } = global;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nvabarData: {
      showCapsule: true, //是否显示左上角图标
      title: '订单详情', //导航栏 中间的标题
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