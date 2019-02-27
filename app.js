const AppID = 'wxe03bb6c88e343ca6';
const AppSecret = 'c2b577b604e9deb660594917987f000c';
global.regeneratorRuntime = require('./utils/regenerator/runtime-module');
const { regeneratorRuntime } = global;
import login from './stores/Login';
import http from './utils/http';
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
          if (res.model.search('iPhone X') != -1){
              this.globalData.isIPhoneX = true;
          }else{
              this.globalData.isIPhoneX = false;
          }
      }
    });
    const result =await login.apply(this);
    //加载购物车数量
    const cart = require('./stores/Cart');
    cart.fetchData();
  },

  globalData: {
    upload: 'https://anfou.cc/api/basics/upload',
    imgHttps: 'https://anfou.cc/',
    openid: null,
    session_key: null,
    user_token: null,
    share: false,  // 分享默认为false
    height: 0,
      avatarUrl:"",
      nickName: "",
    _roles: [],
    roles: async function () {
      return new Promise((resolve, reject) => {
        if (this._roles.length > 0) {
          resolve(this._roles)
        }
        http.request({
          url: '/api/shop/role',
          method: 'POST',
          success: (response) => {
            for (const key in response.data.data) {
              this._roles.push({ id: key, name: response.data.data[key] })
            }
            resolve(this._roles)
          }
        })
      })
    }
  }
})
