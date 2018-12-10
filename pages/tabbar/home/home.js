// pages/tabbar/home/home.js
import { observer } from '../../../utils/mobx/observer';
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
      title: '附件商家', //导航栏 中间的标题
      transparent: false //透明导航栏
    },
    occupation: app.globalData.height * 2 + 20,
    //杂项
    types: [
      { name: '附件农场', id: 1 },
      { name: '附件社群', id: 2 },
      { name: '有机超市', id: 3 },
      { name: '生态餐厅', id: 4 },
      { name: '生态餐厅', id: 5 },
      { name: '生态餐厅', id: 6 },
    ],
    selectedTypeId: 1,
    detailShow: false, //显示详情?
    selectedMarker: -1, //选中的marker id
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
      //模拟请求
      wx.showLoading({
        title: '获取周边商家',
        mask: true,
      });
      setTimeout(() => {
        wx.hideLoading();
        this.props.city.getMarkers();
      }, 1000)
    })
  },

  //切换城市
  onCityChange(e) {
    this.props.city.selected = e.detail.detail.value;
  },

  onReady() {
    this.mapCtx = wx.createMapContext('map')
  },
  onLoad() {
    
  },
  //点击marker
  tapMarker(e) {
    //console.log(e);
    this.setData({
      detailShow: true,
      selectedMarker: e.markerId
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
          success: function (res) {
            // console.log(res.longitude)
            // console.log(res.latitude)
          }
        }
      );
    }
  },
}))