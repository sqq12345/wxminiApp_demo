import http from '../../../utils/http';
import login from '../../../stores/Login';
import regex from '../../../utils/regex';
import {observer} from '../../../utils/mobx/observer';
import verify from '../../../utils/verify';
const app = getApp();
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
      farmsize: '0',
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
      selected:true,
      mDisabled:false,
      cDisabled:true,
      validMobile: false, //判断手机号是否可用【正确且不重复】
      showCodebtn: true,
      timer: '',//定时器名字
      countDownNum: '60'//倒计时初始值
  },
    async onLoad(options) {
        this.props.form['mid'] = options.id;
        this.props.form['farmsize'] = this.data.farmsize;
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

      if(field == 'mobile'){
          if(value.length!=11){
              return;
          }
          // 验证手机号是否重复
          this.valid_mobile(value)
      }
      if(field == 'mobileCode'){
          if(value.length!=6){
              return;
          }
          //验证 验证码是否正确
          this.valid_code(value)
      }
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

  onUploadFail(e) {},
  onRemove(e) {
      const index = e.detail.index;
      const {field} = e.target.dataset;
      let imgList = this.props.form[field].split(',')
      imgList.splice(index,1)
      this.props.form[field] = imgList.join(',')
      console.log("onRemove：",index,this.props.form[field],field)
  },
  onComplete(e) {
    const data = e.detail
    if (data) {
      const {field} = e.target.dataset;
      if (this.props.form[field] == undefined||!this.props.form[field]) {
        this.props.form[field] = data
      } else {
        this.props.form[field] += ',' + data
      }
        console.log("upload：",this.props.form[field],field)
    }
  },
  //同意协议
  select() {
      this.data.selected = !this.data.selected
      const selected = this.data.selected;
      this.setData({selected});
  },
    // 输入框失去焦点
    async blurInput(e) {
        const value = e.detail.value;
        const {field} = e.target.dataset;
        if(field == 'mobile'){
            this.valid_mobile(value)
        }
        if(field == 'mobileCode'){
            this.valid_code(value)
        }
    },
    // 验证手机号是否重复
    async valid_mobile (val){
        http.request({
            url: '/api/shop/valid_mobile',
            method: 'POST',
            data: {
                mobile:val
            },
            success: (response) => {
                if (response.data.code === 1) {
                    //success
                    this.setData({
                        validMobile:true
                    });
                } else {
                    wx.showToast({
                        title: response.data.msg,
                        icon: 'none',
                        duration: 4000,
                    });
                }
            }
        })
    },
    //验证 验证码是否正确
    async valid_code(val){
        http.request({
            url: '/api/message/valid',
            method: 'POST',
            data: {
                code:val,
                mobile:this.props.form['mobile']
            },
            success: (response) => {
                if (response.data.code === 1) {
                    //success
                    this.setData({
                        cDisabled:true
                    });
                } else {
                    wx.showToast({
                        title: response.data.msg,
                        icon: 'none',
                        duration: 4000,
                    });
                }
            }
        })
    },
    //获取验证码
    async getMobileCode() {
      if(!this.props.form['mobile']){
          wx.showToast({
              title: "手机号不能为空",
              icon: 'none',
              duration: 4000,
          });
          return;
      }
      if(!this.data.validMobile){
          //判断手机号防重是否success
          return;
      }
        http.request({
            url: '/api/message/send',
            method: 'POST',
            data: {
                mobile:this.props.form['mobile']
            },
            success: (response) => {
              console.log(response)
                if (response.data.code === 1) {
                    //success
                    this.setData({
                        mDisabled:true,
                        cDisabled:false,
                        showCodebtn: false,
                    });
                    this.countDown();
                } else {
                    wx.showToast({
                        title: response.data.msg,
                        icon: 'none',
                        duration: 4000,
                    });
                }
            }
        })
    },
    // 定时器
    countDown(){
        let that = this,countDownNum = that.data.countDownNum;
        that.setData({
            timer: setInterval(function () {
                countDownNum--;
                that.setData({
                    countDownNum: countDownNum
                })
                if (countDownNum == 0) {
                    clearInterval(that.data.timer);
                    that.setData({
                        showCodebtn: true,
                        countDownNum:60
                    });
                }
            }, 1000)
        })
    },

  async submit() {
    const result = await login();
    const form = this.props.form;
    console.log("submit：",form)
    if (verify(form, config)) {
      //判断是否同意协议
        if(!this.data.selected){
            wx.showToast({
                title: '请认真查阅《商户协议》并勾选同意',
                icon: 'none',
                duration: 4000
            })
            return;
        }
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
  },
    //分享
    onShareAppMessage: function () {
        return app.share('', '/pages/enter/enter', 'default')
    },
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
  mobileCode:{
      name: '验证码',
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
