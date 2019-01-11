// miniprogram/pages/feedback/feedback.js

const config = require('../../config.js')
const userApi = require('../../api/user_api.js')
const $ = require('../../utils/utils.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    title:'',
    content:''
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

  titleInput: function (e){

    this.setData({
      title: e.detail.value
    })
  },

  contentInput: function (e) {
    this.setData({
      content: e.detail.value
    })
  },

  formSubmit: function (e) {
    console.log(this.data.content, this.data.title)
    if(this.data.content.length < 1 || this.data.title.length < 1){
      $.showToast('请填写内容')
      return
    }

    let params = {
      userId: wx.getStorageSync('userId'),
      title:this.data.title,
      content: this.data.content
    }
    $.showLoading()
    $.post(config.createFeedback,params).then(data =>{
      $.showToast('提交成功', 'success')
      setTimeout(function () {
        wx.navigateBack({
        })
      }, 1500)
    }).catch(error=>{

    })

  }
  
})