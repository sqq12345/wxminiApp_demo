// pages/comments/comments.js
import http from '../../utils/http';
import login from '../../stores/Login';
const { regeneratorRuntime } = global;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nvabarData: {
      showCapsule: true, //是否显示左上角图标
      title: '全部评论', //导航栏 中间的标题
      transparent: false //透明导航栏
    },
    gid: 0,
    page: 1,
    loading: false,
    //没有更多数据了
    end: false,
    score: 0,
    list: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ gid: options.id }, () => {
      this.fetchData()
    })
  },

  fetchData() {
    http.request({
      url: '/api/shop/allcomments',
      method: 'POST',
      data: {
        page: this.data.page,
        gid: this.data.gid
      },
      success: (response) => {
        this.setData({
          score: response.data.data.score.toFixed(1),
          list: this.data.list.concat(response.data.data.comments.list),
          page: this.data.page + 1,
          loading: false,
          end: this.data.page == response.data.data.comments.totalpage
        })
      }
    });
  },

  onReachBottom() {
    if (this.data.loading || this.data.end) return;
    this.setData({ loading: true }, () => {
      this.fetchData();
    });
  }
})