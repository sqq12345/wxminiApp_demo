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
    },
    async onLoad(){
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
                  const type = detail.role === "附近农场"?1:detail.role === "附近社群"?2:detail.role === "生态餐厅"?3: detail.role === "有机超市"?4:5
                  this.setData({detail,type});
              }
            }
        })
    },
    //重新申请
    getApply:function () {
      this.setData({onShowApply:true})
    },
})
