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
    //整数部分和小数部分
    price: [],
    score: '0.0',
    collected: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    await city.fetchData();
    const result = await login();
    http.request({
      showLoading: true,
      url: '/api/shop/goods?cityid=' + city.selected.id + '&gid=' + options.id,
      method: 'GET',
      header: {
        token: result.user_token
      },
      success: (response) => {
        const price = Number.parseFloat(response.data.data.price).toFixed(2);
        this.setData({
          goods: response.data.data,
          price: price.split('.'),
          score: Number.parseFloat(response.data.data.score).toFixed(1),
        }, () => {

        });
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
      showLoading: true,
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
          icon: 'success',
          duration: 1500,
          mask: false,
        });
      }
    });
  },
  collect: async function () {
    const result = await login();
    http.request({
      url: '/api/order/collection',
      showLoading: true,
      header: {
        token: result.user_token,
      },
      data: {
        mid: this.data.goods.mid,
        gid: this.data.goods.id,
      },
      method: 'POST',
      success: (response) => {
        wx.showToast({
          title: '收藏成功',
          icon: 'success',
          duration: 1500,
          mask: false,
        });
        this.setData({ collected: true });
      }
    });
  }
})