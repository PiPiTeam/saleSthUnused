//index.js
//获取应用实例
const app = getApp();
import Notify from '../../vant-weapp/notify/index';

Page({
  data: {
    userInfo: {}
  },
  //事件处理函数
  bindViewTap: function() {
    console.log()
  },
  onLoad: function () {
    
  },
  methods: function(e) {
    
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log('滑动到底了...')
    Notify({
      text: '已经是底部了',
      duration: 1000,
      selector: '#custom-selector',
      backgroundColor: '#38f'
    });
  }
})
