// pages/user/coupon/coupon.js
import http from '../../../utils/http';
import login from '../../../stores/Login';
import util from '../../../utils/util';
const { regeneratorRuntime } = global;
const app = getApp();
Page({
  props: {
    order: require('../../../stores/Order'),
  },
  /**
   * 页面的初始数据
   */
  data: {
/*
    nvabarData: {
      showCapsule: true, //是否显示左上角图标
      title: '优惠券', //导航栏 中间的标题
      transparent: false, //透明导航栏
    },
*/
    select: false,
    list: [],
    // occupation: app.globalData.height + 46,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    const data = {};
    if (options.select) {
      this.setData({ select: true });
      data.goodsnum = options.param
    }
    const result = await login();
    http.request({
      url: '/api/order/coupon',
      method: 'POST',
      header: {
        token: result.user_token
      },
      data: data,
      success: (response) => {
        const list = response.data.data.coupon;
        list.forEach(item => {
          item.value = Number.parseInt(item.value_money)
          const startTime = new Date(item.start_time * 1000);
          const endTime = new Date(item.end_time * 1000);
          item.startTime = util.formatTime(startTime);
          item.endTime = util.formatTime(endTime);
        })
        this.setData({ list });
      }
    })
  },

  selectCoupon(e) {
      const status = e.currentTarget.dataset.status;
      if(status!=0){
          return;
      }
    if (this.data.select) {
      //选择优惠券
      const index = e.currentTarget.dataset.index;
      this.props.order.coupon = this.data.list[index];
      wx.navigateBack({
        delta: 1
      });
    } else {
      wx.switchTab({
        url: '/pages/tabbar/shoplist/shoplist',
      });
    }
  }
})
