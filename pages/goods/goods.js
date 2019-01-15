// pages/goods/goods.js
import http from '../../utils/http';
import login from '../../stores/Login';
import {observer} from '../../utils/mobx/observer';

const {regeneratorRuntime} = global;
const city = require('../../stores/City');

Page(observer({
  props: {
    cart: require('../../stores/Cart'),
  },
  /**
   * 页面的初始数据
   */
  data: {
/*
    nvabarData: {
      position: 'absolute',
      showCapsule: true, //是否显示左上角图标
      transparent: true //透明导航栏
    },
*/
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
          goodsContent: response.data.data.content.replace(/\<img/gi, '<img class="rich-img"'),
          price: price.split('.'),
          score: Number.parseFloat(response.data.data.score).toFixed(1),
          //是否收藏
          collected: response.data.data.collection == 1,
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
        this.props.cart.totalNumber++;
        //刷新购物车
        this.props.cart.fetchData()
        wx.showToast({
          title: '添加成功',
          icon: 'success',
          duration: 1500,
          mask: false,
        });
      }
    });
  },
  //立即购买
  async buyNow() {
    let that = this;
    const result = await login();
    http.request({
      url: '/api/order/buynow',
      showLoading: true,
      header: {
        token: result.user_token,
        accesstoken: http.accesstoken,
      },
      data: {
        //商品id
        gid: that.data.goods.id,
        // num: 1,
        //农场id
        mid: that.data.goods.mid,
      },
      method: 'POST',
      success: (response) => {
        console.log(response);
        if (response.data.code === 1) {
          // this.props.cart.fetchData();
          wx.navigateTo({
            url: '/pages/tabbar/cart/settle/settle',
          });
        }
      }
    });
  },
  //收藏
  collect: async function () {
    let that = this;
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
          title: this.data.collected ? '已取消收藏' : '收藏成功',
          icon: 'success',
          duration: 1500,
          mask: false,
          success: function () {
            that.setData({
              collected: !that.data.collected
            });
          }
        });
      }
    });
  }
}))
