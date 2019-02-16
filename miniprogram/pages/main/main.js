// miniprogram/pages/main/main.js

const api = require('../../api/main_api.js')
const $ = require('../../utils/utils.js')
const config = require('../../config.js')
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
        currentIndex: 0,
        wordlist: [],
        forgetWordList: [],
        isAuto: false,
        currentCount: 300,
        avatarUrl: "../../images/user-unlogin.png",
        nickName: "点击获取微信昵称",
        isLogin: false,
        userInfo: {},
        isClear: false,
        confirmtext: '记得',
        forgettext: '忘记',
        currentWordId: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        // 获取用户信息
        wx.getSetting({
            success: res => {
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                    wx.getUserInfo({
                        success: res => {
                            this.setData({
                                isLogin: true
                            })
                            this.updateUserInfo(res.userInfo)
                        }
                    })
                }
            }
        })
        console.log('option:', options)

        if (options['wordId'] != undefined) {
            this.setData({
                currentWordId: options['wordId']
            })
        }
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {
        let that = this
        api.getWords().then(items => {
            let startItems = that.getStartWordlist(items)
            that.setData({
                wordlist: startItems,
                currentWord: startItems.shift()
            })
        })
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    nextWordAction: function() {
        let current = this.data.wordlist.shift()
        let wordlist = this.data.wordlist
        if (current) {
            this.setData({
                isClear: false,
                confirmtext: '记得',
                currentWord: current,
                wordlist: wordlist
            })
            wx.setStorageSync('today', current)
        } else {
            this.setData({
                isClear: false,
                confirmtext: 'End'
            })
        }
    },

    forgetAction: function() {
        if (this.data.confirmtext == '下一个') {
            return
        }
        let forgetlist = this.data.forgetWordList
        forgetlist.push(this.data.currentWord)
        wx.setStorageSync('forgetlist', forgetlist)
        this.setData({
            forgetWordList: forgetlist,
            confirmtext: '下一个'
        })
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

    toSetting: function() {
        $.goto(config.page.setting)
    },

    updateUserInfo: function(userInfo) {
        this.setData({
            avatarUrl: userInfo.avatarUrl,
            nickName: userInfo.nickName,
            userInfo: userInfo,
        })
    },

    getStartWordlist: function(items) {
        if (this.data.currentWordId == undefined) {
            return items
        }
        if (this.data.currentWordId.length > 1) {
            let index = 0
            for (let i = 0; i < items.length; i++) {
                let word = items[i];
                if (word._id == this.data.currentWordId) {
                    index = i;
                    break;
                }
            }
            let startIndex = 0;
            while (startIndex <= index-1) {
                items.shift()
                startIndex++
            }
        }
        return items
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }


})