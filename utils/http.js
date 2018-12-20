import common from './common';
const domain = 'https://anfou.cc/';

const date = new Date();
const datestr = `${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}`;
const accesstoken = common.doMD5Encode(datestr + '_af_api_key');

function request(options) {
  const {
    url,
    data,
    method,
    success,
    header,
  } = options;
  return new Promise((resolve, reject) => {
    wx.request({
      url: domain + url,
      data: data,
      header: Object.assign(header || {}, {
        'content-type': 'application/x-www-form-urlencoded',
        'accesstoken': accesstoken
      }),
      method: method,
      success: (response) => {
        if (typeof success === 'function') {
          success(response);
        }
        resolve(response)
      },
      fail: (error) => {
        console.log('shit happen');
        //reject(error)
      },
      complete: (e) => {
        let msg = '';
        switch (e.statusCode) {
          case 404:
            msg = '找不到服务器';
            break;
          case 500:
            msg = '服务器错误';
            break;
        }
        if (msg != '') {
          wx.showToast({
            title: '网络请求失败',
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  });
}

module.exports = {
  request: request,
  accesstoken: accesstoken
}