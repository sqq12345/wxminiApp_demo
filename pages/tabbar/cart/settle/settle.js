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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    this.props.cart.fetchData();
    const result = await login();
    http.request({
      url:'/api/order/confirmorder',
      method: 'POST',
      header: { token: result.user_token },
      success:(response)=>{
        if(response.data.address){
          this.props.order.address = response.data.address;
        }
      }
    })
  },
  /**
   * 预支付
   */
  async prePay() {
    const result = await login();
    http.request({
      url: '',
      method: 'POST',
      header: { token: result.user_token },
      success: (response) => {

      }
    });
    wx.requestPayment({
      timeStamp: '',
      nonceStr: '',
      package: '',
      signType: 'MD5',
      paySign: '',
      success(res) {

      },
      fail(res) {

      },
      complete:function(res){

      }
    })
  }
}))