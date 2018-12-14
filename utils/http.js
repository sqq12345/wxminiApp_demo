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
        reject(error)
      },
      complete: () => { }
    })
  });
}

module.exports = {
  request: request,
  accesstoken: accesstoken
}