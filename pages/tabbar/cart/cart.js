// pages/cart/cart.js
import {observer} from '../../../utils/mobx/observer';

const app = getApp();

Page(observer({

  props: {
    cart: require('../../../stores/Cart'),
    order: require('../../../stores/Order'),
  },
  /**
   * 页面的初始数据
   */
  data: {
/*
    nvabarData: {
      showCapsule: false, //是否显示左上角图标
      title: '购物车', //导航栏 中间的标题
      transparent: false //透明导航栏
    },
*/
    editing: false,
    // occupation: app.globalData.height + 46,
  },
    onLoad: function (options) {

    },
    onShow() {
        this.props.cart.fetchData()
        this.setData({editing: false});
      this.props.order.coupon = null;
    },
  //商品数量增加
  increase(e) {
    const {cartIndex, goodsIndex} = e.currentTarget.dataset;
    this.props.cart.list[cartIndex].goods[goodsIndex].increase()
  },
  //商品数量减少
  reduce(e) {
    const {cartIndex, goodsIndex} = e.currentTarget.dataset;
    this.props.cart.list[cartIndex].goods[goodsIndex].reduce()
  },
  //选中、取消选中
  select(e) {
    const {cartIndex, goodsIndex} = e.currentTarget.dataset;
    console.log(e.currentTarget.dataset)
    if (typeof goodsIndex === 'number') {
      this.props.cart.list[cartIndex].goods[goodsIndex].select()
    } else {
      this.props.cart.list[cartIndex].select()
    }
  },
  edit() {
    this.setData({editing: !this.data.editing});
    this.props.cart.changeEdit();
  },
  delete() {
    this.props.cart.delete();
  },
  //全部选中
  selectAll() {
    this.props.cart.selectAll();
  },
    //分享
    onShareAppMessage: function () {
        // return app.share('', '/pages/tabbar/home/home', 'default')
    },
}))
