var os = require('os');
const host = os.hostname();
const fs = require('fs')
const path = require('path');
const { Notification } = require('electron')
const { messageBox } = require('../source/dialogBox')

const { spawn, exec, spawnSync, execSync } = require('child_process');
const { ZAVGR043_Pares, LT22_Pares, VL06F_Pares, Manifest_Parse, HUMO_Parse, ZAMTR002_Parse, VT22_Pares } = require('../source/csv-test')
const { clipboard } = require('electron')
const { getPosts , setInsert} = require('../db/dbConfig/dbMain')
const plant = ['540', '542', '544', '891', '892', '895', '893', '896', '317']
const { setInsert043FromTemp, setCustomerShipCity } = require('../db/dbConfig/dbMain')

const callGetDelivery = async function () {
    return new Promise(async function (resolve, reject) {
        await getPosts(`select Delivery from ZAVGR043_Temp where OverallGMStatus = 'A' and ShipmentNo <> '';`)
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
                messageBox('error', 'VL06F get Delivery err', `${err}`)
                reject();
            })

    })
}
const callGetWaveNo = async function () {
    return new Promise(async function (resolve, reject) {
        await getPosts(`select "WaveGrpNo." as WaveNo from ZAVGR043_Temp where  "WaveGrpNo." like '200%' group by WaveNo;`)
            .then(function (response) {
                var tempArr = []
                response.forEach(row => {
                    //console.log(row.Delivery)
                    fs.appendFileSync(path.resolve(__dirname, '../temp/delivery_info.txt'), row.WaveNo.toString() + '\n', function (err) {
                        if (err) throw err;
                        //console.log('Saved!');
                    })
                })
                resolve();
            }).catch(err => {
                console.log(err)
                messageBox('error', 'Get WaveGroup No Err', `${err}`)
                reject();
            })

    })
}



const callGetShipmentForCity = async function () {
    return new Promise(async function (resolve, reject) {
        await getPosts(`select ShipmentNo from TBL_ZAVGR043_Prod where Ship_Customer_Name is null group by ShipmentNo;`)
            .then(function (response) {
                var tempArr = []
                response.forEach(row => {
                    //console.log(row.Delivery)
                    fs.appendFileSync(path.resolve(__dirname, '../temp/city_shipment_info.txt'), row.ShipmentNo.toString() + '\n', function (err) {
                        if (err) throw err;
                        //console.log('Saved!');
                    })
                })
                resolve();
            }).catch(err => {
                console.log(err)
                messageBox('error', 'Get Shipment No Err', `${err}`)
                reject();
            })

    })
}
const callGetShipmentForHUMO = async function () {
    return new Promise(async function (resolve, reject) {
        await getPosts(`select ShipmentNo from TBL_ZAVGR043_Prod where HU_ConfirmDate is null group by ShipmentNo;`)
            .then(function (response) {
                var tempArr = []
                response.forEach(row => {
                    //console.log(row.Delivery)
                    fs.appendFileSync(path.resolve(__dirname, '../temp/humo_shipment_info.txt'), row.ShipmentNo.toString() + '\n', function (err) {
                        if (err) throw err;
                        //console.log('Saved!');
                    })
                })
                resolve();
            }).catch(err => {
                console.log(err)
                messageBox('error', 'Get Shipment for HU not confirm Err', `${err}`)
                reject();
            })

    })
}

const callGetHandlingForHUMO = async function () {
    return new Promise(async function (resolve, reject) {
        await getPosts(`select Handling_Unit from TBL_ZAVGR043_Prod where Handling_Unit is not null and HU_ConfirmDate is null;`)
            .then(function (response) {
                var tempArr = []
                response.forEach(row => {
                    //console.log(row.Delivery)
                    fs.appendFileSync(path.resolve(__dirname, '../temp/humo_HU_info.txt'), row.Handling_Unit.toString() + '\n', function (err) {
                        if (err) throw err;
                        //console.log('Saved!');
                    })
                })

                resolve();
                
            }).catch(err => {
                console.log(err)
                messageBox('error', 'Get HU for HU not confirm Err', `${err}`)
                reject();
            })

    })
}

const callGetDeliveryForZAMTR002 = async function () {
    return new Promise(async function (resolve, reject) {
        await getPosts(`select Delivery from TBL_ZAVGR043_Prod where ProformaD <> '' and Unit_Cost_Check = 0`)
            .then(function (response) {
                var tempArr = []
                response.forEach(row => {
                    //console.log(row.Delivery)
                    fs.appendFileSync(path.resolve(__dirname, '../temp/Delivery_for_ZAMTR002.txt'), row.Delivery.toString() + '\n', function (err) {
                        if (err) throw err;
                        //console.log('Saved!');
                    })
                })
                resolve();
            }).catch(err => {
                console.log(err)
                messageBox('error', 'Get Delivery_for_ZAMTR002 No Err', `${err}`)
                reject();
            })

    })
}

const callGetShipmentForCoo = async function () {
    return new Promise(async function (resolve, reject) {
        await getPosts(`select ShipmentNo from TBL_ZAVGR043_Prod where COO_DocNumber is null and Country not in ('TW') group by ShipmentNo;`)
            .then(function (response) {
                var tempArr = []
                response.forEach(row => {
                    //console.log(row.Delivery)
                    fs.appendFileSync(path.resolve(__dirname, '../temp/coo_shipment_info.txt'), row.ShipmentNo.toString() + '\n', function (err) {
                        if (err) throw err;
                        //console.log('Saved!');
                    })
                })
                resolve();
            }).catch(err => {
                console.log(err)
                messageBox('error', 'Get Shipment No Err', `${err}`)
                reject();
            })

    })
}

const callGetClipboard = async function () {
    return new Promise(function (resolve, reject) {
        exec(`get-content ${path.resolve(__dirname, '../temp/delivery_info.txt')} | set-clipboard`, { 'shell': 'powershell.exe' }, (error) => {
            // do whatever with stdout
            if (error) {
                console.log(error)
                messageBox('error', `Get Clipboard Err`, `${error}`)
                reject();
            }
        }).on('close', () => {
            console.log('get Clipboard')

            
            resolve();

            
        })
    })
}

const callGetClipboardCusName = async function () {
    return new Promise(function (resolve, reject) {
        try {
            if(fs.existsSync(path.resolve(__dirname, '../temp/city_shipment_info.txt'))) {
                exec(`get-content ${path.resolve(__dirname, '../temp/city_shipment_info.txt')} | set-clipboard`, { 'shell': 'powershell.exe' }, (error) => {
                    // do whatever with stdout
                    if (error) {
                        console.log(error)
                        messageBox('error', `Get Clipboard Err`, `${error}`)
                        reject(error);
                    }
                }).on('close', () => {
                    
        
                    console.log('get Clipboard')
                    
                    resolve();
                })
            } else {
                reject('not find city_shipment_info')
            }
        } catch (error) {
            reject(error);
        }
        
    })
}

const callGetClipboardHUMO = async function () {
    return new Promise(function (resolve, reject) {
        try {
            if(fs.existsSync(path.resolve(__dirname,'../temp/humo_shipment_info.txt')) ) {
                exec(`get-content ${path.resolve(__dirname, '../temp/humo_shipment_info.txt')} | set-clipboard`, { 'shell': 'powershell.exe' }, (error) => {
                    // do whatever with stdout
                    if (error) {
                        console.log(error)
                        messageBox('error', `Get Clipboard Err`, `${error}`)
                        reject(error);
                    }
                }).on('close', () => {
                    
        
                    console.log('get Clipboard')
                    
                    resolve();
                })
            } else {
                reject('not find humo_shipment_info.txt')
            }
        }catch(error) {
            reject(error)
        }
        
    })
}
const callGetClipboardHandling = async function () {
    return new Promise(function (resolve, reject) {
        try{
            if(fs.existsSync(path.resolve(__dirname, '../temp/humo_HU_info.txt')) ) {
                exec(`get-content ${path.resolve(__dirname, '../temp/humo_HU_info.txt')} | set-clipboard`, { 'shell': 'powershell.exe' }, (error) => {
                    // do whatever with stdout
                    if (error) {
        
                        console.log(error)
                        messageBox('error', `Get Clipboard Err`, `${error}`)
                        reject();
                    }
                }).on('close', () => {
                    resolve();
        
                    console.log('get Clipboard')
        
                })
            } else {
                reject('not find humo_HU_info.txt')
            }
        }catch(error){
            reject(error)
        }
        
    })
}

const callGetClipboardDeliveryForZAMTR002 = async function () {
    return new Promise(function (resolve, reject) {
        try{
            if(fs.existsSync(path.resolve(__dirname, '../temp/humo_HU_info.txt')) ) {
                exec(`get-content ${path.resolve(__dirname, '../temp/Delivery_for_ZAMTR002.txt')} | set-clipboard`, { 'shell': 'powershell.exe' }, (error) => {
                    // do whatever with stdout
                    if (error) {
        
                        console.log(error)
                        messageBox('error', `Get Clipboard Err`, `${error}`)
                        reject();
                    }
                }).on('close', () => {
                    resolve();
        
                    console.log('get Clipboard')
        
                })
            } else {
                reject('not find Delivery_for_ZAMTR002.txt')
            }
        }catch(error){
            reject(error)
        }
        
    })
}
const callGetClipboardCOO = async function () {
    return new Promise(function (resolve, reject) {
        try {
            if(fs.existsSync(path.resolve(__dirname,'../temp/humo_shipment_info.txt')) ) {
                exec(`get-content ${path.resolve(__dirname, '../temp/coo_shipment_info.txt')} | set-clipboard`, { 'shell': 'powershell.exe' }, (error) => {
                    // do whatever with stdout
                    if (error) {
                        console.log(error)
                        messageBox('error', `Get Clipboard Err`, `${error}`)
                        reject(error);
                    }
                }).on('close', () => {
                    
        
                    console.log('get Clipboard')
                    
                    resolve();
                })
            } else {
                reject('not find coo_shipment_info.txt')
            }
        }catch(error) {
            reject(error)
        }
        
    })
}


const callLT22 = function (plants) {
    return new Promise(async function (resolve, reject) {



        const runLT22 = path.resolve(__dirname, '../vbs/LT22.vbs')
        spawn('cscript.exe', [runLT22, plants, '/SMARTVIEW', 'LT22.txt', path.resolve(__dirname, '../temp')])
            .on('exit', (code) => {
                console.log('exit code (' + code + ')')
            })
            .on('close', () => {
                console.log('script closed');
                //messageBox('error', `Get Clipboard ${path.resolve(__dirname, '../temp/humo_shipment_info.txt')} Err`, error)
                resolve();
                //await LT22_Pares('LT22.txt')
            })
            .on('error', () => {
                console.log('error running vbs')
                messageBox('error', `ZAVGR043`, 'error running vbs LT22')
                reject();
            })


    })
}

const runZavgr043 = async function () {
    console.log('into ZAVGR043')
    return new Promise(async function (resolve, reject) {
        console.log('zavgr043')
        const runZAVGR043 = path.resolve(__dirname, '../vbs/zavgr043.vbs')
        const vbs = spawn('cscript.exe', [runZAVGR043, 'x076559', '-15', 'ZAVGR043.txt', path.resolve(__dirname, '../temp')])
            //const vbs = spawn('cscript.exe', [runZAVGR043, 'x076559', '-2', 'ZAVGR043.txt', path.resolve(__dirname, '../temp')])
            .on('exit', () => {
                vbs.stdout.on('data', (data) => {
                    console.log(`${data}`)
                })

            })
            .on('close', () => {
                console.log('script closed')
                const changeLayout = path.resolve(__dirname, '../vbs/change043Layout.vbs')
                spawn('cscript.exe', [changeLayout, '/X031651'])
                    .on('close', () => {
                        const downloadReport = path.resolve(__dirname, '../vbs/download043Report.vbs')
                        spawn('cscript.exe', [downloadReport, 'ZAVGR043.txt', path.resolve(__dirname, '../temp')])
                            .on('close', () => {
                                resolve()
                            })
                    })


            })
            .on('error', () => {
                console.log('error running vbs')
                messageBox('error', `ZAVGR043`, 'error running vbs ZAVGR043')
                reject()

            })
    })

}

const runVl06f = async function () {
    console.log('into VL06f')
    return new Promise(function (resolve, reject) {
        console.log('zavgr043')
        const runVL06F = path.resolve(__dirname, '../vbs/vl06f.vbs')
        const vbs = spawn('cscript.exe', [runVL06F, '/01 CUSOTMER', '-90', 'VL06F.txt', path.resolve(__dirname, '../temp')])
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
                messageBox('error', `ZAVGR043`, 'error running vbs VL06F')
                reject()

            })
    })

}
const runManifest = async function () {
    console.log('into VL06f')
    return new Promise(function (resolve, reject) {
        console.log('zavgr043')
        const runManifest = path.resolve(__dirname, '../vbs/manifest.vbs')
        const vbs = spawn('cscript.exe', [runManifest, '-60', '/SUPPORT ECS', 'manifest.txt', path.resolve(__dirname, '../temp')])
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
                messageBox('error', `ZAVGR043`, 'error running vbs /nMANIFEST')
                reject()

            })
    })

}

const runHUMO = async function () {
    console.log('into HUMO')
    return new Promise(function (resolve, reject) {
        console.log('HUMO')
        const runHUMO = path.resolve(__dirname, '../vbs/HUMO.vbs')
        const vbs = spawn('cscript.exe', [runHUMO, '/SMARTVIEW', 'humo.txt', path.resolve(__dirname, '../temp')])
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
                messageBox('error', `ZAVGR043`, 'error running vbs HUMO')
                reject()

            })
    })

}

const runZAMTR002 = async function () {
    console.log('into HUMO')
    return new Promise(function (resolve, reject) {
        console.log('HUMO')
        const runHUMO = path.resolve(__dirname, '../vbs/zamtr002.vbs')
        const vbs = spawn('cscript.exe', [runHUMO, 'zamtr002.txt', path.resolve(__dirname, '../temp')])
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
                messageBox('error', `zamtr002`, 'error running vbs zamtr002')
                reject()

            })
    })
}
const runVT22 = async function () {
    console.log('into HUMO')
    return new Promise(function (resolve, reject) {
        console.log('HUMO')
        const runHUMO = path.resolve(__dirname, '../vbs/vt22.vbs')
        const vbs = spawn('cscript.exe', [runHUMO, 'vt22.txt', path.resolve(__dirname, '../temp')])
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
                messageBox('error', `vt22`, 'error running vbs vt22')
                reject()

            })
    })
}


const all_dowload = function () {

    try {
        if (fs.existsSync(path.resolve(__dirname, '../temp/ZAVGR043.txt'))) {
            fs.unlinkSync(path.resolve(__dirname, '../temp/ZAVGR043.txt'))

        }
    } catch (err) {
        console.error(err)
    }
    try {
        if (fs.existsSync(path.resolve(__dirname, '../temp/LT22.txt'))) {
            fs.unlinkSync(path.resolve(__dirname, '../temp/LT22.txt'))

        }
    } catch (err) {
        console.error(err)
    }

    try {
        if (fs.existsSync(path.resolve(__dirname, '../temp/VL06F.txt'))) {
            fs.unlinkSync(path.resolve(__dirname, '../temp/VL06F.txt'))

        }
    } catch (err) {
        console.error(err)
    }


    try {
        if (fs.existsSync(path.resolve(__dirname, '../temp/delivery_info.txt'))) {
            fs.unlinkSync(path.resolve(__dirname, '../temp/delivery_info.txt'))

        }
    } catch (err) {
        console.error(err)
    }

    try {
        if (fs.existsSync(path.resolve(__dirname, '../temp/city_shipment_info.txt'))) {
            fs.unlinkSync(path.resolve(__dirname, '../temp/city_shipment_info.txt'))

        }
    } catch (err) {
        console.error(err)
    }

    try {
        if (fs.existsSync(path.resolve(__dirname, '../temp/humo_shipment_info.txt'))) {
            fs.unlinkSync(path.resolve(__dirname, '../temp/humo_shipment_info.txt'))

        }
    } catch (err) {
        console.error(err)
    }

    try {
        if (fs.existsSync(path.resolve(__dirname, '../temp/manifest.txt'))) {
            fs.unlinkSync(path.resolve(__dirname, '../temp/manifest.txt'))

        }
    } catch (err) {
        console.error(err)
    }
    try {
        if (fs.existsSync(path.resolve(__dirname, '../temp/humo_HU_info.txt'))) {
            fs.unlinkSync(path.resolve(__dirname, '../temp/humo_HU_info.txt'))

        }
    } catch (err) {
        console.error(err)
    }
    try {
        if (fs.existsSync(path.resolve(__dirname, '../temp/humo.txt'))) {
            fs.unlinkSync(path.resolve(__dirname, '../temp/humo.txt'))

        }
    } catch (err) {
        console.error(err)
    }

    try {
        if (fs.existsSync(path.resolve(__dirname, '../temp/zamtr002.txt'))) {
            fs.unlinkSync(path.resolve(__dirname, '../temp/zamtr002.txt'))

        }
    } catch (err) {
        console.error(err)
    }

    try {
        if (fs.existsSync(path.resolve(__dirname, '../temp/vt22.txt'))) {
            fs.unlinkSync(path.resolve(__dirname, '../temp/vt22.txt'))

        }
    } catch (err) {
        console.error(err)
    }



    runZavgr043().then(async function () {
        await ZAVGR043_Pares('ZAVGR043.txt').then(async function (result) {
            console.log('status:' + result)
            await callGetDelivery().then(async function () {
                await callGetWaveNo().then(async function () {
                    await callGetClipboard().then(async function () {
                        for await (const plants of plant) {
                            console.log(plants)
                            await callLT22(plants).then(async function () {
                                try {
                                    if (fs.existsSync(path.resolve(__dirname, '../temp/LT22.txt'))) {
                                        console.log('import LT22 data')
                                        await LT22_Pares('LT22.txt', plants).then(function (result) {
                                            console.log('status LT22 import:' + result)
                                        })


                                    }
                                } catch (err) {
                                    console.error(err)
                                    messageBox('error', 'Import LT22 error', `${err}`)

                                }
                            })
                        }
                    })
                })
            }).then(async function () {

                
                try {
                    /*await setInsert043FromTemp().then(function (result) {
                        console.log(result)
                    })*/
                    await setInsert043FromTemp()
                } catch (err) {
                    console.log(err)
                    messageBox('error', 'Inser ZAVG043 data error', `${err}`)
                }
                


            }).then(async function () {
                await callGetShipmentForCity().then(async function () {
                    await callGetClipboardCusName().then(async function () {
                        await runVl06f().then(async function (result) {
                            console.log(result)
                            await VL06F_Pares('VL06F.txt').then(async function (result) {
                                console.log('status VL06F import:' + result)
                                await setCustomerShipCity().then(function (result) {
                                    console.log(result)
                                })
                            })
                        })
                    })
                })
            }).then(async function () {
                await callGetShipmentForHUMO().then(async function () {
                    await callGetClipboardHUMO().then(async function () {
                        await runManifest().then(async function () {
                            await Manifest_Parse('manifest.txt')
                        }).then(async function () {
                            await callGetHandlingForHUMO().then(async function () {
                                await callGetClipboardHandling().then(async function () {
                                    await runHUMO().then(async function () {
                                        await HUMO_Parse('HUMO.txt').then(async function (result) {
                                            await callGetDeliveryForZAMTR002().then(async function() {
                                                await callGetClipboardDeliveryForZAMTR002().then(async function() {
                                                    await runZAMTR002().then(async function() {
                                                        await ZAMTR002_Parse('zamtr002.txt').then(async function () {
                                                            await callGetShipmentForCoo().then( async () => {
                                                                await callGetClipboardCOO().then( async() => {
                                                                    await runVT22().then(async () => {
                                                                        await VT22_Pares('vt22.txt').then(async () => {
                                                                            if (Notification.isSupported) {
                                                                                console.log('Notification alert')
                                                                                new Notification(
                                                                                    {
                                                                                        title: 'Information',
                                                                                        //subtitle :'Data download completed',
                                                                                        body: 'Data download completed'
                                
                                                                                    }
                                                                                ).show();
                                                                            }
                                                                        })
                                                                    })
                                                                })
                                                            })
                                                            
                                                        })
                                                        
                                                    })
                                                })
                                            })
                                            console.log(result)
                                           
                                        })
                                    })
                                })
                            })
                        })
                    })
                })
            })
        })
    })
}



module.exports = { all_dowload }