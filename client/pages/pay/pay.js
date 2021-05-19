// pages/demo/pay/pay.js
import utilMd5 from '../../utils/md5.js'
import util from '../../utils/util.js'
var appInstance = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    paypackage: '',
    logs:"0000",
  },

  ordersubmit: function(){
    let self = this
    wx.login({
      success: function (res) {
        if (res.code) {
          //发起网络请求
          wx.request({ 
            url: appInstance.globalData.config.host_url+'/v1/recharge',
            data: {
              code: res.code
            },
            header:{
              Authorize: wx.getStorageSync('jwt_token')
            },
            method: 'POST',
            success: function (res) {  
              console.log(res)        
              self.setData('logs',res.data.message)    
              if(res.data.code==0){
                self.package = res.data.data.package
                self.timeStamp = res.data.data.timeStamp + ''
                self.nonceStr = res.data.data.nonceStr
                self.signType = res.data.data.signType
                self.paySign = res.data.data.paySign
              }
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    });

  },

  orderpay: function () { 
    let self = this
      
    
    //调用wx.requestPayment(OBJECT)发起微信支付
    wx.requestPayment(
      {
        'timeStamp': self.timeStamp,
        'nonceStr': self.nonceStr,
        'package': self.package,
        'signType': self.signType,
        'paySign': self.paySign,
        'success': function (res) {
          // {errMsg: "requestPayment:ok"}
          console.log(res)
         },
        'fail': function (res) {
          console.log(res)
         },
        'complete': function (res) { }
      })       

  },
})