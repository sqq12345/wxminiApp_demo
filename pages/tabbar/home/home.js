// pages/tabbar/home/home.js
const app = getApp();
Page({
  data: {
    // 组件所需的参数
    nvabarData: {
      showCapsule: true, //是否显示左上角图标
      title: '附件商家', //导航栏 中间的标题
      transparent: false //透明导航栏
    },
    occupation:app.globalData.height * 2 + 20,
  },
  onLoad() {
    
  }
})