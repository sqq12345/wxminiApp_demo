// pages/group/result/result.js
import { observer } from '../../../utils/mobx/observer';
Page(observer({
  props: {
    selectedList: require('../../../stores/Group').selectedList,
  },
  /**
   * 页面的初始数据
   */
  data: {
    nvabarData: {
      showCapsule: true, //是否显示左上角图标
      title: '开团商品', //导航栏 中间的标题
      transparent: false //透明导航栏
    },
    query: '',
    results: [], //搜索结果
  },
  fetchResults() {
    const json = [
      { id: 1, thumb: '', name: 'goods1', price: 24, unit: '规格1', count: 2, shop: { id: 1, name: '农场名1' }, },
      { id: 2, thumb: '', name: 'goods2', price: 36, unit: '规格2', count: 1, shop: { id: 1, name: '农场名1' }, },
      { id: 3, thumb: '', name: 'goods3', price: 36, unit: '规格2', count: 1, shop: { id: 1, name: '农场名1' }, },
      { id: 4, thumb: '', name: 'goods4', price: 36, unit: '规格2', count: 1, shop: { id: 1, name: '农场名1' }, },
      { id: 5, thumb: '', name: 'goods5', price: 36, unit: '规格2', count: 1, shop: { id: 1, name: '农场名1' }, },
      { id: 6, thumb: '', name: 'goods6', price: 36, unit: '规格2', count: 1, shop: { id: 1, name: '农场名1' }, },
    ];
    this.setData({
      results: json
    }, () => { this.addMarker() });
  },
  //添加选中标记
  addMarker() {
    const data = this.data.results;
    data.map(item => {
      if (this.props.selectedList.some(i => i.id === item.id)) {
        item.selected = true;
      } else {
        item.selected = false;
      }
    });
    this.setData({
      results: data
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.query) {
      this.setData({
        query: options.query
      });
    }
    this.fetchResults();
  },
  search(e) {
    console.log(e.detail.value);
  },
  select(e) {
    const { id } = e.target.dataset;
    const index = this.props.selectedList.findIndex(item => item.id === id);
    //没有-添加 有-删除
    if (index == -1) {
      this.props.selectedList.push(this.data.results.find(item => {
        return item.id === id;
      }))
    } else {
      this.props.selectedList.splice(index, 1)
    }
    this.addMarker();
  }
}))