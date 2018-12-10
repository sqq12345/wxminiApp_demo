// pages/cart/cart.js
import { observer } from '../../../utils/mobx/observer';
Page(observer({

  props: {
    cart: require('../../../stores/Cart'),
  },
  /**
   * 页面的初始数据
   */
  data: {
    nvabarData: {
      showCapsule: true, //是否显示左上角图标
      title: '购物车', //导航栏 中间的标题
      transparent: false //透明导航栏
    }
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
  //选中、取消选中
  select(e) {
    const { cartIndex, goodsIndex } = e.currentTarget.dataset;
    if (typeof goodsIndex === 'number') {
      this.props.cart.list[cartIndex].goods[goodsIndex].select()
    } else {
      this.props.cart.list[cartIndex].select()
    }
  },
  //全部选中
  selectAll(){
    this.props.cart.selectAll();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

}))