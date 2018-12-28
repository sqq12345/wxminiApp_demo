// pages/tabbar/search/search.js
import { observer } from '../../../../utils/mobx/observer';
import http from '../../../../utils/http';
Page(observer({
  props: {
    city: require('../../../../stores/City'),
  },
  /**
   * 页面的初始数据
   */
  data: {
    nvabarData: {
      showCapsule: true, //是否显示左上角图标
      title: '附件商家', //导航栏 中间的标题
      transparent: false //透明导航栏
    },
    query: '',
  },

  //切换城市
  onCityChange(e) {
    this.props.city.selected = e.detail.detail.value;
  },

  onLoad(params) {
    this.setData({ query: params.query || '' });
    this.search(params.query)
  },

  search(query) {
    if (query == "") {
      return false;
    }
    http.request({
      url: '/api/shop/searchfarm',
      method: 'POST',
      data: {
        cityid: this.props.city.selected.id,
        mname: query
      },
      success: (response) => {

      }
    })
  }
}))