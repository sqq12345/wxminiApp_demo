import http from '../../../utils/http';
import login from '../../../stores/Login';
import util from '../../../utils/util';

const {regeneratorRuntime} = global;

Page({
  props: {
    order: require('../../../stores/Order'),
  },
  /**
   * 页面的初始数据
   */
  data: {
    select: false,
    list: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    const data = {};
    if (options.select) {
      this.setData({select: true});
      data.goodsnum = options.param
    }
    const result = await login();
    http.request({
        showLoading: true,
      url: '/api/order/coupon',
      method: 'POST',
      header: {
        token: result.user_token
      },
      data: data,
      success: (response) => {
        const list = response.data.data.coupon;
        list.forEach(item => {
          item.value = Number.parseInt(item.value_money);
          item.mMoney = Number.parseInt(item.money);
          const startTime = new Date(item.start_time * 1000);
          const endTime = new Date(item.end_time * 1000);
          item.startTime = util.formatTime(startTime);
          item.endTime = util.formatTime(endTime);
        });
        this.setData({list});
      }
    })
  },

  selectCoupon(e) {
    const status = e.currentTarget.dataset.status;
    if (status !== 0) {
      return;
    }
    if (this.data.select) {
      //选择优惠券
      const index = e.currentTarget.dataset.index;
      // this.props.order.coupon = this.data.list[index];

      var pages = getCurrentPages();
      var currPage = pages[pages.length - 1];   //当前页面
      var prevPage = pages[pages.length - 2];  //上一个页面

      //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
      prevPage.setData({
        coupon: this.data.list[index]
      })

      wx.navigateBack({
        delta: 1
      });
    } else {
      wx.switchTab({
        url: '/pages/tabbar/shoplist/shoplist',
      });
    }
  }
});
