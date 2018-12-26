// pages/comment/comment.js
import http from '../../utils/http';
import login from '../../stores/Login';
const { regeneratorRuntime } = global;
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
    form: {
      mid: 1,
      gid: 1,
      content_text: '',
      ranks: 5,
      content_img: '',
      parent_id: undefined
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  raterChange(e) {
    this.setData({
      'form.ranks': e.detail.value,
    })
  },
  onInput(e) {
    this.setData({
      'form.content_text': e.detail.value,
    })
  },
  onUploadFail(e) {

  },
  onRemove(e) {
    const data = e.detail.file.res.data;
    if (data) {
      const json = JSON.parse(data);
      this.setData({
        'form.content_img': this.data.form.content_img.replace(json.data.img + ',', '')
      });
      this.setData({
        'form.content_img': this.data.form.content_img.replace(',' + json.data.img, '')
      })
    }
  },
  onComplete(e) {
    const { detail: { data } } = e;
    if (data) {
      const json = JSON.parse(data);
      if (this.data.form.content_img == '') {
        this.setData({
          'form.content_img': json.data.img
        })
      } else {
        this.setData({
          'form.content_img': this.data.form.content_img + ',' + json.data.img
        })
      }
    }
  },
  submit: async function () {
    console.log(this.data.form);
    if (this.data.form.content_text == '') {
      wx.showToast({
        title: '评论内容不能为空',
        icon: 'none',
        duration: 1500,
        mask: false,
      });
      return false;
    }
    const result = await login();
    http.request({
      url: '/api/user/message',
      method: 'POST',
      header: {
        token: result.user_token
      },
      data: this.data.form,
      success: (response) => {

      }
    })
  }
})