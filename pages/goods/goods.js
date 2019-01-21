// pages/goods/goods.js
import http from '../../utils/http';
import login from '../../stores/Login';
import {observer} from '../../utils/mobx/observer';

const {regeneratorRuntime} = global;
const city = require('../../stores/City');

Page(observer({
  props: {
    cart: require('../../stores/Cart'),
  },
  /**
   * 页面的初始数据
   */
  data: {
/*
    nvabarData: {
      position: 'absolute',
      showCapsule: true, //是否显示左上角图标
      transparent: true //透明导航栏
    },
*/
    goods: {},
    //整数部分和小数部分
    price: [],
    score: '0.0',
    collected: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    let that = this;
    const id = options.id || decodeURIComponent(options.scene);
    this.setData({ sid: id });
    await city.fetchData();
    const result = await login();
    http.request({
      showLoading: true,
      url: '/api/shop/goods?cityid=' + city.selected.id + '&gid=' + id,
      method: 'GET',
      header: {
        token: result.user_token
      },
      success: (response) => {
        const price = Number.parseFloat(response.data.data.price).toFixed(2);
        this.setData({
          goods: response.data.data,
          goodsContent: response.data.data.content.replace(/\<img/gi, '<img class="rich-img"'),
          price: price.split('.'),
          score: Number.parseFloat(response.data.data.score).toFixed(1),
          //是否收藏
          collected: response.data.data.collection == 1,
        }, () => {

        });
      }
    })
      wx.getSystemInfo({
          success: function (t) {
              that.setData({
                  windowWidth: t.windowWidth,
                  windowHeight:t.windowHeight,
              });
          }
      })
      this.getwxApp()
  },
  /**
   * 加入购物车
   */
  addCart: async function () {
    const result = await login();
    http.request({
      url: '/api/order/cart',
      showLoading: true,
      header: {
        token: result.user_token,
      },
      data: {
        //商品id
        gid: this.data.goods.id,
        num: 1,
        //农场id
        mid: this.data.goods.mid,
      },
      method: 'POST',
      success: (response) => {
        this.props.cart.totalNumber++;
        //刷新购物车
        this.props.cart.fetchData()
        wx.showToast({
          title: '添加成功',
          icon: 'success',
          duration: 1500,
          mask: false,
        });
      }
    });
  },
  //立即购买
  async buyNow() {
    let that = this;
    const result = await login();
    http.request({
      url: '/api/order/buynow',
      showLoading: true,
      header: {
        token: result.user_token,
        accesstoken: http.accesstoken,
      },
      data: {
        //商品id
        gid: that.data.goods.id,
        // num: 1,
        //农场id
        mid: that.data.goods.mid,
      },
      method: 'POST',
      success: (response) => {
        console.log(response);
        if (response.data.code === 1) {
          // this.props.cart.fetchData();
          wx.navigateTo({
            url: '/pages/tabbar/cart/settle/settle',
          });
        }
      }
    });
  },
  //收藏
  collect: async function () {
    let that = this;
    const result = await login();
    http.request({
      url: '/api/order/collection',
      showLoading: true,
      header: {
        token: result.user_token,
      },
      data: {
        mid: this.data.goods.mid,
        gid: this.data.goods.id,
      },
      method: 'POST',
      success: (response) => {
        wx.showToast({
          title: this.data.collected ? '已取消收藏' : '收藏成功',
          icon: 'success',
          duration: 1500,
          mask: false,
          success: function () {
            that.setData({
              collected: !that.data.collected
            });
          }
        });
      }
    });
  },
    //查看大图
    bindImg:function (e) {
        var src = e.currentTarget.dataset.src;//获取data-src
        var imgList = e.currentTarget.dataset.list;//获取data-list
        //图片预览
        wx.previewImage({
            current: src, // 当前显示图片的http链接
            urls: imgList, // 需要预览的图片http链接列表
        })
    },
    //分享
    onShareAppMessage: function () {
        const title = this.data.goods.title;
        const id = this.data.sid;
        const img = this.data.goods.image;
        return {
            title: title, // 转发后 所显示的title
            path: '/pages/goods/goods?id=' + id, // 相对的路径
            //拼团图片
            imageUrl:img,
            success: (res) => {
            },
            fail: function (res) {
                // 分享失败
                console.log(res)
            }
        }
    },
    //获取小程序码
    getwxApp: async function () {
        let that = this;
        const result = await login();
        http.request({
            url: '/api/basics/share',
            header: {
                token: result.user_token,
            },
            data: {
                page: "/pages/goods/goods",
                scene: that.data.sid,
                width: 220,
            },
            method: 'POST',
            success: (response) => {
                that.setData({
                    wxCodeImg: response.data.data,
                });
            }
        });
    },

    //分享朋友圈
    async bindShare () {
        wx.showLoading({
            title: '正在生成海报...',
            mask: true,
        });
        this.downloadImg()
    },
    async downloadImg(){
        let that = this
        wx.downloadFile({
            url: that.data.wxCodeImg,
            success:(res) =>{
                that.setData({
                    wxCode: res.tempFilePath
                })
            }
        })
        wx.downloadFile({
            url: that.data.goods.image,
            success: (res) => {
                that.setData({
                    proImg: res.tempFilePath
                });
                wx.getImageInfo({
                    src: res.tempFilePath,
                    success(res) {
                        let imgW= that.data.windowWidth - 60 ,imgH = imgW * (res.height/res.width)
                        that.setData({
                            oImgW: imgW,
                            oImgH: imgH,
                            oBgH: imgH + 200,
                            oCanvasH: imgH + 200+130, //上padding40下padding90
                        });
                        that.canvasImg()
                    }
                })
            }
        });
    },
    async canvasImg(){
        const result = await login();
        let that = this, dataInfo = that.data
        let canvasW = dataInfo.windowWidth, canvasH = dataInfo.oCanvasH, imgW = dataInfo.oImgW, imgH = dataInfo.oImgH, bgH = dataInfo.oBgH
        let proImg = dataInfo.proImg, wxCode=dataInfo.wxCode, canvasImg="/static/images/shareBg.png",logo="/static/images/share_logo.png"
        let userName=result.nickName, guige= "规格："+dataInfo.goods.specification, fanwei=dataInfo.goods.area, money="￥"+dataInfo.goods.price,
            title = dataInfo.goods.title
            // title = dataInfo.goods.title.length>20 ? dataInfo.goods.title.substring(0,20)+"...": dataInfo.goods.title
        let ctx = wx.createCanvasContext('share');
        console.log(proImg,wxCode)
        // 绘制背景图
        ctx.drawImage(canvasImg, 0, 0, canvasW, canvasH);
        // 绘制背景块
        ctx.setFillStyle('#fff');
        ctx.fillRect(30, 40, imgW, bgH);
        // 绘制产品图
        ctx.drawImage(proImg, 30, 40, imgW, imgH);
        // 绘制小程序码wxCode
        ctx.drawImage(wxCode, (canvasW - 110), (imgH + 130), 70, 70);
        // 绘制logo
        ctx.drawImage(logo, (canvasW/2-45), (canvasH - 73), 90, 23);
        //绘制产品标题
        ctx.setFontSize(14);
        ctx.fillStyle = "#333333"
        let initHeight = (imgH + 65), titleHeight = 20,canvasWidth = (imgW - 35)
        titleHeight = this.drawText(ctx, title, initHeight, titleHeight, canvasWidth);// 调用行文本换行函数
        ctx.moveTo(15, titleHeight)
        //绘制产品规格
        ctx.setFontSize(12);
        ctx.fillStyle = "#999999"
        ctx.fillText(guige, 45, (imgH + 145));
        //绘制配送范围
        ctx.setFontSize(12);
        ctx.fillStyle = "#999999"
        ctx.fillText("配送范围：", 45, (imgH + 165));
        ctx.setFontSize(12);
        ctx.fillStyle = "#29D258"
        ctx.fillText(fanwei, 45 + ctx.measureText("配送范围：").width, (imgH + 165));
        //绘制产品价格
        ctx.setFontSize(15);
        ctx.fillStyle = "#FF8A00"
        ctx.fillText(money, 45, (imgH + 195));
        //绘制用户名
        ctx.setFontSize(12);
        ctx.fillStyle = "#DADADA"
        ctx.fillText(userName, (canvasW - ctx.measureText(userName).width) / 2, bgH+20);


        ctx.draw(false, that.saveCanvas);
        // ctx.draw();
        wx.hideLoading()
        that.setData({
            showContent:true
        })
        setTimeout(function(){
            that.setData({
                showFoot:true
            })
        }, 3000)
    },
    // 文字换行
    drawText: function (ctx, str, initHeight, titleHeight, canvasWidth) {
        var that = this, lineWidth = 0
        var lastSubStrIndex = 0; //每次开始截取的字符串的索引
        for (let i = 0; i < str.length; i++) {
            lineWidth += ctx.measureText(str[i]).width;
            if (lineWidth > canvasWidth) {
                ctx.fillText(str.substring(lastSubStrIndex, i), 45, initHeight);//绘制截取部分
                initHeight += 20;//20为字体的高度
                lineWidth = 0;
                lastSubStrIndex = i;
                titleHeight += 30;
            }
            if (i == str.length - 1) {//绘制剩余部分
                ctx.fillText(str.substring(lastSubStrIndex, i + 1), 45, initHeight);
            }
        }
        // 标题border-bottom 线距顶部距离
        titleHeight = titleHeight + 10;
        return titleHeight
    },
    saveCanvas: function(){
        let that = this
        wx.canvasToTempFilePath({
            canvasId: 'share',
            success: (res) => {
                wx.saveImageToPhotosAlbum({
                    filePath: res.tempFilePath,
                    success: (res) => {
                        wx.showToast({
                            title: '海报已保存至相册 请打开朋友圈分享',
                            icon: 'none',
                            duration: 2000
                        })
                        console.log('成功保存到手机系统相册', res)
                    },
                    fail: (err) => {
                        console.log('保存到手机系统相册失败', err)
                    }
                })
            }, fail: (err) => {
                console.log('保存到手机系统相册失败', err)
            }
        })
    },

}))
