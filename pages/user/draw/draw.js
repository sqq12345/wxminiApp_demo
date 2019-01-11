// pages/user/draw/draw.js
const app = getApp();
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
    /*
        nvabarData: {
          showCapsule: true, //是否显示左上角图标
          title: '提现', //导航栏 中间的标题
          transparent: true, //透明导航栏
          color: '#fff'
        },
    */
    occupation: app.globalData.height + 46,
    form: {
      card: '',
      card_name: '',
      card_bank: '',
      amount: 0
    },
    max: 0,
  },

  onInput(e) {
    const value = e.detail.value;
    const { field } = e.target.dataset;
    this.setData({
      ['form.' + field]: value
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const max = Number.parseFloat(options.max).toFixed(2);
    this.setData({
      max
    });
  },

  async submit() {
    const result = await login();
    if (verify(this.data.form, config)) {
      http.request({
        url: '/api/user/withdrawal',
        header: {
          token: result.user_token
        },
        method: 'POST',
        data: this.data.form,
        success: (response) => {
          if (response.data.code == 1) {
            wx.showToast({
              title: '提现成功',
              icon: 'none',
              duration: 1500,
            });
            wx.redirectTo({
              url: '/pages/tabbar/user/user',
            });
          } else {
            wx.showToast({
              title: response.data.msg,
              icon: 'none',
              duration: 1500,
            });
          }
        }
      })
    }


  },

  /**
   * 全部提现
   */
  takeAll() {
    this.setData({
      'form.amount': this.data.max
    });
  }
})

const config = {
  card: {
    name: '收款账号',
    require: true,
    regex: regex.bank
  },
  card_name: {
    require: true,
    name: '收款户名',
  },
  card_bank: {
    require: true,
    name: '收款银行',
  },
}