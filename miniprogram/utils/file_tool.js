
function getAllWords(){
    // let content = wx.getFileSystemManager().readFile('../file/7000Words.json')
    let content = wx.getSavedFileList({
        success(res){
            console.log(res)
        }
    })
    wx.saveFile({
        tempFilePath: '',
    })
    // console.log(content)
}





module.exports = {
    getAllWords: getAllWords
}