
const config = require('../../config.js')


Page({

    /**
     * 页面的初始数据
     */
    data: {
        isEnAnnuce: true,
        isAuto: false,
        memoryTime: '20:00',
        daycount:20,
        version:"v1.0"
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

    },

    formSubmit: function (e) {
      let formId = event.detail.formId;
      console.log('form发生了submit事件，推送码为：', formId)
      
    },

    changeWordCount: function (el) {
        //6152 个
        let value = el.detail.value
        this.setData({
            daycount: value
        })
        wx.setStorageSync("daycount", value)
    },

    changeAutoAnnuce: function (el){
        let value = el.detail.value
        wx.setStorageSync("isAuto", value)
    },

    changeAnnounceType: function () {
        let aunnceType = !this.data.isEnAnnuce
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
    }
})