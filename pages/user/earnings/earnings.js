import http from '../../../utils/http';
import login from '../../../stores/Login';

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
      url: '/api/user/earnings',
      header: {
        token: result.user_token
      },
      method: 'GET',
      success: (response) => {
        const data = response.data;
        if (data.code !== 999) {
          const list = data.data.income;
          list.forEach(item => {
            item.orderNo = item.item_num.substr(0, 3) + '****' + item.item_num.substr(item.item_num.length - 1)
          });
          this.setData({
            list: list
          });
        }
      }
    })
  },
});