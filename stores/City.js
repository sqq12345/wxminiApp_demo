/**当前定位城市 */
const ak = 'vhxahuEGUT0LuHNexQPRsxmxIaDkSKED';
const { regeneratorRuntime } = global;
const extendObservable = require('../utils/mobx/mobx').extendObservable;
import http from '../utils/http';
let City = function () {
  extendObservable(this, {
    selected: null,
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
http.request({
  url: '/api/basics/geographic',
  method: 'POST',
  success: (response) => {
    Store.list = response.data.data;

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
            for (const key in Store.list) {
              const find = Store.list[key].find(item => {
                return item.name + '市' == name;
              });
              if (find) {
                Store.selected = find;
                break;
              }
            }
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
  }
});

module.exports = Store