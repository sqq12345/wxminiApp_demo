import http from '../../../utils/http';
const {regeneratorRuntime} = global;
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        detail: '',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function (option) {
        const {vId} = option
        console.log(option,vId)
        if(vId==2){
            this.getSolitaire()
            return;
        }
        this.getData()
    },
    onShow: async function () {
    },
    //商家入驻协议
    async getData () {
        http.request({
            url: '/api/shop/relief',
            method: 'GET',
            success: (res) => {
                const detail = res.data.data;
                this.setData({ detail })
            }
        });
    },
    //群接龙服务协议
    async getSolitaire(){
        http.request({
            url: '/api/solitaire/relief',
            method: 'GET',
            success: (res) => {
                const detail = res.data.data;
                this.setData({ detail })
            }
        });
    },
});
