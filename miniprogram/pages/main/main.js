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
        currentIndex:0,
        wordlist:[],
        forgetWordList:[],
        isAuto:false,
        isEn:true,
        currentCount:300,
        avatarUrl:"../../images/user-unlogin.png",
        nickName:"点击获取微信昵称",
        isLogin:false,
        user:{},
        isClear: false,
        confirmtext:'记得',
        forgettext:'忘记'
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
      let that = this
      api.getWords().then(items=>{
        that.setData({
          wordlist:items,
          currentWord:items.shift()
        })
      })
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
      console.log('main.js_onShow')
      let user = wx.getStorageSync('currentUser')
      let isAuto = user.isAuto == 1 ? true : false
      let isEn = user.isEnAnnuce == 1 ? true : false
      console.log(user.isEnAnnuce)
      this.setData({
        isAuto: isAuto,
        isEn: isEn,
        user: user
      })
      this.updateUserInfo(user)
    },

    nextWordAction: function() {
 
        let current = this.data.wordlist.shift()
        let wordlist = this.data.wordlist
        if (current){
          this.setData({
            isClear: false,
            confirmtext: '记得',
            currentWord: current,
            wordlist:wordlist
          })
        }else{
          this.setData({
            isClear: false,
            confirmtext: 'End'
          })
        }
    },

    forgetAction: function() {
        let wordlist = this.data.wordlist
        wordlist.push(this.data.currentWord)
        this.setData({
          wordlist: wordlist,
          confirmtext:'下一个'
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
        let type = this.data.isEn ? '1' : '2'
        const audio = wx.createInnerAudioContext()
        audio.autoplay = true
        audio.src = `http://dict.youdao.com/dictvoice?audio=${this.data.currentWord['word']}&type=${type}`

    },

    toSetting: function(){
        $.goto(config.page.setting)
    },

    updateUserInfo: function (user) {
      this.setData({
        avatarUrl: user.avatarUrl,
        nickName: user.nickName,
        user: user,
      })
    }


})