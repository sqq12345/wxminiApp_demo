/**
 * 入驻的表单值
 */
const extendObservable = require('../utils/mobx/mobx').extendObservable;
let Form = function () {
    extendObservable(this, {
       
    })
}
const Store = new Form();

module.exports = Store