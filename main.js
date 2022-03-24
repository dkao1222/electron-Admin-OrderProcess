


// Modules to control application life and create native browser window
const { app, BrowserWindow, Menu ,ipcMain, ipcRenderer} = require('electron')

const path = require('path')

const menuItem = require('./mainmenu/menuitem')




let mainWindow
const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.resolve(path.join(__dirname,'./public/assist/img/UPS_logo.png')),
    webPreferences: {

      nodeIntegration: true,
      preload: path.join(__dirname, './route/preload.js')
    }
  })



  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, './views/index.html'))

  const serviceWeb = require('./route/startService');
  const serviceLocal = require('./route/startLocalService')
  //mainWindow.setIcon(path.resolve(path.join(__dirname,'./public/assist/img/ups_shield.ico')))

  //
  //ruleassignWindow.loadFile(path.join(__dirname, '.views/ruleassign.html'))


  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  ipcMain.handle('checkSapLogin', () => {
    console.log('get Textarea value to clipboard')


    const runZAVGR043 = path.resolve(__dirname, '/vbs/zavgr043.vbs')

    const check = spawn('cscript.exe', [runZAVGR043])
    
  })




}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

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