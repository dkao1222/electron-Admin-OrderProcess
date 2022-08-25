const { contextBridge, ipcRenderer, webContents, net } = require('electron');

const { hostGet, hostSet } = require('../db/dbConfig/hostConfig')
var os = require('os');


// 所有Node.js API都可以在预加载过程中使用。
contextBridge.exposeInMainWorld('callSAP', {

    checkSAPlogin: () => ipcRenderer.invoke('checkSapLogin'),
    changeHost: () => ipcRenderer.invoke('changeHost'),
    createInvoice: () => ipcRenderer.invoke('createInvoice')



})

onload = () => {
    hostGet().then(async function (response) {

        console.log(response)
        if (response[0].Status == 1) {
            console.log('index, c')
            document.getElementById('hostname').innerHTML = os.hostname().toLowerCase();
            document.getElementById('myNaame').innerHTML = response[0].hostname
            if (os.hostname().toLowerCase() !== response[0].hostname) {
                document.getElementById('serverStus').innerHTML = 'Please check your Server Address'
            } else {
                document.getElementById('serverStus').innerHTML = 'Server'
            }




        } else {
            console.log('index, d')
            document.getElementById('hostname').innerHTML = response[0].hostname
            document.getElementById('myNaame').innerHTML = response[0].hostname

            document.getElementById('serverStus').innerHTML = 'Client'


        }


    });




}

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

