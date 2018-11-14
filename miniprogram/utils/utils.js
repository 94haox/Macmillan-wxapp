/**
 *  BK 创建于 2018/1/21
 * 
 * 使用条件：
 *  1、storage里需要定义 usertoken
 *  2、config.js 位于上级目录，需要定义 ver,source 等常量
 */


// const md5 = require('md5')
// const config = require('../config')
// const errorCode = require('./errorCode')
const ver = config.appversion
const source = config.source
const appId = config.appId
let appInstance


function getAppInstance(app){
    console.log('instance_____',app)
    appInstance = app
}


// 手机号判断
function isMobile(number) {
    var reg = /^1[3|4|5|6|7|8|9][0-9]{9}$/;
    return reg.test(number)
}

// 提示框
function alert(content, showCancel = false) {
    wx.showModal({
        content: content,
        showCancel: showCancel
    })
}

// 确认框
function confirm(title = '提示', content, yesCallback, noCallback) {
    wx.showModal({
        title: title,
        content: content,
        success: function (res) {
            if (res.confirm)
                yesCallback()
            else if (res.cancel) {
                if (noCallback)
                    noCallback()
            }
        }
    })
}

function analysisQRCode(url) {
    url = url == null ? window.location.href : url;
    var qs = url.substring(url.lastIndexOf("?") + 1);
    var args = {};
    var items = qs.length > 0 ? qs.split('&') : [];
    var item = null;
    var name = null;
    var value = '';
    for (var i = 0; i < items.length; i++) {

        item = items[i].split("=");
        //用decodeURIComponent()分别解码name 和value（因为查询字符串应该是被编码过的）。
        name = decodeURIComponent(item[0]);
        if (item.length > 2) {
            for (var a = 1; a < item.length; a++) {
                if (a == (item.length - 1)) {
                    value += decodeURIComponent(item[a]);
                } else {
                    value += decodeURIComponent(item[a] + '=');
                }

            }
        } else {
            value = decodeURIComponent(item[1]);
        }

        if (name.length) {
            args[name] = value;
        }
    }
    return args;
}

// loading
function showLoading(title, timeInterval = 2000) {
    // return wxPromise(wx.showLoading)({
    //     title: title || '加载中'
    // })

    wx.showLoading({
        title: title || '加载中'
    })

    setTimeout(function () {
        wx.hideLoading()
    }, timeInterval)
}

function hideLoading() {
    wx.hideLoading()
}

function showToast(msg, icon = "none") {
    wx.showToast({
        title: msg,
        icon: icon
    })
}

/*
    页面跳转
    url： 路径
    closePage: 是否需要关闭当前页面 true 需要， false 不需要
*/
function goto(url, closePage = false) {
    if (closePage) {
        wx.redirectTo({
            url: url
        })
    } else {
        wx.navigateTo({
            url: url
        })
    }
}

function setTitle(title) {
    wx.setNavigationBarTitle({
        title: title
    })
}

function uuid() {
    var lut = [];
    for (var i = 0; i < 256; i++) { lut[i] = (i < 16 ? '0' : '') + (i).toString(16); }
    var d0 = Math.random() * 0xffffffff | 0;
    var d1 = Math.random() * 0xffffffff | 0;
    var d2 = Math.random() * 0xffffffff | 0;
    var d3 = Math.random() * 0xffffffff | 0;
    return lut[d0 & 0xff] + lut[d0 >> 8 & 0xff] + lut[d0 >> 16 & 0xff] + lut[d0 >> 24 & 0xff] +
        lut[d1 & 0xff] + lut[d1 >> 8 & 0xff] + lut[d1 >> 16 & 0x0f | 0x40] + lut[d1 >> 24 & 0xff] +
        lut[d2 & 0x3f | 0x80] + lut[d2 >> 8 & 0xff] + lut[d2 >> 16 & 0xff] + lut[d2 >> 24 & 0xff] +
        lut[d3 & 0xff] + lut[d3 >> 8 & 0xff] + lut[d3 >> 16 & 0xff] + lut[d3 >> 24 & 0xff];
}

function wxPromise(wxFun) {
    return obj => {
        obj = obj || {}
        return new Promise((resolve, reject) => {
            obj.success = function (res) {
                // wx.hideLoading()
                if (res.data === undefined) {
                    resolve(res.data)
                    return;
                }
                let ercode = JSON.stringify(res.data.code);

                if (ercode == errorCode.USER_TOKEN_IS_UNVALID || ercode == errorCode.TOKEN_IS_NULL || ercode == errorCode.USERID_IS_EMPTY || ercode == errorCode.USER_NOT_FOUND) {
                    wx.hideLoading();
                    if (wx.getStorageSync("isLogin")){
                        wx.setStorageSync('isLogin', false)
                        goto(config.page.login)
                        // appInstance.callUserCheck().then(data => {
                        //     resolve(data)
                        // }).catch(error => {
                        // goto(config.page.login)
                        //     reject(error)
                        // })
                        // return
                    }

                    reject(res)
                }
                resolve(res.data)
            }
            obj.fail = function (res) {
                wx.hideLoading()
                reject(res)
            }

            wxFun(obj)
        })
    }
}

function subChineseString(str, len, hasDot) {
    var newLength = 0;
    var newStr = "";
    var chineseRegex = /[^\x00-\xff]/g;
    var singleChar = "";
    var strLength = str.replace(chineseRegex, "**").length;
    for (var i = 0; i < strLength; i++) {
        singleChar = str.charAt(i).toString();
        if (singleChar.match(chineseRegex) != null) {
            newLength += 2;
        } else {
            newLength++;
        }
        if (newLength > len) {
            break;
        }
        newStr += singleChar;
    }

    if (hasDot && strLength > len) {
        newStr += "...";
    }
    return newStr;
}

function getUrl(url, params) {
    url = url.replace('//', '/').replace('//', '/').replace(':/', '://'); //TODO 需后续统一url请求统一去掉//    

    if (!url.endsWith('?')) url += '?'

    for (let key in params) {
        if (typeof (params[key]) !== 'object') {
            url += key + '=' + encodeURIComponent(params[key]) + '&'
        } else {
            url += key + '=' + encodeURIComponent(JSON.stringify(params[key])) + '&'
        }
    }

    if (url.endsWith('&')) url = url.substr(0, url.length - 1)

    return url
}

// 存储formId
function uploadFormid(hostUrl, appid, currentFormid = 'the formId is a mock one') {
    console.log("uploadFormid---------------",currentFormid)
    if (currentFormid != 'the formId is a mock one') {
        let url = hostUrl + 'wxapp/saveMsgFormId'
        let data = {
            formId: currentFormid,
            userid: wx.getStorageSync("userid"),
            appid: appid
        }
        post(url, data).then(data => {
            console.log("uploadFormid------success---------", data)
        }).catch(error => {
        })
    }

    

}

function isNullOrEmpty(param) {
    if (typeof param === 'object') {
        for (let name in param) {
            return false    //不是空对象
        }
        return true
    }

    if (param === 'undefined' || param === null || param === '')
        return true

    return false
}

/*****************************************************************
 *  OSS
 *****************************************************************/

function uploadToOSS(source) {
    return new Promise(function (resolve, reject) {
        prepareUpload()
            .then(sts => {
                uploadImage(sts, source).then(data => {
                    resolve(data)
                }).catch(error => {
                    reject(error)
                })
            })
            .catch(error => {
                reject(error)
            })
    })

}

function prepareUpload() {

    return new Promise(function (resolove, reject) {
        let data = {
            'usertoken': wx.getStorageSync('usertoken'),
            'userid': wx.getStorageSync('userid')
        }
        post(config.getOssSts, data)
            .then(data => {
                resolove(data.detail)
            })
            .catch(error => {
                reject(error)
            })
    })

}


function uploadImage(sts, source) {
    return new Promise(function (resolve, reject) {
        let filename = Date.parse(new Date()) + '.png'
        let fullNmae = sts.host + "/"+ sts.dir + filename

        let params = {
            "key": sts.dir + filename,
            "OSSAccessKeyId": sts.accessid,
            "policy": sts.policy,
            'success_action_status': '200',
            "signature": sts.signature
        };
        console.log(sts)
        wx.uploadFile({
            url: sts.host,
            filePath: source,
            name: 'file',
            formData: params,
            success: res => {
                resolve(fullNmae)
            },
            fail: error => {
                reject(error)
            }
        })
    })

}





/*****************************************************************
 *  AJAX: GET/POST/PUT/DELETE
 *****************************************************************/
function getHeader(url, data = '') {

    if (!isNullOrEmpty(data)) {
        if (typeof data == 'object') data = JSON.stringify(data)
    }

    let key = wx.getStorageSync('usertoken') || 'worldbang'
    let ts = Date.parse(new Date())
    let sourceData = key + appId + ts + url + data
    let sign = md5(sourceData)
    // console.log(`# sourceData = ${sourceData}`)
    // console.log(`# key = ${key}`)
    // console.log(`# appId = ${appId}`)
    // console.log(`# ts = ${ts}`)
    // console.log(`# url  = ${url}`)
    // console.log(`# source  = ${source}`)
    console.warn(`# sign=${sign}`)

    return {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        ver: ver,
        source: source,
        ts: ts,
        token: key,
        appId: appId,
        sign: sign,
        url: url
    }
}

function get(url, showLoading=false) {
    if (showLoading){
        wx.showLoading({
            title: '正在加载中...',
        })
    }
    console.log(`url : [${url}]`);
    return wxPromise(wx.request)({
        method: 'GET',
        dataType: 'json',
        url: url,
        header: getHeader(url)
    })
}

function post(url, data) {
    return wxPromise(wx.request)({
        method: 'POST',
        dataType: 'json',
        url: url,
        data: data,
        header: getHeader(url, data)
    })
}

function put(url) {
    return wxPromise(wx.request)({
        method: 'PUT',
        dataType: 'json',
        url: url,
        header: getHeader(url)
    })
}

function del(url) {
    return wxPromise(wx.request)({
        method: 'DELETE',
        dataType: 'json',
        url: url,
        header: getHeader(url)
    })
}

/*****************************************************************
 *  EXPORT
 *****************************************************************/
module.exports = {
    get: get,
    post: post,
    put: put,
    del: del,

    uuid: uuid,
    isMobile: isMobile,   // 判断是否是手机号码
    subChineseString: subChineseString,    // 截取中文汉字，一个字是两个字符
    getUrl: getUrl,   // 生成url，支持传入json对象
    getHeader: getHeader,

    alert: alert,
    confirm: confirm,
    setTitle: setTitle,
    goto: goto,

    showLoading: showLoading,
    hideLoading: hideLoading,
    showToast: showToast,

    uploadFormid: uploadFormid,
    analysisQRCode: analysisQRCode,
    isNullOrEmpty: isNullOrEmpty,

    uploadToOSS: uploadToOSS,
    getAppInstance: getAppInstance
}
