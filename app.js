const AppID = 'wxe03bb6c88e343ca6';
const AppSecret = 'c2b577b604e9deb660594917987f000c';
global.regeneratorRuntime = require('./utils/regenerator/runtime-module');
const { regeneratorRuntime } = global;
import login from './stores/Login';
//app.js
App({
  onLaunch: async function (options) {
    // 判断是否由分享进入小程序
    if (options.scene == 1007 || options.scene == 1008) {
      this.globalData.share = true
    } else {
      this.globalData.share = false
    };
    wx.getSystemInfo({
      success: (res) => {
        this.globalData.height = res.statusBarHeight
      }
    })
  },

  globalData: {
    openid: null,
    session_key: null,
    user_token: null,
    share: false,  // 分享默认为false
    height: 0,
  }
})