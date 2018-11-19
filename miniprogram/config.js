/**
 * 小程序配置文件
 */


var host = "api.funnyfm.top/api/v1"; 

var config = {

  // 页面常量
  page: {
    main: '/pages/main/main',  //首页
    setting: '/pages/setting/setting',  //登录
  },

  appversion: '0.1',
  appId: "wx87d316def37f03d2",
  source: 'wx_app',

  // 下面的地址配合云端 Server 工作
  host,


  /**************后台接口定义***********************/
  // 获取单词
  getWords: `https://${host}/wordlist`,

};
module.exports = config