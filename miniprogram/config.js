/**
 * 小程序配置文件
 */


var host = "api.funnyfm.top/api/v1";

var config = {

    // 页面常量
    page: {
        welcome: '/pages/welcome/welcome',
        main: '/pages/main/main', //首页
        setting: '/pages/setting/setting', //登录
        rule: '/pages/rule/rule', //云端同步规则
    },

    appversion: '1.0',
    appId: "wx87d316def37f03d2",
    source: 'wx_app',

    // 下面的地址配合云端 Server 工作
    host,


    /**************后台接口定义***********************/
    // 获取单词
    getWords: `https://${host}/wordlist`,
    updateUser: `https://${host}/user/updateUser`,

};
module.exports = config