import Toast from '../../vant-weapp/toast/toast'
import { dsp} from '../../utils/api.js'
import api from '../../utils/request.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    btnTxt: '解析',
    url: '',
    requestData: {
      img: '',
      imgs: '',
      overseas: 0,
      scheme: 0,
      title: '',
      url: ''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  
  urlInput: function (e) {
    this.setData({
      url: e.detail.value
    })
  },

  clearUrl: function() {
    this.setData({
      url: ''
    })
  },

  getClipboardData: function() {
    const _this = this;
    wx.getClipboardData({
      success (res){
        _this.setData({
          url: res.data
        })
      }
    })
  },

  setClipboardData: function(e) {
    let link = e.currentTarget.dataset.link;
    wx.setClipboardData({
      data: link,
      success (res) {
        wx.getClipboardData({
          success (res) {
            
          }
        })
      }
    })
  },

  Resolution: function (event) {
    const _this = this;
    let url = this.data.url;
    if(!url) {
      Toast.success('请输入视频链接');
    } else if(!url.match(/https:\/\/(\S*)\s/)) {
      Toast.fail('请输入正确的视频链接');
    } else {
      this.setData({btnTxt: '解析中'})
      url = url.match(/https:\/\/(\S*)/)[0]
      const params = {
        customHost: 'https://api.lingquan166.com/',
        key: '4C37E11240TLVQB4AE3FC3',
        token: '051210AW73220ENTLVQ',
        url: encodeURI(url)
      }
      api.get(dsp, params).then(res => {
        _this.setData({
          requestData: res.data
        })
        _this.setData({btnTxt: '解析'})
      }).catch(err => {
        console.log(err)
        _this.setData({btnTxt: '解析'})
      })
    }
  },
  handleDownload(e) {
    let link = e.currentTarget.dataset.link;
    let fileName = new Date().valueOf();
    wx.downloadFile({
      url: link,
      filePath: wx.env.USER_DATA_PATH + '/' + fileName + '.mp4',
      success: res => {
        console.log(res);
        let filePath = res.filePath;
        wx.saveVideoToPhotosAlbum({
          filePath,
          success: file => {
            Toast.success('下载成功')
            let fileMgr = wx.getFileSystemManager();
            fileMgr.unlink({
              filePath: wx.env.USER_DATA_PATH + '/' + fileName + '.mp4',
              success: function (r) {
              },
            })
          },
          fail: err => {
            console.log(err)
            if (err.errMsg === 'saveVideoToPhotosAlbum:fail auth deny') {
              wx.showModal({
                title: '提示',
                content: '需要您授权保存相册',
                showCancel: false,
                success: data => {
                  wx.openSetting({
                    success(settingdata) {
                      if (settingdata.authSetting['scope.writePhotosAlbum']) {
                        wx.showModal({
                          title: '提示',
                          content: '获取权限成功,再次点击下载即可保存',
                          showCancel: false,
                        })
                      } else {
                        wx.showModal({
                          title: '提示',
                          content: '获取权限失败，将无法保存到相册哦~',
                          showCancel: false,
                        })
                      }
                    },
                  })
                }
              })
            }
          }
        })
      }
    })
  }
})