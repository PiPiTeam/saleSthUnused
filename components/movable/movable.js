let {
  windowWidth,
  windowHeight
} = wx.getSystemInfoSync()

Component({
  data: {
    
  },
  properties: {
    x: {
      type: Number,
      value: windowWidth - 40
    },
    y: {
      type: Number,
      value: windowHeight - 40
    },
    isPlay: {
      type: Boolean,
      value: true
    }
  },
  methods: {
     onTap: function(){
       this.setData({ isPlay: !this.properties.isPlay });
       this.triggerEvent('playStop',{})
     }
  }
})
