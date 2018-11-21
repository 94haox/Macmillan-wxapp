


const $ = require('../../utils/utils.js')
const config = require('../../config.js')
const userApi = require('../../api/user_api.js')
const file_tool = require('../../utils/file_tool.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: "../../images/user-unlogin.png",
    nickName:"需要您的授权获取您的微信相关信息,这对保存您的学习记录非常重要",
    showAuthor:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.isShowAuthor()
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
    }).catch(error=>{
    })
  },

  isShowAuthor: function () {
    let that = this
    wx.getSetting({
      success: (res) => {
        console.log('getSetting', res);
        if (res.authSetting['scope.userInfo'] == true) {
          wx.getUserInfo({
            success: function (res) {
              that.configUser(res.userInfo)
            },
            fail: function () {
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
            success: function (opt) {
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

})