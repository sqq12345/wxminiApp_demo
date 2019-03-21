import http from '../../../utils/http';
import login from '../../../stores/Login';
const app = getApp();
const {regeneratorRuntime} = global;

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
  onLoad: async function (options) {
    const result = await login();
    http.request({
      showLoading: true,
      url: '/api/user/pointslist',
      method: 'GET',
      header: {
        token: result.user_token
      },
      success: (response) => {
        const data = response.data;
        if (data.code !== 0) {
          this.setData({
            list: data.data.points,
          })
        }
      }
    })
  },
    //分享
    onShareAppMessage: function () {
        // return app.share('', '/pages/tabbar/home/home', 'default')
    },
});
