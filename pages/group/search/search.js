// pages/group/search/search.js
import http from '../../../utils/http';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
/*
    nvabarData: {
      showCapsule: true, //是否显示左上角图标
      title: '商品分类', //导航栏 中间的标题
      transparent: false //透明导航栏
    },
    occupation: app.globalData.height + 46,
*/
    list: [

    ]
  },
  search(e) {
    console.log(e.detail.value);
    wx.navigateTo({
      url: "/pages/group/result/result?query=" + e.detail.value,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    http.request({
      url:'/api/basics/classify',
      method:'GET',
      success:(response)=>{
        this.setData({list:response.data});
      }
    })
  },
    //分享
    onShareAppMessage: function () {
        return app.share('', '/pages/tabbar/home/home', 'default')
    },
})
