import http from '../../../utils/http';
import login from '../../../stores/Login';

const {regeneratorRuntime} = global;
const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        detail: {},
        noticeId: 0,
        loading: false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function (options) {
        this.setData({ noticeId: options.id });
        this.getNotice()
    },
    onShow: async function () {
    },
    getNotice: async function () {
        const result = await login();
        http.request({
            url: '/api/notice/detail',
            method: 'POST',
            header: {
                token: result.user_token
            },
            showLoading: true,
            data: {
                nid: this.data.noticeId,
            },
            success: (response) => {
                const detail = response.data.data;
                this.setData({ detail,loading: false })
            }
        });
    },
    //分享
    onShareAppMessage: function () {
        // return app.share('', '/pages/tabbar/user/user', 'default')
    },
});
