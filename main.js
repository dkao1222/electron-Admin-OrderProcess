


// Modules to control application life and create native browser window
const { app, Tray, BrowserWindow, Menu ,ipcMain, ipcRenderer, webContents, nativeImage} = require('electron')
const {hostGet, hostSet, hostUpdate} = require('./db/dbConfig/hostConfig')



const path = require('path')

const menuItem = require('./mainmenu/menuitem')
const { main } = require('@popperjs/core')



let mainWindow
let childWindow
const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.resolve(path.join(__dirname ,'./public/assist/img/UPS_logo.png')),
    webPreferences: {

      nodeIntegration: true,
      preload: path.join(__dirname, './route/preload.js')
    }
  })

  
  
  

  
  //mainWindow.loadURL()
  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, './views/index.html'))
  
  //mainWindow.webContents.getURL('http://127.0.0.1:3010/get/query?table=hostnameConfig')
  //mainWindow.webContents.loadURL('http://127.0.0.1:3010/get/query?table=hostnameConfig')
  //mainWindow.loadURL('http://127.0.0.1:3010/get/query?table=hostnameConfig')

  const serviceWeb = require('./route/startService');
  const serviceLocal = require('./route/startLocalService')
  //mainWindow.setIcon(path.resolve(path.join(__dirname,'./public/assist/img/ups_shield.ico')))

  //
  //ruleassignWindow.loadFile(path.join(__dirname, '.views/ruleassign.html'))


  // Open the DevTools.

  devtools = new BrowserWindow()
  mainWindow.webContents.setDevToolsWebContents(devtools.webContents)
  mainWindow.webContents.openDevTools({ mode: 'detach' }) 
  //mainWindow.webContents.openDevTools({ mode: 'detach' })
  //mainWindow.webContents.openDevTools()

  ipcMain.handle('checkSapLogin', () => {
    console.log('get Textarea value to clipboard')


    const runZAVGR043 = path.resolve(__dirname, '/vbs/zavgr043.vbs')

    const check = spawn('cscript.exe', [runZAVGR043])
    
  });

  ipcMain.handle('changeHost', () => {
    console.log('handle change')
    const os = require('os')
    hostUpdate(os.hostname().toLowerCase())
    //mainWindow.webContents.reloadIgnoringCache()

  });

  /*ipcMain.handle('createInvoice', () => {
    console.log('get command create invoice')
  })*/

  


}





// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  const icon = nativeImage.createFromPath(path.resolve(path.join(__dirname ,'./public/assist/img/UPS_logo.png')))
  tray = new Tray(icon)
  const traymenu = Menu.buildFromTemplate(menuItem)
  tray.setContextMenu(traymenu)

  

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

const menu = Menu.buildFromTemplate(menuItem)
Menu.setApplicationMenu(menu)