// miniprogram/pages/main/main.js
const db = wx.cloud.database()
const filetools = require('../../utils/file_tool')
// const $ = require('../../utils/utils');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        currentWord: {
            "word": "abandon",
            "means": "n. 放任；狂热 vt. 遗弃；放弃",
            "En": "[əˈbænd(ə)n]",
            "Am": "[əˈbændən]"
        },
        isClear: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

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
        filetools.getAllWords()
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    nextWordAction: function() {
        console.log('nextword')
    },

    forgetAction: function() {
        console.log('forget')
        this.showMeans()
    },

    checkMeans: function() {
        this.showMeans()
    },

    showMeans: function() {
        this.setData({
            isClear: true
        })
    },

    playCurrentWord: function() {
        const audio = wx.createInnerAudioContext()
        audio.autoplay = true
        audio.src = `http://dict.youdao.com/dictvoice?audio=${this.data.currentWord['word']}&type=1`

    },

    toSetting: function(){
        wx.navigateTo({
            url: "../setting/setting"
        })
    }


})