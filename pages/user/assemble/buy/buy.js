// pages/group/buy/buy.js
import { observer } from '../../../../utils/mobx/observer';
import http from '../../../../utils/http';
import login from '../../../../stores/Login';
const { regeneratorRuntime } = global;
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    detail: {},
    sid: '',  //接龙id
      isPhone:app.globalData.isIPhoneX,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    const id = options.id;
    this.setData({ sid: id });
    const result = await login();
    http.request({
      showLoading: true,
      url: '/api/solitaire/assemble_detail',
      method: 'POST',
      header: {
        token: result.user_token
      },
      data: { sid: id },
      success: (response) => {
        const detail = response.data.data;
        const timeNow = (new Date()).valueOf();
        const endTime = (new Date(detail.solitaire.endtime)).valueOf();
        detail.status = endTime<=timeNow ? 1:0;//1为已结束 0未结束
        // console.log(detail);
        this.setData({ detail });
      }
    });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  //分享
  onShareAppMessage: function (e) {
    const title = this.data.detail.solitaire.title;
    const id = this.data.sid;
    const img = this.data.detail.solitaire.image;
    return {
      title: title, // 转发后 所显示的title
      path: '/pages/group/buy/buy?id=' + id, // 相对的路径
      //拼团图片
      imageUrl:img,
      success: (res) => {    // 成功后要做的事情

      },
      fail: function (res) {
        // 分享失败
        console.log(res)
      }
    }
  }
})
