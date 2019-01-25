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
  },
    async onLoad(options) {
        this.props.form['mid'] = options.id;
        /*
        const loginResult = await login();
         //查询进度
         const progressResult = await http.request({
             url: "/api/shop/groupProgress",
             method: 'POST',
             header: {
                 token: loginResult.user_token
             },
         });
         if (progressResult.data.data.state == 1) {
             const resultVal = progressResult.data.data.data
             // this.props.form[resultVal] = resultVal;
             this.props.form['linkman'] = resultVal.linkman?resultVal.linkman:"";
             this.props.form['mobile'] = resultVal.mobile?resultVal.mobile:"";
             this.props.form['telephone'] = resultVal.telephone?resultVal.telephone:"";
             this.props.form['other'] = resultVal.other?resultVal.other:"";
             this.props.form['nums'] = resultVal.nums?resultVal.nums:"";
             this.props.form['address'] = resultVal.address?resultVal.address:"";
             this.props.form['memo'] = resultVal.memo?resultVal.memo:"";
             this.props.form['story'] = resultVal.story?resultVal.story:"";
             this.props.form['longitude'] = resultVal.longitude?resultVal.longitude:"";
             this.props.form['latitude'] = resultVal.latitude?resultVal.latitude:"";
             this.props.form['cover'] = resultVal.cover?resultVal.cover:"";
             this.props.form['pics'] = resultVal.pics?resultVal.pics:"";
             this.props.form['idcard'] = resultVal.idcard?resultVal.idcard:"";
             this.props.form['idcardback'] = resultVal.idcardback?resultVal.idcardback:"";
             this.props.form['brand'] = resultVal.brand?resultVal.brand:"";
             this.props.form['enterprise'] = resultVal.enterprise?resultVal.enterprise:"";
             this.props.form['qs'] = resultVal.qs?resultVal.qs:"";
             this.props.form['wxaccount_image'] = resultVal.wxaccount_image?resultVal.wxaccount_image:"";

             console.log(this.props.form)

             const cover = resultVal.cover.split(',')
             const pics = resultVal.pics.split(',')
             const idcard = resultVal.idcard.split(',')
             const idcardback = resultVal.idcardback.split(',')
             const brand = resultVal.brand.split(',')
             const enterprise = resultVal.enterprise.split(',')
             const qs = resultVal.qs.split(',')
             const wxaccount_image = resultVal.wxaccount_image.split(',')
             cover.map(item=>{
                 item = "https://anfou.cc/"+item
             })
             pics.map(item=>{
                 item = "https://anfou.cc/"+item
             })
             idcard.map(item=>{
                 item = "https://anfou.cc/"+item
             })
             idcardback.map(item=>{
                 item = "https://anfou.cc/"+item
             })
             brand.map(item=>{
                 item = "https://anfou.cc/"+item
             })
             enterprise.map(item=>{
                 item = "https://anfou.cc/"+item
             })
             qs.map(item=>{
                 item = "https://anfou.cc/"+item
             })
             wxaccount_image.map(item=>{
                 item = "https://anfou.cc/"+item
             })
             this.setData({
                 detail: resultVal,
                 cover,
                 pics,
                 idcard,
                 idcardback,
                 brand,
                 enterprise,
                 qs,
                 wxaccount_image,
             })

         }
         */
    },

  onInput(e) {
    const value = e.detail.value;
    const {field} = e.target.dataset;
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
        this.setData({address: str});
        //赋值经纬度
      },
    });
  },
  onUploadFail(e) {},
  onRemove(e) {
    console.log(e.detail)
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
    console.log(form);
    //   if(!form.mobile && !form.other && !form.telephone){
    //       wx.showToast({
    //           title: '联系方式至少填一项',
    //           icon: 'none',
    //           duration: 2000,
    //       });
    //       return;
    //   }
    if (verify(form, config)) {
      http.request({
        url: '/api/shop/setgrouptwo',
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
  nums: {
    name: '社群人数',
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
    name: '社群故事',
    require: true,
    max: 300
  },
  enterprise: {
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
  qs: {
    name: '食品经营许可证/食品流通许可证',
    require: true,
  },
  latitude: {
    require: true,
    msg: '请在地图上选择位置'
  },
  longitude: {
    require: true,
    msg: '请在地图上选择位置'
  },
    wxaccount_image: {
        name: '微信二维码',
        require: true,
    },
};
