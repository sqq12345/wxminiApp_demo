/**当前定位城市 */
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
    user_latitude: null,
    user_longitude: null,
    markers: []
  });
}
City.prototype.getMarkers = function () {
  // this.markers = [{
  //   id: 111111,
  //   latitude: 23.099994,
  //   longitude: 113.324520,
  //   iconPath: '/static/icons/map/1-1.png',
  //   width: '80rpx',
  //   height: '80rpx',
  // }, {
  //   id: 2334232,
  //   latitude: 23.099994,
  //   longitude: 113.344520,
  //   iconPath: '/static/icons/map/1-1.png',
  //   width: '80rpx',
  //   height: '80rpx',
  // }, {
  //   id: '奥术大师多撒阿萨德',
  //   latitude: 23.099994,
  //   longitude: 113.304520,
  //   iconPath: '/static/icons/map/1-1.png',
  //   width: '80rpx',
  //   height: '80rpx',
  // }];
  // http.request({
  //   url: '/getmarker',
  //   data: {},
  //   header: {},
  //   method: 'POST',
  //   success: (response) => {

  //   }
  // })
}
City.prototype.fetchData = function () {
  return new Promise((resolve, reject) => {
    if (this.user_latitude && this.user_longitude && this.list && this.selected) {
      resolve();
      return
    }
    http.request({
      url: '/api/basics/geographic',
      method: 'POST',
      success: (response) => {
        this.list = response.data.data;
        wx.getLocation({
          type: 'wgs84',
          success: (res) => {
            // success  
            this.longitude = res.longitude;
            this.latitude = res.latitude;
            //用户所处位置
            this.user_latitude = res.latitude;
            this.user_longitude = res.longitude;
            //console.log('latitude', res.latitude);
            //console.log('longitude', res.longitude);
            this.getMarkers();
            http.request({
              url: '/api/basics/position',
              header: {
                latitude: res.latitude,
                longitude: res.longitude
              },
              success: (res) => {
                // success
                //根据名字找到数组中的城市
                for (const key in this.list) {
                  const find = this.list[key].find(item => {
                    return item.id == res.data.data.id;
                  });
                  if (find) {
                    this.selected = find;
                    break;
                  }
                }
                resolve();
              }
            });
          }
        })
      },
      fail: function () {
        wx.showToast({
          icon: 'none',
          title: '获取地址失败',
          duration: 2000
        });
        //加载默认地址
        http.request({
          url: '/api/basics/config',
          success: (res) => {
            for (const key in this.list) {
              const find = this.list[key].find(item => {
                return item.id == res.data.data.id;
              });
              if (find) {
                this.selected = find;
                break;
              }
            }
          }
        });
      },
    });
  });
};

const Store = new City();
Store.fetchData();
module.exports = Store