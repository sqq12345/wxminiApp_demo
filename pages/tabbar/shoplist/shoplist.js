// pages/tabbar/shoplist/shoplist.js
import { observer } from '../../../utils/mobx/observer';
import http from '../../../utils/http';

Page(observer({
  props: {
    city: require('../../../stores/City'),
  },
  /**
   * 页面的初始数据
   */
  data: {
    nvabarData: {
      showCapsule: false, //是否显示左上角图标
      title: '全部商家', //导航栏 中间的标题
      transparent: false //透明导航栏
    },
    //分类
    types: [
      { text: '农场', value: '1' },
      { text: '社群', value: '2' },
    ],
    selectedType: '1',
    //排序
    sorts: [
      { text: '默认排序', value: '1' },
      { text: '销量', value: '2' },
    ],
    selectedSort: '1',
    //当前页数
    page: 1,
    list: [],
    loading: false,

    imgUrls: [

    ],
  },
  fetchList() {
    setTimeout(() => {
      this.setData({
        list: this.data.list.concat([{}, {}, {}])
      }, () => {
        this.setData({ loading: false });
      })
    }, 1000)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //请求轮播图
    http.request({
      url: '/api/basics/slides',
      method: 'POST',
      success: (response) => {
        //排序图片
        const arr = response.data.data;
        arr.sort((a, b) => {
          return b.sort - a.sort;
        });
        //temp
        arr.map(item=>{
          item.avatar = item.avatar.replace('http://af.dev.com','')
        });
        this.setData({ imgUrls: response.data.data })
      }
    });
    this.fetchList();
  },
  //切换城市
  onCityChange(e) {
    this.props.city.selected = e.detail.detail.value;
  },

  //过滤条件
  onConditionChange(e) {
    const { condition, value } = e.target.dataset;
    switch (condition) {
      case 'type':
        this.setData({ selectedType: value })
        break;
      case 'sort':
        this.setData({ selectedSort: value })
        break;
    }
    //重新加载数据
    this.setData({ loading: true, list: [] }, () => {
      setTimeout(() => {
        this.setData({ list: [{}, {}, {}] }, () => {
          this.setData({ loading: false });
        });
      }, 1000)
    });
  },

  onReachBottom() {
    if (this.data.loading) return;
    this.setData({ loading: true }, () => {
      this.fetchList();
    });
  }
}))