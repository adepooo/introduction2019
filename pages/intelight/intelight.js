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

    data: { intelight: switch_value },
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
  disabled:true,
  light:"开灯"
  },
  send1: function () {
    post1('2')
  },
  send2: function () {
    post1('3')
  },
  send3: function () {
    post1('4')
  },
  switch:function(e)
  {
    var that=this
    if(e.detail.value)
    {
      post1('0')
         that.setData({
           disabled:false,
           light:"关灯"
         })
    }
    else{
      post1('1')
      that.setData({
        disabled: true,
        light:"开灯"
      })}
  }

})