// components/shop/shpo.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item: {
      type: Object,
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    distance: '',
    goods: [],
  },

  ready() {
    this.properties.item.goods.forEach(element => {
      element.price = Number.parseFloat(element.price).toFixed(2)
    });
    const dist = (this.properties.item.distance * 1000);
    this.setData({
      distance: (dist > 1000 ? dist / 1000 : dist).toFixed(2) + (dist > 1000 ? '公里' : '米'),
      goods: this.properties.item.goods,
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
