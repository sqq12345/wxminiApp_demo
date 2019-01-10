// pages/tabbar/user/fans/orders/orders.js
// const app = getApp();
import http from '../../../utils/http';
import login from '../../../stores/Login';
const { regeneratorRuntime } = global;
Page({

  /**
   * 页面的初始数据
   */
  data: {
/*
    nvabarData: {
      showCapsule: true, //是否显示左上角图标
      title: '收益明细', //导航栏 中间的标题
      transparent: false, //透明导航栏
    },
*/
    list: [],
    // occupation: app.globalData.height + 46,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    const result = await login();
    http.request({
      url: '/api/user/earnings',
      header: {
        token: result.user_token
      },
      method: 'GET',
      success: (response) => {
        // const data = {
        //   "code": 1,
        //   "msg": "查询成功",
        //   "time": "1546675166",
        //   "data": {
        //     "income": [
        //       {
        //         "item_id": 89,
        //         "item_num": "201901051EB813F06E9F",
        //         "create_at": 1546673150,
        //         "money": 13.5
        //       },
        //       {
        //         "item_id": 88,
        //         "item_num": "201901054E3D67553E37",
        //         "create_at": 1546656038,
        //         "money": 13.5
        //       },
        //       {
        //         "item_id": 87,
        //         "item_num": "201901050B22CE93B334",
        //         "create_at": 1546654812,
        //         "money": 13.5
        //       }
        //     ],
        //     "last_page": 1
        //   }
        // }
        const data = response.data;
        const list = data.data.income;
        list.forEach(item => {
          item.orderNo = item.item_num.substr(0, 3) + '****' + item.item_num.substr(item.item_num.length - 1)
        });
        this.setData({
          list: list
        });
      }
    })
  },

})