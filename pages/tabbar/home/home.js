// pages/tabbar/home/home.js
const app = getApp();
const ak = 'vhxahuEGUT0LuHNexQPRsxmxIaDkSKED';
Page({
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
    //map相关
    map: {},
    cities: [
      { city: '北京市', },
      { city: '武汉市', },
      { city: '十堰市', },
      { city: '广州市', },
    ],  //城市列表
    selected: -1,  //选中的城市的下标,
    markers: [],
    detailShow: false, //显示详情?
    selectedMarker: -1, //选中的marker id
  },

  changeType(e) {
    const { id } = e.currentTarget.dataset;
    this.setData({
      selectedTypeId: id
    })
  },

  onCityChange(e) {
    this.setData({
      selected: e.detail.detail.value
    })
  },
  onReady() {
    this.mapCtx = wx.createMapContext('map')
  },
  onLoad() {
    //todo 请求城市列表
    wx.getLocation({
      type: 'wgs84',
      success: (res) => {
        // success  
        // const longitude = res.longitude;
        // const latitude = res.latitude;
        const latitude = 23.099994;
        const longitude = 113.324520;
        this.setData({
          map: {
            longitude, latitude
          }
        });
        this.getMarkers();
        wx.request({
          url: 'https://api.map.baidu.com/geocoder/v2/?ak=' + ak + '&location=' + latitude + ',' + longitude + '&output=json',
          data: {},
          success: (res) => {
            // success  
            const name = res.data.result.addressComponent.city;
            //根据名字找到数组中的城市
            const selected = this.data.cities.findIndex(item => {
              return item.city === name;
            });
            this.setData({
              selected
            })
          },
          fail: function () {
            wx.showToast({
              icon: 'none',
              title: '获取地址失败',
              duration: 2000
            })
          },
        })
      }
    })
  },
  //根据经纬度获取周边商家
  getMarkers() {
    //todo
    this.setData({
      markers: [{
        id: 1,
        latitude: 23.099994,
        longitude: 113.324520,
        name: 'T.I.T 创意园'
      }, {
        id: 2,
        latitude: 23.099994,
        longitude: 113.344520,
        iconPath: '/static/icons/location.png'
      }, {
        id: 3,
        latitude: 23.099994,
        longitude: 113.304520,
        iconPath: '/static/icons/location.png'
      }],
    })
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
})