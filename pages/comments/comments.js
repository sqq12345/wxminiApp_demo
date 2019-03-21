import http from '../../utils/http';

const {regeneratorRuntime} = global;
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    gid: 0,
    page: 1,
    loading: false,
    end: false,
    score: 0,
    list: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({gid: options.id}, () => {
      this.fetchData()
    })
  },

  fetchData() {
    http.request({
      showLoading: true,
      url: '/api/shop/allcomments',
      method: 'POST',
      data: {
        page: this.data.page,
        gid: this.data.gid
      },
      success: (response) => {
        this.setData({
          score: response.data.data.score,
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
    this.setData({loading: true}, () => {
      this.fetchData();
    });
  },
    //查看大图
    bindImg:function (e) {
        var src = e.currentTarget.dataset.src;//获取data-src
        var imgList = e.currentTarget.dataset.list;//获取data-list
        //图片预览
        wx.previewImage({
            current: src, // 当前显示图片的http链接
            urls: imgList, // 需要预览的图片http链接列表
        })
    },
    //分享
    onShareAppMessage: function () {
        // return app.share('', "/pages/tabbar/home/home", '')
    },
});
