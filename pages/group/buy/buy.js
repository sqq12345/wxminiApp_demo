// pages/group/buy/buy.js
import { observer } from '../../../utils/mobx/observer';
import http from '../../../utils/http';
import login from '../../../stores/Login';
const { regeneratorRuntime } = global;
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    detail: {},
    sid: '',  //
      isPhone:app.globalData.isIPhoneX,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    const id = options.id;
    this.setData({ sid: id });
    this.getData()
  },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
    },
   //获取数据
    async getData(){
        const id = this.data.sid;
        const result = await login();
        http.request({
            showLoading: true,
            url: '/api/solitaire/solitairedetail',
            method: 'POST',
            header: {
                token: result.user_token
            },
            data: { sid: id },
            success: (response) => {
                const detail = response.data.data;
                const timeNow = (new Date()).valueOf();
                const endTime = new Date(detail.endtime).valueOf();
                detail.goods.forEach(g => {
                    g.num = 0;
                    g.value = Number.parseFloat(g.price);
                    g.total = 0;
                    //商品总价
                    // Object.defineProperty(g, 'total', {
                    //   get() {
                    //     console.log('get');
                    //     return Number.parseFloat(this.value * this.num).toFixed(2)
                    //   }
                    // })
                });
                detail.user_list.forEach(user => {
                    var currentTime = parseInt(new Date().getTime() / 1000),
                        dateTime = parseInt(new Date(user.time).getTime() / 1000),
                        d = currentTime - dateTime,
                        d_days = parseInt(d / 86400), d_hours = parseInt(d / 3600),
                        d_minutes = parseInt(d / 60), d_seconds = parseInt(d)
                    if (d_days > 0 && d_days < 10) {
                        return user.time = d_days + '天前';
                    } else if (d_days <= 0 && d_hours > 0) {
                        return user.time = d_hours + '小时前';
                    } else if (d_hours <= 0 && d_minutes > 0) {
                        return user.time = d_minutes + '分钟前';
                    } else if (d_seconds < 60) {
                        if (d_seconds <= 0) {
                            return user.time = '刚刚';
                        } else {
                            return user.time = d_seconds + '秒前';
                        }
                    } else if (d_days >= 10) {
                        return user.time = user.time
                    }
                });
                detail.total = 0;
                detail.status = endTime<=timeNow ? 1:0;//1为已结束 0未结束
                this.setData({ detail });
            }
        });
    },

    //计算总价
  calc(goods) {
    const arr = goods.map(item => {
      return item.value * item.num
    });
    const sum = arr.reduce(function (pre, cur) {
      return pre + cur
    })
    return sum.toFixed(2)
  },

  reduce(e) {
    const detail = this.data.detail;
    const { index } = e.currentTarget.dataset;
    if (detail.goods[index].num == 0) {
      return false;
    }
    detail.goods[index].num--;
    detail.goods[index].total = Number.parseFloat(detail.goods[index].value * detail.goods[index].num).toFixed(2);
    detail.total = this.calc(detail.goods);
    this.setData({ detail });
  },

  increase(e) {
    //console.log(this.data.detail);
    const detail = this.data.detail;
    const { index } = e.currentTarget.dataset;
    if(detail.goods[index].num == detail.goods[index].stock){
        wx.showToast({
            title: "库存不足",
            icon: 'none',
            duration: 1000
        })
      return false;
    }
    detail.goods[index].num++;
    detail.goods[index].total = Number.parseFloat(detail.goods[index].value * detail.goods[index].num).toFixed(2);
    detail.total = this.calc(detail.goods);
    this.setData({ detail });
  },

  //我要接龙 先加入购物车
  async buy() {
    const result = await login();
    const flag = this.data.detail.goods.some(item => {
      return item.num > 0
    });
    if (!flag) {
      wx.showToast({
        title: '至少添加一个商品',
        icon: 'none',
        duration: 1500,
      });
      return false;
    }
    let form = '';
    this.data.detail.goods.forEach(async item => {
      if (item.num > 0) {
        form += item.mid + '_' + item.gid + '_' + item.num + ','
      }
    });
    await http.request({
      url: '/api/order/cartmore',
      showLoading: true,
      header: {
        token: result.user_token,
      },
      data: {
        mid_gid_num : form.substr(0,form.length - 1)
      },
      method: 'POST',
    });
    wx.redirectTo({
      url: '/pages/tabbar/cart/settle/settle?sid=' + this.data.sid,
    });
  },

  //分享
  onShareAppMessage: function (e) {
    const title = this.data.detail.title;
    const id = this.data.sid;
    const img = this.data.detail.image;
    return app.share(title,  '/pages/group/buy/buy?id=' + id, '')
  },
  //立即终止
    async stopNow(){
        const id = this.data.sid;
        const result = await login();
        wx.showModal({
            title: '提示',
            content: '确认结束当前接龙，该接龙将无法继续进行接龙或分享',
            cancelText: '取消',
            cancelColor: '#000000',
            confirmText: '确定',
            confirmColor: '#3CC51F',
            success: (resdata) => {
                if(resdata.confirm){
                    //确定
                    http.request({
                        showLoading: true,
                        url: '/api/solitaire/stop',
                        method: 'POST',
                        header: {
                            token: result.user_token
                        },
                        data: { sid: id },
                        success: (res) => {
                            if(res.data.code === 1){
                                this.getData()
                                var pages = getCurrentPages();
                                if (pages.length > 1) {
                                    var prePage = pages[pages.length - 2];
                                    prePage.onChangeList()
                                    console.log(pages,prePage)
                                }
                            }
                            wx.showToast({
                                title: res.data.msg,
                                icon: 'none',
                                duration: 2000,
                            });
                        }
                    });
                } else if(resdata.cancel){
                    //取消
                }
            },
        });
    },
})
