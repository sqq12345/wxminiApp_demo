/**
 * 拼团
 */
const { regeneratorRuntime } = global;
const extendObservable = require('../utils/mobx/mobx').extendObservable;
let Group = function () {
    extendObservable(this, {
        selectedList: [],
        address: null
    })
}
const Store = new Group();

module.exports = Store