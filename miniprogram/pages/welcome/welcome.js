const $ = require('../../utils/utils.js')
const config = require('../../config.js')
const userApi = require('../../api/user_api.js')
const file_tool = require('../../utils/file_tool.js')
const moment = require('moment');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: "../../images/user-unlogin.png",
    nickName:"需要您的授权获取您的微信相关信息,这对保存您的学习记录非常重要",
    showAuthor:true,
    btnTitle:'开始记忆'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.isShowAuthor()
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let word = wx.getStorageSync('today')
        if (word) {
            console.log('word', word)
            this.setData({
                btnTitle: "继续记忆"
            })
        }
  },

  toMain: function () {
    $.goto(config.page.main, true)
  },

  getUserInfo: function (e) {
    this.configUser(e.detail.userInfo)
  },

  configUser: function (userInfo) {
    let that = this
    this.setData({
      avatarUrl: userInfo.avatarUrl,
      nickName: userInfo.nickName,
      showAuthor: false
    })
    wx.setStorageSync('userinfo', userInfo);
    let openid = wx.getStorageSync('openId')
    if(openid.length < 1){
      $.callCloud('login').then(res => {
        let openid = res.openid
        wx.setStorageSync('openId', openid)
        that.updateUser(userInfo,openid)
      })
    }else{
      that.updateUser(userInfo, openid)
    }
  },

  updateUser: function (userInfo,openid) {
    let params = {
      openId: openid,
      nickName: userInfo.nickName,
      avatarUrl: userInfo.avatarUrl,
    }
    userApi.updateUser(params).then(res=>{
      wx.setStorageSync('currentUser', res)
      wx.setStorageSync('userId', res._id)
    }).catch(error=>{
    })
  },

    toMain: function() {
        let word = wx.getStorageSync('today')
        if (word) {
            $.goto(config.page.main + '?wordId=' + word._id, true)
            return;
        }
        $.goto(config.page.main, true)
    },

    toRule: function() {
        $.goto(config.page.rule)
    },

    getUserInfo: function(e) {
        this.configUser(e.detail.userInfo)
    },

    configUser: function(userInfo) {
        let that = this
        this.setData({
            avatarUrl: userInfo.avatarUrl,
            nickName: userInfo.nickName,
            showAuthor: false
        })
        wx.setStorageSync('userinfo', userInfo);
        let openid = wx.getStorageSync('openId')
        if (openid.length < 1) {
            $.callCloud('login').then(res => {
                let openid = res.openid
                wx.setStorageSync('openId', openid)
                that.updateUser(userInfo, openid)
            })
        } else {
            that.updateUser(userInfo, openid)
        }
    },

    updateUser: function(userInfo, openid) {
        let params = {
            openId: openid,
            nickName: userInfo.nickName,
            avatarUrl: userInfo.avatarUrl,
        }
        console.log(params)
        userApi.updateUser(params).then(res => {
            wx.setStorageSync('currentUser', res)
            wx.setStorageSync('userId', res._id)
        }).catch(error => {

        })
    },

    isShowAuthor: function() {
        let that = this
        wx.getSetting({
            success: (res) => {
                console.log('getSetting', res);
                if (res.authSetting['scope.userInfo'] == true) {
                    wx.getUserInfo({
                        success: function(res) {
                            that.configUser(res.userInfo)
                        },
                        fail: function() {
                            that.setData({
                                showAuthor: true
                            })
                        }
                    })
                } else {
                    that.setData({
                        showAuthor: true
                    })
                }
                if (res.authSetting['scope.userInfo'] == false || res.authSetting['scope.userLocation'] == false) {
                    wx.showModal({
                        title: '提示',
                        content: '需要您设置用户授权才能体验哦~',
                        showCancel: false,
                        confirmText: '去设置',
                        success: function(opt) {
                            wx.openSetting({
                                success: (res) => {
                                    that.getUserInfo();
                                }
                            });
                        }
                    });
                }
            },
        });

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {
        return {
            title: '麦克米伦7000词-最常用的英语7000词',
            // imageUrl: '../../images/user-unlogin.png',
            path: config.page.welcome,
            success: function (res) {
            },
            fail: function (res) {
                // 转发失败
                console.log("fail");
            }
        }
    }

})