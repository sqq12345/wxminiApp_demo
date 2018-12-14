// pages/enter/step1/step1.js
import http from '../../../utils/http';
Page({

  /**
   * 页面的初始数据
   */
  onLoad(options) {
    let title = '';
    let type = '';
    let url = '';
    let fields = [];
    switch (options.index) {
      case '1':
        url = '/pages/enter/nongchang/nongchang';
        type = '农场';
        title = '农场入户';
        fields = data.nongchang;
        break;
      case '2':
        url = '/pages/enter/shequn/shequn';
        type = '社群';
        title = '社群入驻';
        fields = data.shequn;
        break;
      case '3':
        url = '/pages/enter/canting/canting';
        type = '餐厅';
        title = '餐厅入驻';
        fields = data.canting;
        break;
      case '4':
        url = '/pages/enter/chaoshi/chaoshi';
        type = '超市';
        title = '超市入驻';
        fields = data.chaoshi;
        break;
      case '5':
        url = '/pages/enter/jishi/jishi';
        type = '集市';
        title = '集市入驻';
        fields = data.jishi;
        break;
    }
    http.request({
      url: 'api/shop/merchant',
      data: {
        shoptype: '' + options.index
      },
      method: 'POST',
      success: (response) => {
        this.setData({
          fields: response.data.data
        })
      }
    });
    this.setData({ 'nvabarData.title': title, type, nextUrl: url, fields })
  },
  data: {
    type: '',
    nextUrl: '',  //下一步地址
    nvabarData: {
      showCapsule: true, //是否显示左上角图标
      title: '', //导航栏 中间的标题
      transparent: false //透明导航栏
    },
    form: {

    },
    fields: [

    ]
  },
  //全是多选
  select(e) {
    const { value, field } = e.currentTarget.dataset;
    const selected = this.data.form[field] || [];
    const index = selected.findIndex(item => item.text === value.text);
    if (index === -1) {   //未选中添加
      selected.push(value);
    } else {  //已选中删除
      selected.splice(index, 1);
    }
    //标记
    const fields = this.data.fields;
    fields.map(f => {
      if (f.field === field) {
        f.items.map(item => {
          item.selected = selected.some(s => s.text === item.text)
        })
      }
    });
    this.setData({
      form: Object.assign(this.data.form, { [field]: selected }),
      fields
    })
  }
})

const data = {
  nongchang: [
    {
      name: '农场类型', field: 'field1', items: [
        { text: 'CSA农场', value: '' },
        { text: '自然农法农场', value: '' },
        { text: '朴门农场', value: '' },
        { text: '有机', value: '' },
        { text: '绿色', value: '' },
        { text: '其他', value: '' },
      ]
    },
    {
      name: '特色的种养技术', field: 'field2', items: [
        { text: '禽畜作物循环型', value: '' },
        { text: '稻鸭共养型', value: '' },
        { text: '林木禽畜共生型', value: '' },
        { text: '水产作为共生型', value: '' },
        { text: '仿生野生种养型', value: '' },
        { text: '其他', value: '' },
      ]
    },
    {
      name: '特色的传统工艺', field: 'field3', items: [
        { text: '古法酿造', value: '' },
        { text: '古法压榨', value: '' },
        { text: '传统研磨', value: '' },
        { text: '土法加工', value: '' },
        { text: '自然晾晒', value: '' },
        { text: '其他', value: '' },
      ]
    },
    {
      name: '农场产品', field: 'field4', items: [
        { text: '水果', value: '' },
        { text: '蔬菜', value: '' },
        { text: '特产', value: '' },
        { text: '肉禽蛋类', value: '' },
        { text: '粮油副食', value: '' },
        { text: '海鲜水产', value: '' },
        { text: '酒水茶饮', value: '' },
      ]
    },
    {
      name: '农场服务', field: 'field5', items: [
        { text: '民宿', value: '' },
        { text: '餐饮', value: '' },
        { text: '参观', value: '' },
        { text: '采摘', value: '' },
        { text: '亲子', value: '' },
        { text: '租地种植', value: '' },
      ]
    },
  ],
  shequn: [
    {
      name: '社群类型', field: 'field4', items: [
        { text: '社区', value: '' },
        { text: '企业', value: '' },
        { text: '其它', value: '' },
      ]
    },
    {
      name: '需求产品', field: 'field5', items: [
        { text: '蔬果肉蛋', value: '' },
        { text: '米面', value: '' },
        { text: '粮油', value: '' },
        { text: '天然零食', value: '' },
        { text: '茶酒', value: '' },
        { text: '调味品', value: '' },
      ]
    },
  ],
  canting: [
    {
      name: '餐厅类型', field: 'field4', items: [
        { text: '有机', value: '' },
        { text: '绿色', value: '' },
        { text: '无公害', value: '' },
      ]
    },
    {
      name: '餐厅风格', field: 'field5', items: [
        { text: '现代简约', value: '' },
        { text: '奢华典雅', value: '' },
        { text: '中式风情', value: '' },
        { text: '摩登MIX', value: '' },
        { text: '自然田园', value: '' },
        { text: '日式和风', value: '' },
      ]
    },
    {
      name: '菜系类型', field: 'field6', items: [
        { text: '西餐', value: '' },
        { text: '日本料理', value: '' },
        { text: '东南亚', value: '' },
        { text: '鲁菜', value: '' },
        { text: '川菜', value: '' },
        { text: '粤菜', value: '' },
        { text: '苏菜', value: '' },
        { text: '闽菜', value: '' },
        { text: '浙菜', value: '' },
        { text: '徽菜', value: '' },
        { text: '湘菜', value: '' },
        { text: '其它', value: '' },
      ]
    },
  ],
  chaoshi: [
    {
      name: '超市类型', field: 'field4', items: [
        { text: '有机', value: '' },
        { text: '其它', value: '' },
      ]
    },
    {
      name: '产品类型', field: 'field5', items: [
        { text: '蔬果肉弹', value: '' },
        { text: '米面粮油', value: '' },
        { text: '调味品', value: '' },
        { text: '天然零食', value: '' },
        { text: '茶酒', value: '' },
        { text: '日用品', value: '' },
      ]
    },
    {
      name: '超市规模', field: 'field6', items: [
        { text: '大型超市', value: '' },
        { text: '中小型超市', value: '' },
        { text: '社区便捷超市', value: '' },
      ]
    },
  ],
  jishi: [
    {
      name: '集市类型', field: 'field4', items: [
        { text: '有机', value: '' },
        { text: '绿色', value: '' },
      ]
    },
    {
      name: '产品类型', field: 'field5', items: [
        { text: '蔬果肉弹', value: '' },
        { text: '米面粮油', value: '' },
        { text: '天然调味品', value: '' },
        { text: '天然零食', value: '' },
        { text: '进口茶酒', value: '' },
        { text: '天然日用品', value: '' },
        { text: '综合', value: '' },
      ]
    },
    {
      name: '市集活动', field: 'field6', items: [
        { text: '试吃评鉴', value: '' },
        { text: '二手置换', value: '' },
        { text: '环保课堂', value: '' },
        { text: '文化活动', value: '' },
      ]
    },
  ]
};