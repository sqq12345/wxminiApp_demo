// pages/tabbar/user/address/address.js
import { observer } from '../../../utils/mobx/observer';
import http from '../../../utils/http';
import login from '../../../stores/Login';
const { regeneratorRuntime } = global;
Page(observer({
  props: {
    order: require('../../../stores/Order'),
  },
  /**
   * 页面的初始数据
   */
  data: {
    nvabarData: {
      showCapsule: true, //是否显示左上角图标
      title: '确认地址', //导航栏 中间的标题
      transparent: false, //透明导航栏
    },
    select: false,
    list: [],
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
      url: '',
      method: 'GET',
      header: {
        token: result.user_token
      },
      success: (response) => {

      }
    })
  },
  //选择地址
  select(e) {
    if (this.data.select) {

    }
  }
}))