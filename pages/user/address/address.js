// pages/tabbar/user/address/address.js
import { observer } from '../../../utils/mobx/observer';
import http from '../../../utils/http';
import login from '../../../stores/Login';
const { regeneratorRuntime } = global;
const app = getApp();
Page(observer({
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
      title: '确认地址', //导航栏 中间的标题
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
  onLoad: function (options) {
    if (options.select) {
      this.setData({ select: true });
    }

  },
  async onShow() {
    const result = await login();
    http.request({
      url: '/api/user/listaddress',
      method: 'GET',
      header: {
        token: result.user_token
      },
      success: (response) => {
        this.setData({ list: response.data.data });
      }
    })
  },
  //选择地址
  select(e) {
    const index = e.currentTarget.dataset.index;
    this.props.order.address = this.data.list[index];
    console.log(this.props.order.address)
    wx.navigateBack({
      delta: 1
    });
  },
    //分享
    onShareAppMessage: function () {
        return app.share('', '', 'default')
    },
}))
