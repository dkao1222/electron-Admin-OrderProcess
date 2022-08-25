const { dialog } = require('electron')


const messageBox = function (type, title, message) {
    dialog.showMessageBox(
        null,
        {
            type: type,
            title: title,
            message: message
        }
    )
}

module.exports = { messageBox }