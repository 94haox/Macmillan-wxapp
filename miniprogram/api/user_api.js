const $ = require('../utils/utils.js')
const config = require('../config.js')


function updateUser (params) {
  return new Promise (function(resolve, reject){
    $.post(config.updateUser,params).then(res=>{
      resolve(res.detail)
    }).catch(error=>{
      reject(error)
    })
  })
}



module.exports = {
  updateUser: updateUser
}