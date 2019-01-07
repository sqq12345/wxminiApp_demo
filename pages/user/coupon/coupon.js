// pages/user/coupon/coupon.js
import http from '../../../utils/http';
import login from '../../../stores/Login';
import util from '../../../utils/util';
const { regeneratorRuntime } = global;
Page({
  props: {
    order: require('../../../stores/Order'),
  },
  /**
   * 页面的初始数据
   */
  data: {
    nvabarData: {
      showCapsule: true, //是否显示左上角图标
      title: '优惠券', //导航栏 中间的标题
      transparent: false, //透明导航栏
    },
    select: false,
    list: [

    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    if (options.select) {
      this.setData({ select: true });
    }

    const result = await login();
    http.request({
      url: '/api/order/coupon',
      method: 'GET',
      header: {
        token: result.user_token
      },
      success: (response) => {
        const list = response.data.data.coupon;
        list.forEach(item => {

        })
        this.setData({ list });
      }
    })
  },

  bindTap() {
    if (this.data.select) {
      const index = e.currentTarget.dataset.index;
      this.props.order.coupon = this.data.list[index];
      wx.navigateBack({
        delta: 1
      });
    } else {

    }
  }
})