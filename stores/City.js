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
    markers: [],
  });
}
City.prototype.getMarkers = async function (type, latitude, longitude) {
  if (type == undefined) {
    await this.fetchData();
  }
  if (latitude && longitude) {
    this.latitude = latitude;
    this.longitude = longitude;
  }

  http.request({
    url: '/api/shop/near',
    data: {
      btype: type || '1',
      latitude: this.latitude,
      longitude: this.longitude,
      user_latitude: this.user_latitude,
      user_longitude: this.user_longitude,
    },
    showLoading: latitude == undefined,
    loadingTitle: '获取周边商家',
    header: {
      user_latitude: this.user_latitude,
      user_longitude: this.user_longitude,
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
          //marker.tags = item.typename.split(',');
          marker.tags = item.typename;
          // const dist = (item.distance * 1000);
          // marker.distance = (dist > 1000 ? dist / 1000 : dist).toFixed(2) + (dist > 1000 ? '公里' : '米');
          marker.distance = item.distance;
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
        this.list = response.data.data

          wx.getSetting({
              success:(res)=>{
                  console.log(res)
                  if(res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
                      wx.showModal({
                          title: '请求授权当前位置',
                          content: '需要获取您的地理位置，请确认授权',
                          success:(res)=>{
                            if(res.cancel){
                                wx.showToast({
                                    title: '拒绝授权',
                                    icon: 'none',
                                    duration: 1000
                                })
                                http.request({
                                    url:'/api/basics/config',
                                    method:'POST',
                                    success:(res)=>{
                                        const position = res.data.data.position
                                        console.log("拒绝授权",position)
                                        this.longitude = position.location.lng;
                                        this.latitude = position.location.lat;
                                        //用户所处位置
                                        this.user_latitude = position.location.lng;
                                        this.user_longitude = position.location.lat;
                                        //根据名字找到数组中的城市
                                        for (const key in this.list) {
                                            const find = this.list[key].find(item => {
                                                return item.id == position.city_id;
                                            });
                                            if (find) {
                                                this.selected = find;
                                                break;
                                            }
                                        }
                                        resolve();
                                    }
                                })
                            }else if(res.confirm){
                                wx.openSetting({
                                    success:(res)=>{
                                      if (res.authSetting["scope.userLocation"] == true){
                                          wx.showToast({
                                              title: '授权成功',
                                              icon: 'success',
                                              duration: 1000
                                          })
                                          wx.getLocation({
                                              type: 'wgs84',
                                              success: (res) => {
                                                  console.log(res);
                                                  // success
                                                  this.longitude = res.longitude;
                                                  this.latitude = res.latitude;
                                                  //用户所处位置
                                                  this.user_latitude = res.latitude;
                                                  this.user_longitude = res.longitude;

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
                                      }else {
                                          wx.showToast({
                                              title: '授权失败',
                                              icon: 'none',
                                              duration: 1000
                                          })
                                          http.request({
                                              url:'/api/basics/config',
                                              method:'POST',
                                              success:(res)=>{
                                                  const position = res.data.data.position
                                                  console.log("授权失败",res.data)
                                                  this.longitude = position.location.lng;
                                                  this.latitude = position.location.lat;
                                                  //用户所处位置
                                                  this.user_latitude = position.location.lng;
                                                  this.user_longitude = position.location.lat;
                                                  //根据名字找到数组中的城市
                                                  for (const key in this.list) {
                                                      const find = this.list[key].find(item => {
                                                          return item.id == position.city_id;
                                                      });
                                                      if (find) {
                                                          this.selected = find;
                                                          break;
                                                      }
                                                  }
                                                  resolve();
                                              }
                                          })
                                      }
                                    }
                                })
                            }
                          }
                      })
                  }else if (res.authSetting['scope.userLocation'] == undefined) {
                  //第一次授权
                      wx.getLocation({
                          type: 'wgs84',
                          success: (res) => {
                              console.log("success",res);
                              // success
                              this.longitude = res.longitude;
                              this.latitude = res.latitude;
                              //用户所处位置
                              this.user_latitude = res.latitude;
                              this.user_longitude = res.longitude;

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
                          },
                          fail:(res)=>{
                              if(res.errMsg=='getLocation:fail:auth denied'){
                                  wx.showToast({
                                      title: '取消授权',
                                      icon: 'none',
                                      duration: 1000
                                  })
                              }
                              http.request({
                                  url:'/api/basics/config',
                                  method:'POST',
                                  success:(res)=>{
                                      const position = res.data.data.position
                                      console.log("拒绝授权",position)
                                      this.longitude = position.location.lng;
                                      this.latitude = position.location.lat;
                                      //用户所处位置
                                      this.user_latitude = position.location.lng;
                                      this.user_longitude = position.location.lat;
                                      //根据名字找到数组中的城市
                                      for (const key in this.list) {
                                          const find = this.list[key].find(item => {
                                              return item.id == position.city_id;
                                          });
                                          if (find) {
                                              this.selected = find;
                                              break;
                                          }
                                      }
                                      resolve();
                                  }
                              })
                          }
                      })
                  }else {
                  //  授权成功
                      wx.getLocation({
                          type: 'wgs84',
                          success: (res) => {
                              console.log(res);
                              // success
                              this.longitude = res.longitude;
                              this.latitude = res.latitude;
                              //用户所处位置
                              this.user_latitude = res.latitude;
                              this.user_longitude = res.longitude;

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
                  }
              }
          })

        /*
        wx.getLocation({
          type: 'wgs84',
          success: (res) => {
            console.log(res);
            // success
            this.longitude = res.longitude;
            this.latitude = res.latitude;
            //用户所处位置
            this.user_latitude = res.latitude;
            this.user_longitude = res.longitude;

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
        */
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
