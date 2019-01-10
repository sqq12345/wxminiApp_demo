// pages/tabbar/user/fans/orders/orders.js
import http from '../../../../utils/http';
import login from '../../../../stores/Login';
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
        // const data = {
        //   "code": 1,
        //   "msg": "查询成功",
        //   "time": "1546746119",
        //   "data": {
        //     "data": [
        //       {
        //         "id": 96,
        //         "order_num": "201901058C252B2D20FF",
        //         "money": "0.01000000",
        //         "ratio_money": 0.001
        //       }
        //     ],
        //     "last_page": 1,
        //     "uid": {
        //       "nickname": "哈哈哈哈",
        //       "mobile": "15999999999",
        //       "create_at": "2018-12-27 11:23:38",
        //       "avatar": "https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTIt185QOxHb4Jdlj4hCuxf06GEiaysYTrExvfYfhIX3pKHMnH6g9wYZcabicbs28IuCxtQQOiaBRHUcg/132"
        //     }
        //   }
        // }
        const data = response.data;
        const fan = data.data.uid;
        fan.mobile = fan.mobile.substr(0, 3) + '****' + fan.mobile.substr(7);
        const list = data.data.data;
        list.forEach(item => {
          item.orderNo = item.order_num.substr(0, 3) + '****' + item.order_num.substr(item.order_num.length - 1)
        });
        this.setData({
          fan: fan,
          list: list
        });
      }
    })
  },

})