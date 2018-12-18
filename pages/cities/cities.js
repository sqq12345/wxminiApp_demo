// pages/cities/cities.js
import { observer } from '../../utils/mobx/observer';
Page(observer({
  props: {
    city: require('../../stores/City'),
  },
  /**
   * 页面的初始数据
   */
  data: {
    nvabarData: {
      showCapsule: true, //是否显示左上角图标
      title: '选择城市', //导航栏 中间的标题
      transparent: false //透明导航栏
    },
    toView: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  select(e) {
    const { value } = e.target.dataset;
    this.props.city.selected = value;
    this.props.city.latitude = value.location.lat;
    this.props.city.longitude = value.location.lng;
    wx.navigateBack();
  },

  scroll(e) {
    const { key } = e.target.dataset;
    this.setData({ toView: key })
  }
}))