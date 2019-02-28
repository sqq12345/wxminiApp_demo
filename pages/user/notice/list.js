import http from '../../../utils/http';
import login from '../../../stores/Login';

const {regeneratorRuntime} = global;
const app = getApp();

Page({
    /**
     * 页面的初始数据
     */
    data: {
        //当前页数
        page: 1,
        noticeList:[],
        loading: false,
        //没有更多数据了
        end: false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function () {
        this.getNotice()
    },
    onShow: async function () {
    },
    getNotice: async function () {
        const result = await login();
        http.request({
            url: '/api/notice/list',
            method: 'POST',
            header: {
                token: result.user_token
            },
            showLoading: true,
            data: {
                page: this.data.page,
            },
            success: (response) => {
                console.log(response.data.data)
                const list = this.data.noticeList;
                //没有更多了
                const end = response.data.data.last_page == this.data.page;
                const data = response.data.data.items;
                this.setData({ noticeList: list.concat(data), end, loading: false, page: this.data.page + 1 })
            }
        });
    },
});
