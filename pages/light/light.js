const apikey = 'hUFB9YXT = zOlaXdQzusWdUd10 = 4 ='
const device_id = 573456859
const sendCommandURL = 'http://api.heclouds.com/devices/573456859/datapoints'
function post1(switch_value) {
  wx.request({
    url: 'http://api.heclouds.com/devices/573456859/datapoints?type=3',
    method: 'POST',
    header: {
      "Content-Type": "application/json",
      "api-key": 'hUFB9YXT=zOlaXdQzusWdUd10=4='
    },

    data: { light: switch_value },
    success(res) {
      console.log("控制成功")
      console.log(res)
      wx.showToast({ //显示弹窗
        title: '控制成功',
        icon: 'success',
        duration: 500
      })
    }
  })
}
Page({
  data: {
light:"开灯",
    img:"../images/12.jpeg",
    text:"该起来啦！",
  },
  switch: function (e) {
    var that = this
    if (e.detail.value) {
      post1('1')
      that.setData({
        light: "关灯",
        text:"早点睡吧！",
        img:"../images/1234.jpeg"
      })
    }
    else{
      post1('0')
      that.setData({
        light: "开灯",
        text:"该起来啦！",
        img:"../images/12.jpeg"
      })}
  }

})