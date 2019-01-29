// components/search/search.js
const app = getApp();

// 去左右空格
function trim(s) {
  return s.replace(/(^\s*)|(\s*$)/g, "");
}

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    cities: Array,
    selected: Object,  //选中的城市的下标,
    query: String, //查询关键字
    placeholder: String, //输入框提示语
      types:Number,// 搜索类型【1商家、2商品】
  },

  /**
   * 组件的初始数据
   */
  data: {},

  /**
   * 组件的方法列表
   */
  methods: {
    search(e) {
      const pages = getCurrentPages();
      const currentPage = pages[pages.length - 1];
      const url = currentPage.route;
      var value = trim(e.detail.value);
      if (url !== 'pages/tabbar/home/search/search') {
        wx.navigateTo({
          url: "/pages/tabbar/home/search/search?query=" + value+"&type="+this.properties.types,
        })
      } else {
        currentPage.search(value);
      }
    },
      goSearch(){
          wx.navigateTo({
              url: "/pages/tabbar/home/search/search?query=" + ""+"&type="+this.properties.types,
          })
      }
  }
});
