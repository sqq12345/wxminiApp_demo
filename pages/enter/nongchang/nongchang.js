// pages/enter/step2/step2.js
import http from '../../../utils/http';
import login from '../../../stores/Login';
import regex from '../../../utils/regex';
import { observer } from '../../../utils/mobx/observer';
const { regeneratorRuntime } = global;
import verify from '../../../utils/verify';
Page(observer({
  props: {
    form: require('../../../stores/Form')
  },
  /**
   * 页面的初始数据
   */
  data: {
    nvabarData: {
      showCapsule: true, //是否显示左上角图标
      title: '农场入驻', //导航栏 中间的标题
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
  onLoad() {
    //console.log(this.props.form);
  },
  /* upload */
  onUploadSuccess(e) {

  },
  onUploadFail(e) {

  },
  onUploadComplete(e) {
    console.log(e);
  },

  async submit() {
    const result = await login();
    const form = this.props.form;
    //console.log(form);
    if (verify(form, config)) {
      http.request({
        url: '/api/shop/setmerchant',
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
    name: '手机号码',
    regex: regex.cellphone
  },
  telephone: {
    name: '固定电话',
    regex: regex.telphone
  },
  other: {
    name: '其他',
  },
  farmsize: {
    name: '农场规模',
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
  Idaho: {
    name: '农场图片',
    require: true,
  },
  story: {
    name: '农夫故事',
    require: true,
    max: 300
  },
  idcard: {
    name: '身份证正面',
    require: true,
  },
  idcardback: {
    name: '身份证反面',
    require: true,
  },
  brand: {
    name: '品牌授权',
    require: true,
  },
  enterprise: {
    name: '企业生产许可证/食品经营许可证/食品流通许可证',
    require: true,
  },
  report: {
    name: '质检报告(质监局/SGS等专业检测机构)',
    require: true,
  },
  organic: {
    name: '有机认证/绿色认证',
    require: true,
  }
}