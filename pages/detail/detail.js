// pages/detail/detail.js
import http from '../../utils/http';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nvabarData: {
      position: 'absolute',
      showCapsule: true, //是否显示左上角图标
      transparent: true //透明导航栏
    },
    detail: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    switch (options.type) {
      case '1': //农场
        break;
      case '2': //社群
        break;
      case '3': //餐厅
        break;
      case '4': //超市
        break;
      case '5': //集市
        break;
    }
    http.request({
      url: '/api/shop/detailsfarm?mid=' + options.id,
      method: 'GET',
      success: (response) => {
        const data = response.data.data;

        this.setData({ detail: data })
      }
    });
  },

})