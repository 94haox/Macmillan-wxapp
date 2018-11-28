// miniprogram/pages/main/main.js

const api = require('../../api/main_api.js')
const userApi = require('../../api/user_api.js')
const $ = require('../../utils/utils.js')
const config = require('../../config.js')
const moment = require('moment');


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
    isEn: true,
    currentCount: 300,
    avatarUrl: "../../images/user-unlogin.png",
    nickName: "点击获取微信昵称",
    isLogin: false,
    user: {},
    isClear: false,
    confirmtext: '记得',
    forgettext: '忘记',
    beginIndex: 1,
    endIndex: 300,
    recordlist: [],      // 背诵记录列表
    isMemoryEnd: false,
    isBackMemory: false // 是否是复习词汇
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let params = {
      'userId': wx.getStorageSync('userId')
    }
    let that = this
    userApi.getRecords(params).then(data => {
      that.getTodayWords(data)
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    console.log('main.js_onShow')
    let user = wx.getStorageSync('currentUser')
    let isAuto = user.isAuto == 1 ? true : false
    let isEn = user.isEnAnnuce == 1 ? true : false
    this.setData({
      isAuto: isAuto,
      isEn: isEn,
      user: user
    })
    this.updateUserInfo(user)
  },

/****************** Actions **********************/

  /**
   * 
   */
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
    } else {
      if(!this.data.isBackMemory) {
        this.setData({
          isBackMemory:true
        })
        this.creatRecord()
      }else{

      }
      
      this.setData({
        isMemoryEnd:true,
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
    let type = this.data.isEn ? '1' : '2'
    const audio = wx.createInnerAudioContext()
    audio.autoplay = true
    audio.src = `http://dict.youdao.com/dictvoice?audio=${this.data.currentWord['word']}&type=${type}`

  },

  toSetting: function() {
    $.goto(config.page.setting)
  },

  updateUserInfo: function(user) {
    this.setData({
      avatarUrl: user.avatarUrl,
      nickName: user.nickName,
      user: user,
    })
  },


  /******************** Network ********************/

  /**
   * 获取当天单词
   */
  getTodayWords: function (records) {
    let that = this
    let user = wx.getStorageSync('currentUser')
    let count = user.dayCount
    let beginIndex = 1
    let endIndex = count
    let skip = 0

    if (records.length > 0) {
      let nearlyRecord = records.pop()
      if ($.timeIsEqual(nearlyRecord.startDate, Date.now())) {
        beginIndex = nearlyRecord.beginIndex
        endIndex = nearlyRecord.endIndex
        skip = nearlyRecord.beginIndex - 1
      } else {
        beginIndex = nearlyRecord.endIndex
        endIndex = nearlyRecord.endIndex + count
        skip = nearlyRecord.endIndex
      }
    }

    api.getWords(count, skip).then(items => {
      that.setData({
        beginIndex: beginIndex,
        endIndex: endIndex,
        wordlist: items,
        currentWord: items.shift()
      })
    })
    this.getAllNeedMemoryWords(records)
  },

  getAllNeedMemoryWords: function(records){
    console.log('main.js_getAllNeedMemoryWords',records)
    let recordlist = []
    let that = this
    records.map(item=>{
      if ($.needRemeber(item.nextDate)){
        item.nextDate = $.nextRemeberDate(item)
        item.nowDate = Date.now()
        count = item.endIndex - item.beginIndex + 1 
        skip = item.beginIndex - 1
        let forgetWordList = that.data.forgetWordList
        api.getWords(count, skip).then(items => {
          forgetWordList.concat(items)
          that.setData({
            forgetWordList: forgetWordList,
          })
        })
      }
    })
    this.setData({
      recordlist: records
    })
  },


  /**
   * 创建 记忆记录
   */

  creatRecord: function () {
    let params = {
      userId: wx.getStorageSync('userId'),
      startDate: Date.now(),
      nowDate: Date.now(),
      nextDate: moment(Date.now()).add(1, 'days').valueOf(),
      beginIndex: this.data.beginIndex,
      endIndex: this.data.endIndex
    }

    userApi.updateRecord(params).then(data => {
      console.log('update-------', data)
    })
  },

  updateRecord: function (record) {

    let date = moment(Date.now()).add('day', 1)
    console.log('main.js_creatRecord()', date)
    let params = {
      userId: wx.getStorageSync('userId'),
      nowDate: Date.now(),
      nextDate: moment(Date.now()).add(1, 'days').unix(),
    }

    userApi.updateRecord(params).then(data => {
      console.log('update-------', data)
    })
  },

})