// pages/tabbar/user/fans/fans.js
// const app = getApp();
import http from '../../../utils/http';
import login from '../../../stores/Login';
const { regeneratorRuntime } = global;
Page({

  /**
   * 页面的初始数据
   */
  data: {
/*
    nvabarData: {
      showCapsule: true, //是否显示左上角图标
      title: '粉丝列表', //导航栏 中间的标题
      transparent: false, //透明导航栏
    },
    occupation: app.globalData.height + 46,
*/
    list: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    const result = await login();
    http.request({
      url: '/api/user/fans',
      header: {
        token: result.user_token
      },
      method: 'GET',
      success: (response) => {
        if (response.data.code != 0) {
          const list = response.data.data.users;
          //隐藏手机号码
          list.forEach(item => {
              item.mobile = item.mobile.substr(0, 3) + '****' + item.mobile.substr(7)
          });
          this.setData({ list })
        }
      }
    })
  },

})