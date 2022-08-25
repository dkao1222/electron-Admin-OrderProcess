var os = require('os');
const host = os.hostname();
const fs = require('fs')
const path = require('path');
const { Notification } = require('electron')
const { messageBox } = require('../source/dialogBox')

const { spawn, exec, spawnSync, execSync } = require('child_process');
const { ZAVGR043_Pares, LT22_Pares, VL06F_Pares, Manifest_Parse, HUMO_Parse, ZAMTR002_Parse, ZAVGR043_Inv_Pares } = require('../source/csv-test')
const { clipboard } = require('electron')
const { getPosts , setInsert, setUpdate} = require('../db/dbConfig/dbMain')
const plant = ['540', '542', '544', '891', '892', '895', '893', '896', '317']
const { setInsert043FromTemp, setCustomerShipCity } = require('../db/dbConfig/dbMain')

const callGetQueryData = async function (sqlQuery, fileName) {
    try {
        if (fs.existsSync(path.resolve(__dirname, `../temp/${fileName}.txt`))) {
            fs.unlinkSync(path.resolve(__dirname, `../temp/${fileName}.txt`))

        }
    } catch (err) {
        console.error(err)
    }
    return new Promise(async function (resolve, reject) {
        
        await getPosts(sqlQuery)
            .then(function (response) {
                var tempArr = []
                response.forEach(row => {
                    //console.log(row.Delivery)
                    fs.appendFileSync(path.resolve(__dirname, `../temp/${fileName}.txt`), row.rowString.toString() + '\n', function (err) {
                        if (err) throw err;
                        //console.log('Saved!');
                    })
                })

                resolve();
                
            }).catch(err => {
                console.log(err)
                //messageBox('error', 'Get ShipmentNo Err', `${err}`)
                reject();
            })

    })
}

const callGetClipboard = async function (fileName) {
    return new Promise(function (resolve, reject) {
        exec(`get-content ${path.resolve(__dirname, `../temp/${fileName}.txt`)} | set-clipboard`, { 'shell': 'powershell.exe' }, (error) => {
            // do whatever with stdout
            if (error) {
                console.log(error)
                //messageBox('error', `Get Clipboard Err`, `${error}`)
                reject();
            }
        }).on('close', () => {
            console.log('get Clipboard')

            
            resolve();

            
        })
    })
}

const runSapTCode = async function (VBSname, fileName) {
    try {
        if (fs.existsSync(path.resolve(__dirname, `../temp/${fileName}.txt`))) {
            fs.unlinkSync(path.resolve(__dirname, `../temp/${fileName}.txt`))

        }
    } catch (err) {
        console.error(err)
    }
    return new Promise(function (resolve, reject) {
        console.log(VBSname)
        const runHUMO = path.resolve(__dirname, `../vbs/${VBSname}.vbs`)
        const vbs = spawn('cscript.exe', [runHUMO, `${fileName}.txt`, path.resolve(__dirname, '../temp')])
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
                //messageBox('error', `${VBSname}`, `error running vbs ${VBSname}`)
                reject()

            })
    })
}

callGetQueryData(`select Delivery as rowString from TBL_ZAVGR043_Prod where ShipmentNo in (
    select ShipmentNo from Invoice_Shipment)`, 'zavgr043_delivery',).then(async function() {
        await callGetClipboard('zavgr043_delivery').then(async function() {
            await runSapTCode('zavgr043_delivery','zavgr043_delivery_info').then(async function(result) {
                await runSapTCode('change043Layout', 'zavgr043_delivery_info').then(async () => {
                    await runSapTCode('download043Report','zavgr043_delivery_info').then(async ()=> {
                        await ZAVGR043_Inv_Pares('zavgr043_delivery_info.txt').then(async (result) => {
                            console.log(result)
                            await setUpdate(`update TBL_ZAVGR043_Prod
                            set OvrGMStus = t.OverallGMStatus
                            ,OvrPickingStus = t.OverallPickingStatus
                            ,OvrWMStus = t.OverallWMStatus
                            ,ProformaD = t.ProformaD
                            ,EntryDate = t.EntryDate
                            ,PGITime = t.PGITime
                            from (
                                select * from ZAVGR043_Inv_Temp
                            ) t
                            
                            where TBL_ZAVGR043_Prod.ShipmentNo = t.ShipmentNo and TBL_ZAVGR043_Prod.Delivery = t.Delivery`).then(async () => {
                                await ZAVGR043_Inv_Pares('zavgr043_delivery_info.txt').then(async (result) => {
                                    console.log(result)
                                    await setUpdate(`update Invoice_Shipment 
                                        set Bill_Doc_Check = case when t.ProformaD <> '' then 1 else 0 end
                                        ,Bill_Doc = t.ProformaD
                                        from (
                                            select * from TBL_ZAVGR043_Prod
                                        ) t
                                        where Invoice_Shipment.ShipmentNo = t.ShipmentNo`).then(async () => {
                                            await callGetQueryData('select ShipmentNo as rowString from Invoice_Shipment;', 'Invoce_Shipment_manifest').then(async () => {
                                                await callGetClipboard('Invoce_Shipment_manifest').then(async () => {
                                                    await runSapTCode('manifest_shipment', 'Invoce_Shipment_manifest_info').then(async () => {
                                                        //console.log('close')
                                                        await Manifest_Parse('Invoce_Shipment_manifest_info.txt').then(async() => {
                                                            
                                                            await setUpdate(`update Invoice_Shipment 
                                                            set ECSID_Check = case when t.ECSID_Total > 0 then 1 else 0 end
                                                            from ( 
                                                                select Delivery_Shipment, count(ECSID) as ECSID_Total from TBL_Manifest group by Delivery_Shipment
                                                            ) t
                                                            where Invoice_Shipment.ShipmentNo = t.Delivery_Shipment`).then(async() => {
                                                                console.log('check invode close')
                                                                
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
                })
            })
        })
    })

