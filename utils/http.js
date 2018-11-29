var app = getApp();
var util = require("util.js");
var common = require("common.js");
var host = "https://www.sojson.com/api"

function post(url, data) {
  var promise = new Promise((resolve, reject) => {
    //init
    var that = this;
    var postData = data;
    let accesstoken = 'lc' + util.formatTime(new Date) + 'lc_api_key';
    var header = {
      'accesstoken': common.doMD5Encode(accesstoken)
    }
    var userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      if (userInfo.reg) {
        header.usertoken = userInfo.user_token;
      }
    }
    //网络请求
    wx.request({
      url: url,
      data: postData,
      method: 'POST',
      header: header,
      success: function (res) {
        if (res.data.code == 1) {
          resolve(res.data.data);
        } else {//返回错误提示信息
          reject(res.data.msg);
        }
      },
      error: function (e) {
        reject('网络出错');
      }
    })
  });
  return promise;
}

function get(url) {
  var promise = new Promise((resolve, reject) => {
    //init
    var that = this;
    let accesstoken = 'lc' + util.formatTime(new Date) + 'lc_api_key';
    var header = {
      'accesstoken': common.doMD5Encode(accesstoken)
    }
    var userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      if (userInfo.reg) {
        header.usertoken = userInfo.user_token;
      }
    }
    //网络请求
    wx.request({
      url: url,
      method: 'GET',
      header: header,
      success: function (res) {
        if (res.data.status == 200) {
          resolve(res.data);
        } else {//返回错误提示信息
          reject(res.data.msg);
        }
      },
      error: function (e) {
        reject('网络出错');
      }
    })
  });
  return promise;
}

//配置文件
function base(){
  let url = host + '/qqmusic/8446666';
  return get(url);
}

//获取openId
function openId(code) {
  let url = host + '/common/openid';
  let postData = {
    'code': code
  };
  return post(url, postData);
}

module.exports = {
    post:post,
    get: get,
    base:base,
    openId: openId,
}