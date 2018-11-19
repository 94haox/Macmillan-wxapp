
const db = wx.cloud.database()

function addUser(userInfo){
  return new Promise(function (resolve, reject) {
    db.collection('users').add({
      data: {
        openId: res.result.openid,
        nickName: userInfo.nickName,
        isEnAnnuce: true,
        isAuto: false,
        dayCount: 300,
        memoryTime: '20:00'
      }
    }).then(res=>{
      resolve(res)
    }).catch(error=>{
      reject(error)
    })
  })
}

function isExsit(openId) {
  return new Promise(function(resolve, reject){
    db.collection('users').where({
      openId: openId,
    }).get().then(res => {
      resolve(res)
    }).catch(error=>{
      reject(error)
    })
  })
}







module.exports = {
  addUser: addUser,
  isExsit: isExsit
}