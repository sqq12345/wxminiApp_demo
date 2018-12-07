// components/search/search.js
import regeneratorRuntime from '../../utils/regenerator/runtime-module';
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    selected: Number,  //选中的城市的下标
  },

  /**
   * 组件的初始数据
   */
  data: {
    cities: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onChange(e) {
      this.triggerEvent('onChange', e)
    }
  },

  async attached() {
    const cities = await app.globalData.getCities;
    this.setData({
      cities: cities
    });
  }
})
