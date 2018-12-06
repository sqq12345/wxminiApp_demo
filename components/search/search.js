// components/search/search.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    cities: Array,  //城市列表 
    selected: Number,  //选中的城市的下标
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onChange(e){
      this.triggerEvent('onChange', e)
    }
  },
})
