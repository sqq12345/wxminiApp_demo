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
      type:1,
    // occupation: app.globalData.height + 46,
  },

  //切换城市
  onCityChange(e) {
    this.props.city.selected = e.detail.detail.value;
  },

  onLoad(params) {
    console.log(params)
    this.setData({ query: params.query || '',type:params.type });
    this.search(params.query)
  },
  //  搜索类型选择
  async select(e){
    const {type} = e.currentTarget.dataset
      //重新加载数据
      this.setData({type, loading: true, list: []}, () => {
          if(type == 1){
              this.searchFarm()
          } else if(type == 2){
              this.searchShop()
          }
      });
  },
  //搜索
  async search(query) {
    // if (query == "") {
    //   return false;
    // }
      //重新加载数据
      this.setData({query, loading: true, list: []}, () => {
          if(this.data.type == 1){
              this.searchFarm()
          } else if(this.data.type == 2){
              this.searchShop()
          }
      });
  },
    //搜索商家/农场
    async searchFarm(){
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
                mname: this.data.query
            },
            success: (response) => {
                if (response.data.code == 1) {
                    this.setData({ list: response.data.data });
                } else {
                    this.setData({ list: [] });
                }
            }
        })
    },
    //搜索商品
    async searchShop(){
        http.request({
            url: "/api/shop/searchgood",
            method: 'POST',
            showLoading: true,
            data: {
                gname: this.data.query
            },
            success: (response) => {
                if (response.data.code == 1) {
                    this.setData({ list: response.data.data });
                } else {
                    this.setData({ list: [] });
                }
            }
        })
    },
}))
