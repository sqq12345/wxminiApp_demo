import {observer} from '../../../utils/mobx/observer';
import http from '../../../utils/http';

const {regeneratorRuntime} = global;

Page(observer({
  props: {
    city: require('../../../stores/City'),
  },
  /**
   * 页面的初始数据
   */
  data: {
    iColor: '#d2d2d2',
    iaColor: '#ff6600',
    //分类
    types: [
      {text: '农场', value: '1'},
      {text: '社群', value: '2'},
    ],
    selectedType: '1',
    //排序
    sorts: [
      {text: '默认排序', value: '0'},
      {text: '销量', value: '1'},
    ],
    selectedSort: '0',
    //当前页数
    page: 1,
    list: [],
    loading: false,
    //没有更多数据了
    end: false,
    imgUrls: [],
    noticeList:{},
  },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.slidesList();
        this.fetchList();
        this.getNotice();
    },
    //刷新购物车数量
    onShow() {
        const cart = require('../../../stores/Cart');
        cart.setTabbar();
    },
  async fetchList() {
    await this.props.city.fetchData();
    http.request({
      url: '/api/shop/allbusinesses',
      method: 'POST',
      showLoading: true,
      header: {
        longitude: this.props.city.user_longitude,
        latitude: this.props.city.user_latitude
      },
      data: {
        cityid: this.props.city.selected.id,
        order: this.data.selectedSort,
        btype: this.data.selectedType,
        page: this.data.page,
      },
      success: (response) => {
        const list = this.data.list;
        //没有更多了
        const end = response.data.data.last_page == this.data.page;
        this.setData({list: list.concat(response.data.data.data), end, loading: false, page: this.data.page + 1})
      }
    })
  },
    async slidesList(){
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
                this.setData({imgUrls: response.data.data})
            }
        });
    },
    async getNotice(){
        //请求公告
        http.request({
            url: '/api/notice/home',
            method: 'GET',
            success: (response) => {
                this.setData({
                    noticeList: response.data.code===1?response.data.data:null
                })

            }
        });
    },

  //切换城市
  onCityChange(e) {
    this.props.city.selected = e.detail.detail.value;
  },

  //过滤条件
  onConditionChange(e) {
    const {condition, value} = e.target.dataset;
    switch (condition) {
      case 'type':
        this.setData({selectedType: value})
        break;
      case 'sort':
        this.setData({selectedSort: value})
        break;
    }
    //重新加载数据
    this.setData({page: 1, loading: true, end: false, list: []}, () => {
      this.fetchList();
    });
  },

  onReachBottom() {
    if (this.data.loading || this.data.end) return;
    this.setData({loading: true}, () => {
      this.fetchList();
    });
  },
// 更新数据
    onChangeList(){
        this.setData({page: 1, loading: true, end: false, list: []}, () => {
            this.fetchList();
        });
    },
    //下拉
    onPullDownRefresh: function () {
        var that = this
        wx.showToast({
            title: '正在刷新',
            icon: 'loading',
            duration: 2000
        })
        that.onChangeList()
        that.slidesList();
        setTimeout(function(){
            wx.stopPullDownRefresh()
        }, 2000)
    },
}))
