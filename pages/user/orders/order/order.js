// pages/tabbar/user/orders/order/order.js
// const app = getApp();
import http from '../../../../utils/http';
import login from '../../../../stores/Login';
import utils from '../../../../utils/util';
const { regeneratorRuntime } = global;
Page({

  /**
   * 待支付订单页面
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
    second: -1,
    timetext: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    const result = await login();
    this.setData({ orderId: options.id });
    http.request({
      url: '/api/user/orderdetails?orderid=' + options.id + '&type=2',
      method: 'GET',
      header: {
        token: result.user_token
      },
      success: (response) => {
        const detail = response.data.data;
        switch (detail.order_status) {
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
        detail.items.forEach(item => {
          item.cost_freight = Number.parseFloat(item.cost_freight) == 0 ? '免运费' : Number.parseFloat(item.cost_freight).toFixed(2);
          item.money = Number.parseFloat(item.money).toFixed(2);
          item.pmt = Number.parseFloat(item.pmt) == 0 ? '无' : Number.parseFloat(item.pmt).toFixed(2);

          item.goods.forEach(g => {
            g.price = Number.parseFloat(g.price).toFixed(2)
          })
        });

        detail.money = Number.parseFloat(detail.money).toFixed(2);
        detail.createAt = utils.formatTime(new Date(detail.create_at * 1000), true);

        //倒计时
        const now = new Date().getTime();
        //剩余秒数
        let second = (detail.close_time - now / 1000).toFixed(0);

        const interval = setInterval(() => {
          second--;
          if(second <= 0){
            clearInterval(interval);
            //todo 归零了做下处理
              const pages = getCurrentPages();
              const prePage = pages[pages.length - 2];
              prePage.cancelOrder({ currentTarget: { dataset: { id: this.data.orderId } } })
              wx.redirectTo({
                  url: '/pages/user/orders/orders'
              });
          }
          this.setData({ second, timetext: formatSeconds(second) });
        }, 1000)

        this.setData({ detail, timetext: formatSeconds(second) })
      }
    })
  },

  copyText() {
    wx.setClipboardData({
      data: this.data.detail.order_num,
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

  //取消订单
  cancelOrder() {
    const pages = getCurrentPages();
    const prePage = pages[pages.length - 2];
    prePage.cancelOrder({ currentTarget: { dataset: { id: this.data.orderId } } })
    wx.showToast({
      title: '订单已取消',
      icon: 'success',
      duration: 1500,
      mask: true,
      success: (result) => {
        setTimeout(() => {
          wx.redirectTo({
            url: '/pages/user/orders/orders'
          });
        }, 1500)
      },
    });
  },

  //支付订单
  payOrder() {
    const pages = getCurrentPages();
    const prePage = pages[pages.length - 2];
    prePage.payOrder({ currentTarget: { dataset: { id: this.data.orderId } } })
  }
})

function formatSeconds(value) {
  var secondTime = parseInt(value);// 秒
  var minuteTime = 0;// 分
  var hourTime = 0;// 小时
  if (secondTime > 60) {//如果秒数大于60，将秒数转换成整数
    //获取分钟，除以60取整数，得到整数分钟
    minuteTime = parseInt(secondTime / 60);
    //获取秒数，秒数取佘，得到整数秒数
    secondTime = parseInt(secondTime % 60);
    //如果分钟大于60，将分钟转换成小时
    if (minuteTime > 60) {
      //获取小时，获取分钟除以60，得到整数小时
      hourTime = parseInt(minuteTime / 60);
      //获取小时后取佘的分，获取分钟除以60取佘的分
      minuteTime = parseInt(minuteTime % 60);
    }
  }
  var result = "" + parseInt(secondTime) + "秒";

  if (minuteTime > 0) {
    result = "" + parseInt(minuteTime) + "分" + result;
  }
  if (hourTime > 0) {
    result = "" + parseInt(hourTime) + "小时" + result;
  }
  return result;
}
