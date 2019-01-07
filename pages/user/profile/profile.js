// pages/tabbar/user/profile/profile.js
import http from '../../../utils/http';
import login from '../../../stores/Login';
import regex from '../../../utils/regex';
import verify from '../../../utils/verify';
const { regeneratorRuntime } = global;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nvabarData: {
      showCapsule: true, //是否显示左上角图标
      title: '编辑', //导航栏 中间的标题
      transparent: false, //透明导航栏
    },
    user: {},
  },
  onInput(e) {
    this.setData({
      'user.mobile': e.detail.value
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    const result = await login();
    http.request({
      url: '/api/user/information',
      method: 'GET',
      header: {
        token: result.user_token
      },
      success: (response) => {
        this.setData({ user: response.data.data });
      }
    })
  },

  async updateProfile() {
    const result = await login();
    if (verify(this.data.user, config)) {
      http.request({
        url: '/api/user/editor',
        method: 'POST',
        data: this.data.user,
        header: {
          token: result.user_token
        },
        success: (response) => {
            wx.showToast({
              title: '资料更新成功',
              icon: 'success',
              duration: 1500,
              mask: false,
            });
        }
      })
    }
  }
})

const config = {
  mobile: {
    name: '手机号',
    regex: regex.cellphone
  },
}