// pages/group/buy/buy.js
import { observer } from '../../../utils/mobx/observer';
import http from '../../../utils/http';
import login from '../../../stores/Login';
const { regeneratorRuntime } = global;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    detail: {},
    sid: '',  //接龙id
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    const id = options.id;
    this.setData({ sid: id });
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
        console.log(detail);
        detail.goods.forEach(g => {
          g.num = 0;
          g.value = Number.parseFloat(g.price);
          g.total = 0;
          //商品总价
          // Object.defineProperty(g, 'total', {
          //   get() {
          //     console.log('get');
          //     return Number.parseFloat(this.value * this.num).toFixed(2)
          //   }
          // })
        });
        detail.total = 0;
        //总价
        // Object.defineProperty(detail, 'total', {
        //   get() {
        //     const arr = this.goods.map(item => {
        //       return item.value * item.num
        //     });
        //     const sum = arr.reduce(function (pre, cur) {
        //       return pre + cur
        //     })
        //     return sum
        //   }
        // })
        this.setData({ detail });
      }
    });
  },

  //计算总价
  calc(goods) {
    const arr = goods.map(item => {
      return item.value * item.num
    });
    const sum = arr.reduce(function (pre, cur) {
      return pre + cur
    })
    return sum.toFixed(2)
  },

  reduce(e) {
    const detail = this.data.detail;
    const { index } = e.currentTarget.dataset;
    if (detail.goods[index].num == 0) {
      return false;
    }
    detail.goods[index].num--;
    detail.goods[index].total = Number.parseFloat(detail.goods[index].value * detail.goods[index].num).toFixed(2);
    detail.total = this.calc(detail.goods);
    this.setData({ detail });
  },

  increase(e) {
    //console.log(this.data.detail);
    const detail = this.data.detail;
    const { index } = e.currentTarget.dataset;
    detail.goods[index].num++;
    detail.goods[index].total = Number.parseFloat(detail.goods[index].value * detail.goods[index].num).toFixed(2);
    detail.total = this.calc(detail.goods);
    this.setData({ detail });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  //我要接龙 先加入购物车
  async buy() {
    const result = await login();
    const flag = this.data.detail.goods.some(item => {
      return item.num > 0
    });
    if (!flag) {
      wx.showToast({
        title: '至少添加一个商品',
        icon: 'none',
        duration: 1500,
      });
      return false;
    }
    let form = '';
    this.data.detail.goods.forEach(async item => {
      if (item.num > 0) {
        form += item.mid + '_' + item.gid + '_' + item.num + ','
      }
    });
    await http.request({
      url: '/api/order/cartmore',
      showLoading: true,
      header: {
        token: result.user_token,
      },
      data: {
        mid_gid_num : form.substr(0,form.length - 1)
      },
      method: 'POST',
    });
    wx.redirectTo({
      url: '/pages/tabbar/cart/settle/settle?sid=' + this.data.sid,
    });
  },

  //分享
  onShareAppMessage: function (e) {
    const title = this.data.detail.title;
    const id = this.data.sid;
    const img = this.data.detail.image;
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
