/**当前定位城市 */
const { regeneratorRuntime } = global;
const extendObservable = require('../utils/mobx/mobx').extendObservable;
import http from '../utils/http';
let City = function () {
  extendObservable(this, {
    selected: null,
    list: [],
    latitude: null,
    longitude: null,
    user_latitude: null,
    user_longitude: null,
    markers: []
  });
}
City.prototype.getMarkers = async function (type, latitude, longitude) {
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
  if (type == undefined) {
    await this.fetchData();
  }
  if (latitude && longitude) {
    this.latitude = latitude;
    this.longitude = longitude;
  }
  //打印数据
  // console.log('latitude', this.latitude);
  // console.log('longitude', this.longitude);
  // wx.showToast({
  //   title: `${type},${this.latitude},${this.longitude}`,
  //   icon: 'none',
  //   image: '',
  //   duration: 5000,
  // });
  http.request({
    url: '/api/shop/near',
    data: { btype: type || '1' },
    showLoading: latitude == undefined,
    loadingTitle: '获取周边商家',
    header: {
      latitude: this.latitude,
      longitude: this.longitude,
      // latitude: this.latitude,
      // longitude: this.longitude,
    },
    method: 'POST',
    success: (response) => {
      let icon = '';
      switch (Number.parseInt(type)) {
        case 1:
          icon = '/static/icons/map/1-1.png';
          break;
        case 2:
          icon = '/static/icons/map/2.png';
          break;
        case 3:
          icon = '/static/icons/map/3.png';
          break;
        case 4:
          icon = '/static/icons/map/4.png';
          break;
        case 5:
          icon = '/static/icons/map/5.png';
          break;
        default:
          icon = '/static/icons/map/1-1.png';
      }
      if (response.data.code != '999') {
        const markers = [];
        response.data.data.forEach(item => {
          const marker = {};
          marker.id = item.id;
          marker.latitude = item.latitude;
          marker.longitude = item.longitude;
          marker.width = '80rpx';
          marker.height = '80rpx';
          marker.iconPath = icon;
          marker.name = item.name;
          marker.address = item.district;

          const dist = (item.distance * 1000);
          marker.distance = (dist > 1000 ? dist / 1000 : dist).toFixed(2) + (dist > 1000 ? '公里' : '米');
          markers.push(marker);
        });
        this.markers = markers;
      }
    }
  })
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
            // console.log('latitude', res.latitude);
            // console.log('longitude', res.longitude);
            // this.getMarkers();
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
//Store.fetchData();
Store.getMarkers();
module.exports = Store