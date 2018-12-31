// pages/group/start.js
import { observer } from '../../utils/mobx/observer';
Page(observer({
  props: {
    selectedList: require('../../stores/Group').selectedList,
  },
  /**
   * 页面的初始数据
   */
  data: {
    nvabarData: {
      showCapsule: true, //是否显示左上角图标
      title: '开团商品', //导航栏 中间的标题
      transparent: false //透明导航栏
    },
    picker: [
      { text: 'picker', value: '' },
      { text: 'picker', value: '' },
      { text: 'picker', value: '' },
      { text: 'picker', value: '' },
      { text: 'picker', value: '' },
    ]
  },
  /* upload */
  onUploadSuccess(e) {

  },
  onUploadFail(e) {

  },
  onUploadComplete(e) {
    console.log(e);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  onShow: function () {
    
  },
  //删除选中商品
  remove(e){
    const {id} = e.target.dataset;
    const index = this.props.selectedList.findIndex(item=>item.id===id);
    this.props.selectedList.splice(index,1)
  }
}))