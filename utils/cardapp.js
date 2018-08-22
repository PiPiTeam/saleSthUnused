var app = getApp()
var config = require('./config');
var globalData = {
  userInfo: null,
  cityCode: '',
  city: '全部',
  addCityCode: '',
  addCity: '',
  isHasCard: false,//用来标示当前登录用户是否已用名片 
  labelData: [],
  getUserInfoResponse: null,
};
function login(callBack) {
  var that = this;
  // 登录
  wx.login({
    success: res => {
      // 发送 res.code 到后台换取 openId, sessionKey, unionId
      wx.showLoading({ title: "加载中...", mask: true })
      if (res.code) {
        //发起网络请求
        wx.request({
          method: 'POST',
          url: config.service.loginUrl,
          data: { code: res.code },
          header: {
            'content-type': 'application/json', // 默认值
            "X-WX-SESSION-KEY": app.globalData.sessionKey,
            "X-WX-FROM": app.globalData.appId,
          },
          success: getTokeResponse => {
            if (getTokeResponse.statusCode != 200 && getTokeResponse.data.errorCode != 0) {
              wx.hideLoading()
              wx.showModal({
                title: '登录失败',
                content: '登录失败，请点击"确定"重新登陆',
                success: function (m) {
                  if (m.confirm) {
                    app.goLogin({
                      success: function(){
                        callBack
                      }
                    })
                  }
                }
              })
              return;
            }
            wx.setStorageSync('token', getTokeResponse.data.token);
            wx.setStorageSync('openid', getTokeResponse.data.openid);
            // 获取用户信息
            wx.getSetting({
              success: res => {
                // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                wx.getUserInfo({
                  withCredentials: false,
                  lang: 'zh_CN',
                  success: res => {
                    that.globalData.userInfo = res.userInfo;
                    that.globalData.getUserInfoResponse = res;
                    // set local city.
                    /*if(res.userInfo.city) {
                      var cityData = city.getCityData(res.userInfo.province, res.userInfo.city);
                      if (cityData) {
                        that.globalData.cityCode = cityData.code;
                        that.globalData.city = cityData.name;
                      }
                    }
                    */
                    // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                    // 所以此处加入 callback 以防止这种情况
                    //if (that.userInfoReadyCallback) {
                    //  that.userInfoReadyCallback(res)
                    //}
                    if (callBack && typeof callBack == "function") {
                      callBack();
                    }
                    wx.hideLoading()
                    
                  }, fail: function (e) {
                    wx.hideLoading()
                    let pageInstance = app.getAppCurrentPage();
                    pageInstance.setData({
                      showGetUserInfo: true
                    });
                  }
                })
              }
            })
          }
        })
      } else {
        wx.hideLoading();
      }
    },
    fail: function () {
      console.log('登录失败')
      wx.hideLoading()
      wx.showModal({
        title: '登录失败',
        content: '登录失败，请点击"确定"重新登陆',
        success: function (m) {
          if (m.confirm) {
            that.login(callBack)
          }
        }
      })
    }
  });
};
function showAuthAlert(callback){
  var that = this;
  wx.hideLoading();
  wx.showModal({
    title: '警告',
    content: '若不授权微信登陆，则无法使用名片功能。点击"授权"，则可重新使用。',
    cancelText: '不授权',
    confirmText: '授权',
    success: function (res) {
      if (res.confirm) {
        wx.openSetting({
          success: function (res) {
            if (!res.authSetting["scope.userInfo"] || !res.authSetting["scope.userLocation"]) {
              app.goLogin({
                success: function(){
                  that.login(callback)
                }
              })
            }
          }
        })
      } else if (res.cancel) {
      }
    }
  })
};

function checkSession(data){
  var that = this;
  wx.checkSession({
    success: function () {
      that.getQueryData({ url: 'mi/session/checkSession' }, function (res) {
        console.log(res);
        if (data) {
          if (res.data.token && data.success) {
            console.log("check session success");
            data.success();
          } else if (!res.data.token && data.fail) {
            console.log("failed to check session");
            //data.fail();
          }
        }
      })
    }, fail: function (r) {
      console.log("checkSession fail");
      if (data && data.fail) {
        // data.fail();
      }
    }
  })
};
function checkShareTicket(ticket, shareCardId, callback){
  if (ticket) {
    var that = this;
    wx.getShareInfo({
      shareTicket: ticket,
      success(res) {
        console.log(res);
        var openid = wx.getStorageSync('openid');
        if (res.iv) {
          var groupdata = {
            openId: openid,
            cardId: shareCardId ? shareCardId : "",
            shareTicket: ticket,
            iv: res.iv,
            encryptedData: res.encryptedData
          };
          that.postData({ 'url': 'mi/group/join', 'data': groupdata, 'keepLoading': true }, function (resdata) {
            console.log(resdata.data);
          });
        }
      },
      fail() { },
      complete() { }
    });
  }
};
function getSystemInfo(){
   var sysinfo = wx.getStorageSync("systeminfo");
    if (!sysinfo) {
      try {
        sysinfo = wx.getSystemInfoSync();
        wx.setStorageSync("systeminfo", sysinfo);
      } catch (e) {
        console.log(e);
      }
    }
    return sysinfo;
};
function postQueryData(data, callback){
  var url = config.service.host + data.url
  var token = wx.getStorageSync('token');
  var openid = wx.getStorageSync('openid');
  wx.request({
    url: url,
    method: 'POST',
    data: data.data,
    header: {
      "X-WX-SESSION-KEY": app.globalData.sessionKey,
      "X-WX-FROM": app.globalData.appId,
      'content-type': 'application/json',
      'X-AUTH-TOKEN': token,
      'X-AUTH-OPENID': openid
    },
    success: function (res) {
      console.log(data);
      callback(res);
      if (!data.keepLoading) {
        wx.hideLoading()
        wx.hideNavigationBarLoading()
      }
    },
    fail: function (res) {
      console.log('请求出错')
      setTimeout(function () {
        wx.hideLoading()
        wx.hideNavigationBarLoading()
      }, 500)
    }
  });
}
function getQueryData(data, callback){
  var url = config.service.host + data.url;
  var token = wx.getStorageSync('token');
  var openid = wx.getStorageSync('openid');
  wx.request({
    url: url,
    data: {},
    header: {
      "X-WX-SESSION-KEY": app.globalData.sessionKey,
      "X-WX-FROM": app.globalData.appId,
      'content-type': 'application/json',
      'X-AUTH-TOKEN': token,
      'X-AUTH-OPENID': openid
    },
    success: function (res) {
      console.log(res);
      callback(res);
      if (!data.keepLoading) {
        wx.hideLoading()
        wx.hideNavigationBarLoading()
      }
    },
    fail: function (res) {
      console.log('请求出错')
      setTimeout(function () {
        wx.hideLoading()
        wx.hideNavigationBarLoading()
      }, 500)
    }
  })
};
function getData(data, callback){
  var that = this;
  wx.checkSession({
    success: function (r) {
      that.getQueryData(data, callback);
    }, fail: function (r) {
      app.goLogin({
        success: function(){
          that.login(that.getQueryData(data, callback))
        }
      });
    }
  });
};
function postData(data, callback){
  var that = this;
  that.checkSession({
    success: function (r) {
      that.postQueryData(data, callback);
    }, fail: function (r) {
      app.goLogin({
        success: function(){
          that.login(that.postQueryData(data, callback));
        }
      });
    }
  });
};
module.exports = {
  globalData: globalData,
  login: login,
  showAuthAlert: showAuthAlert,
  checkSession: checkSession,
  checkShareTicket: checkShareTicket,
  getSystemInfo: getSystemInfo,
  postQueryData: postQueryData,
  getQueryData: getQueryData,
  getData: getData,
  postData: postData,
}