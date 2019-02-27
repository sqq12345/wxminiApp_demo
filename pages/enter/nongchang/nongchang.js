import http from '../../../utils/http';
import login from '../../../stores/Login';
import regex from '../../../utils/regex';
import {observer} from '../../../utils/mobx/observer';
import verify from '../../../utils/verify';

const {regeneratorRuntime} = global;

Page(observer({
  props: {
    form: require('../../../stores/Form').values
  },
  /**
   * 页面的初始数据
   */
  data: {
    address: '',
      farmsize: 0,
      numsList:[{
          key: 0,
          value: '0-50',
      },{
          key: 1,
          value: '50-100',
      },{
          key: 2,
          value: '100以上',
      }],
  },
    //选择农场规模
    bindPickerNum: function(e) {
        var val = e.detail.value
        this.setData({
            farmsize: val,
        })
        this.props.form['farmsize'] = val;
    },
  onInput(e) {
    const value = e.detail.value;
    const {field} = e.target.dataset;
    this.props.form[field] = value;
  },
  chooseAddress() {
    wx.chooseLocation({
      success: (result) => {
          console.log(result)
        //选择地址赋值 赋值经纬度
        // const str = result.address + ' ' + result.name;
          const str = result.name;
        this.props.form['address'] = str;
        this.props.form['latitude'] = result.latitude;
        this.props.form['longitude'] = result.longitude;
        this.setData({address: str});
      },
    });
  },
  async onLoad(options) {
    this.props.form['mid'] = options.id;
  },

  onUploadFail(e) {

  },
  onRemove(e) {
    const data = e.detail.file.res.data;
    if (data) {
      const {field} = e.target.dataset;
      const json = JSON.parse(data);
      this.props.form[field] = this.props.form[field].replace(json.data.img + ',', '');
      this.props.form[field] = this.props.form[field].replace(',' + json.data.img, '');
    }
  },
  onComplete(e) {
    const {detail: {data}} = e;
    if (data) {
      const {field} = e.target.dataset;
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
    console.log(form)
    // console.log(form,!form.mobile , !form.other , !form.telephone);
    // if(!form.mobile && !form.other && !form.telephone){
    //     wx.showToast({
    //         title: '联系方式至少填一项',
    //         icon: 'none',
    //         duration: 2000,
    //     });
    //     return;
    // }
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
              showCancel: false,
              success(res) {
                if (res.confirm) {
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
    require: false,
  },
  other: {
    name: '其他',
    require: false,
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
    name: '主头像',
    require: true,
  },
  memo: {
    name: '简介',
    require: true,
    max: 300
  },
  pics: {
    name: '农场图片',
    require: false,
  },
  story: {
    name: '农夫故事',
    require: false,
    max: 300
  },
  licence: {
    name: '营业执照',
    require: false,
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
    require: false,
  },
  enterprise: {
    name: '企业生产许可证/食品经营许可证/食品流通许可证',
    require: false,
  },
  report: {
    name: '质检报告(质监局/SGS等专业检测机构)',
    require: false,
  },
  organic: {
    name: '有机认证/绿色认证',
    require: false,
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
