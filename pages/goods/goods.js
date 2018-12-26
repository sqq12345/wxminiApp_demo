// pages/goods/goods.js
import http from '../../utils/http';
import login from '../../stores/Login';
const { regeneratorRuntime } = global;
const city = require('../../stores/City');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nvabarData: {
      position: 'absolute',
      showCapsule: true, //是否显示左上角图标
      transparent: true //透明导航栏
    },
    imgUrls: [
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
    ],
    goods: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    await city.fetchData();
    http.request({
      url: '/api/shop/goods?cityid=' + city.selected.id + '&gid=' + options.id,
      method: 'GET',
      success: (response) => {
        this.setData({ goods: response.data.data });
      }
    })
  },
  /**
   * 加入购物车
   */
  addCart: async function () {
    const result = await login();
    http.request({
      url: '/api/order/cart',
      header: {
        token: result.user_token,
      },
      data: {
        //商品id
        gid: this.data.goods.id,
        num: 1,
        //农场id
        mid: this.data.goods.mid,
      },
      method: 'POST',
      success: (response) => {
        wx.showToast({
          title: '添加成功',
          icon: 'none',
          duration: 1500,
          mask: false,
        });
      }
    });
  }
})