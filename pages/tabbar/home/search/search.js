// pages/tabbar/search/search.js
import { observer } from '../../../../utils/mobx/observer';
import http from '../../../../utils/http';
const { regeneratorRuntime } = global;
// const app = getApp();
Page(observer({
  props: {
    city: require('../../../../stores/City'),
  },
  /**
   * 页面的初始数据
   */
  data: {
/*
    nvabarData: {
      showCapsule: true, //是否显示左上角图标
      title: '附件商家', //导航栏 中间的标题
      transparent: false //透明导航栏
    },
*/
    query: '',
    list: [],
    // occupation: app.globalData.height + 46,
  },

  //切换城市
  onCityChange(e) {
    this.props.city.selected = e.detail.detail.value;
  },

  onLoad(params) {
    this.setData({ query: params.query || '' });
    this.search(params.query)
  },

  async search(query) {
    if (query == "") {
      return false;
    }
    await this.props.city.fetchData();
    http.request({
      url: '/api/shop/searchfarm',
      method: 'POST',
      showLoading: true,
      header:{
        latitude: this.props.city.user_latitude,
        longitude: this.props.city.user_longitude,
      },
      data: {
        cityid: this.props.city.selected.id,
        mname: query
      },
      success: (response) => {
        if (response.data.code == 1) {
          this.setData({ list: response.data.data });
        } else {
          this.setData({ list: [] });
        }
      }
    })
  }
}))