import http from '../utils/http';
const regeneratorRuntime = require('../utils/regenerator/runtime-module');


const login = function () {
    let app = getApp();
    if (app === undefined) {
        app = this;
    }
    return new Promise((resolve, reject) => {
        const result = app.globalData;
        if (result.user_token) {
            resolve(result);
            return true;
        }
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
                    const response = await http.request({
                        url: '/api/wx/openid',
                        data: { code: res.code },
                        method: 'POST',
                    });
                    const { session_key, openid, reg, user_token } = response.data.data;
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
                        result.openid = openid;
                        result.session_key = session_key;
                        result.user_token = user_token;
                        resolve(result);
                    }
                } else {
                    console.warn('获取用户登录态失败！' + res.errMsg)
                }
            }
        })
    })
}

export default login