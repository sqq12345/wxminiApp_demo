import http from '../../utils/http';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: {},
    typeName: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    http.request({
      url: '/api/shop/details',
      method: 'POST',
      showLoading: true,
      data: {
        mid: options.id
      },
      success: (response) => {
        const data = response.data.data;
        let typeName='';
        data.goods.forEach(item => {
          item.score = Number.parseFloat(item.score).toFixed(1);
          item.price = Number.parseFloat(item.price).toFixed(2);
        });
          switch (data.type) {
              case 1: //农场
                  typeName = '农场';
                  break;
              case 2: //社群
                  typeName = '社群';
                  break;
              case 3: //餐厅
                  typeName = '餐厅';
                  break;
              case 4: //超市
                  typeName = '超市';
                  break;
              case 5: //集市
                  typeName = '集市';
                  break;
          }
        this.setData({ detail: data,typeName });
          console.log(data,typeName)
      }
    })
  }
})
