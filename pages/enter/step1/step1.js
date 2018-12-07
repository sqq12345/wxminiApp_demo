// pages/enter/step1/step1.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nvabarData: {
      showCapsule: true, //是否显示左上角图标
      title: '农场入驻', //导航栏 中间的标题
      transparent: false //透明导航栏
    },
    form: {
      
    },
    fields: [
      {
        name: '农场类型', field: 'field1', items: [
          { text: 'CSA农场', value: 'xxxx' },
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
    ]
  },

  select(e) {
    const {value,field} = e.currentTarget.dataset;
    this.setData({
      form : Object.assign(this.data.form,{[field]:value})
    })
  }
})