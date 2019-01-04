// pages/user/collectioin/collection.js
import http from '../../../utils/http';
import login from '../../../stores/Login';
const { regeneratorRuntime } = global;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nvabarData: {
      showCapsule: true, //是否显示左上角图标
      title: '收藏', //导航栏 中间的标题
      transparent: false, //透明导航栏
    },
    list: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    const result = await login();
    http.request({
      url: '/api/user/collection',
      method: 'GET',
      header: {
        token: result.user_token
      },
      success: (response) => {
        const list = response.data.data;
        list.forEach(item => {
          item.goods.price = Number.parseFloat(item.goods.price).toFixed(2)
        });
        this.setData({ list })
      }
    })
  },
})