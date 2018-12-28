// pages/tabbar/home/home.js
import { observer } from '../../../utils/mobx/observer';
import login from '../../../stores/Login';
const { regeneratorRuntime } = global;
const app = getApp();
Page(observer({
  props: {
    city: require('../../../stores/City'),
  },
  data: {
    // 组件所需的参数
    nvabarData: {
      showCapsule: false, //是否显示左上角图标
      title: '附近商家', //导航栏 中间的标题
      transparent: false //透明导航栏
    },
    occupation: app.globalData.height + 46,
    //类型
    types: [],
    selectedTypeId: 1,
    detailShow: false, //显示详情?
    selectedMarker: -1, //选中的marker
  },
  //切换分类
  changeType(e) {
    const { id } = e.currentTarget.dataset;
    //清除markers和detail,并重新请求markers
    this.setData({
      selectedTypeId: id,
      detailShow: false
    }, () => {
      this.props.city.markers = [];
      this.props.city.getMarkers(this.data.selectedTypeId);
    })
  },

  onReady() {
    this.mapCtx = wx.createMapContext('map');
  },
  async onLoad() {
    const arr = await app.globalData.roles();
    this.setData({ types: arr });
  },
  //显示页面时隐藏marker
  onShow() {
    this.setData({ detailShow: false })
  },
  //点击marker
  tapMarker(e) {
    const markerId = e.markerId;
    const marker = this.props.city.markers.find(item => item.id == markerId);
    console.log(marker);
    this.setData({
      detailShow: true,
      selectedMarker: marker
    })
  },
  //点击map时关闭详情框
  tapMap() {
    this.setData({
      detailShow: false
    })
  },
  //改变视野后  重新请求周边markers
  regionChange(e) {
    //只有移动结束才能重新获取位置
    if (e.type === 'end') {
      this.mapCtx.getCenterLocation(
        {
          success: (res) => {
            // console.log(res.longitude)
            // console.log(res.latitude)
            //this.props.city.latitude = res.longitude;
            //this.props.city.longitude = res.latitude;
            this.props.city.getMarkers(this.data.selectedTypeId, res.latitude, res.longitude);
          }
        }
      );
    }
  },
  goDetail() {
    wx.navigateTo({
      url: `/pages/detail/detail?id=${this.data.selectedMarker.id}&type=${this.data.selectedTypeId}`,
    });
  }
}))