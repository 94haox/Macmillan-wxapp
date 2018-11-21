/**
 * 小程序配置文件
 */


var host = "api.funnyfm.top/api"; 

var config = {

  // 页面常量
  page: {
    welcome:'/pages/welcome/welcome', // 欢迎页
    main: '/pages/main/main',  //首页
    setting: '/pages/setting/setting',  //登录
  },

  appversion: '0.0.1',
  appId: "wxe31a6720f732aecf",
  source: 'wx_app',

  // 下面的地址配合云端 Server 工作
  host,

  /**************后台接口定义***********************/
  // 获取单词
  getWords: `https://${host}/v1/wordlist`,
  updateUser: `https://${host}/v1/user/updateUser`,

};
module.exports = config