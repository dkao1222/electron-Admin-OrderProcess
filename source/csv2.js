const parse = require('csv')
// import os module
const os = require("os");

// get temp directory
const tempDir = os.tmpdir(); // /tmp

const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');

const sqlite3 = require('sqlite3').verbose()

ZAVGR043_Pares('ZAVGR043.txt');

async function ZAVGR043_Pares(fileName) {

    const inputFilePath = path.resolve(path.join(__dirname, '../temp/' + fileName));
    //const inputFilePath = path.resolve(tempDir + '/' +fileName);
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
        //escape: '/\'/g',
        //ltrim: true,
        trim: true,
        columns: ['h1', 'Shpt', 'DP', 'Delivery', 'Country', 'Item', 'Orde', 'StorageLoc', 'Shipto', 'Consignee', 'CreateOn', 'CreateTime', 'TransferOrder', 'TO_CreateDate', 'TO_CreateTime', 'ShipmentNo'
            , 'ShipmentCreateDate', 'ShipmentCreateTime', 'ShippingCondition', 'EntryDate', 'PGITime', 'ProformaD', 'Route', 'SOrg', 'NoPk', 'TotalWeight', 'BillofLading', 'Pieces'
            , 'OverAllPickingStatus', 'OverAllWMstatus', 'OverAllGMStatus', 'DivT', 'CusPoNo', 'WaveNo', 'Instructions']

    });




    //console.log('parsedResult', parsedResult);
    //console.log(Date())
    var db = new sqlite3.Database(path.resolve(path.join(__dirname, '../db/main.db')), sqlite3.OPEN_READWRITE)

    db.run('delete from ZAVGR043_Temp', function (err, rows) {
        if (err) {
            return console.log(`find  error: `, err.message)
        }
    })

    var insertSmt = db.prepare(`INSERT INTO ZAVGR043_Temp(
        "ShPt", "DP", "Delivery", 
       "Country", "#Items", "Orde", "StorageLocation", 
       "Ship-To", "Consignee", "Createdon", 
       "Time", "TransferOrder", "TOCreateDate", 
       "TOCreateTime", "ShipmentNo", "ShipmentCreateDate", 
       "ShipmentCreateTime", "ShippingCondition", 
       "EntryDate", "PGITime", "ProformaD", 
       "Route", "SOrg", "No.Pk", "Totalweig", 
       "Billoflading", "#Pieces", "OverallPickingStatus", 
       "OverallWMStatus", "OverallGMStatus", 
       "DlvT", "CustomerPONo.", "WaveGrpNo.", 
       "ShippingInstructions"
     ) 
     VALUES (
        ?, ?, ?, 
        ?, ?, ?, ?, 
        ?, ?, ?,
        ?, ?, ?, 
        ?, ?, ?, 
        ?, ?, 
        ?, ?, 
        ?, ?, 
        ?, ?, ?, 
        ?, ?, 
        ?, ?, 
        ?, ?, 
        ?, ?, ?
     )`)


     parsedResult.map( row => {
        if (typeof (row.Instructions) == 'undefined') { var instruction = '' } else { var instruction = row.Instructions }
        insertSmt.run(row.Shpt, row.DP, row.Delivery,
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
            row.CusPoNo, row.WaveNo, instruction.replace(/\'/g, ' '))
     })
    /*parsedResult.forEach(function (row) {
        if (typeof (row.Instructions) == 'undefined') { var instruction = '' } else { var instruction = row.Instructions }
        insertSmt.run(row.Shpt, row.DP, row.Delivery,
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
            row.CusPoNo, row.WaveNo, instruction.replace(/\'/g, ' '))
    });
    */

    insertSmt.finalize();



    db.close



}

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
