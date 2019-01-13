// pages/user/address/add/add.js
import http from '../../../../utils/http';
import login from '../../../../stores/Login';
const { regeneratorRuntime } = global;
import verify from '../../../../utils/verify';
import regex from '../../../../utils/regex';
import clickDisable from '../../../../utils/clickDisable';
const app = getApp();
Page({
    props: {
        order: require('../../../../stores/Order'),
    },
  /**
   * 页面的初始数据
   */
  data: {
/*
    nvabarData: {
      showCapsule: true, //是否显示左上角图标
      title: '添加地址', //导航栏 中间的标题
      transparent: false, //透明导航栏
    },
*/
    btnDisabled:false,
    form: {
      province_id: 0,
      city_id: 0,
      area_id: 0,
    },
    multiArray: [],
    showArray: [],
    multiIndex: [0, 0, 0],
    addressid: null,
    // occupation: app.globalData.height + 46,
  },
  onInput(e) {
    const value = e.detail.value;
    const { field } = e.target.dataset;
    const form = this.data.form;
    form[field] = value;
    this.setData({ form })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    let address = {};
    const multiIndex = [0, 0, 0];
    let form = {};
    //加载地址
    if (options.id) {
      this.setData({ addressid: options.id });
      const response = await http.request({
        url: '/api/user/addressdetails?addressid=' + options.id,
        method: 'GET',
      });
      form = {
        province_id: response.data.data.province_id,
        city_id: response.data.data.city_id,
        area_id: response.data.data.area_id,
        name: response.data.data.name,
        mobile: response.data.data.mobile,
        address: response.data.data.address,
      };
    }
    this.setData({ form }, async () => {
      const multiArray = [];
      const form = this.data.form;
      //省
      const provinces = await http.request({
        url: '/api/basics/provincelists',
        method: 'GET',
      });
      provinces.data.data.forEach(item => {
        item.name = item.province_name
      })
      multiArray.push(provinces.data.data);
      if (!options.id) {
        form.province_id = provinces.data.data[0].id;
      } else {
        multiIndex[0] = provinces.data.data.findIndex(item => {
          return item.id == form.province_id
        })
      }
      //市
      const cities = await http.request({
        url: '/api/basics/citylist?province_id=' + form.province_id,
        method: 'GET',
      });
      cities.data.data.forEach(item => {
        item.name = item.city_name
      })
      multiArray.push(cities.data.data);
      if (!options.id) {
        form.city_id = cities.data.data[0].id;
      } else {
        multiIndex[1] = cities.data.data.findIndex(item => {
          return item.id == form.city_id
        })
      }
      //区
      const areas = await http.request({
        url: '/api/basics/arealists?city_id=' + form.city_id,
        method: 'GET',
      });
      areas.data.data.forEach(item => {
        item.name = item.area_name
      })
      multiArray.push(areas.data.data);
      if (!options.id) {
        form.area_id = areas.data.data[0].id;
      } else {
        multiIndex[2] = areas.data.data.findIndex(item => {
          return item.id == form.area_id
        })
      }
      this.setData({ multiArray, showArray: multiArray, form, multiIndex });
    })
  },
  bindPickerChange(e) {
    const form = this.data.form;
    const multiIndex = e.detail.value;
    const multiArray = this.data.multiArray;
    form.province_id = this.data.multiArray[0][multiIndex[0]].id;
    form.city_id = this.data.multiArray[1][multiIndex[1]].id;
    form.area_id = this.data.multiArray[2][multiIndex[2]].id;
    this.setData({
      multiIndex, form, showArray: multiArray
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
  //新增或更新
  async insertOrUpdate() {
    const form = this.data.form;
    //console.log(form);
    if (this.data.addressid != null) {
      form.addressid = this.data.addressid
    }
    if (verify(form, config)) {
      clickDisable.btnDisabled(this)
      const result = await login();
      http.request({
        url: this.data.addressid == null ? '/api/user/addaddress' : '/api/user/modifyaddress',
        method: 'POST',
        header: {
          token: result.user_token
        },
        data: form,
        success: (response) => {
          if (response.data.code == 0) {
            wx.showToast({
              title: response.data.msg,
              icon: 'none',
              duration: 1500,
            });
          }
          if (response.data.code == 1) {
            wx.showToast({
              title: this.data.addressid == null ? '添加成功' : '修改成功',
              icon: 'none',
              duration: 1500,
              mask: true,
              success: (result) => {
                setTimeout(() => {
                  wx.navigateBack({
                    delta: 1
                  });
                }, 1500)
              },
            });
          }
        }
      })
    }
  },
  async setDefault() {
    const result = await login();
    http.request({
      url: '/api/user/defaultaddress',
      method: 'POST',
      header: {
        token: result.user_token
      },
      data: { addressid: this.data.addressid },
      success: (response) => {
        wx.showToast({
          title: '设置成功',
          icon: 'success',
          duration: 1500,
          mask: false,
        });
      }
    })
  },
  async delete() {
    const result = await login();
    http.request({
      url: '/api/user/deladdress',
      method: 'POST',
      header: {
        token: result.user_token
      },
      data: { addressid: this.data.addressid },
      success: (response) => {
        let orderAddressId = this.props.order.address!=null? Number(this.props.order.address.id):0
        console.log(orderAddressId,this.data.addressid)
        if(orderAddressId === Number(this.data.addressid)){
            this.props.order.address = null;
        }
        wx.navigateBack({
          delta: 1
        });
      }
    })
  },
})

const config = {
  name: {
    name: '姓名',
    require: true,
    max: 5,
  },
  mobile: {
    name: '电话',
    regex: regex.cellphone,
    require: true,
  },
  address: {
    name: '地址',
    require: true,
  },
}
