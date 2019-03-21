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
    logisticsprc: 0, //运费
    totalPrice: "",
    remark: "", //买家备注
    hasCoupon: 0,   //是否有可用的优惠券,
    coupon: null,
    couponParam: '',    //优惠券过滤条件
    //提交表单
    form: {},
    // occupation: app.globalData.height + 46,
      invoiceList:[
          {
              id: 1,
              value: "不开发票",
          },{
              id: 2,
              value: "开发票",
          }
      ],
      invoiceIndex:0,
      showFixed:false,
      showInvoice:false,
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
      var that = this;
      this.props.cart.fetchData();
      const result = await login();
      const data = {};
      //地址算运费
      if (this.props.order.address != null) {
          data.addressid = this.props.order.address.id
      }
      //优惠券算金额
      if (this.data.coupon != null) {
          data.couponid = this.data.coupon.id
      }
      // console.log(this.props.cart.list.goods);
      // this.setData({
      //     goods: this.props.cart.list,
      // });

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
                  this.setData({
                      goods: response.data.data.data,
                  });
                  return
              }

              if (this.props.order.address == null && response.data.address) {
                  this.props.order.address = response.data.address;
              }
              this.setData({
                  logisticsprc: response.data.goods.logisticsprc,
                  totalPrice: response.data.goods.totalprc.toFixed(2),
                  address: response.data.address,
                  goods: response.data.goods.data,
              });

              //检查有没有可用优惠券
              let goodsnum = '';
              for (const key in response.data.goods.data) {
                  if(response.data.goods.data[key].state != 0){
                      response.data.goods.data[key].goods.forEach(g => {
                          goodsnum += g.id + '_' + g.num + ','
                      })
                  }

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
                          //这里加

                      })
                  }
              })
          }
      })
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
    //选择是否开发票
    async bindChoice(){
        this.setData({
            showFixed:true,
            showInvoice:false,
        })
    },
    //关闭弹出层
    async bindClose (){
        this.setData({
            showFixed:false,
            showInvoice: this.data.invoiceIndex==1?true:false
        })
    },
    async subChoice(e){
        const index = e.currentTarget.dataset.index
        this.setData({
            invoiceIndex: index,
        })
    },
    //发票信息
    bindInput(e) {
        const value = e.detail.value;
        const {field} = e.target.dataset;
        const form = this.data.form;
        form[field] = value;
        this.setData({ form });
    },

  /**
   * 预支付
   */
  async prePay() {
    const form = this.data.form;
    form.addressid = this.props.order.address.id;
    form.need_tax = this.data.invoiceIndex;

    if (this.data.coupon != null) {
      form.couponid = this.data.coupon.id
    }
    // if (this.props.order.coupon != null) {
    //   //　这就是bug 的地方
    //   form.couponid = this.props.order.coupon.id
    // }
      if(this.data.invoiceIndex == 1){
        if(!form.tax_company){
            wx.showToast({
                title: '请输入发票抬头',
                icon: 'none',
            })
            return
        }
        if(!form.tax_number){
            wx.showToast({
                title: '请输入税号',
                icon: 'none',
            })
            return
        }
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
            //支付成功
            wx.redirectTo({
              url: '/pages/tabbar/cart/success/success',
            });
          },
          fail(res) {
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
  },
    //分享
    onShareAppMessage: function () {
        return app.share('', '/pages/tabbar/home/home', 'default')
    },
}))
