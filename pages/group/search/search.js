// pages/group/search/search.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nvabarData: {
      showCapsule: true, //是否显示左上角图标
      title: '商品分类', //导航栏 中间的标题
      transparent: false //透明导航栏
    },
    list: [
      { text: '新鲜水果', id: 1, thumb: '' },
      { text: '新鲜蔬菜', id: 1, thumb: '' },
      { text: '猪牛羊肉', id: 1, thumb: '' },
      { text: '禽类蛋品', id: 1, thumb: '' },
      { text: '米面杂粮', id: 1, thumb: '' },
      { text: '坚果干活', id: 1, thumb: '' },
      { text: '海鲜水产', id: 1, thumb: '' },
      { text: '蜂产品类', id: 1, thumb: '' },
      { text: '食用油类', id: 1, thumb: '' },
      { text: '厨房调料', id: 1, thumb: '' },
      { text: '酒水饮料', id: 1, thumb: '' },
    ]
  },
  search(e) {
    console.log(e.detail.value);
    wx.navigateTo({
      url: "/pages/group/result/result?query=" + e.detail.value,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
})