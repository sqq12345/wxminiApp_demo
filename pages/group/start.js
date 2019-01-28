// pages/group/start.js
import { observer } from '../../utils/mobx/observer';
import http from '../../utils/http';
import login from '../../stores/Login';
const { regeneratorRuntime } = global;
import verify from '../../utils/verify';
const app = getApp();
Page(observer({
  props: {
    selectedList: require('../../stores/Group').selectedList,
  },
  /**
   * 页面的初始数据
   */
  data: {
/*
    nvabarData: {
      showCapsule: true, //是否显示左上角图标
      title: '开团商品', //导航栏 中间的标题
      transparent: false //透明导航栏
    },
    occupation: app.globalData.height + 46,
*/
    picker: [
      { text: 'picker', value: '' },
      { text: 'picker', value: '' },
      { text: 'picker', value: '' },
      { text: 'picker', value: '' },
      { text: 'picker', value: '' },
    ],
    //同意协议
    agreed: true,
    form: {
      image: '',
      title: '',
      content: '',
      gids: '',
      endtime: '',
    },
    time: '',
      disable:false,
      isPhone:app.globalData.isIpx,
  },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },
    onShow: function () {
        console.log("onShow商品：",this.props.selectedList)
    },
  setTime(e) {
    const time = e.detail;
    this.setData({
      time, 'form.endtime': (new Date(time).getTime() / 1000) + ''
    })
  },
  /* upload */
  onUploadFail(e) {

  },
  onRemove(e) {
    const data = e.detail.file.res.data;
    if (data) {
      const json = JSON.parse(data);
      let image = '';
      image = this.data.form.image.replace(json.data.img + ',', '');
      image = this.data.form.image.replace(',' + json.data.img, '');
      this.setData({
        'form.image': image
      })
    }
  },
  onComplete(e) {
    const { detail: { data } } = e;
    if (data) {
      const json = JSON.parse(data);
      let image = this.data.form.image;
      if (this.data.form.image == "") {
        image = json.data.img
      } else {
        image += ',' + json.data.img
      }
      this.setData({
        'form.image': image
      })
    }
  },
  onInput(e) {
    const value = e.detail.value;
    const field = 'form.' + e.target.dataset.field;
    this.setData({
      [field]: value
    });
  },

  //删除选中商品
  remove(e) {
    const { id } = e.target.dataset;
    const index = this.props.selectedList.findIndex(item => item.id === id);
    this.props.selectedList.splice(index, 1)
  },
  //同意协议
  agree() {
    this.setData({
      agreed: !this.data.agreed
    });
  },


  async submit() {
    if (!this.data.agreed) {
      wx.showToast({
        title: '请同意《群接龙服务协议》',
        icon: 'none',
        duration: 1500,
      });
      return false;
    }
    const form = this.data.form;
    form.gids = '';
    this.props.selectedList.forEach(item => {
      form.gids += item.id + ','
    });
    if (form.gids != '') {
      form.gids = form.gids.substr(0, form.gids.length - 1)
    }
    //test
    console.log(form);
    const result = await login();
    if (verify(form, config)) {
        this.setData({disable: true})
      http.request({
        url: '/api/solitaire/publish',
        method: 'POST',
        header: {
          token: result.user_token
        },
        data: form,
        success: (response) => {
            //提交成功
          if (response.data.code == 1) {
              this.props.selectedList.splice(0, this.props.selectedList.length)
              this.setData({disable: false})
            wx.redirectTo({
              url: '/pages/user/group/group',
            });
          }
        }
      });
    }
  }
}))

const config = {
  title: {
    name: '团购主题',
    require: true,
  },
  content: {
    name: '团购内容',
    require: true,
  },
  gids: {
    require: true,
    msg: '请选择至少一件商品'
  },
  endtime: {
    name: '截止时间',
    require: true,
  }
};
