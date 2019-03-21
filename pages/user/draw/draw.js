import http from '../../../utils/http';
import login from '../../../stores/Login';
import regex from '../../../utils/regex';
import verify from '../../../utils/verify';

const app = getApp();
const {regeneratorRuntime} = global;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    occupation: app.globalData.height + 46,
    form: {
      card: '',
      card_name: '',
      card_bank: '',
      amount: null
    },
    max: 0,
    maxDraw: 0,
  },

  onInput(e) {
    const value = e.detail.value;
    const {field} = e.target.dataset;
    this.setData({
      ['form.' + field]: value
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (o) {
    console.log(o);
    this.setData({
      max: o.max,
      maxDraw: parseInt(o.max),
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
      'form.amount': this.data.maxDraw
    });
  },
    //分享
    onShareAppMessage: function () {
        return app.share('', '/pages/tabbar/user/user', 'default')
    },
});

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
};
