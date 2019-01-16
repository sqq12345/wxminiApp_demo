import http from '../../../utils/http';
import login from '../../../stores/Login';

const {regeneratorRuntime} = global;
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
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
  onLoad: async function (options) {},
  onShow: async function () {
    this.getMycenter()
  },
  getMycenter: async function () {
    const result = await login();
    http.request({
      url: '/api/user/center',
      header: {
        token: result.user_token
      },
      method: 'POST',
      success: (response) => {
        const user = response.data.data;
        if (user.earnings === null) {
          this.setData({
            userinfo: user,
            earnings: Number(0),
          });
        }
        else {
          this.setData({
            userinfo: user,
            earnings: Number(user.earnings).toFixed(2),
          });
        }
      }
    });
  },
});
