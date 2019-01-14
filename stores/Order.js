/**
 * 订单  包含了地址和优惠券
 */
const extendObservable = require('../utils/mobx/mobx').extendObservable;
let Order = function () {
    extendObservable(this, {
        payload: {},
        //地址
        address: null,
        //优惠券
        coupon: null,
        //退款信息
        refundOrder: null,
    })
}

const Store = new Order();
module.exports = Store
