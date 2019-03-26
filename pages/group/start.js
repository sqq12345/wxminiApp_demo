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
      isPhone:app.globalData.isIPhoneX,
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
    console.log(time);
    this.setData({
      time: time,
      'form.endtime': time
      // time, 'form.endtime': (new Date(time).getTime() / 1000) + ''
    })
  },
  /* upload */
  onUploadFail(e) {

  },
  onRemove(e) {
      const index = e.detail.index;
      const { field } = e.target.dataset;
      let imgList = this.data.form.image.split(',')
      imgList.splice(index,1)
      this.data.form.image = imgList.join(',')
      this.setData({
          'form.image': imgList.join(',')
      });
      console.log("onRemove：",index,this.data.form.image,field)
  },
  onComplete(e) {
    const data = e.detail
    if (data) {
      let image = this.data.form.image;
      if (this.data.form.image == "") {
        image = data
      } else {
        image += ',' + data
      }
      this.setData({
        'form.image': image
      })
        console.log("upload:",this.data.form.image)
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
              this.props.selectedList.splice(0, this.props.selectedList.length) //清除已添加接龙商品
              this.setData({disable: false}) //按钮状态
              //更新上一页数据
              // var pages = getCurrentPages();
              // if (pages.length > 1) {
              //     var prePage = pages[pages.length - 2];
              //     prePage.onChangeList()
              //     console.log(pages,prePage)
              // }
              //返回上页
              wx.redirectTo({
                url: '/pages/user/group/group',
              });
          }
        }
      });
    }
  },
    //分享
    onShareAppMessage: function () {
        return app.share('', '/pages/tabbar/home/home', 'default')
    },
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
