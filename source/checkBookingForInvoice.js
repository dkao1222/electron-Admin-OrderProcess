var os = require('os');
const host = os.hostname();
const fs = require('fs')
const path = require('path');
const { Notification } = require('electron')
const { messageBox } = require('../source/dialogBox')

const { spawn, exec, spawnSync, execSync } = require('child_process');
const { ZAVGR043_Pares, LT22_Pares, VL06F_Pares, Manifest_Parse, HUMO_Parse } = require('../source/csv-test')

const callGetNonbooking = async function (table) {
    let query = `select a.ShipmentNo FROM
    ${table}_LogNum a  inner join ${table} b
    on a.ShipmentNo = b.ShipmentNo
    inner join TBL_ZAVGR043_Prod c
    on a.ShipmentNo = c.ShipmentNo
    
    where c.Tracking_Number is null and c.OverallGMStatus not in ('C');`

    return new Promise(async function (resolve, reject) {
        await getPosts(query)
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
                messageBox('error', 'Booking get Shipment err:', `${err}`)
                reject();
            })

    })
}

const callGetNoPgi = async function (table) {
    let query = `select a.ShipmentNo FROM
    ${table}_LogNum a  inner join ${table} b
    on a.ShipmentNo = b.ShipmentNo
    inner join TBL_ZAVGR043_Prod c
    on a.ShipmentNo = c.ShipmentNo
    
    where c.OverallGMStatus not in ('C');`
    return new Promise(async function (resolve, reject) {

        try {
            if (fs.existsSync(path.resolve(__dirname, '../temp/delivery_info.txt'))) {
                fs.unlinkSync(path.resolve(__dirname, '../temp/delivery_info.txt'))
            }
        } catch (error) {
            console.log(error)
            reject('try remvoe temp file err:' + error)
        }



        await getPosts(query)
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
                messageBox('error', 'Booking get Shipment err:', `${err}`)
                reject();
            })

    })
}

const runManifest = async function () {
    console.log('into VL06f')
    return new Promise(function (resolve, reject) {
        console.log('zavgr043')
        const runManifest = path.resolve(__dirname, '../vbs/manifest.vbs')
        const vbs = spawn('cscript.exe', [runManifest, '-60', '/PEGGY', 'manifest.txt', path.resolve(__dirname, '../temp')])
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

await callGetNonbooking(table).then(async function () {
    await runManifest().then(async function () {
        await Manifest_Parse('manifest.txt')
    })
})

