// components/search/search.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    cities: Array,
    selected: Object,  //选中的城市的下标,
    query: String, //查询关键字
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
    search(e) {
      wx.navigateTo({
        url: "/pages/tabbar/home/search/search?query=" + e.detail.value,
      })
    }
  }
})
