// pages/enter/step1/step1.js
import http from '../../../utils/http';
import { observer } from '../../../utils/mobx/observer';
Page(observer({
  props: {
    form: require('../../../stores/Form'),
  },
  //input赋值
  onInput(e) {
    const value = e.detail.value;
    const { field } = e.target.dataset;
    this.props.form[field] = value;
  },
  /**
   * 页面的初始数据
   */
  onLoad(options) {
    let title = '';
    let type = '';
    let url = '';
    switch (options.index) {
      case '1':
        url = '/pages/enter/nongchang/nongchang';
        type = '农场';
        title = '农场入户';
        break;
      case '2':
        url = '/pages/enter/shequn/shequn';
        type = '社群';
        title = '社群入驻';
        break;
      case '3':
        url = '/pages/enter/canting/canting';
        type = '餐厅';
        title = '餐厅入驻';
        break;
      case '4':
        url = '/pages/enter/chaoshi/chaoshi';
        type = '超市';
        title = '超市入驻';
        break;
      case '5':
        url = '/pages/enter/jishi/jishi';
        type = '集市';
        title = '集市入驻';
        break;
    }
    http.request({
      url: 'api/shop/merchant',
      data: {
        shoptype: '' + options.index
      },
      method: 'POST',
      success: (response) => {
        const fields = response.data.data;
        //默认选中第一个
        fields.map(item => {
          this.props.form[item.alias] = [item.son[0].id];
          item.son[0].selected = true;
        });
        this.setData({
          'nvabarData.title': title, type, nextUrl: url, fields
        })
      }
    });
  },
  data: {
    type: '',
    nextUrl: '',  //下一步地址
    nvabarData: {
      showCapsule: true, //是否显示左上角图标
      title: '', //导航栏 中间的标题
      transparent: false //透明导航栏
    },
    fields: []
  },

  select(e) {
    const { value, field, multiple } = e.currentTarget.dataset;
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

  navigation() {
    let pass = true;
    //非空检查
    const form = this.props.form;
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
      //提交第一页
      http.request({
        
      });
      wx.navigateTo({
        url: this.data.nextUrl + '?id='
      });
    } else {
      wx.showToast({
        title: '请填写完整信息',
        icon: 'none',
        duration: 1500,
        mask: false,
      });
    }
  }
}))