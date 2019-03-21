import http from '../../../../utils/http';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    http.request({
      url: '/api/user/logistics',
      method: 'POST',
      data: {
        logi_no: options.no,
      },
        showLoading: true,
      success: (response) => {
        var res = response.data;
        if (res.code === 1) {
          this.setData({
            list: res.data.data,
          });
        }
      }
    });
  },
    //分享
    onShareAppMessage: function () {
        return app.share('', '/pages/user/orders/orders', 'default')
    },
});
