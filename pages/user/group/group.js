// pages/group/my/my.js
import http from '../../../utils/http';
import login from '../../../stores/Login';
const { regeneratorRuntime } = global;
// const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
/*
    nvabarData: {
      showCapsule: true, //是否显示左上角图标
      title: '我的接龙', //导航栏 中间的标题
      transparent: false, //透明导航栏
    },
    occupation: app.globalData.height + 46,
*/
    //当前页数
    page: 1,
    list: [],
    loading: false,
    //没有更多数据了
    end: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    this.fetchList()
  },

  async fetchList() {
    const result = await login();
    http.request({
      url: '/api/solitaire/solitaire',
      method: 'POST',
      data: {
        page: this.data.page
      },
      header: {
        token: result.user_token
      },
      success: (response) => {
        const list = response.data.data.data;
        const timeNow = (new Date()).valueOf();
          list.forEach(item => {
            const itemTime = new Date(item.endtime).valueOf();
              item.status = itemTime<=timeNow ? 1:0;//1为已结束 0未结束
          });

        const end = response.data.data.last_page == this.data.page;
        this.setData({ list: this.data.list.concat(list), end, loading: false, page: this.data.page + 1 })
      }
    })
  },

  onReachBottom() {
    if (this.data.loading || this.data.end) return;
    this.setData({ loading: true }, () => {
      this.fetchList();
    });
  },

  //分享
  onShareAppMessage: function (e) {
    if (e.from === 'button') {
      const { title, id, img} = e.target.dataset;
      return {
        title: title, // 转发后 所显示的title
        path: '/pages/group/buy/buy?id=' + id, // 相对的路径
        //拼团图片
        imageUrl: img,
        success: (res) => {    // 成功后要做的事情

        },
        fail: function (res) {
          // 分享失败
          console.log(res)
        }
      }
    }
  }
})
