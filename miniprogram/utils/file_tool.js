

const db = wx.cloud.database()


function getFirstWords(){
  db.collection('MicMillan-words')
}

function addUser(userInfo){

  wx.cloud.callFunction({
    name: 'login',
    data: {},
    success: res => {
      db.collection('users').add({
        data: {
          openId: res.result.openid,
          isEnAnnuce: true,
          isAuto:false,
          dayCount:300,
          memoryTime:'20:00'
        },
        success: function (res) {
        }
      })
    }
  })
}

function isExsit(openId) {
  db.collection('users').where({
    openId: openId,
  }).get().then(res=>{
    
  })
}







module.exports = {
  getFirstWords: getFirstWords,
  addUser: addUser,
  isExsit: isExsit
}