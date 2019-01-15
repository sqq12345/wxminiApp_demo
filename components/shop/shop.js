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
    showDetail: true
  },

  ready() {
    if (this.properties.item.goods) {
      this.properties.item.goods.forEach(element => {
        element.price = Number.parseFloat(element.price).toFixed(2)
      });
    }

    const dist = this.properties.item.distance;
    this.setData({
      distance: dist > 1000 ? (dist / 1000).toFixed(2) + '公里' : dist + '米',
      goods: this.properties.item.goods,
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //展开活动
    openDetail(e) {
      const id = e.currentTarget.dataset.id;
      this.setData({
        showDetail: !this.data.showDetail
      })
    }
  }
})
