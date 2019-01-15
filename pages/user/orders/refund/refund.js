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
        gids:"",
        images:"",
    },
    onLoad: async function () {
        const that = this, refundInfo = this.props.order.refundOrder||wx.getStorageSync('refundOrder'), gidsList=[]
        for(let i = 0; i < refundInfo.goods.length; i++){
            gidsList.push(refundInfo.goods[i].gid)
            //console.log(gidsList.join(","),gidsList.toString())
        }
        that.setData({
            list:refundInfo.goods,
            item_id: refundInfo.item_id,
            money:refundInfo.money,
            freight: refundInfo.cost_freight,
            gids:gidsList.join(","),
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
        // this.bindClose()
    },

    //退款说明
    bindKeyInput(e) {
        console.log(e.detail.value)
        this.setData({
            content: e.detail.value
        })
    },

    /* upload */
    onUploadFail(e) {

    },
    onChange(e){},
    onRemove(e) {
        const data = e.detail.file.res.data;
        if (data) {
            const { field } = e.target.dataset;
            const json = JSON.parse(data);
            this.data.images = this.data.images.replace(json.data.img + ',', '');
            this.data.images = this.data.images.replace(',' + json.data.img, '');
            console.log("onRemove:",this.data.images,field)
        }
    },
    onComplete(e) {
        const { detail: { data } } = e;
        if (data) {
            const { field } = e.target.dataset;
            const json = JSON.parse(data);
            if (this.data.images == '') {
                this.data.images = json.data.img
            } else {
                this.data.images += ',' + json.data.img
            }
            console.log("upload:",this.data.images,field)
        }
    },

    //退款订单
    async refundOrder() {
        const result = await login();
        if(this.data.goods<=0){
            wx.showToast({
                title: '请选择货物状态',
                icon: 'none',
                duration: 2000
            })
            return;
        }
        if(!this.data.reason){
            wx.showToast({
                title: '请选择退款原因',
                icon: 'none',
                duration: 2000
            })
            return;
        }
        http.request({
            url: '/api/user/refund',
            method: 'POST',
            showLoading: true,
            data: {
                item_id: this.data.item_id,
                gids: this.data.gids,
                image: this.data.images,
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
