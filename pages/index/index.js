const app = getApp()

Page({
  data: {
    ImageFileID: "",
    ImagetempFilePaths: "",
    result: 0.0,
    canvas_height: 200,
    image_viwe_display: "block", //前端图片默认展示状态，修复canvas无法在真机展示部分图片。
    canvas_viwe_display: "none", //前端canvas默认展示状态，修复canvas无法在真机展示部分图片。
  },

  UploadImage() {
    var myThis = this
    var random = Date.parse(new Date()) + Math.ceil(Math.random() * 1000) //随机数
    wx.chooseImage({ //图片上传接口
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success(chooseImage_res) {
        wx.showLoading({ //展示加载接口
          title: '加载中...',
        });
        wx.getImageInfo({ //图片属性接口
          src: chooseImage_res.tempFilePaths[0], //地址为选择图片后在本地的临时文件
          success(getImageInfo_res) {
            var ctx_size = 250 / getImageInfo_res.width;
            // 获取上传后图片宽度与250的比值
            const ctx = wx.createCanvasContext('Canvas');
            const image = chooseImage_res.tempFilePaths[0]; //设置图片地址为选择图片后在本地的临时文件
            ctx.drawImage(image, 0, 0, 250, getImageInfo_res.height * ctx_size); //选择的图片高度与宽度/250后比值做乘积，得到符合前端canvas正常高度
            myThis.setData({
              canvas_height: getImageInfo_res.height * ctx_size, 
              image_viwe_display: "none", //关闭前端图片展示
              canvas_viwe_display: "block", //打开前端canvas展示
            })
            ctx.draw(); 
          }
        })
        console.log("临时地址:" + chooseImage_res.tempFilePaths[0])
        myThis.setData({
          UpdateImage: "上传进度", //选择图片后将“请上传照片”更改为“上传进度”
          ImagetempFilePaths: chooseImage_res.tempFilePaths[0] //将选择图片后的临时地址写给ImagetempFilePaths等待其他函数调用
        })
        const uploadTask = wx.cloud.uploadFile({ //云存储上传接口
          cloudPath: random + '.png', //将图片上传后名称为随机数 + .png
          filePath: chooseImage_res.tempFilePaths[0], //将临时地址中的图片文件上传到云函数文件服务器
          success(uploadFile_res) {
            myThis.setData({
              ImageFileID: uploadFile_res.fileID //将上传图片后的fileID写给ImageFileID等待其他函数调用
            })
            wx.hideLoading() //关闭加载中弹窗
            wx.showToast({ //显示弹窗
              title: '上传成功',
              icon: 'success',
              duration: 500
            })
          }
        })
      }
    })
  },

  CompareFace() {
    wx.showLoading({
      title: '请稍后...',
    });
    var myThis = this
    var image_src = this.data.ImagetempFilePaths
    console.log(myThis.data.ImageFileID)
    wx.cloud.callFunction({ //人脸检测云函数
      name: 'cloud',
      data: {
        fileID: this.data.ImageFileID //上传成功文件的fileID
      },
      success(cloud_callFunction_res) {
        wx.hideLoading()
        console.log(cloud_callFunction_res)
        myThis.setData({
          result: cloud_callFunction_res.result.Score
        })
        console.log(myThis.data.result)
        if (myThis.data.result > 50) {
          console.log("yiyang");

          wx.switchTab({

            url: '../main/main'

          });
        }
        else {
          console.log("butong");
          wx.showModal({
            title: '人像错误！',
            content: '请重新选择图片',
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
      fail(err) { //失败回调函数
        console.log(err.errMsg)
        wx.hideLoading()
        wx.showModal({
          title: '人脸检测失败,请重试！',
          content: "（图片大小不可超过3M)"
        })
      }
    })
  },

})