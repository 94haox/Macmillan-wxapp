
const $ = require('../utils/utils.js')
const config = require('../config.js')

function getWords(count=300, skip=0){
  return new Promise(function (resolve, reject) {
    let url = $.getUrl(config.getWords, { 'count': count, 'skip': skip })
    let words = $.get(url).then(res=>{
      resolve(res['items'])
    }).catch(error=>{
      reject(error)
    })
  })
  

}




module.exports = {
  getWords: getWords
}