import http from '../../../../utils/http';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    msg: '',
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
      success: (response) => {
        var res = response.data;
        console.log(res);
        this.setData({
          list: res.data.data,
          msg: res.msg,
        });
      }
    });
  },
});