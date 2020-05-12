//index.js
// import Toast from '../../vant-weapp/toast/index';
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  showMsg: function (event) {
    let msg = event.currentTarget.dataset.msg,content;
    switch(msg){
      case 'blog':
        content = 'https://er567.cn';
        break;
      case 'github':
        content = 'https://github.com/er567';
        break;
      case 'wechat':
        content = 'er_567';
        break;
    }
    wx.showModal({
      title: msg,
      content: content,
      confirmText: '点击复制',
      showCancel: false,
      success: function (res) {
        if (res.confirm) {
          wx.setClipboardData({
            data: content,
            // success - fail - complete
            success: function(){}
          })
        }
      }
    })
  }
})
