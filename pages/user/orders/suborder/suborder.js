// pages/tabbar/user/orders/order/order.js
// const app = getApp();
import http from '../../../../utils/http';
import login from '../../../../stores/Login';
import utils from '../../../../utils/util';
const { regeneratorRuntime } = global;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    /*
        nvabarData: {
          showCapsule: true, //是否显示左上角图标
          title: '订单详情', //导航栏 中间的标题
          transparent: false, //透明导航栏
        },
        occupation: app.globalData.height + 46,
    */
    detail: {},
    orderId: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    const result = await login();
    this.setData({ orderId: options.id });
    http.request({
      url: '/api/user/orderdetails?orderid=' + options.id + '&type=1',
      method: 'GET',
      header: {
        token: result.user_token
      },
      success: (response) => {
        const detail = response.data.data;
        switch (detail.item_status) {
          case 0:
            detail.status = '待付款';
            break;
          case 1:
            detail.status = '已付款';
            break;
          case 2:
            detail.status = '已发货';
            break;
          case 3:
            detail.status = '已完成';
            break;
          case -1:
            detail.status = '已取消';
            break;
          case -11:
            detail.status = '申请退款';
            break;
          case -12:
            detail.status = '退款中';
            break;
          case -13:
            detail.status = '退款驳回';
            break;
          case -14:
            detail.status = '退款完成';
            break;
        }
        detail.cost_freight = Number.parseFloat(detail.cost_freight) == 0 ? '免运费' : Number.parseFloat(detail.cost_freight).toFixed(2);
        detail.pmt = Number.parseFloat(detail.pmt) == 0 ? '无' : Number.parseFloat(detail.pmt).toFixed(2);
        detail.pay.createAt = utils.formatTime(new Date(detail.pay.create_at * 1000), true);
        detail.money = Number.parseFloat(detail.money).toFixed(2);
        detail.deliveryTime = detail.delivery == null ? '未发货' : '已发货';
        detail.goods.forEach(g => {
          g.price = Number.parseFloat(g.price).toFixed(2)
        });
        this.setData({ detail })
      }
    })
  },

  copyText() {
    wx.setClipboardData({
      data: this.data.detail.item_num,
      success(res) {
        wx.showToast({
          title: '复制成功',
          icon: 'success',
          duration: 1500,
          mask: false,
        });
      }
    })
  },
})