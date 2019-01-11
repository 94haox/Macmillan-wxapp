
const config = require('../../config.js')
const userApi = require('../../api/user_api.js')
const $ = require('../../utils/utils.js')

Page({

    /**
     * 页面的初始数据
     */
    data: {
        isEnAnnuce: 0,
        isAuto: 1,
        memoryTime: '20:00',
        dayCount:100,
        needDays:62,
        needMin:50,
        version:"v1.0",

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      this.setData({
        version: config.appversion
      })
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
      let currenUser = wx.getStorageSync('currentUser')
      this.setData({
        isEnAnnuce: parseInt(currenUser.isEnAnnuce),
        isAuto: parseInt(currenUser.isAuto),
        memoryTime: currenUser.memoryTime,
        dayCount: currenUser.dayCount,
        openId: currenUser.openId
      })
      this.configDays(parseInt(currenUser.dayCount))
    },

    formSubmit: function (e) {
      let formId = e.detail.formId;
      console.log('form发生了submit事件，推送码为：', formId)
      let params =  this.data
      params.isEnAnnuce = String(this.data.isEnAnnuce)
      params.isAuto = this.data.isAuto ? '1':'0'
      console.log(params)
      $.showLoading()
      userApi.updateUser(params).then(res => {
        $.showToast('修改成功','success')
        wx.setStorageSync('currentUser', res)
        setTimeout(function () {
          wx.navigateBack({
          })
        }, 1500)
      }).catch(error => {
      })
    },

    changeWordCount: function (el) {
        //6152 个
      let value = el.detail.value
      this.configDays(value)
    },

    configDays: function (daycout){
      let min = daycout * 0.5
      let days = Math.ceil(6152 / daycout)
      if (daycout == 0) {
        days = 0
      }
      this.setData({
        dayCount: String(daycout),
        needDays: days,
        needMin: min,
      })
      wx.setStorageSync("dayCount", daycout)
    },

    changeAutoAnnuce: function (el){
      let value = el.detail.value
      console.log(value)
      this.setData({
        isAuto: value
      })
      wx.setStorageSync("isAuto", value)
    },

    changeAnnounceType: function () {
      let aunnceType = this.data.isEnAnnuce == 1 ? 0 : 1
      this.setData({
        isEnAnnuce: aunnceType
      })
      wx.setStorageSync("isEnAnnuce", aunnceType)
    },

    bindTimeChange: function (el) {
        let memoryTime = el.detail.value
        this.setData({
            memoryTime: memoryTime
        })
    },

    toFeedBack: function (){
      $.goto(config.page.feedback)
    }
})