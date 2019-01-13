// pages/tabbar/user/user.js
import http from '../../../utils/http';
import login from '../../../stores/Login';
const { regeneratorRuntime } = global;
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
/*
    nvabarData: {
      showCapsule: false, //是否显示左上角图标
      title: '个人中心', //导航栏 中间的标题
      transparent: true, //透明导航栏
      color: '#000'
    },
*/
    userinfo: {
      points: 0,
      fansnum: 0,
      ismerchant: 0,
    },
    occupation: app.globalData.height + 46,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {

  },
    onShow:async function(){
      this.getMycenter()
    },
    getMycenter:async function () {
        const result = await login();
        http.request({
            url: '/api/user/center',
            header: {
                token: result.user_token
            },
            method: 'POST',
            success: (response) => {
                const user = response.data.data;
                user.earnings = Number.parseFloat(user.earnings).toFixed(2)
                this.setData({
                    userinfo: user
                });
            }
        });
    },
})
