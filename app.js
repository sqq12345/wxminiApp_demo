const AppID = 'wxe03bb6c88e343ca6';
const AppSecret = 'c2b577b604e9deb660594917987f000c';
global.regeneratorRuntime = require('./utils/regenerator/runtime-module');
const { regeneratorRuntime } = global;
import http from './utils/http';
//app.js
App({
  onLaunch: function (options) {
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

    //登录
    wx.login({
      success: async (res) => {
        if (res.code) {
          //请求用户信息
          // wx.request({
          //   url: `https://api.weixin.qq.com/sns/jscode2session?appid=${AppID}&secret=${AppSecret}&js_code=${res.code}&grant_type=authorization_code`,
          //   success:  (response)=> {
          //     this.globalData.openId = response.data.openid;
          //     console.log(this.globalData.openId);
          //   },
          // })
          //获取openid
          const { session_key, openid, reg, user_token } = await http.request({
            url: '/api/wx/openid',
            data: { code: res.code },
            method: 'POST',
          });
          if (reg === 0) {
            wx.getUserInfo({
              success(res) {
                const userInfo = res.userInfo;
                const { nickName, avatarUrl } = userInfo;
                //注册
                http.request({
                  url: '/api/wx/reg',
                  data: {
                    openid: openid,
                    nickName: nickName,
                    avatarUrl: avatarUrl,
                    unionid: ''
                  },
                  method: 'POST',
                  success(response) {

                  }
                })
              }
            })
          } else {  //已注册
            this.globalData.openid = openid;
            this.globalData.session_key = session_key;
            this.globalData.user_token = user_token;
          }
        } else {
          console.warn('获取用户登录态失败！' + res.errMsg)
        }
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