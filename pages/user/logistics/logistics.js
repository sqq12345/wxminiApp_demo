// pages/user/logistics/logistics.js
import http from '../../../utils/http';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    http.request({
      url: '/api/user/logistics',
      method: 'POST',
      data:{
        logi_no:''
      },
      success: (response) => {

      }
    });
  },

  onShow: function () {

  },
})