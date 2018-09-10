Page({

  /**
   * 页面的初始数据
   * 
   * 
   */
  data: {
    count: 0,
    content: '',
    chatList: [],
    is_content_chat: true,
    isShowMore: false,
    isOpen: false,
    statusMsg: '连接中...',
    input_value_content: '',
    UserChatList: [],
    isUser: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    this.setData({
      // resource_id: options.resource_id,
      // book_id: options.book_id,
      is_content_chat: true,
      isShowMore: false,
      input_value_content: '',
      UserChatList: [],
      isUser: false,
      isOpen: true
    })

    this.data.resource_id = options.resource_id;

    this.wssInit()
  },
  onShow: function () {
    !this.data.isOpen && this.connectWss();
  },
  // 获取直播聊天列表
  handleGetChatList() {
    getChatList({
      // token: wx.getStorageSync('token')
    }).then(res => {
      if (res.data.length > 9) {
        this.setData({
          isShowMore: true,
          chatList: res,
          isOpen: false,
        })
      } else {
        this.setData({
          chatList: res,
          isShowMore: false,
          isOpen: false,
        })
      }
    }).catch(err => {
      Event.initShowToast(err, this);
    })
  },
  // // 下拉获取更多聊天记录
  getMoreChatList() {
    getChatList({
      // token: wx.getStorageSync('token'),
      // page_index: 0,
      // page_size: 10,
      // start_id: this.data.chatList.min_id
    }).then(res => {
      // 把之前得到的聊天数据和重新加载的拼接在一起
      res.data.forEach(item => {
        this.data.chatList.data.push(item)
      })
      this.data.chatList.min_id = res.min_id;
      this.setData({
        chatList: this.data.chatList,
      })
    }).catch(err => {
      Event.initShowToast(err, this);
    })
  },
  wssInit() {
    var that = this;
    this.connectWss();
    // 链接失败显示
    wx.onSocketError(function (res) {
      console.log('WebSocket连接打开失败，请检查！', res);
      that.setData({
        isOpen: false,
        statusMsg: '已断开'
      });
    });
    // 监听连接成功
    wx.onSocketOpen(function (res) {
      console.log('WebSocket连接已打开！')
      that.setData({
        isOpen: true,
        statusMsg: '已连接'
      });
      // that.handleGetChatList()
      wx.onSocketMessage(function (res) {
        let res_data = JSON.parse(res.data).data;
        console.log('收到服务器内容：', res);
        if (res_data.errcode > 0) {
          wx.showToast({
            title: '内容涉及敏感信息！',
            icon: 'none',
            duration: 2000
          })
        }
        if (res_data.fd) {
          that.data.chatList.push(res_data)
          that.setData({
            isUser: true,
            count: res_data.count,
            chatList: that.data.chatList
          })
        }
      });
      wx.sendSocketMessage({
        data: '',
        success: res => {
          console.log(res + '发送成功')
        },
        fail: err => {
          console.log(err + '失败')
        }
      });
    });
    wx.onSocketClose(function (res) {
      that.setData({
        isOpen: false,
        statusMsg: '已断开'
      })
      wx.showToast({
        title: '连接已断开！',
        icon: 'none',
        duration: 2000
      })
      console.log('WebSocket 已关闭！')
    })
  },
  bindContent:function (e){
    this.setData({
      content: e.detail.value
    })
  },
  // 向服务器发送消息
  handleSendMessage: function () {
    var that = this;
    console.log('尝试向服务器发送消息：');
    that.data.statusMsg == '已断开' && connect()
    if (that.data.content.trim() == '') {
      wx.showToast({
        title: '内容不能为空！',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    wx.sendSocketMessage({
      data: JSON.stringify({ content: that.data.content }),
      success: res => {
        that.setData({
          content: ''
        })
      }
    });
  },
  connectWss: function () {
    this.setData({
      statusMsg: '连接中...'
    });
    connect();
  },
})
function connect() {
  wx.connectSocket({
    url: 'wss://www.er567.cn/ws',
    success: function (res) {
      this.setData({
        isOpen: true,
        statusMsg: '已连接'
      });
    }
  });
}