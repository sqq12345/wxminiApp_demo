// pages/group/result/result.js
import { observer } from '../../../utils/mobx/observer';
import http from '../../../utils/http';
import login from '../../../stores/Login';
const app = getApp();
const city = require('../../../stores/City');
const { regeneratorRuntime } = global;
Page(observer({
  props: {
    selectedList: require('../../../stores/Group').selectedList,
  },
  /**
   * 页面的初始数据
   */
  data: {
/*
    nvabarData: {
      showCapsule: true, //是否显示左上角图标
      title: '开团商品', //导航栏 中间的标题
      transparent: false //透明导航栏
    },
*/
    query: '',
    type: '',
    // occupation: app.globalData.height + 46,

    //当前页数
    page: 1,
    list: [],
    loading: false,
    //没有更多数据了
    end: false,
      isPhone:app.globalData.isIPhoneX,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // if (options.query) {
    //   this.setData({
    //     query: options.query
    //   });
    // }
    this.setData({
      type: options.type
    }, () => {
      this.fetchResults(options.query);
    });
  },
  async fetchResults(query) {
    // await city.fetchData();
    const result = await login();
    http.request({
        showLoading: true,
      url: '/api/solitaire/goodsList',
      method: 'POST',
      header: {
        token: result.user_token
      },
      data: {
        page: this.data.page,
        // city_id: city.selected.id,
        farm_name: query || '',
        type_id: this.data.type,
      },
      success: (response) => {
        const list = response.data.data.list;
        list.forEach(item => {
          item.strPrice = Number.parseFloat(item.price).toFixed(2)
        })
        //没有更多了
        const end = response.data.data.totalPage == this.data.page;
        this.setData({ list: this.data.list.concat(list), end, loading: false, page: this.data.page + 1 }, () => {
          this.addMarker()
        })
      }
    });
  },
  //添加选中标记
  addMarker() {
    const data = this.data.list;
    data.map(item => {
      if (this.props.selectedList.some(i => i.id === item.id)) {
        item.selected = true;
      } else {
        item.selected = false;
      }
    });
    this.setData({
      list: data
    });
  },
  search(e) {
    //console.log(e.detail.value);
    this.setData({ page: 1, list: [] }, () => {
      this.fetchResults(e.detail.value)
    });
  },
  select(e) {
    const { id } = e.currentTarget.dataset;
    // console.log(e.currentTarget.dataset)
    const index = this.props.selectedList.findIndex(item => item.id === id);
    //没有-添加 有-删除
    if (index == -1) {
      this.props.selectedList.push(this.data.list.find(item => {
        return item.id === id;
      }))
    } else {
      this.props.selectedList.splice(index, 1)
    }
    this.addMarker();
  },

  onReachBottom() {
    if (this.data.loading || this.data.end) return;
    this.setData({ loading: true }, () => {
      this.fetchResults(this.data.query);
    });
  },
    //分享
    onShareAppMessage: function () {
        return app.share('', '/pages/tabbar/home/home', 'default')
    },
}))
