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
    nums: 0,
    person_nums: 0,
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
    personNumsList:[{
        key: 0,
        value: '0-200',
    },{
        key: 1,
        value: '200-500',
    },{
        key: 2,
        value: '500以上',
    }],
  },
    //选择餐桌数
    bindPickerNum: function(e) {
        var val = e.detail.value
        this.setData({
            nums: val,
        })
        this.props.form['nums'] = val;
    },
    //选择可接待人数
    bindPickerPersonNum: function(e) {
        var val = e.detail.value
        this.setData({
            person_nums: val,
        })
        this.props.form['person_nums'] = val;
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
        //赋值经纬度
      },
    });
  },
  async onLoad(options) {
    this.props.form['mid'] = options.id;
  },

  /* upload */
  onUploadFail(e) {},
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
    if (verify(form, config)) {
      http.request({
        url: '/api/shop/setdiningtwo',
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
}));

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
    require: false,
    name: '固定电话',
    regex: regex.telphone
  },
  other: {
    require: false,
    name: '其他',
  },
  nums: {
    name: '餐桌数',
    require: true,
  },
  person_nums: {
    name: '可接待',
    require: true,
  },
  address: {
    name: '地址',
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
    name: '菜品图片',
    require: false,
  },
  story: {
    name: '品牌故事',
    require: false,
    max: 300
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
