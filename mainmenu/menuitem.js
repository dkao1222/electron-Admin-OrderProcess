const { Menu, BrowserWindow, BrowserView, dialog } = require('electron')
const mainwindow_controllog = require('../mainmenu/mainwindow_controllog')

var os = require('os');
const host = os.hostname();
const fs = require('fs')
const path = require('path');


const { spawn, exec, spawnSync, execSync } = require('child_process');
const { all_dowload } = require('../source/locl_importData')
const sqlite3 = require('sqlite3').verbose()

const templateMenu = [
    {
        label: "JOB",
        submenu: [
            {
                label: "Data Download",
                submenu: [
                    {
                        label: "ALL",
                        click: async () => {
                            //let startTime, endTime;
                            //startTime = performance.now();
                            all_dowload();
                            //endTime = performance.now();
                            //console.debug('Data Download All Elapsed time:', (endTime - startTime));
                        }

                    }
                ]
            },
            {
                label: "ZAVGR043",
                click: async () => {
                    const { spawn } = require('child_process')
                    const { ZAVGR043_Pares, LT22_Pares } = require('../source/csv-test')
                    const { clipboard } = require('electron')
                    const { getPosts } = require('../db/dbConfig/dbMain')

                    const runZavgr043 = async function () {
                        console.log('into ZAVGR043')
                        return new Promise(function (resolve, reject) {
                            console.log('zavgr043')
                            const runZAVGR043 = path.resolve(__dirname, '../vbs/zavgr043.vbs')
                            const vbs = spawn('cscript.exe', [runZAVGR043, 'x076559', '-1', 'ZAVGR043.txt', path.resolve(__dirname, '../temp')])
                                .on('exit', () => {
                                    vbs.stdout.on('data', (data) => {
                                        console.log(`${data}`)
                                    })

                                })
                                .on('close', () => {
                                    console.log('script closed')
                                    resolve('script closed')

                                })
                                .on('error', () => {
                                    console.log('error running vbs')
                                    reject('error running vbs')

                                })
                        })

                    }


                    try {
                        if (fs.existsSync(path.resolve(__dirname, '../temp/ZAVGR043.txt'))) {
                            fs.unlinkSync(path.resolve(__dirname, '../temp/ZAVGR043.txt'))

                        }
                    } catch (err) {
                        console.error(err)
                    }

                    runZavgr043().then(async function () {
                        await ZAVGR043_Pares('ZAVGR043.txt').then(function (result) {
                            console.log('status:' + result)

                        })
                    })

                }

            },
            {
                label: "LT22",
                click: async () => {
                    const { spawn } = require('child_process')
                    const { ZAVGR043_Pares, LT22_Pares } = require('../source/csv-test')
                    const { clipboard } = require('electron')
                    const { getPosts } = require('../db/dbConfig/dbMain')

                    const callGetDelivert = function () {
                        return new Promise(async function (resolve, reject) {
                            await getPosts('select Delivery from ZAVGR043_Temp where Delivery is not null limit 2000;')
                                .then(function (response) {
                                    var tempArr = []
                                    response.forEach(row => {
                                        //console.log(row.Delivery)
                                        fs.appendFileSync(path.resolve(__dirname, '../temp/delivery_info.txt'), row.Delivery.toString() + '\n', function (err) {
                                            if (err) throw err;
                                            //console.log('Saved!');
                                        })
                                    })
                                    resolve();
                                }).catch(err => {
                                    console.log(err)
                                    reject();
                                })

                        })
                    }


                    const callGetClipboard = function () {
                        return new Promise(function (resolve, reject) {
                            exec(`get-content ${path.resolve(__dirname, '../temp/delivery_info.txt')} | set-clipboard`, { 'shell': 'powershell.exe' }, (error) => {
                                // do whatever with stdout
                                if (error) {
                                    console.log(error)
                                    reject();
                                }
                            }).on('close', () => {
                                resolve();

                                console.log('get Clipboard')

                            })
                        })
                    }


                    const callLT22 = function (plants) {
                        return new Promise(async function (resolve, reject) {



                            const runLT22 = path.resolve(__dirname, '../vbs/LT22.vbs')
                            spawn('cscript.exe', [runLT22, plants, '/kathia', 'LT22.txt', path.resolve(__dirname, '../temp')])
                                .on('exit', (code) => {
                                    console.log('exit code (' + code + ')')
                                })
                                .on('close', () => {
                                    console.log('script closed');
                                    resolve();
                                    //await LT22_Pares('LT22.txt')
                                })
                                .on('error', () => {
                                    console.log('error running vbs')

                                    reject();
                                })


                        })
                    }
                    const plant = ['540', '542', '544', '891', '892', '895', '893', '896', '317']
                    callGetDelivert().then(function () {
                        callGetClipboard().then(async function () {
                            for await (const plants of plant) {
                                await callLT22(plants).then(async function () {
                                    try {
                                        if (fs.existsSync(path.resolve(__dirname, '../temp/LT22.txt'))) {
                                            console.log('import LT22 data')
                                            await LT22_Pares('LT22.txt').then(function () {
                                                console.log('import LT22 done')
                                            })


                                        }
                                    } catch (err) {
                                        console.error(err)

                                    }
                                })
                            }
                        })
                    })


                }
            },
            {
                label: "HUMO"
            },
            {
                label: "Manifest"
            }
        ]
    },
    {
        label: "Report",
        submenu: [
            {
                label: "Control Log(Downs)",
                click: async () => {
                    const { shell } = require('electron')
                    const Dates = new Date()
                    var years = Dates.getFullYear();
                    var mons = (Dates.getMonth() + 1).toString().length > 1 ? (Dates.getMonth() + 1) : "0" + (Dates.getMonth() + 1)
                    try{
                        await shell.openExternal(`microsoft-edge:http://${host}:3000/get/dashboard?function=control_log_downs&queryDate=${years + '-' + mons}&pagesize=100&currentPage=1`)
                    } catch (err) {
                        console.log(err)
                        await shell.openExternal(`http://${host}:3000/get/dashboard?function=control_log_downs&queryDate=${years + '-' + mons}&pagesize=100&currentPage=1`)
                    }
                    
                }
            },
            {
                label: "Control Log(54 Regular nTW)",
                click: async () => {
                    const { shell } = require('electron')
                    const Dates = new Date()
                    var years = Dates.getFullYear();
                    var mons = (Dates.getMonth() + 1).toString().length > 1 ? (Dates.getMonth() + 1) : "0" + (Dates.getMonth() + 1)
                    try{
                        await shell.openExternal(`microsoft-edge:http://${host}:3000/get/dashboard?function=control_log_regular&queryDate=${years + '-' + mons}&pagesize=100&currentPage=1`)
                    } catch (err) {
                        console.log(err)
                        await shell.openExternal(`http://${host}:3000/get/dashboard?function=control_log_regular&queryDate=${years + '-' + mons}&pagesize=100&currentPage=1`)
                    }
                    
                }
            },
            {
                label: "Control Log(54 Regular TW)",
                click: async () => {
                    const { shell } = require('electron')
                    const Dates = new Date()
                    var years = Dates.getFullYear();
                    var mons = (Dates.getMonth() + 1).toString().length > 1 ? (Dates.getMonth() + 1) : "0" + (Dates.getMonth() + 1)
                    try{
                        await shell.openExternal(`microsoft-edge:http://${host}:3000/get/dashboard?function=control_log_regulartw&queryDate=${years + '-' + mons}&pagesize=100&currentPage=1`)
                    } catch (err) {
                        console.log(err)
                        await shell.openExternal(`http://${host}:3000/get/dashboard?function=control_log_regulartw&queryDate=${years + '-' + mons}&pagesize=100&currentPage=1`)
                    }
                    
                }
            },
            {
                label: "Control Log(AMT Regular)",
                click: async () => {
                    const { shell } = require('electron')
                    const Dates = new Date()
                    var years = Dates.getFullYear();
                    var mons = (Dates.getMonth() + 1).toString().length > 1 ? (Dates.getMonth() + 1) : "0" + (Dates.getMonth() + 1)
                    try{
                        await shell.openExternal(`microsoft-edge:http://${host}:3000/get/dashboard?function=control_log_amt&queryDate=${years + '-' + mons}&pagesize=100&currentPage=1`)
                    } catch (err) {
                        console.log(err)
                        await shell.openExternal(`http://${host}:3000/get/dashboard?function=control_log_amt&queryDate=${years + '-' + mons}&pagesize=100&currentPage=1`)
                    }
                    
                }
            },
            {
                label: "Control Log(AMT Downs)",
                click: async () => {
                    const { shell } = require('electron')
                    const Dates = new Date()
                    var years = Dates.getFullYear();
                    var mons = (Dates.getMonth() + 1).toString().length > 1 ? (Dates.getMonth() + 1) : "0" + (Dates.getMonth() + 1)
                    try{
                        await shell.openExternal(`microsoft-edge:http://${host}:3000/get/dashboard?function=control_log_amt_downs&queryDate=${years + '-' + mons}&pagesize=100&currentPage=1`)
                    } catch (err) {
                        console.log(err)
                        await shell.openExternal(`http://${host}:3000/get/dashboard?function=control_log_amt_downs&queryDate=${years + '-' + mons}&pagesize=100&currentPage=1`)
                    }
                    
                }
            },
            {
                label: "ZAVGR043_Temp",
                click: async () => {
                    const { shell } = require('electron')
                    try{
                        await shell.openExternal('microsoft-edge:http://' + host + ':3000/get/dashboard/?function=temp_history')
                    } catch (err) {
                        console.log(err)
                        await shell.openExternal('http://' + host + ':3000/get/dashboard/?function=temp_history')
                    }
                    
                }
            }
        ]
    },
    {
        label: "Option",
        submenu: [
            {
                label: "Shipping Dashboard (Non Completed)",
                click: async () => {
                    const { shell } = require('electron')
                    const Dates = new Date()
                    var years = Dates.getFullYear();
                    var mons = (Dates.getMonth() + 1).toString().length > 1 ? (Dates.getMonth() + 1) : "0" + (Dates.getMonth() + 1)
                    try{
                        await shell.openExternal(`microsoft-edge:http://${host}:3000/get/dashboard?function=dashboard`)
                    }catch(err) {
                        console.log(err)
                        await shell.openExternal(`http://${host}:3000/get/dashboard?function=dashboard`)
                    }
                    
                }
            },
            {
                label: "HAWB Assignment Rule",
                click: () => {
                    const ruleassignWindow = new BrowserWindow({
                        width: 800,
                        height: 600,
                        webPreferences: {
                            //sandbox: true,
                            nodeIntegration: true,
                            //preload: path.join(__dirname, '../public/function/ruleassign.js')

                        }
                    })

                    // and load the index.html of the app.
                    ruleassignWindow.loadFile(path.resolve(path.join(__dirname, '../views/ruleassign.html')))


                    //
                    //ruleassignWindow.loadFile(path.join(__dirname, '.views/ruleassign.html'))


                    // Open the DevTools.
                    ruleassignWindow.webContents.openDevTools()
                    ruleassignWindow.removeMenu();
                }
            },
            {
                label: "Batch Import HAWB(Host only)",
                click: () => {
                    
                    const savedialog =  dialog.showOpenDialog(null,{
                        //defaultPath: path.resolve(__dirname,'../db/main.db'),
                        title:'Import HAWB',
                        message: 'Please find you HAWB file, file type most is .xlsx',
                        filters: [
                            {
                                name:'*',
                                extensions:['xlsx','xls']
                            }
                        ],
                        multiSelections: false

                    }).then(result => {
                        if (result.canceled) {
                            console.log('使用者關閉 SaveDialog')
                        } else {
                            let checkExt = path.extname(result.filePaths[0])
                            console.log(path.extname(result.filePaths[0]))
                            const Excel = require('exceljs')
                            let db = new sqlite3.Database(path.resolve(__dirname, '../db/main.db'), sqlite3.OPEN_READWRITE)
                            var workbook = new Excel.Workbook(); 
                            workbook.xlsx.readFile(result.filePaths[0])
                                .then(async function() {
                                    var worksheet = workbook.getWorksheet();
                                    //var worksheet = workbook.getWorksheet("Sheet3");
                                    
                                    worksheet.eachRow({ includeEmpty: true }, function(row, rowNumber) {
                                        //console.log( JSON.stringify(row.values))
                                        console.log(row.values[1] +','+ row.values[2])
                                        db.serialize(function() {
                                            db.run(`insert INTO HAWB_Primary (Vendor, HAWB) values ('${row.values[1]}','${row.values[2]}')`, function(err, rows){
                                                if(err) {
                                                    console.log(err)
                                                    dialog.showMessageBox(
                                                        null,
                                                        {
                                                            type: 'warning',
                                                            title: 'HAWB import error',
                                                            message: `Duplicate HAWB: ${row.values[1] +' '+ row.values[2] }`
                                                        }
                                                    )
                                                }
                                            })
                                            db.exec(`delete from HAWB_Primary where Vendor = 'Vendor' or Vendor like 'Sample%'`)
                                            db.exec(`Update HAWB_Primary
                                            set Vendor = t.Vendor
                                            from (
                                                select * from HAWB_Import_Check
                                            ) t
                                            where HAWB_Primary.Vendor = 'CEVA'
                                            and substr(HAWB_Primary.HAWB,1,1) = t.Start_With`, function( err, rows) {
                                                if(err) {
                                                    console.log(err)
                                                }
                                            })
                                        })
                                        
                                    });
                                    //db.close
                                    dialog.showMessageBox(
                                        null,
                                        {
                                            type: 'info',
                                            title: 'HAWB import done',
                                            message: `HAWB has been import`
                                        }
                                    )
                                });
                                
                                
                            
                        }
                    })

                }
            },
            {
                label: "Service Assign Rule",
                click: () => {
                    const ruleassignWindow = new BrowserWindow({
                        width: 800,
                        height: 600,
                        webPreferences: {
                            //sandbox: true,
                            nodeIntegration: true,
                            //preload: path.join(__dirname, '../public/function/ruleassign.js')

                        }
                    })

                    // and load the index.html of the app.
                    ruleassignWindow.loadFile(path.resolve(path.join(__dirname, '../views/serviceassign.html')))


                    //
                    //ruleassignWindow.loadFile(path.join(__dirname, '.views/ruleassign.html'))


                    // Open the DevTools.
                    //ruleassignWindow.webContents.openDevTools()
                    ruleassignWindow.removeMenu();
                }
            },
            {
                label: "Server Option(Host only)",
                submenu: [
                    {
                        label: "DB Backup",
                        click: () => {
                            const savedialog = dialog.showSaveDialog(null,{
                                defaultPath: path.resolve(__dirname,'../db/main.db'),
                                title:'DB Main file backup',
                            }).then(result => {
                                console.log(result)
                                if (result.canceled) {
                                    console.log('使用者關閉 SaveDialog')
                                } else {
                                    console.log(result.filePath)
                                    fs.copyFile(path.resolve(__dirname,'../db/main.db'), result.filePath,(err) => {
                                        if(err) {
                                            dialog.showMessageBox(
                                                null,
                                                {
                                                    type: 'warning',
                                                    title: 'DB Backup',
                                                    message: 'Failed backup your file, please re-try',
                                                }
                                            )
                                        } else {
                                            dialog.showMessageBox(
                                                null,
                                                {
                                                    type: 'info',
                                                    title: 'DB Backup',
                                                    message: `DB file has been copy to ${result.filePath}`
                                                }
                                            )
                                        }
                                    })
                                    
                                }

                            }) 

                            //fs.copyFile(path.resolve(__dirname,'/db/main.db'), filename['filePath'])
                            
                            /*.then(function(filePath){
                                console.log(filePath)
                                fs.copyFile(path.resolve(__dirname,'/db/main.db'), filePath.filePath)
                            })
                            */

                            
                            
                        }
                    },
                    {
                        label: "DB Restore",
                        click: () => {
                            const savedialog = dialog.showOpenDialog(null,{
                                defaultPath: path.resolve(__dirname,'../db/main.db'),
                                title:'DB Main file restore',
                                message: 'Please find you backup file, file type most is .DB'
                            }).then(result => {
                                console.log(result)
                                if (result.canceled) {
                                    console.log('使用者關閉 SaveDialog')
                                } else {
                                    console.log(result.filePaths[0])
                                    let checkExt = path.extname(result.filePaths[0])
                                    console.log(path.extname(result.filePaths[0]))
                                    if(checkExt !== '.db') {
                                        dialog.showMessageBox(
                                            null,
                                            {
                                                type: 'warning',
                                                title: 'DB Restore',
                                                message: `Please recheck your restore file`
                                            }
                                        )
                                    } else {
                                        var db = new sqlite3.Database(path.resolve(__dirname, '../db/main.db'), sqlite3.OPEN_READWRITE)
                                        
                                        db.close
                                        fs.copyFile( result.filePaths[0], path.resolve(__dirname,'../db/main.db'), (err) => {
                                            if(err) {
                                                dialog.showMessageBox(
                                                    null,
                                                    {
                                                        type: 'warning',
                                                        title: 'DB Restore',
                                                        message: `Faile cover restore file`
                                                    }
                                                )
                                            } else {
                                                dialog.showMessageBox(
                                                    null,
                                                    {
                                                        type: 'info',
                                                        title: 'DB Restore',
                                                        message: `Has been cover the DB file`
                                                    }
                                                )
                                            }
                                        })
                                        
                                    }
                                    
                                }

                            }) 

                            

                            
                            
                        }
                        
                    }
                ]
            },
            {
                label: "Connect to Server",
                click: () => {
                    const Dates = new Date()
                    var years = Dates.getFullYear();
                    var mons = (Dates.getMonth() + 1).toString().length > 1 ? (Dates.getMonth() + 1) : "0" + (Dates.getMonth() + 1)
                    mainwindow_controllog.control_log(host, years, mons)
                }
            },
            {
                label: "Schedule Job",
                submenu: [
                    {
                        label: "Display Job"
                    },
                    {
                        label: "Create Job"
                    },
                    {
                        label: "Modify Job"
                    },
                    {
                        label: "Delete Job"
                    }
                ]
            }
        ]
    }
]





module.exports = templateMenu