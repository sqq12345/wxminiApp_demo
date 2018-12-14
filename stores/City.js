/**当前定位城市 */
const ak = 'vhxahuEGUT0LuHNexQPRsxmxIaDkSKED';
const { regeneratorRuntime } = global;
const extendObservable = require('../utils/mobx/mobx').extendObservable;
import http from '../utils/http';
let City = function () {
  extendObservable(this, {
    selected: -1,
    list: [

    ],
    latitude: null,
    longitude: null,
    markers: []
  });
}
City.prototype.getMarkers = function () {
  this.markers = [{
    id: 111111,
    latitude: 23.099994,
    longitude: 113.324520,
    iconPath: '/static/icons/map/1-1.png',
    width: '80rpx',
    height: '80rpx',
  }, {
    id: 2334232,
    latitude: 23.099994,
    longitude: 113.344520,
    iconPath: '/static/icons/map/1-1.png',
    width: '80rpx',
    height: '80rpx',
  }, {
    id: '奥术大师多撒阿萨德',
    latitude: 23.099994,
    longitude: 113.304520,
    iconPath: '/static/icons/map/1-1.png',
    width: '80rpx',
    height: '80rpx',
  }]
}
const Store = new City();
setTimeout(function () {
  Store.list = [
    { city: '北京市', },
    { city: '武汉市', },
    { city: '十堰市', },
    { city: '广州市', },
  ];
  wx.getLocation({
    type: 'wgs84',
    success: (res) => {
      // success  
      Store.longitude = res.longitude;
      Store.latitude = res.latitude;
      // Store.latitude = 23.099994;
      // Store.longitude = 113.324520;
      Store.getMarkers();
      wx.request({
        url: 'https://api.map.baidu.com/geocoder/v2/?ak=' + ak + '&location=' + Store.latitude + ',' + Store.longitude + '&output=json',
        data: {},
        success: (res) => {
          // success  
          const name = res.data.result.addressComponent.city;
          //根据名字找到数组中的城市
          const selected = Store.list.findIndex(item => {
            return item.city === name;
          });
          Store.selected = selected;
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
}, 2000);
//获取城市列表
http.request({
  url: 'api/basics/geographic',
  method: 'POST',
  success: (response) => {

  }
})

module.exports = Store