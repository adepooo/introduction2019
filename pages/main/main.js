Page({
  data: {
    
  },
  weather:function()
  {
    wx.navigateTo({
      url: '../weather/weather',
    })
  },
  environment: function () {
    wx.navigateTo({
      url: '../environment/environment',
    })
  },
  human: function () {
    wx.navigateTo({
      url: '../human/human',
    })
  }
})