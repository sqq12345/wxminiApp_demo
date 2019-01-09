// pages/settle/settle.js
import { observer } from '../../../../utils/mobx/observer';
import http from '../../../../utils/http';
import login from '../../../../stores/Login';
const { regeneratorRuntime } = global;
const app = getApp();
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
    hasCoupon: 0,   //是否有可用的优惠券,
    couponParam: '',    //优惠券过滤条件
    //提交表单
    form: {},
    occupation: app.globalData.height + 46,
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
    const form = this.data.form;
    form["remark_" + e.currentTarget.dataset.mid] = value;
    this.setData({ form });
  },
  onLoad: function (options) {
    if (options.sid) {
      this.setData({ 'form.ordertype': 1, 'form.sid': options.sid });
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: async function (options) {
    this.props.cart.fetchData();
    const result = await login();
    const data = {};
    //地址算运费
    if (this.props.order.address != null) {
      data.addressid = this.props.order.address.id
    }
    //优惠券算金额
    if (this.props.order.coupon != null) {
      data.couponid = this.props.order.coupon.id
    }
    http.request({
      url: '/api/order/confirmorder',
      method: 'POST',
      header: { token: result.user_token },
      data: data,
      success: (response) => {
        if (response.data.code == 999) {
          wx.showToast({
            title: '请添加一个地址',
            icon: 'none',
            duration: 1500,
          });
          return
        }
        if (this.props.order.address == null && response.data.address) {
          this.props.order.address = response.data.address;
        }
        this.setData({
          logisticsprc: response.data.goods.logisticsprc,
          totalPrice: response.data.goods.totalprc.toFixed(2)
        });

        //检查有没有可用优惠券
        let goodsnum = '';
        for (const key in response.data.goods.data) {
          response.data.goods.data[key].goods.forEach(g => {
            goodsnum += g.id + '_' + g.num + ','
          })
        }
        goodsnum = goodsnum.substr(0, goodsnum.length - 1)
        this.setData({ couponParam: goodsnum });
        http.request({
          url: '/api/order/coupon',
          method: 'POST',
          data: {
            goodsnum
          },
          header: {
            token: result.user_token
          },
          success: (response) => {
            this.setData({
              hasCoupon: response.data.data.isusecount
            })
          }
        })
      }
    })
  },
  /**
   * 预支付
   */
  async prePay() {
    const form = this.data.form;
    form.addressid = this.props.order.address.id;
    if (this.props.order.coupon != null) {
      form.couponid = this.props.order.coupon.id
    }

    const result = await login();
    http.request({
      url: '/api/order/payment',
      method: 'POST',
      header: { token: result.user_token },
      data: form,
      success: (response) => {
        wx.requestPayment({
          timeStamp: response.data.data.timeStamp,
          nonceStr: response.data.data.nonceStr,
          package: response.data.data.package,
          signType: response.data.data.signType,
          paySign: response.data.data.paySign,
          success(res) {
            // wx.redirectTo({
            //   url: '/pages/user/orders/orders',
            // });
          },
          fail(res) {
            // wx.showModal({
            //   title: '',
            //   content: JSON.stringify(res),
            //   showCancel: true,
            //   cancelText: '取消',
            //   cancelColor: '#000000',
            //   confirmText: '确定',
            //   confirmColor: '#3CC51F',
            // });
            //取消支付
            if (res.errMsg == 'requestPayment:fail cancel') {
              wx.showModal({
                title: '提示',
                content: '您取消了支付，请及时支付',
                showCancel: true,
                cancelText: '取消',
                cancelColor: '#000000',
                confirmText: '确定',
                confirmColor: '#3CC51F',
                success: (result) => {
                  wx.redirectTo({
                    url: '/pages/user/orders/orders',
                  });
                },
                fail: () => { },
              });
            }
          },
          complete: function (res) {

          }
        })
      }
    });
  }
}))