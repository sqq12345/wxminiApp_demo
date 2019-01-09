// pages/tabbar/user/points/points.js
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
      title: '安积分', //导航栏 中间的标题
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
      url: '/api/user/pointslist',
      method: 'GET',
      header: {
        token: result.user_token
      },
      success: (response) => {
        const data = {
          "code": 1,
          "msg": "查询成功",
          "time": "1546656099",
          "data": {
            "points": [
              {
                "id": 3,
                "uid": "30",
                "type": "购买商品",
                "amount": "10",
                "totalamount": "10",
                "create_at": "1970-01-07 14:59:03",
                "status": 0
              },
              {
                "id": 4,
                "uid": "30",
                "type": "购买商品",
                "amount": "10",
                "totalamount": "10",
                "create_at": "1970-01-07 14:59:03",
                "status": 0
              }
            ],
            "totalPage": 1
          }
        };
        this.setData({ list: data.data.points })
      }
    })
  },

})