// pages/user/address/add/add.js
import http from '../../../../utils/http';
import login from '../../../../stores/Login';
const { regeneratorRuntime } = global;
import verify from '../../../../utils/verify';
import regex from '../../../../utils/regex';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nvabarData: {
      showCapsule: true, //是否显示左上角图标
      title: '添加地址', //导航栏 中间的标题
      transparent: false, //透明导航栏
    },
    form: {
      province_id: 0,
      city_id: 0,
      area_id: 0,
    },
    multiArray: [],
    showArray: [],
    multiIndex: [0, 0, 0],
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
    const multiArray = [];
    const form = this.data.form;
    const provinces = await http.request({
      url: '/api/basics/provincelists',
      method: 'GET',
    });
    provinces.data.data.forEach(item => {
      item.name = item.province_name
    })
    multiArray.push(provinces.data.data);
    form.province_id = provinces.data.data[0].id;

    const cities = await http.request({
      url: '/api/basics/citylist?province_id=' + form.province_id,
      method: 'GET',
    });
    cities.data.data.forEach(item => {
      item.name = item.city_name
    })
    multiArray.push(cities.data.data);
    form.city_id = cities.data.data[0].id;

    const areas = await http.request({
      url: '/api/basics/arealists?city_id=' + form.city_id,
      method: 'GET',
    });
    areas.data.data.forEach(item => {
      item.name = item.area_name
    })
    multiArray.push(areas.data.data);
    form.area_id = areas.data.data[0].id;
    this.setData({ multiArray, showArray: multiArray, form });
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
  async insert() {
    const form = this.data.form;
    //console.log(form);
    if (verify(form, config)) {
      const result = await login();
      http.request({
        url: '/api/user/addaddress',
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
              title: '添加成功',
              icon: 'none',
              duration: 1500,
              mask: true,
              success: (result)=>{
                setTimeout(()=>{
                  wx.navigateBack({
                    delta: 1
                  });
                },1500)
              },
            });
          }
        }
      })
    }
  }
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