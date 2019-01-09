import http from '../../utils/http';
Page({

  /**
   * 页面的初始数据
   */
  data: {
/*
    nvabarData: {
      showCapsule: true, //是否显示左上角图标
      transparent: true //透明导航栏
    },
*/
    detail: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    http.request({
      url: '/api/shop/details',
      method: 'POST',
      data: {
        mid: options.id
      },
      success: (response) => {
        const data = response.data.data;
        data.goods.forEach(item => {
          item.score = Number.parseFloat(item.score).toFixed(1);
          item.price = Number.parseFloat(item.price).toFixed(2);
        });
        this.setData({ detail: data });
      }
    })
  }
})