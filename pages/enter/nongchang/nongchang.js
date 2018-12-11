// pages/enter/step2/step2.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nvabarData: {
      showCapsule: true, //是否显示左上角图标
      title: '农场入驻', //导航栏 中间的标题
      transparent: false //透明导航栏
    },
  },
  /* upload */
  onUploadSuccess(e){

  },
  onUploadFail(e){
    
  },
  onUploadComplete(e){
    console.log(e);
  }
})