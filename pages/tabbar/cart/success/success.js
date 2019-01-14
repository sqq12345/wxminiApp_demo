// pages/tabbar/cart/success/success.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      iconType:"success", //warn
      iconSize: 93,
      iconColor: "#33cd5f", //red
      resultTitle: "支付成功",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },
    onClick(e) {
        console.log(e)
        const { index } = e.detail

        index === 0 && wx.showModal({
            title: 'Thank you for your support!',
            showCancel: !1,
        })

        index === 1 && wx.navigateBack()
    },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
