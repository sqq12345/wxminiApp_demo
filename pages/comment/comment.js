// pages/comment/comment.js
import http from '../../utils/http';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nvabarData: {
      showCapsule: true, //是否显示左上角图标
      title: '留言评论', //导航栏 中间的标题
      transparent: false //透明导航栏
    },
    raterValue: 3.5,
    uploadOptions: {
      header: {
        'content-Type': 'multipart/form-data',
        'accesstoken': http.accesstoken
      },
      max: 4,
      url: 'https://anfou.cc/api/basics/upload',
      name: 'images'
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  raterChange(e) {
    this.setData({
      raterValue: e.detail.value,
    })
  },

  /* upload */
  onUploadSuccess(e) {

  },
  onUploadFail(e) {

  },
  onUploadComplete(e) {
    console.log(e);
  }
})