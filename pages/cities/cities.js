// pages/cities/cities.js
import {observer} from '../../utils/mobx/observer';

const app = getApp();

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
    occupation: app.globalData.height + 46,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  select(e) {
    const {value} = e.target.dataset;
    this.props.city.selected = value;
    this.props.city.user_latitude = value.location.lat;
    this.props.city.user_longitude = value.location.lng;

    this.props.city.latitude = value.location.lat;
    this.props.city.longitude = value.location.lng;

    let pages = getCurrentPages();
    let prevpage = pages[pages.length - 2];
    //重置地图缩放等级
    if (prevpage.route == 'pages/tabbar/home/home') {
      prevpage.setData({scale: 12});
    }

    wx.navigateBack();
  },

  scroll(e) {
    const {key} = e.target.dataset;
    this.setData({toView: key})
  }
}))