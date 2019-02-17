/**
 * 小程序配置文件
 */


var host = "api.funnyfm.top/api"; 
var hostPrefix = 'https'
// var host = '127.0.0.1:7001/api'
// var hostPrefix = 'http'
var config = {

  // 页面常量
  page: {
    welcome:'/pages/welcome/welcome', // 欢迎页
    main: '/pages/main/main',  //首页
    setting: '/pages/setting/setting',  //登录
    feedback: '/pages/feedback/feedback',  //反馈
    rule: '/pages/rule/rule', //云端同步规则
  },

  appversion: '1.0.1',
  appId: "wxe31a6720f732aecf",
  source: 'wx_app',

    // 下面的地址配合云端 Server 工作
    host,

  /**************后台接口定义***********************/
  // 获取单词
  getWords: `${hostPrefix}://${host}/v1/wordlist`,
  updateUser: `${hostPrefix}://${host}/v1/user/updateUser`,
  updateRecord: `${hostPrefix}://${host}/v1/user/updateRecord`,
  getRecords: `${hostPrefix}://${host}/v1/user/getRecords`,
  createFeedback: `${hostPrefix}://${host}/v1/user/createFeedback`,

};
module.exports = config