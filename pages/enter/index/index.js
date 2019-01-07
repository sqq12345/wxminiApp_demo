// pages/enter/step1/step1.js
import http from '../../../utils/http';
import {observer} from '../../../utils/mobx/observer';
import login from '../../../stores/Login';

const {regeneratorRuntime} = global;
const app = getApp();
//表单提交地址
let submitUrl = '';
Page(observer({
  props: {
    form: require('../../../stores/Form').values,
  },
  //input赋值
  onInput(e) {
    const value = e.detail.value;
    const {field} = e.target.dataset;
    this.props.form[field] = value;
  },
  /**
   * 页面的初始数据
   */
  async onLoad(options) {
    wx.showLoading({
      title: '加载中',
      mask: true,
    });
    let title = '';
    let type = '';
    let url = '';
    let progressUrl = '';
    switch (options.index) {
      case '1':
        url = '/pages/enter/nongchang/nongchang';
        progressUrl = '/api/shop/merchantProgress';
        submitUrl = '/api/shop/setmerchantone';
        type = '农场';
        title = '农场入户';
        break;
      case '2':
        url = '/pages/enter/shequn/shequn';
        progressUrl = '/api/shop/groupProgress';
        submitUrl = '/api/shop/setgroupone';
        type = '社群';
        title = '社群入驻';
        break;
      case '3':
        url = '/pages/enter/canting/canting';
        progressUrl = '/api/shop/diningProgress';
        submitUrl = '/api/shop/setdiningone';
        type = '餐厅';
        title = '餐厅入驻';
        break;
      case '4':
        url = '/pages/enter/chaoshi/chaoshi';
        progressUrl = '/api/shop/supermarketProgress';
        submitUrl = '/api/shop/setSupermarketone';
        type = '超市';
        title = '超市入驻';
        break;
      case '5':
        url = '/pages/enter/jishi/jishi';
        progressUrl = '/api/shop/marketProgress';
        submitUrl = '/api/shop/setmarketone';
        type = '集市';
        title = '集市入驻';
        break;
    }
    const loginResult = await login();
    //查询进度
    const progressResult = await http.request({
      url: progressUrl,
      method: 'POST',
      header: {
        token: loginResult.user_token
      },
    });

    //第一页已经填写
    if (progressResult.data.data.state == 1) {
      setTimeout(() => {
        //直接跳第二页  第一页只能填一次
        wx.redirectTo({
          url: url + '?id=' + progressResult.data.data.mid,
        });
      }, 1000)
      return false;
    }

    //已经申请
    if (progressResult.data.data.state == 2) {
      wx.hideLoading();
      wx.showModal({
        title: '提示',
        content: '您已提交了相关申请，请耐心等待',
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
      return false;
    }
    //已经通过
    if (progressResult.data.data.state == 3) {
      wx.hideLoading();
      wx.showModal({
        title: '提示',
        content: '您提交的申请已通过，无须再次申请',
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
      return false;
    }

    //读取数据
    const response = await http.request({
      url: 'api/shop/merchant',
      data: {
        shoptype: '' + options.index
      },
      method: 'POST',
    });
    const fields = response.data.data;
    //默认选中第一个
    fields.map(item => {
      this.props.form[item.alias] = [item.son[0].id];
      item.son[0].selected = true;
    });
    wx.hideLoading();
    this.setData({
      'nvabarData.title': title, type, nextUrl: url, fields, loading: false
    })
  },
  data: {
    type: '',
    nextUrl: '',  //下一步地址
    nvabarData: {
      showCapsule: true, //是否显示左上角图标
      title: '', //导航栏 中间的标题
      transparent: false //透明导航栏
    },
    fields: [],
    loading: true,
    occupation: app.globalData.height + 46,
  },

  select(e) {
    const {value, field, multiple} = e.currentTarget.dataset;
    let selected = this.props.form[field] || [];
    //判断单选多选
    if (multiple === 1) {
      const index = selected.findIndex(id => id === value.id);
      if (index === -1) {   //未选中添加
        selected.push(value.id);
      } else {  //已选中删除
        selected.splice(index, 1);
      }
    } else {
      selected = [];
      selected.push(value.id);
    }
    //标记
    const fields = this.data.fields;
    fields.map(f => {
      if (f.alias === field) {
        f.son.map(item => {
          item.selected = selected.some(id => id === item.id)
        })
      }
    });
    //this.props.form = Object.assign(this.props.form, { [field]: selected });
    this.props.form[field] = selected;
    this.setData({
      fields
    })
  },

  async navigation() {
    let pass = true;
    //非空检查
    const form = this.props.form;
    console.log('表单值', form);
    let filledCount = 0;
    for (const field in form) {
      if (form[field] instanceof Array) {
        if (form[field].length > 0) {
          filledCount = filledCount + 1
        }
      }
    }
    if (filledCount !== this.data.fields.length) {
      pass = false;
    }
    //input检查
    if (!form['name'] || form['name'].length === 0) {
      pass = false;
    }
    if (pass) {
      const loginResult = await login();
      //提交第一页
      const result = await http.request({
        url: submitUrl,
        method: 'POST',
        data: form,
        header: {
          token: loginResult.user_token
        }
      });
      if (result.data.code == 0) {
        wx.showToast({
          title: result.data.msg,
          icon: 'none',
          duration: 2000,
          mask: false,
        });
        return
      }
      //用重定向 避免返回上一页  这个页面提交后不能修改
      wx.redirectTo({
        url: this.data.nextUrl + '?id=' + result.data.data.mid
        //url: this.data.nextUrl
      });
    } else {
      wx.showToast({
        title: '请填写完整信息',
        icon: 'none',
        duration: 2000,
        mask: false,
      });
    }
  },
  onUnload() {
    this.props.form = {};
  }
}))