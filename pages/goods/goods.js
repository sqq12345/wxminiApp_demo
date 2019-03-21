// pages/goods/goods.js
import http from '../../utils/http';
import login from '../../stores/Login';
import {observer} from '../../utils/mobx/observer';

const {regeneratorRuntime} = global;
const city = require('../../stores/City');
const app = getApp();

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
        // this.props.cart.totalNumber++;
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
        return app.share(title,'',img)
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
                            oBgH: imgH + 180,
                            oCanvasH: imgH + 180+130, //上padding40下padding90
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
        let proImg = dataInfo.proImg, wxCode=dataInfo.wxCode, canvasImg="/static/images/shareBg.png", slogan = "/static/images/share_slogan.png"
        let userName=result.nickName, guige= "规格："+dataInfo.goods.specification, fanwei=dataInfo.goods.area, money="￥"+dataInfo.goods.price,
            title = dataInfo.goods.title,introduct = dataInfo.goods.introduct?'“'+dataInfo.goods.introduct+'”':''
        let ctx = wx.createCanvasContext('share');
        // 绘制背景图
        ctx.drawImage(canvasImg, 0, 0, canvasW, canvasH);
        //绘制产品推荐语
        ctx.setFontSize(22);
        ctx.fillStyle = "#ffffff"
        ctx.fillText(introduct, (canvasW - ctx.measureText(introduct).width) / 2, 40);
        // 绘制背景块
        ctx.setFillStyle('#fff');
        ctx.fillRect(30, 60, imgW, bgH);
        // 绘制产品图
        ctx.drawImage(proImg, 30, 60, imgW, imgH);
        // 绘制小程序码wxCode
        ctx.drawImage(wxCode, (canvasW - 110), (imgH + 120), 70, 70);
        // 绘制slogan
        ctx.drawImage(slogan, 0, (canvasH - 48), canvasW, 48);
        //绘制产品标题
        ctx.fillStyle = "#333333"
        this.dealWords({
            ctx: ctx,//画布上下文
            fontSize: 14,//字体大小
            word: title,//需要处理的文字
            maxWidth: imgW - 35,//一行文字最大宽度
            x: 45,//文字在x轴要显示的位置
            y: imgH + 70,//文字在y轴要显示的位置
            maxLine: 2//文字最多显示的行数
        })
        //绘制产品规格
        ctx.setFontSize(12);
        ctx.fillStyle = "#999999"
        ctx.fillText(guige, 45, (imgH + 130));
        //绘制配送范围
        ctx.fillStyle = "#999999"
        this.dealWords({
            ctx: ctx,//画布上下文
            fontSize: 12,//字体大小
            word: "配送范围：",//需要处理的文字
            maxWidth: ctx.measureText("配送范围：").width,//一行文字最大宽度
            x: 45,//文字在x轴要显示的位置
            y: (imgH + 135),//文字在y轴要显示的位置
            maxLine: 1//文字最多显示的行数
        })
        ctx.fillStyle = "#29D258"
        this.dealWords({
            ctx: ctx,//画布上下文
            fontSize: 12,//字体大小
            word: fanwei,//需要处理的文字
            maxWidth: imgW-180,//一行文字最大宽度
            x: 45 + ctx.measureText("配送范围：").width,//文字在x轴要显示的位置
            y: (imgH + 135),//文字在y轴要显示的位置
            maxLine: 1//文字最多显示的行数
        })
        //绘制产品价格
        ctx.setFontSize(15);
        ctx.fillStyle = "#FF8A00"
        ctx.fillText(money, 45, (imgH + 185));
        //绘制用户名
        ctx.setFontSize(12);
        ctx.fillStyle = "#DADADA"
        ctx.fillText(userName, (canvasW - ctx.measureText(userName).width) / 2, bgH+40);


        ctx.draw(false, that.saveCanvas);
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
    //处理文字多出省略号显示
    dealWords: function (options) {
        options.ctx.setFontSize(options.fontSize);//设置字体大小
        var allRow = Math.ceil(options.ctx.measureText(options.word).width / options.maxWidth);//实际总共能分多少行
        var count = allRow >= options.maxLine ? options.maxLine : allRow;//实际能分多少行与设置的最大显示行数比，谁小就用谁做循环次数
        var endPos = 0;//当前字符串的截断点
        for (var j = 0; j < count; j++) {
            var nowStr = options.word.slice(endPos);//当前剩余的字符串
            var rowWid = 0;//每一行当前宽度
            if (options.ctx.measureText(nowStr).width > options.maxWidth) {//如果当前的字符串宽度大于最大宽度，然后开始截取
                for (var m = 0; m < nowStr.length; m++) {
                    rowWid += options.ctx.measureText(nowStr[m]).width;//当前字符串总宽度
                    if (rowWid > options.maxWidth) {
                        if (j === options.maxLine - 1) { //如果是最后一行
                            options.ctx.fillText(nowStr.slice(0, m - 1) + '...', options.x, options.y + (j + 1) * 18);    //(j+1)*18这是每一行的高度
                        } else {
                            options.ctx.fillText(nowStr.slice(0, m), options.x, options.y + (j + 1) * 18);
                        }
                        endPos += m;//下次截断点
                        break;
                    }
                }
            } else {//如果当前的字符串宽度小于最大宽度就直接输出
                options.ctx.fillText(nowStr.slice(0), options.x, options.y + (j + 1) * 18);
            }
        }
    },
    saveCanvas: function(){
        let that = this
        wx.canvasToTempFilePath({
            canvasId: 'share',
            success: (res) => {
              that.setData({
                oCanvasH: 0,
              });
                wx.saveImageToPhotosAlbum({
                    filePath: res.tempFilePath,
                    success: (res) => {
                        wx.showToast({
                            title: '海报已保存至相册 请打开朋友圈分享',
                            icon: 'none',
                            duration: 2000
                        });
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
