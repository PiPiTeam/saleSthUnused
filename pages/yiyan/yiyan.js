// pages/yiyan/yiyan.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    yiyan: '',
    source: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    _this.getYiyan();
    setInterval(_this.getYiyan,10000)
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
  /**
   *yiyan
   */
  getYiyan: function() {
    let _this = this;
    wx.request({
      url: 'http://er567.cn/api/yiyan',
      data: {},
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        // console.log(res.statusCode) //200
        console.log(res.data)
        _this.setData({
          yiyan: res.data.data.hitokoto
          // `from:${res.data.data.from}】`
        })
      }
    })
  }
})