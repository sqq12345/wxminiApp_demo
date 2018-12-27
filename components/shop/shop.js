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
    this.setData({
      distance: (this.properties.item.distance * 1000).toFixed(2),
      goods: this.properties.item.goods,
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
