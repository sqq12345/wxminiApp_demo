// pages/enter/enter.js
const app = getApp();
import login from '../../stores/Login';
const { regeneratorRuntime } = global;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nvabarData: {
      showCapsule: true, //是否显示左上角图标
      title: '商家入驻', //导航栏 中间的标题
      transparent: false //透明导航栏
    },
    occupation:app.globalData.height + 46,
  },

  onLoad(){
    
  }
})