var app = getApp();
var MD5Encode = require("MD5Encode.js");
var util = require("util.js");
/**
 * 对字符串判空
 */
function isStringEmpty(data) {
    if (null == data || "" == data) {
        return true;
    }
    return false;
}

/**
 * 将map对象转换为json字符串
 */
function mapToJson(map) {
    if (null == map) {
        return null;
    }
    var jsonString = "{";
    for (var key in map) {
        jsonString = jsonString + key + ":" + map[key] + ",";
    }
    if ("," == jsonString.charAt(jsonString.length - 1)) {
        jsonString = jsonString.substring(0, jsonString.length - 1);
    }
    jsonString += "}";
    return jsonString;
}

/**
 * 弹窗提示成功
 */
function toastSuccess() {
    wx.showToast({
        title: '成功',
        icon: 'success',
        duration: 2000
    })
}

/**
 * 调用微信支付
 */
function doWechatPay(prepayId, successCallback, failCallback, completeCallback) {
    var nonceString = getRandomString();
    var currentTimeStamp = getCurrentTimeStamp();
    var packageName = "prepay_id=" + prepayId;
    var dataMap = {
        timeStamp : currentTimeStamp,
        nonceStr : nonceString,
        package : packageName,
        signType : "MD5",
        paySign : getWechatPaySign(nonceString, packageName, currentTimeStamp),
        success : successCallback,
        fail : failCallback,
        complete : completeCallback
    }
    console.log(dataMap);
    wx.requestPayment(dataMap);
}

/**
 * 获取微信支付签名字符串
 */
function getWechatPaySign(nonceStr, packageName, timeStamp){
    var beforMD5 = "appid=" + app.d.appId + "&nonceStr=" + nonceStr + "&package=" + packageName + "&signType=MD5" + "&timeStamp=" + timeStamp + "&key=" + app.d.appKey;
    return doMD5Encode(beforMD5).toUpperCase();
}

/**
 * 获取当前时间戳
 */
function getCurrentTimeStamp() {
    var timestamp = Date.parse(new Date());
    return timestamp + "";
}

/**
 * 获取随机字符串，32位以下
 */
function getRandomString() {
    return Math.random().toString(36).substring(3, 8);
}

/**
 * MD5加密
 */
function doMD5Encode(toEncode){
    return MD5Encode.hexMD5(toEncode);
}

/**
 * 使用循环的方式判断一个元素是否存在于一个数组中
 * @param {Object} arr 数组
 * @param {Object} value 元素值
 */
function isInArray(arr, value) {
  for (var i = 0; i < arr.length; i++) {
    if (value === arr[i]) {
      return true;
    }
  }
  return false;
}


module.exports = {
    isStringEmpty: isStringEmpty,
    mapToJson: mapToJson,
    toastSuccess: toastSuccess,
    doMD5Encode: doMD5Encode
}