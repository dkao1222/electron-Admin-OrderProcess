const { app, Tray, BrowserWindow, Menu, ipcMain, ipcRenderer, webContents, nativeImage } = require('electron')
const path = require('path')
const { spawn, exec, spawnSync, execSync } = require('child_process');

var os = require('os');
const host = os.hostname();

let iconPath = path.resolve(path.join(__dirname, './public/assist/img/UPS_logo.png'))
let mainWindow
let childWindow
const control_log = (hostname, logYear, logmons) => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    //width: 800,
    //height: 600,
    icon: iconPath,
    webPreferences: {
      //contextIsolation: false,
      nodeIntegration: true,
      preload: path.join(__dirname, '../route/controllog_preload.js')
    }
  })


  


  /*const runCreateNewSession = async function (tcode) {
    return new Promise(function (reject, resolve) {
      const newsssion = path.resolve(__dirname, '../vbs/createNewSapConnection.vbs')
      spawn('cscript.exe', [newsssion, tcode])
        .on('close', () => {
          console.log('vt02, script closed')
          resolve('script closed')

        })
        .on('error', () => {
          console.log('error running vbs')
          //messageBox('error', `zamtr002`, 'error running vbs zamtr002')
          reject('error')
        })
    })

  }*/

  
  ipcMain.handle('createInvoice', () => {
    console.log('get command create invoice')
    const runHUMO = path.resolve(__dirname, '../vbs/createNewSapConnection.vbs')

    const vbs = spawn('cscript.exe', [runHUMO,'/ozavgu005'])
      .on('exit', () => {
        vbs.stdout.on('data', (data) => {
          console.log(`${data}`)
        })

      })
      .on('close', () => {
        console.log('script closed')
        //resolve()

      })
      .on('error', () => {
        console.log('error running vbs')
        //messageBox('error', `zamtr002`, 'error running vbs zamtr002')
      })

    
  


  })

  
  mainWindow.loadURL(`http://${hostname}:3000/get/dashboard?function=control_log_regulartw&queryDate=${logYear + '-' + logmons}&pagesize=100&currentPage=1`)
  mainWindow.webContents.openDevTools({ mode: 'detach' })
  //mainWindow.show()



}

module.exports = { control_log }
