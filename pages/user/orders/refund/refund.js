// pages/tabbar/user/orders/orders.js
const app = getApp();
import { observer } from '../../../../utils/mobx/observer';
import http from '../../../../utils/http';
import login from '../../../../stores/Login';
const { regeneratorRuntime } = global;
Page(observer({
    props: {
        order: require('../../../../stores/Order'),
    },
    data: {
        goodsIndex: -1,
        reasonIndex:-1,
        onShow:false,
        isGoods: false,
        isReason:false,
        list:[],
        goods:0,
        goodsValue: "请选择",
        reason:"",
        content:"",
        fixedTitle: "物流状态",
        goodsList:[
            {
                id: 1,
                value: "未收到货",
            },{
                id: 2,
                value: "已收到货",
            }
        ],
        reasonList:[
            {
                id: 1,
                value: "多拍/拍错/不想要",
            },{
                id: 2,
                value: "快递一直未送到",
            },{
                id: 3,
                value: "未按约定时间发货",
            },{
                id: 4,
                value: "快递无跟踪记录",
            },{
                id: 5,
                value: "空包裹、少货",
            },{
                id: 6,
                value: "其他",
            }
        ],
    },
    onLoad: async function () {
        const that = this, refundInfo = this.props.order.refundOrder||wx.getStorageSync('refundOrder')
        that.setData({
            list:refundInfo.goods,
            item_id: refundInfo.item_id,
            money:refundInfo.money,
            freight: refundInfo.cost_freight,
        })
    },
    onShow(){
        //todo
    },

    //选择货物状态、退款原因
    async bindChoice(e){
        const type = e.currentTarget.dataset.type
        //选择货物状态
        if(type == 'goods'){
            this.setData({
                onShow:true,
                isGoods:true,
                isReason:false,
            })
        }
        //选择退款原因
        if(type == 'reason') {
            this.setData({
                onShow:true,
                isGoods:false,
                isReason:true,
            })
        }
    },
    //关闭弹出层
    async bindClose (e){
        this.setData({
            onShow:false,
            isGoods:false,
            isReason:false,
        })
    },
    async subChoice(e){
        const index = e.currentTarget.dataset.index
        if(this.data.isGoods){
            this.setData({
                goods:this.data.goodsList[index].id,
                goodsValue:this.data.goodsList[index].value,
                goodsIndex: index,
            })
        }
        else {
            this.setData({
                reason:this.data.reasonList[index].value,
                reasonIndex:index,
            })
        }
        this.bindClose()

    },

    //退款说明
    async bindKeyInput(e){
        this.setData({
            content: e.detail.value
        })
    },

    //退款订单
    async refundOrder() {
        const result = await login();
        http.request({
            url: '/api/user/refund',
            method: 'POST',
            showLoading: true,
            data: {
                item_id: this.data.item_id,
                gids: 0,
                image: ",",
                content:this.data.content,
                reason:this.data.reason,
                goods:this.data.goods, //0代表未定义 1代表未收到货 2代表已收到货
            },
            header: {
                token: result.user_token
            },
            success: (response) => {
                //退款成功
            }
        });
    },

}))
