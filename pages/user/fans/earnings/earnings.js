// pages/tabbar/user/fans/orders/orders.js
import http from '../../../../utils/http';
import login from '../../../../stores/Login';
const app = getApp();
const { regeneratorRuntime } = global;
    Page({

  /**
   * 页面的初始数据
   */
  data: {
/*
    nvabarData: {
      showCapsule: true, //是否显示左上角图标
      title: '粉丝订单', //导航栏 中间的标题
      transparent: false, //透明导航栏
    },
*/
    list: [],
    fan: {},
    // occupation: app.globalData.height + 46,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    const result = await login();
    http.request({
      url: '/api/user/fansorder',
      header: {
        token: result.user_token
      },
      data: { uid: options.id },
      method: 'POST',
      success: (response) => {
        const data = response.data;
        const fan = data.data.uid;
        fan.mobile = fan.mobile?fan.mobile.substr(0, 3) + '****' + fan.mobile.substr(7):"暂无联系电话";
        const list = data.data.data;
        list.forEach(item => {
          item.orderNo = item.item_num?item.item_num.substr(0, 3) + '****' + item.item_num.substr(item.item_num.length - 1):""
        });
        this.setData({
          fan: fan,
          list: list
        });
      }
    })
  },
  //分享
  onShareAppMessage: function () {
      return app.share('', '/pages/tabbar/user/user', 'default')
  },
})
