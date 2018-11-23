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


function updateRecord(params) {
  return new Promise(function (resolve, reject) {
    $.post(config.updateRecord, params).then(res => {
      resolve(res.detail)
    }).catch(error => {
      reject(error)
    })
  })
}

function getRecords (params) {
  return new Promise(function (resolve, reject) {
    let url = $.getUrl(config.getRecords,params)
    $.get(url).then(res => {
      resolve(res.detail)
    }).catch(error => {
      reject(error)
    })
  })
}



module.exports = {
  updateUser: updateUser,
  getRecords: getRecords,
  updateRecord: updateRecord
}