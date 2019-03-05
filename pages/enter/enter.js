import login from '../../stores/Login';
import http from '../../utils/http';
import {observer} from '../../utils/mobx/observer';
import util from "../../utils/util";
const { regeneratorRuntime } = global;
Page({
    /**
     * 页面的初始数据
     */
    data: {
        onShowApply:false,
        enterCode:'',
    },
    async onLoad(options){
        var enterCode = options.icode, scene = decodeURIComponent(options.scene)
        this.setData({
            enterCode:enterCode || scene
        })
        const result = await login();
        http.request({
            showLoading: true,
            url: '/api/user/role',
            method: 'POST',
            header: {
                token: result.user_token
            },
            success: (res) => {
              if(res.data.code === 1){
                  const detail = res.data.data
                  const roleName = detail.role === 1?"农场":detail.role === 2?"社群":detail.role === 3?"生态餐厅": detail.role === 4?"有机超市":"农夫集市"
                  this.setData({detail,roleName});
              }
            }
        })
    },
    //确认驳回并去重新申请
    async getApply () {
        const result = await login();
        http.request({
            showLoading: true,
            url: '/api/shop/confirm_refuse',
            method: 'POST',
            header: {
                token: result.user_token
            },
            success: (res) => {
                wx.showToast({
                    title: res.data.msg,
                    icon: 'none',
                    duration: 1000,
                    complete:()=>{
                        if(res.data.code === 1){
                            this.setData({onShowApply:true})
                        }
                    }
                });
            }
        })
    },
})
