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
      showLoading: true,
      url: '/api/user/fans',
      header: {
        token: result.user_token
      },
      method: 'GET',
      success: (response) => {
        if (response.data.code !== 999) {
          const list = response.data.data.users;
          //隐藏手机号码
          list.forEach(item => {
            item.mobile = item.mobile ? item.mobile.substr(0, 3) + '****' + item.mobile.substr(7) : "暂无联系电话"
          });
          this.setData({
            list: list,
          })
        }
      }
    })
  },
});
