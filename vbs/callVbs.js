const { spawn, exec } = require('child_process')
//const { ZAVGR043_Pares, LT22_Pares } = require('../source/csv-test')
const { clipboard } = require('electron')
const { getPosts } = require('../db/dbConfig/dbMain')
const parse = require('csv')
var os = require('os');
const host = os.hostname();
const http = require('http');

const fs = require('fs')
const path = require('path');
const fsPromises = fs.promises;

const plant = ['540', '542', '544', '891', '892', '895', '893', '896', '317']
const plantWave = ['540', '542', '544']

function parseCSV(input, options) {
    return new Promise((resolve, reject) => {

        parse.parse(input, options, (error, output) => {

            if (error) {
                console.error('[ERROR] parseCSV: ', error.message);
                reject('[ERROR] parseCSV: ', error.message)
            } else {
                resolve(output)
            }


        });
    });

}

const callGetDelivery = async function () {
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

const callGetClipboard = async function () {
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

var callLT22 = function (plants) {
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

const runZavgr043 = async function () {
    console.log('into ZAVGR043')
    return new Promise(function (resolve, reject) {
        console.log('zavgr043')
        const runZAVGR043 = path.resolve(__dirname, '../vbs/zavgr043.vbs')
        const vbs = spawn('cscript.exe', [runZAVGR043, 'x076559', '-10', 'ZAVGR043.txt', path.resolve(__dirname, '../temp')])
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
    const fileName = 'ZAVGR043.txt'
    const inputFilePath = path.resolve(path.join(__dirname, '../temp/' + fileName));
    if (fs.existsSync(inputFilePath)) {
        const inputFile = await fsPromises.readFile(inputFilePath);

        const parsedResult = await parseCSV(inputFile, {
            delimiter: '\t',
            //from_line: 1,
            //to_line: 2,
            relax_column_count: true,
            relax_quotes: true,
            skip_empty_lines: true,
            skip_lines_with_error: false,
            ignore_last_delimiters: true,
            quote: false,
            ///escape: "/\'/g",
            //ltrim: true,
            trim: true,
            columns: ['h1', 'Shpt', 'DP', 'Delivery', 'Country', 'Item', 'Orde', 'StorageLoc', 'Shipto', 'Consignee', 'CreateOn', 'CreateTime', 'TransferOrder', 'TO_CreateDate', 'TO_CreateTime', 'ShipmentNo'
                , 'ShipmentCreateDate', 'ShipmentCreateTime', 'ShippingCondition', 'EntryDate', 'PGITime', 'ProformaD', 'Route', 'SOrg', 'NoPk', 'TotalWeight', 'BillofLading', 'Pieces'
                , 'OverAllPickingStatus', 'OverAllWMstatus', 'OverAllGMStatus', 'DivT', 'CusPoNo', 'WaveNo', 'Instructions']

        });


        var db = new sqlite3.Database(path.resolve(path.join(__dirname, '../db/main.db')), sqlite3.OPEN_READWRITE)
        db.run('delete from ZAVGR043_Temp', function (err, rows) {
            if (err) {
                return console.log(`find  error: `, err.message)
            }
        })
        db.run(`pragma journal_mode = WAL;
        pragma synchronous = normal;
        pragma temp_store = memory;
        pragma mmap_size = 30000000000;
        pragma vacuum;
        pragma optimize;
        pragma incremental_vacuum;`)

        console.log('total import line:' + parsedResult.length)

        var insertSmt = db.prepare(`INSERT INTO ZAVGR043_Temp (
        "ShPt"
        ,"DP"
        ,"Delivery"
        ,"Country"
        ,"#Items"
        ,"Orde"
        ,"StorageLocation"
        ,"Ship-To"
        ,"Consignee"
        ,"Createdon"
        ,"Time"
        ,"TransferOrder"
        ,"TOCreateDate"
        ,"TOCreateTime"
        ,"ShipmentNo"
        ,"ShipmentCreateDate"
        ,"ShipmentCreateTime"
        ,"ShippingCondition"
        ,"EntryDate"
        ,"PGITime"
        ,"ProformaD"
        ,"Route"
        ,"SOrg"
        ,"No.Pk"
        ,"Totalweig"
        ,"Billoflading"
        ,"#Pieces"
        ,"OverallPickingStatus"
        ,"OverallWMStatus"
        ,"OverallGMStatus"
        ,"DlvT"
        ,"CustomerPONo."
        ,"WaveGrpNo."
        ,"ShippingInstructions"
        )
    VALUES (
        ?
        , ?
        , ?
        , ?
        , ?
        , ?
        , ?
        , ?
        , ?
        , ?
        , ?
        , ?
        , ?
        , ?
        , ?
        , ?
        , ?
        , ?
        , ?
        , ?
        , ?
        , ?
        , ?
        , ?
        , ?
        , ?
        , ?
        , ?
        , ?
        , ?
        , ?
        , ?
        , ?
        , ?
        )`)



        for await (const row of parsedResult) {
            if (typeof (row.Instructions) == 'undefined') { var instruction = '' } else { var instruction = row.Instructions }
            await insertSmt.run(row.Shpt, row.DP, row.Delivery,
                row.Country, row.Item, row.Orde, row.StorageLoc,
                row.Shipto, row.Consignee, row.CreateOn,
                row.CreateTime, row.TransferOrder, row.TO_CreateDate,
                row.TO_CreateTime, row.ShipmentNo, row.ShipmentCreateDate,
                row.ShipmentCreateTime, row.ShippingCondition,
                row.EntryDate, row.PGITime,
                row.ProformaD, row.Route,
                row.SOrg, row.NoPk, row.TotalWeight,
                row.BillofLading, row.Pieces,
                row.OverAllPickingStatus, row.OverAllWMstatus,
                row.OverAllGMStatus, row.DivT,
                row.CusPoNo, row.WaveNo, instruction.replace(/\'/g, ' '), function(err, rows) {
                    if(err) {
                        console.log(err)
                    }
                })
        }



        await insertSmt.finalize();
        await db.close();

        console.log('zavgr043 import done')
        return new Promise(function(resolve, reject){

        })







    }

}).then(function () {
    
})