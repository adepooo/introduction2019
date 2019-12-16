Page({
  data: {
    state:0
  },
  test:function()
{
  var that=this
  wx.request({
    url: 'http://api.heclouds.com/devices/573456859/datapoints?datastream_id=Human&limit=1',
    method: 'GET',
    header: {
      "Content-Type": "application/json",
      "api-key": 'hUFB9YXT=zOlaXdQzusWdUd10=4='
    },
    success(res)
    {
      
     console.log(res.data.data.datastreams[0].datapoints[0].value)
     that.setData({
       state: res.data.data.datastreams[0].datapoints[0].value
     })
      if (that.data.state == 1.00) {
        console.log("有人")
        wx.showModal({
          title: '检测成功！',
          content: '寝室中有人',
          success(res) {
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }
      else
      {
        wx.showModal({
          title: '检测成功！',
          content: '寝室中无人',
          success(res) {
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }
    },
    fail(res)
    {
      wx.showModal({
        title: '检测失败！',
        content: '请检查硬件是否连接。',
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
    })
    }
}
)