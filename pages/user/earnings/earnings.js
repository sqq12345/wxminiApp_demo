import http from '../../../utils/http';
import login from '../../../stores/Login';
const app = getApp();
const {regeneratorRuntime} = global;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    const result = await login();
    http.request({
      showLoading: true,
      url: '/api/user/earnings',
      header: {
        token: result.user_token
      },
      method: 'GET',
      success: (response) => {

        const data = response.data;
        if (data.code == 1) {
          const list = data.data.income;
          if (JSON.stringify(list) != '{}') {
            var newList = Array();
            for (var item in list) {
              var nitem = list[item];
              nitem.orderNo = nitem.item_num.substr(0, 3) + '****' + nitem.item_num.substr(nitem.item_num.length - 1)
              newList.push(nitem);
            }
            this.setData({
              list: newList
            });
          }
        }


      }
    })
  },
    //分享
    onShareAppMessage: function () {
        return app.share('', '/pages/tabbar/user/user', 'default')
    },
});
