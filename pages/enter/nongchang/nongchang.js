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
        //选择地址赋值 赋值经纬度
        const str = result.address + ' ' + result.name;
        this.props.form['address'] = str;
        this.props.form['latitude'] = result.latitude;
        this.props.form['longitude'] = result.longitude;
        this.setData({ address: str });
      },
    });
  },
  onLoad(options) {
    this.props.form['mid'] = options.id;
    const pages = getCurrentPages();
    const prevPage = pages[pages.length - 2];  //上一个页面
    //prevPage.setData({ mid: options.id })
  },
  onUploadFail(e) {

  },
  onRemove(e) {
    const data = e.detail.file.res.data;
    if (data) {
      const { field } = e.target.dataset;
      const json = JSON.parse(data);
      this.props.form[field] = this.props.form[field].replace(json.data.img + ',', '')
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
    console.log(form);
    if (verify(form, config)) {
      http.request({
        url: '/api/shop/setmerchanttwo',
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
    name: '手机号码',
    regex: regex.cellphone,
    require: true,
  },
  telephone: {
    name: '固定电话',
    regex: regex.telphone,
    require: true,
  },
  other: {
    name: '其他',
    require: true,
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
  licence: {
    name: '营业执照',
    require: true,
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
  },
  latitude: {
    require: true,
    msg: '请在地图上选择位置'
  },
  longitude: {
    require: true,
    msg: '请在地图上选择位置'
  }
}