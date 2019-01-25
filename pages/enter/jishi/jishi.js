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
  async onLoad(options) {
    this.props.form['mid'] = options.id;
      //省
      const provinces = await http.request({
          url: '/api/basics/provincelists',
          method: 'GET',
      });
      provinces.data.data.forEach(item => {
          item.name = item.province_name
      })
      multiArray.push(provinces.data.data);
      this.props.form['province_id'] = provinces.data.data[0].id;
      //市
      const cities = await http.request({
          url: '/api/basics/citylist?province_id=' + this.props.form['province_id'],
          method: 'GET',
      });
      cities.data.data.forEach(item => {
          item.name = item.city_name
      })
      multiArray.push(cities.data.data);
      this.props.form['city_id'] = cities.data.data[0].id;
      //区
      const areas = await http.request({
          url: '/api/basics/arealists?city_id=' + this.props.form['city_id'],
          method: 'GET',
      });
      areas.data.data.forEach(item => {
          item.name = item.area_name
      })
      multiArray.push(areas.data.data);
      this.props.form['area_id'] = areas.data.data[0].id;
      this.setData({ multiArray, showArray: multiArray, multiIndex })
  },
    bindPickerChange(e) {
        const multiIndex = e.detail.value;
        const multiArray = this.data.multiArray;
        this.props.form['province_id'] = this.data.multiArray[0][multiIndex[0]].id;
        this.props.form['city_id'] = this.data.multiArray[1][multiIndex[1]].id;
        this.props.form['area_id'] = this.data.multiArray[2][multiIndex[2]].id;
        this.setData({
            multiIndex, showArray: multiArray
        })
    },
    bindPickerColumnChange: async function (e) {
        const index = e.detail.value;
        const multiArray = this.data.multiArray;
        let multiIndex = this.data.multiIndex;
        switch (e.detail.column) {
            case 0: {
                const id = this.data.multiArray[0][index].id;
                const cities = await http.request({
                    url: '/api/basics/citylist?province_id=' + id,
                    method: 'GET',
                });
                cities.data.data.forEach(item => {
                    item.name = item.city_name
                });
                multiArray[1] = cities.data.data;

                const areas = await http.request({
                    url: '/api/basics/arealists?city_id=' + cities.data.data[0].id,
                    method: 'GET',
                });
                areas.data.data.forEach(item => {
                    item.name = item.area_name
                });
                multiArray[2] = areas.data.data;
                //multiIndex = [index, 0, 0]
                break
            }
            case 1: {
                const id = this.data.multiArray[1][index].id
                const areas = await http.request({
                    url: '/api/basics/arealists?city_id=' + id,
                    method: 'GET',
                });
                areas.data.data.forEach(item => {
                    item.name = item.area_name
                });
                multiArray[2] = areas.data.data;
                //multiIndex[1] = index;
                //multiIndex[2] = 0;
                break
            }
            case 3: {
                //multiIndex[2] = index;
            }
        }
        this.setData({ multiArray })
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
    //console.log(form);
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
    name: '其他',
    require: false,
  },
  idcard: {
    name: '身份证号',
    require: true,
    regex: regex.idcard
  },
  nums: {
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
};
