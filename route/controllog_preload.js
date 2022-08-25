const { contextBridge, ipcRenderer, webContents, net } = require('electron');


var os = require('os');


// 所有Node.js API都可以在预加载过程中使用。
contextBridge.exposeInMainWorld('callSAP', {

    createInvoice: () => ipcRenderer.invoke('createInvoice')

})



// 它拥有与Chrome扩展一样的沙盒。
window.addEventListener('DOMContentLoaded', () => {

    const replaceText = (selector, text) => {
        const element = document.getElementById(selector)
        if (element) element.innerText = text
    }



    for (const dependency of ['chrome', 'node', 'electron']) {
        replaceText(`${dependency}-version`, process.versions[dependency])

    }
    //getConfig()

})

