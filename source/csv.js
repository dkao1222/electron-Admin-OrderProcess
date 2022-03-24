const parse = require('csv')
// import os module
const os = require("os");

// get temp directory
const tempDir = os.tmpdir(); // /tmp

const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');

const sqlite3 = require('sqlite3').verbose()

//LT22_Pares('540-LT22.txt');
//npm run watch
ZAVGR043_Pares('ZAVGR043.txt');

async function LT22_Pares(fileName) {

    const inputFilePath = path.resolve(path.join(__dirname, '../temp/' + fileName));
    //const inputFilePath = path.resolve(tempDir + '/' +fileName);
    const inputFile = await fsPromises.readFile(inputFilePath);
    const parsedResult = await parseCSV(inputFile, {
        delimiter: '\t',
        //from_line: 3,
        relax_column_count: true,
        skip_empty_lines: true,
        skip_lines_with_error: true,
        //ignore_last_delimiters: true,
        trim: true,
        columns: ['h1', 'Item', 'TO_Number', 'h19', 'Material', 'h20', 'Source_Typ', 'Source_Bin', 'Source_Target_Qty', 'Dest_Typ', 'Dest_Bin', 'Dest_Target_Qty', 'User1', 'Time', 'Created_On', 'Conf_Date', 'Conf_Time', 'User2', 'CS', 'Batch',],
        //columns: true,
    });

    //console.log('parsedResult', parsedResult);
    var db = new sqlite3.Database(path.resolve(path.join(__dirname, '../db/main.db')), sqlite3.OPEN_READWRITE)
    db.serialize(function () {
        db.run('delete from LT22_Temp', function (err, rows) {
            if (err) {
                return console.log(`find  error: `, err.message)
            } 
        })
    });

    parsedResult.forEach(function (row) {
        
        
        db.serialize(function () {
            if (typeof (row.Batch) == 'undefined') { var Batch = null } else { var Batch = row.Batch }
            if (typeof (row.CS) == 'undefined') { var CS = null } else { var CS = row.CS }
            if (typeof (row.User1) == 'undefined') { var User1 = null } else { var User1 = row.User1 }
            if (typeof (row.User2) == 'undefined') { var User2 = null } else { var User2 = row.User2 }
            var query = `insert into LT22_Temp (

                "field1"	,
                "Item",
                "TONumber"	,
                "field4"	,
                "Material"	,
                "field6"	,
                "Source_Typ"	,
                "Source_Bin"	,
                "Sourcetargetqty"	,
                "Dest_Typ"	,
                "Dest_Bin"	,
                "Dest_targetqty"	,
                "Cre_User"	,
                "Time"	,
                "CreatedOn"	,
                "Conf_date"	,
                "Conf.t"	,
                "Conf_User"	,
                "CS"	,
                "Batch"	
            ) values (''
            ,'${row.Item}'
            ,'${row.TO_Number}'
            ,''
            ,'${row.Material}'
            ,''
            ,'${row.Source_Typ}'
            ,'${row.Source_Bin}'
            ,'${row.Source_Target_Qty}'
            ,'${row.Dest_Typ}'
            ,'${row.Dest_Bin}'
            ,'${row.Dest_Target_Qty}'
            ,'${User1}'
            ,'${row.Time}'
            ,'${row.Created_On}'
            ,'${row.Conf_Date}'
            ,'${row.Conf_Time}'
            ,'${User2}'
            ,'${CS}'
            ,'${Batch}'
            )`
            db.run(query, function (err, rows) {
                if (err) {
                    return console.log(`find  error: `, err.message)
                } 
            })

        })


    });
    db.serialize(function(){
        db.run(`update LT22_Temp
        set Conf_User = NULL
        where Conf_User = 'null' or Conf_User = '';
        
        update LT22_Temp
        set "CS" = NULL
        where "CS" = 'null' or "CS" = '';
        
        update LT22_Temp
        set "Batch" = NULL
        where "Batch" = 'null' or "Batch" = '';`,function(err, rows) {
            if (err) {
                return console.log(`find  error: `, err.message)
            } 
        })
    })

    db.serialize(function(){
        db.run(`insert into TBL_LT22_Prod (AutiId,"Item", TONumber, Material, Source_Typ , Source_Bin, Sourcetargetqty, Dest_Typ, Dest_Bin, Cre_User, "Time", CreatedOn, Conf_date, "Conf_time",
        Conf_User, "CS", "Batch")
       select LT22_Temp.TONumber ||'_'||LT22_Temp.Item 
       ,LT22_Temp.Item
       ,LT22_Temp.TONumber
       ,LT22_Temp.Material
       ,LT22_Temp.Source_Typ 
       ,LT22_Temp.Source_Bin
       ,LT22_Temp.Sourcetargetqty
       ,LT22_Temp.Dest_Typ
       ,LT22_Temp.Dest_Bin
       ,LT22_Temp.Cre_User
       ,LT22_Temp."Time"
       ,LT22_Temp.CreatedOn
       ,LT22_Temp.Conf_date
       ,LT22_Temp."Conf.t"
       ,LT22_Temp.Conf_User
       ,LT22_Temp."CS"
       ,LT22_Temp."Batch"
        from LT22_Temp left join TBL_LT22_Prod
        on LT22_Temp.TONumber||'_'||LT22_Temp.Item = TBL_LT22_Prod.AutiId
       where TBL_LT22_Prod.AutiId is null and LT22_Temp.TONumber ||'_'||LT22_Temp.Item not in ('_' , 'TO Number_Item') ;`,function(err, rows) {
            if (err) {
                return console.log(`find  error: `, err.message)
            } 
        })
    })
    db.close


}

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
        //columns: ['h1', 'Item', 'TO_Number', 'h19', 'Material', 'h20', 'Source_Typ', 'Source_Bin', 'Source_Target_Qty', 'Dest_Typ', 'Dest_Bin', 'Dest_Target_Qty', 'User1', 'Time', 'Created_On', 'Conf_Date', 'Conf_Time', 'User2', 'CS', 'Batch',],
        //columns: true,
    });

    //console.log('parsedResult', parsedResult);
    //console.log(Date())
    var db = new sqlite3.Database(path.resolve(path.join(__dirname, '../db/main.db')), sqlite3.OPEN_READWRITE)
    db.serialize(function () {
        db.run('delete from ZAVGR043_Temp', function (err, rows) {
            if (err) {
                return console.log(`find  error: `, err.message)
            } 
        })
        

        parsedResult.forEach(function (row) {
            //console.log(row)
            //db.serialize(function () {
                //var instruction = instruction.replace('\'','')
                if (typeof(row.Instructions) == 'undefined') { var instruction = ''}  else {var instruction = row.Instructions}
                //var instructions = instruction.replace(/\'/g,'')
                //console.log(instructions)
                var query = `INSERT INTO ZAVGR043_Temp(
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
                  VALUES 
                    (
                       '${row.Shpt}', '${row.DP}', '${row.Delivery}', 
                      '${row.Country}', '${row.Item}', '${row.Orde}', '${row.StorageLoc}', 
                      '${row.Shipto}', '${row.Consignee}', '${row.CreateOn}',
                      '${row.CreateTime}', '${row.TransferOrder}', '${row.TO_CreateDate}', 
                      '${row.TO_CreateTime}','${row.ShipmentNo}', '${row.ShipmentCreateDate}', 
                      '${row.ShipmentCreateTime}', '${row.ShippingCondition}', 
                      '${row.EntryDate}', '${row.PGITime}', 
                      '${row.ProformaD}', '${row.Route}', 
                      '${row.SOrg}', '${row.NoPk}', '${row.TotalWeight}', 
                      '${row.BillofLading}', '${row.Pieces}', 
                      '${row.OverAllPickingStatus}', '${row.OverAllWMstatus}', 
                      '${row.OverAllGMStatus}', '${row.DivT}', 
                      '${row.CusPoNo}', '${row.WaveNo}', '${instruction.replace(/\'/g,' ')}'
                    )
                  `
                  //console.log(query)
    
                db.exec(query, function (err, row) {
                    if (err) {
                        console.log(`find  error: `, err.message)
                        
                    } 
                })
                
            //})
    
    
        })
    });
    


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

//module.exports = { LT22_Pares, ZAVGR043_Pares }