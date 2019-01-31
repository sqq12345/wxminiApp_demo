// pages/detail/detail.js
import http from '../../utils/http';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
/*
    nvabarData: {
      position: 'absolute',
      showCapsule: true, //是否显示左上角图标
      transparent: true //透明导航栏
    },
*/
    detail: {},
    bg: '',
    type: '1',
    labels: [],
    // occupation: app.globalData.height + 46,
    page: 1,
    loading: false,
    //没有更多数据了
    end: false,
    //评论列表
    list: [],
    descLabel: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let bg = '';
    let labels = [];
    let descLabel = '';
    switch (options.type) {
      case '1': //农场
        labels.push({ name: '农场类型' }, { name: '农场产品' }, { name: '农场服务' });
        bg = '1.png';
        descLabel = '农场简介';
          wx.setNavigationBarTitle({
              title: '农场详情'
          })
        break;
      case '2': //社群
        labels.push({ name: '社群类型' }, { name: '需求产品' });
        bg = '2.png';
        descLabel = '社群简介';
          wx.setNavigationBarTitle({
              title: '社群详情'
          })
        break;
      case '3': //餐厅
        labels.push({ name: '餐厅类型' }, { name: '餐厅风格' }, { name: '菜系类型' });
        bg = '3.png';
        descLabel = '餐厅简介';
          wx.setNavigationBarTitle({
              title: '餐厅详情'
          })
        break;
      case '4': //超市
        labels.push({ name: '超市类型' }, { name: '产品类型' }, { name: '超市规模' });
        bg = '4.png';
        descLabel = '超市简介';
          wx.setNavigationBarTitle({
              title: '超市详情'
          })
        break;
      case '5': //集市
        labels.push({ name: '市集类型' }, { name: '产品类型' }, { name: '市集活动' });
        bg = '5.png';
        descLabel = '集市简介';
          wx.setNavigationBarTitle({
              title: '集市详情'
          })
        break;
    }
    this.setData({ bg, descLabel, type: options.type });
    http.request({
      showLoading: true,
      url: '/api/shop/detailsfarm?mid=' + options.id,
      method: 'GET',
      success: (response) => {
        const data = response.data.data;
        switch (options.type) {
          case '1': //农场
            labels[0].arr = data['type_ids'].split(',');
            labels[1].arr = data['goods_ids'].split(',');
            labels[2].arr = data['server_ids'].split(',');
            break;
          case '2': //社群
            labels[0].arr = data['type_ids'].split(',');
            labels[1].arr = data['goods_ids'].split(',');
            break;
          case '3': //餐厅
            labels[0].arr = data['type_ids'].split(',');
            labels[1].arr = data['style_ids'].split(',');
            labels[2].arr = data['cooking_ids'].split(',');
            break;
          case '4': //超市
            labels[0].arr = data['type_ids'].split(',');
            labels[1].arr = data['goods_ids'].split(',');
            labels[2].arr = data['scale_ids'].split(',');
            break;
          case '5': //集市
            labels[0].arr = data['type_ids'].split(',');
            labels[1].arr = data['goods_ids'].split(',');
            labels[2].arr = data['live_ids'].split(',');
            break;
        }
        this.setData({ detail: data, labels, loading: false, }, () => {
          this.fetchComments()
        })
      }
    });
  },

  resetComments() {
    this.setData({ list: [], page: 1 }, () => {
      this.fetchComments();
    });
  },

  fetchComments() {
    http.request({
      showLoading: true,
      url: `/api/shop/comments?mid=${this.data.detail.id}&page=${this.data.page}`,
      method: 'GET',
      success: (response) => {
        const list = this.data.list;
        const end = response.data.data.totalpage == this.data.page;
        this.setData({ list: list.concat(response.data.data.list), end, loading: false, page: this.data.page + 1 })
      }
    });
  },

  onReachBottom() {
    if (this.data.loading || this.data.end) return;
    this.setData({ loading: true }, () => {
      this.fetchComments();
    });
  },
    //查看大图
    bindImg:function (e) {
        var src = e.currentTarget.dataset.src;//获取data-src
        var imgList = e.currentTarget.dataset.list == 'null'? src.split(',') : e.currentTarget.dataset.list;//获取data-list
        //图片预览
        wx.previewImage({
            current: src, // 当前显示图片的http链接
            urls: imgList, // 需要预览的图片http链接列表
        })
    },
})
