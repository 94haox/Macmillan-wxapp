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
        currentIndex:0,
        wordlist:[],
        isAuto:false,
        currentCount:300,
        avatarUrl:"../../images/user-unlogin.png",
        nickName:"点击获取微信昵称",
        isLogin:false,
        userInfo:{},
        isClear: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      // 获取用户信息
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
            wx.getUserInfo({
              success: res => {
                this.setData({
                  isLogin:true
                })
                this.updateUserInfo(res.userInfo)
              }
            })
          }
        }
      })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
      let that = this
      filetools.getFirstWords().then(res=>{
        let current = res[0]
        that.setData({
          currentIndex:0,
          currentWord: current,
          wordlist: res
        })
      })
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    nextWordAction: function() {
        console.log('nextword')
        let index = this.data.currentIndex + 1
        if(index < this.data.wordlist.length){
          let wordlist = this.data.wordlist;
          this.setData({
            currentIndex: index,
            currentWord: wordlist[index]
          })
        }
        this.setData({
          isClear: false
        })
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
    },

    onGetUserInfo: function (e) {
      if (!this.logged && e.detail.userInfo) {
        this.updateUserInfo(e.detail.userInfo)
      }
    },

    updateUserInfo: function(userInfo) {
      this.setData({
        avatarUrl: userInfo.avatarUrl,
        nickName: userInfo.nickName,
        userInfo: userInfo,
      })
    }


})