// pages/yiyan/yiyan.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    yiyan: '',
    source: '',
    yiyanTimer: '',
    isPlay: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    _this.getYiyan();
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
    if (!this.data.isPlay) this.clickFn()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    if (this.data.isPlay) this.clickFn()
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(this.data.yiyanTimer)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getYiyan()
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
  /**
   *yiyan
   */
  getYiyan: function() {
    let _this = this;
    wx.request({
      url: 'https://er567.cn/api/yiyan',
      data: {},
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        // console.log(res.statusCode) //200
        // console.log(res.data)
        wx.stopPullDownRefresh();
        _this.setData({ yiyan: res.data.data.hitokoto})
      }
    })
  },

  clickFn: function() {
    clearInterval(this.data.yiyanTimer);
    if (this.data.isPlay) {
      this.data.dragImg = '/image/play.png';
      wx.showToast({
        title: "已暂停",
        duration: 1000,
      })
    }else{
      this.data.dragImg = '/image/stop.png';
      this.data.yiyanTimer = setInterval(this.getYiyan, 8000);
      wx.showToast({
        title: "已开始",
        duration: 1000,
      })
    }
    this.setData({ isPlay: !this.data.isPlay });
  }
})