// pages/debunk/debunk.js
var util = require('../../utils/util.js');
var skin = require('../../utils/skin.js');
var tagconf = require('../../utils/tagconf.js');
// var city = require('../../utils/city.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    hiddenmodalput: true,
    scrollLeft: 0,
    businessIndex: 0,
    businessList: ["请选择"].concat(tagconf.business),
    labelList: tagconf.tags,
    templateList: skin.definitions,
    radioItems:
      [
        { name: '是', value: 'Y' },
        { name: '否', value: 'N', checked: 'true' },
      ],
    checkboxItems: [
      { name: '本人己阅读并同意遵守', value: 'Y', checked: false },
    ]
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

  //取消按钮  
  cancel: function () {
    this.setData({
      hiddenmodalput: true
    });
  },

  //确认  
  confirm: function () {
    
  },

  //滚动条触边
  lower: function (e) {
    console.log(e)
  },

  //滚动条滚动后触发
  scroll: function (e) {
    console.log(e)
  },

  //通过设置滚动条位置实现画面滚动
  tapMove: function (e) {
    this.setData({
      scrollLeft: this.data.scrollLeft + 10
    })
  },
  //上传头像
  uploadImage: function () {
    var that = this
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        util.showLoading('上传中...');
        var filePath = res.tempFilePaths[0];
        var token = wx.getStorageSync('token');
        var openid = wx.getStorageSync('openid');
        util.showAlert('上传成功！');
        that.setData({'cardData.avatar': filePath})
        wx.hideLoading()
        // wx.uploadFile({
        //   url: config.service.imageUploadUrl + "?type=logo",
        //   filePath: filePath,
        //   header: {
        //     'X-AUTH-TOKEN': token,
        //     'X-AUTH-OPENID': openid
        //   },
        //   name: 'media',
        //   success: function (res) {
        //     wx.hideLoading()
        //     console.log(res)
        //     res = JSON.parse(res.data)
        //     if (res.errorCode == 0) {
        //       util.showAlert('上传成功！', function () {
        //       });
        //       that.setData({
        //         'cardData.avatar': res.data
        //       })
        //     } else {
        //       util.showAlert('上传失败！')
        //     }
        //   },
        //   fail: function (e) {
        //     console.error(e)
        //     wx.hideLoading()
        //     util.showAlert('上传失败！')
        //   }
        // })

      },
      fail: function (e) {
        console.log('选择头像失败！');
        console.log(e);
        wx.hideLoading()
      }
    })
  },
  selectLabel: function (e) {
    var index = e.currentTarget.dataset.index;
    var lableList = this.data.labelList;
    if (lableList[index].checked) {
      lableList[index].checked = false;
      this.setData({ labelList: lableList });
      return;
    }

    var j = this.getLableCheckedCount(lableList);
    if (j >= 4) {
      util.showAlert('只能选4个！');
      return;
    }
    lableList[index].checked = true;
    this.setData({ labelList: lableList });
  },

  getLableCheckedCount: function () {
    var labelList = this.data.labelList;
    var count = 0;
    if (labelList) {
      for (var i = 0; i < labelList.length; i++) {
        if (labelList[i].checked) {
          count++;
        }
      }
    }
    return count;

  },

  selectTemplate: function (e) {
    var index = e.currentTarget.dataset.index;
    var templateList = this.data.templateList;
    for (var i = 0; i < templateList.length; i++) {
      templateList[i].checked = false;
    }
    templateList[index].checked = true;
    this.setData({ templateList: templateList });
  },

  radioChange: function (e) {
    var radioItems = this.data.radioItems;
    for (var i = 0, len = radioItems.length; i < len; ++i) {
      radioItems[i].checked = radioItems[i].value == e.detail.value;
    }
    var value = '';
    for (var i = 0; i < radioItems.length; i++) {
      if (radioItems[i].checked) {
        value = radioItems[i].value;
        break;
      }
    }
    this.setData({
      'radioItems': radioItems
    });
  },
  //修改行业
  bindBussinessChange: function(e){
    var index = e.detail.value;
    var businessName = this.data.businessList[index];
    if (index == 0) {
      businessName = ''
    }
    this.setData({
      'cardData.description': businessName,
      'businessIndex': index,
    });
  },
  checkboxChange: function (e) {
    var checkboxItems = this.data.checkboxItems, values = e.detail.value;
    var agreement = 'N';
    for (var i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
      checkboxItems[i].checked = false;
      for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (checkboxItems[i].value == values[j]) {
          checkboxItems[i].checked = true;
          agreement = checkboxItems[i].value;
          break;
        }
      }
    }

    this.setData({
      'checkboxItems': checkboxItems
    })
  },

  formSubmit: function (e) {
    if (e.detail.value.name === '') {
      util.showAlert('姓名不能为空');
      return;
    }
    if (e.detail.value.company === '') {
      util.showAlert('公司不能为空');
      return;
    }
    if (e.detail.value.title === '') {
      util.showAlert('职位不能为空');
      return;
    }
    var mobile = e.detail.value.mobile;
    var msg = util.validataMobile(mobile);
    if (msg) {
      util.showAlert(msg);
      return;
    }
    // validate.
    if (e.detail.value.code === '' && isNeedValidateCode) {
      util.showAlert('验证码不能为空');
      return;
    }
    var email = e.detail.value.email;
    var msg = util.validateEmail(email);
    if (msg) {
      util.showAlert(msg);
      return;
    }
    if (!this.data.cardData.description) {
      util.showAlert('必须选择行业');
      return;
    }
    if (!this.data.cardData.citycode) {
      util.showAlert('必须选择城市');
      return;
    }
    var that = this;
    var agreement = that.data.cardData.agreement;
    if (agreement != 'Y') {
      util.showAlert('你必须阅读并同意遵守名片助手服务协议！');
      return;
    }
    util.showSuccess('填写通过！');
  },
})