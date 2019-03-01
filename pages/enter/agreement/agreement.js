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
    onLoad: async function () {
        this.getData()
    },
    onShow: async function () {
    },
    getData: async function () {
        http.request({
            url: '/api/shop/relief',
            method: 'GET',
            success: (res) => {
                const detail = res.data.data;
                this.setData({ detail })
            }
        });
    },
});
