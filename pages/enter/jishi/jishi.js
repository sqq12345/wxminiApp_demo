// pages/enter/step2/step2.js
import http from '../../../utils/http';
import login from '../../../stores/Login';
import regex from '../../../utils/regex';
import { observer } from '../../../utils/mobx/observer';
const { regeneratorRuntime } = global;
import verify from '../../../utils/verify';
Page(observer({
  props: {
    form: require('../../../stores/Form').values
  },
  /**
   * 页面的初始数据
   */
  data: {
    nvabarData: {
      showCapsule: true, //是否显示左上角图标
      title: '集市入驻', //导航栏 中间的标题
      transparent: false //透明导航栏
    },
    address: ''
  },
  onInput(e) {
    const value = e.detail.value;
    const { field } = e.target.dataset;
    this.props.form[field] = value;
  },
  chooseAddress() {
    wx.chooseLocation({
      success: (result) => {
        //选择地址赋值
        const str = result.address + ' ' + result.name;
        this.props.form['address'] = str;
        this.props.form['latitude'] = result.latitude;
        this.props.form['longitude'] = result.longitude;
        this.setData({ address: str });
        //赋值经纬度
      },
    });
  },
  onLoad(options) {
    this.props.form['mid'] = options.id;
  },
  /* upload */
  onUploadFail(e) {

  },
  onRemove(e) {
    const data = e.detail.file.res.data;
    if (data) {
      const { field } = e.target.dataset;
      const json = JSON.parse(data);
      this.props.form[field] = this.props.form[field].replace(json.data.img + ',', '');
      this.props.form[field] = this.props.form[field].replace(',' + json.data.img, '');
    }
  },
  onComplete(e) {
    const { detail: { data } } = e;
    if (data) {
      const { field } = e.target.dataset;
      const json = JSON.parse(data);
      if (this.props.form[field] == undefined) {
        this.props.form[field] = json.data.img
      } else {
        this.props.form[field] += ',' + json.data.img
      }
    }
  },
  async submit() {
    const result = await login();
    const form = this.props.form;
    //console.log(form);
    if (verify(form, config)) {
      http.request({
        url: '/api/shop/setmarkettwo',
        method: 'POST',
        header: {
          token: result.user_token
        },
        data: form,
        success: (response) => {
          if (response.data.code === 0) {
            wx.showToast({
              title: response.data.msg,
              icon: 'none',
              duration: 2000,
            });
          } else {
            //success
            wx.showModal({
              title: '提示',
              content: '申请成功，请等待耐心等待',
              success(res) {
                if (res.confirm) {
                  wx.switchTab({
                    url: '/pages/tabbar/home/home'
                  });
                } else if (res.cancel) {
                  wx.switchTab({
                    url: '/pages/tabbar/home/home'
                  });
                }
              }
            })
          }
        }
      })
    }
  }
}))

const config = {
  linkman: {
    name: '联系人',
    require: true,
    max: 5,
  },
  mobile: {
    require: true,
    name: '手机号码',
    regex: regex.cellphone
  },
  telephone: {
    require: true,
    name: '固定电话',
    regex: regex.telphone
  },
  other: {
    name: '其他',
    require: true,
  },
  idcard: {
    name: '身份证号',
    require: true,
    regex: regex.idcard
  },
  nums:{
    name: '产品种类',
    require: true,
  },
  address: {
    name: '地址',
    require: true,
  },
  cover: {
    name: '封面',
    require: true,
  },
  memo: {
    name: '简介',
    require: true,
    max: 300
  },
  pics: {
    name: '产品图片',
    require: true,
  },
  story: {
    name: '集市故事',
    require: true,
    max: 300
  },
}