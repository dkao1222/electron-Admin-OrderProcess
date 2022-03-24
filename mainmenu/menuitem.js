const { Menu, BrowserWindow, BrowserView } = require('electron')
var os = require('os');
const host = os.hostname();
const fs = require('fs')
const path = require('path');

const { spawn, exec, spawnSync, execSync } = require('child_process');
const { rejects } = require('assert');
const { resolve } = require('path');
const { all_dowload } = require('../source/locl_importData')
//const sqlite3 = require('sqlite3').verbose()

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

                            
                            all_dowload();

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
                                    resolve()

                                })
                                .on('error', () => {
                                    console.log('error running vbs')
                                    reject()

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

                    await shell.openExternal(`http://${host}:3000/get/dashboard?function=control_log_downs&queryDate=${years + '-' + mons}&pagesize=100&currentPage=1`)
                }
            },
            {
                label: "Control Log(54 Regular nTW)",
                click: async () => {
                    const { shell } = require('electron')
                    const Dates = new Date()
                    var years = Dates.getFullYear();
                    var mons = (Dates.getMonth() + 1).toString().length > 1 ? (Dates.getMonth() + 1) : "0" + (Dates.getMonth() + 1)

                    await shell.openExternal(`http://${host}:3000/get/dashboard?function=control_log_regular&queryDate=${years + '-' + mons}&pagesize=100&currentPage=1`)
                }
            },
            {
                label: "Control Log(54 Regular TW)",
                click: async () => {
                    const { shell } = require('electron')
                    const Dates = new Date()
                    var years = Dates.getFullYear();
                    var mons = (Dates.getMonth() + 1).toString().length > 1 ? (Dates.getMonth() + 1) : "0" + (Dates.getMonth() + 1)

                    await shell.openExternal(`http://${host}:3000/get/dashboard?function=control_log_regulartw&queryDate=${years + '-' + mons}&pagesize=100&currentPage=1`)
                }
            },
            {
                label: "Control Log(AMT Regular)",
                click: async () => {
                    const { shell } = require('electron')
                    const Dates = new Date()
                    var years = Dates.getFullYear();
                    var mons = (Dates.getMonth() + 1).toString().length > 1 ? (Dates.getMonth() + 1) : "0" + (Dates.getMonth() + 1)

                    await shell.openExternal(`http://${host}:3000/get/dashboard?function=control_log_amt&queryDate=${years + '-' + mons}&pagesize=100&currentPage=1`)
                }
            },
            {
                label: "Control Log(AMT Downs)",
                click: async () => {
                    const { shell } = require('electron')
                    const Dates = new Date()
                    var years = Dates.getFullYear();
                    var mons = (Dates.getMonth() + 1).toString().length > 1 ? (Dates.getMonth() + 1) : "0" + (Dates.getMonth() + 1)

                    await shell.openExternal(`http://${host}:3000/get/dashboard?function=control_log_amt_downs&queryDate=${years + '-' + mons}&pagesize=100&currentPage=1`)
                }
            },
            {
                label: "ZAVGR043_Temp",
                click: async () => {
                    const { shell } = require('electron')
                    await shell.openExternal('http://' + host + ':3000/get/dashboard/?function=temp_history')
                }
            }
        ]
    },
    {
        label: "Option",
        submenu: [
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
                    ruleassignWindow.loadFile(path.join(__dirname, '../views/ruleassign.html'))


                    //
                    //ruleassignWindow.loadFile(path.join(__dirname, '.views/ruleassign.html'))


                    // Open the DevTools.
                    ruleassignWindow.webContents.openDevTools()
                    ruleassignWindow.removeMenu();
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
                    ruleassignWindow.loadFile(path.join(__dirname, '../views/serviceassign.html'))


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
                            const { spawn, exec, execFile, spawnSync, execSync, fork } = require('child_process');
                            const path = require('path')

                            //const runSq01multi = path.join(__dirname, '../vbs/runSapSQ01MultiValue.vbs')

                            //const check = spawn('cscript.exe', [runSq01multi])
                            console.log(path.join(__dirname, '../db/sqlite3 .backup main my_bak'))
                            const backuppath = path.join(__dirname, '../db/sqlite3')
                            const check = spawn(backuppath, ['.backup main my_bak'])

                        }
                    },
                    {
                        label: "DB Restore",
                    }
                ]
            },
            {
                label: "Connect to Server"
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