Page({
  data: {
    tem:0,
    humi:0
  },
  onShow:function()
  {
    this.test()
  },
  test: function () {
    var that = this
    wx.showLoading({
      title: '读取中...',
    })
    wx.request({
      url: 'http://api.heclouds.com/devices/573456859/datapoints?datastream_id=Temperature,Humidity&limit=1',
      method: 'GET',
      header: {
        "Content-Type": "application/json",
        "api-key": 'hUFB9YXT=zOlaXdQzusWdUd10=4='
      },
      success(res) {
        wx.hideLoading()
        wx.showToast({ //显示弹窗
          title: '读取成功！',
          icon: 'success',
          duration: 500
        })
        console.log(res.data.data)
        that.setData({
          tem:res.data.data.datastreams[0].datapoints[0].value,
          humi:res.data.data.datastreams[1].datapoints[0].value
        })
        console.log(that.data.tem)
        console.log(that.data.humi)
        }
    })

  }
  })
