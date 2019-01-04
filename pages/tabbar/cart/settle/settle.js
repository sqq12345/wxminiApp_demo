// pages/settle/settle.js
import { observer } from '../../../../utils/mobx/observer';
import http from '../../../../utils/http';
import login from '../../../../stores/Login';
const { regeneratorRuntime } = global;
Page(observer({
  props: {
    cart: require('../../../../stores/Cart'),
    order: require('../../../../stores/Order'),
  },
  /**
   * 页面的初始数据
   */
  data: {
    nvabarData: {
      showCapsule: true, //是否显示左上角图标
      title: '确认订单', //导航栏 中间的标题
      transparent: false //透明导航栏
    },
    logisticsprc: 0, //运费
    totalPrice: "",
    remark: "", //买家备注
  },
  //商品数量增加
  increase(e) {
    const { cartIndex, goodsIndex } = e.currentTarget.dataset;
    this.props.cart.list[cartIndex].goods[goodsIndex].increase()
  },
  //商品数量减少
  reduce(e) {
    const { cartIndex, goodsIndex } = e.currentTarget.dataset;
    this.props.cart.list[cartIndex].goods[goodsIndex].reduce()
  },
  //买家备注
  onInput(e) {
    const value = e.detail.value;
    this.setData({ remark: value })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    this.props.cart.fetchData();
    const result = await login();
    http.request({
      url: '/api/order/confirmorder',
      method: 'POST',
      header: { token: result.user_token },
      success: (response) => {
        if (response.data.address) {
          this.props.order.address = response.data.address;
        }
        this.setData({
          logisticsprc: response.data.goods.logisticsprc,
          totalPrice: response.data.goods.totalprc.toFixed(2)
        });
      }
    })
  },
  /**
   * 预支付
   */
  async prePay() {
    const result = await login();
    http.request({
      url: '/api/order/payment',
      method: 'POST',
      header: { token: result.user_token },
      data: {
        
      },
      success: (response) => {
        wx.requestPayment({
          timeStamp: response.data.data.timeStamp,
          nonceStr: response.data.data.nonceStr,
          package: response.data.data.package,
          signType: response.data.data.signType,
          paySign: response.data.data.paySign,
          success(res) {

          },
          fail(res) {
            wx.showModal({
              title: '',
              content: JSON.stringify(res),
              showCancel: true,
              cancelText: '取消',
              cancelColor: '#000000',
              confirmText: '确定',
              confirmColor: '#3CC51F',
            });
          },
          complete: function (res) {

          }
        })
      }
    });
  }
}))