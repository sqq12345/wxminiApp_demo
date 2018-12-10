// pages/group/start.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nvabarData: {
      showCapsule: true, //是否显示左上角图标
      title: '开团商品', //导航栏 中间的标题
      transparent: false //透明导航栏
    },
    picker:[
      {text:'picker',value:''},
      {text:'picker',value:''},
      {text:'picker',value:''},
      {text:'picker',value:''},
      {text:'picker',value:''},
    ]
  },
  /* upload */
  onUploadSuccess(e) {

  },
  onUploadFail(e) {

  },
  onUploadComplete(e) {
    console.log(e);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

})