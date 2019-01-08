// pages/group/buy/buy.js
import { observer } from '../../../utils/mobx/observer';
import http from '../../../utils/http';
import login from '../../../stores/Login';
const { regeneratorRuntime } = global;
Page(observer({
  props: {
    address: require('../../../stores/Group').address
  },
  /**
   * 页面的初始数据
   */
  data: {
    detail: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    const id = options.id;
    const result = await login();
    http.request({
      url: '/api/solitaire/solitairedetail',
      method: 'POST',
      header: {
        token: result.user_token
      },
      data: { sid: id },
      success: (response) => {
        const detail = response.data.data;
        detail.goods.forEach(g => {
          g.num = 1;
          g.value = Number.parseFloat(g.price);
          g.total = 0;
          //商品总价
          Object.defineProperty(g, 'total', {
            get() {
              return Number.parseFloat(g.value * g.num).toFixed(2)
            }
          })
        });
        detail.total = 0;
        //总价
        Object.defineProperty(detail, 'total', {
          get() {
            const arr = this.goods.map(item => {
              return item.value * item.num
            });
            const sum = arr.reduce(function (pre, cur) {
              return pre + cur
            })
            return sum
          }
        })
        this.setData({ detail });
      }
    });
  },

  reduce(e) {
    const detail = this.data.detail;
    const { index } = e.currentTarget.dataset;
    if (detail.goods[index].num == 1) {
      return false;
    }
    detail.goods[index].num--;
    this.setData({ 'detail': detail });
  },

  increase(e) {
    const detail = this.data.detail;
    const { index } = e.currentTarget.dataset;
    detail.goods[index].num++;
    this.setData({ 'detail': detail });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  //我要接龙
  async buy() {
    const result = await login();
    http.request({
      url: '',
      method: 'POST',
      header: {
        token: result.user_token
      },
      data: {

      },
      success: (response) => {
        wx.redirectTo({
          url: '/pages/group/success/success',
        });
      }
    });
  }
}))