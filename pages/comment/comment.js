// pages/comment/comment.js
import http from '../../utils/http';
import login from '../../stores/Login';
const { regeneratorRuntime } = global;
import clickDisable from '../../utils/clickDisable';
// const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    /*
        nvabarData: {
          showCapsule: true, //是否显示左上角图标
          title: '留言评论', //导航栏 中间的标题
          transparent: false //透明导航栏
        },
    */
    btnDisabled:false,
    form: {},
    //提交地址
    commitUrl: '',
    // occupation: app.globalData.height + 46,
    type: '',    //order shop
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let url = '';
    const form = {
      content_text: '',
      ranks: 5,
      content_img: '',
    };
    switch (options.type) {
      case 'shop':
        url = '/api/shop/message';
        form.mid = options.mid;
        break;
      case 'order':
        url = '/api/user/orderitemsmessage';
        form.item_id = options.id;
        break;
    }
    this.setData({ commitUrl: url, form, type: options.type })
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
    //console.log(this.data.form);
    //todo 判断是哪里的评论
    if (this.data.form.content_text == '') {
      wx.showToast({
        title: '评论内容不能为空',
        icon: 'none',
        duration: 1500,
        mask: false,
      });
      return false;
    }
      this.setData({
          btnDisabled:true,
      })
    const result = await login();
    http.request({
      url: this.data.commitUrl,
      method: 'POST',
      header: {
        token: result.user_token
      },
      data: this.data.form,
      success: (response) => {
        if (response.data.code == 1) {
          wx.showToast({
            title: '评论成功',
            icon: 'success',
            duration: 1000,
            mask: false,
            success: (result) => {
              if (this.data.type == 'shop') {
                const pages = getCurrentPages();
                const lastPage = pages[pages.length - 2];
                lastPage.resetComments();
              } else {
                  const pages = getCurrentPages();
                  const prePage = pages[pages.length - 2];
                  prePage.refresh()
              }
              setTimeout(() => {
                wx.navigateBack({
                  delta: 1
                });
              }, 1000)
            },
          });
        }
      }
    })
  },
    submit1:function () {
        console.log("禁止提交")
    }
})
