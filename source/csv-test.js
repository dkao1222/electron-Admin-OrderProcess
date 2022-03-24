const parse = require('csv')
// import os module
const os = require("os");

const { spawn, exec, spawnSync, execSync } = require('child_process');
// get temp directory
const tempDir = os.tmpdir(); // /tmp

const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');
const { resolve } = require('path');

const sqlite3 = require('sqlite3').verbose()

//ZAVGR043_Pares('ZAVGR043.txt');
//LT22_Pares('540-LT22.txt');
//LT22_Pares('542-LT22.txt');
//LT22_Pares('544-LT22.txt');
//LT22_Pares('891-LT22.txt');
//LT22_Pares('892-LT22.txt');
//LT22_Pares('893-LT22.txt');
//LT22_Pares('895-LT22.txt');
//LT22_Pares('896-LT22.txt');
//LT22_Pares('317-LT22.txt');


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
            console.log('total import LT22 line:' + parsedResult.length)
            const dataLength = parsedResult.length

            return new Promise(async function (resolve, reject) {
                for await (const row of parsedResult) {
                    
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
                                //return console.log(`find  error: `, err.message)
                                reject(err.message)
                            }
                        })

                        


                    

                    db.serialize(function () {
                        db.get('select max(ROWID) as [Total] from LT22_Temp ', function (err, row) {
                            if (err) {
                                console.log(err)
                                reject(err)
                            }
                            if (row['Total'] == dataLength) {
                                resolve('close')
                                db.serialize(function () {
                                    db.run(`update LT22_Temp
                                        set Conf_User = NULL
                                        where Conf_User = 'null' or Conf_User = '';
                                        
                                        update LT22_Temp
                                        set "CS" = NULL
                                        where "CS" = 'null' or "CS" = '';
                                        
                                        update LT22_Temp
                                        set "Batch" = NULL
                                        where "Batch" = 'null' or "Batch" = '';`, function (err, rows) {
                                        if (err) {
                                            return console.log(`find  error: `, err.message)
                                        }
                                    })
                                })

                                db.serialize(function () {
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
                                    where TBL_LT22_Prod.AutiId is null and LT22_Temp.TONumber ||'_'||LT22_Temp.Item not in ('_' , 'TO Number_Item') ;`, function (err, rows) {
                                        if (err) {
                                            return console.log(`find  error: `, err.message)
                                        }
                                    })
                                })

                                db.close


                                try {
                                    if (fs.existsSync(path.resolve(__dirname, '../temp/LT22.txt'))) {
                                        fs.unlinkSync(path.resolve(__dirname, '../temp/LT22.txt'))
                                        resolve('close');
                                    }
                                } catch (err) {
                                    console.error(err)
                                }

                            }
                        })
                    })
                }
            })









        
    









}
async function ZAVGR043_Pares(fileName) {

    //return new Promise(async function (resolve, reject) {



    const inputFilePath = path.resolve(path.join(__dirname, '../temp/' + fileName));


    //const inputFilePath = path.resolve(tempDir + '/' +fileName);
    const inputFile = await fsPromises.readFile(inputFilePath);
    if (!fs.existsSync(inputFilePath)) {
        reject('error');
    }


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

    console.log('total import line:' + parsedResult.length)
    const dataLength = parsedResult.length

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

    return new Promise(async function (resolve, reject) {
        for await (const row of parsedResult) {
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
                row.CusPoNo, row.WaveNo, instruction.replace(/\'/g, ' '), function (err, rows) {
                    if (err) {
                        console.log(err)
                        reject(err)
                    }

                })
            db.serialize(function () {
                db.get('select count(field1) as [Total] from zavgr043_temp ', function (err, row) {
                    if (err) {
                        console.log(err)
                    }
                    //console.log(row)
                    if (row['Total'] = dataLength) {
                        resolve('close')
                    }
                })
            })


        }


        insertSmt.finalize();

        db.close();





    })

    /*parsedResult.forEach(async function (row) {
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





    //})

}

async function VL06F_Pares(fileName) {

    const inputFilePath = path.resolve(path.join(__dirname, '../temp/' + fileName));


    //const inputFilePath = path.resolve(tempDir + '/' +fileName);
    const inputFile = await fsPromises.readFile(inputFilePath);
    if (!fs.existsSync(inputFilePath)) {
        reject('error');
    }
    

    var db = new sqlite3.Database(path.resolve(path.join(__dirname, '../db/main.db')), sqlite3.OPEN_READWRITE)

    db.run('delete from VL06F_Temp', function (err, rows) {
        if (err) {
            return console.log(`find  error: `, err.message)
        }
    })

    var insertSmt = db.prepare(`INSERT INTO VL06F_Temp (
        Delivery, Shipto, Ship_Customer_Name, Ship_Customer_City
        )
    VALUES (
        ?, ?, ?, ?
        )`)
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
        columns: ['h1','Delivery', 'Shipto', 'Ship_Customer_Name', 'Ship_Customer_City']

    });

    console.log('total import line:' + parsedResult.length)
    const dataLength = parsedResult.length

    return new Promise(async function (resolve, reject) {
        for await (const row of parsedResult) {
            
            insertSmt.run(row.Delivery, row.Shipto, row.Ship_Customer_Name, row.Ship_Customer_City, function (err, rows) {
                    if (err) {
                        console.log(err)
                        reject(err)
                    }

                })
            db.serialize(function () {
                db.get('select max(rowid) as [Total] from VL06F_temp ', function (err, row) {
                    if (err) {
                        console.log(err)
                    }
                    //console.log(row)
                    if (row['Total'] = dataLength) {
                        resolve('close')
                    }
                })
            })


        }


        insertSmt.finalize();

        db.close();





    })

}

async function Manifest_Parse(fileName) {
    const inputFilePath = path.resolve(path.join(__dirname, '../temp/' + fileName));

    var db = new sqlite3.Database(path.resolve(path.join(__dirname, '../db/main.db')), sqlite3.OPEN_READWRITE)
    db.serialize(function() {
        db.exec('drop table IF EXISTS manifest', function(error, row){
            if (error) {
                console.log(error)
            }
        })
        db.exec('create table IF NOT EXISTS manifest (Shipment , Tracking_Number, Handling_Unit, Carrier,ShippingCarrier,Total_Packages )', function(error, row){
            if (error) {
                console.log(error)
            }
        })
    })
        
    
    //const inputFilePath = path.resolve(tempDir + '/' +fileName);
    const inputFile = await fsPromises.readFile(inputFilePath);
    if (!fs.existsSync(inputFilePath)) {
        reject('error');
    }

    const parsedResult = await parseCSV(inputFile, {
        delimiter: '\t',
        //from_line: 3,
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
        columns: ['h1','Status','Ship Date','Ship Time','Shipment','ShipFrom','Tracking_Number','Handling_Unit','Carrier','ShippingCarrier','Package Weight','EID','POD Date','POD Time','ShipToCountry','Package','Total_Packages','Uom']


    });

    console.log('total import line:' + parsedResult.length)
    const dataLength = parsedResult.length
    
    return new Promise(async function(resolve, reject) {
        for await (const row of parsedResult) {
            db.serialize(function(){
                db.run(`insert into manifest(Shipment , Tracking_Number, Handling_Unit, Carrier,ShippingCarrier,Total_Packages) 
                values ('${row.Shipment}', '${row.Tracking_Number}', '${row.Handling_Unit}', '${row.Carrier}', '${row.ShippingCarrier}', '${row.Total_Packages}')`, function(error, row){
                    if (error) {
                        console.log(error)
                        reject(error)
                    }
                })
            })
            
        }

        db.serialize(function () {
            db.get('select max(rowid) as [Total] from manifest ', function (err, row) {
                if (err) {
                    console.log(err)
                }
                //console.log(row)
                if (row['Total'] = dataLength) {
                    resolve('close')
                }
            })
        })

        db.serialize(function() {
            db.exec(`update TBL_ZAVGR043_Prod
            set Handling_Unit = t.Handling_Unit
            , Tracking_Number = t.Tracking_Number
            , Carrier = t.Carrier
            , ShippingCarrier = t.ShippingCarrier
            from (
                select * from manifest
            ) as t
            where TBL_ZAVGR043_Prod.ShipmentNo = t.Shipment`)
        })

    }).then(null, () => {
        console.log('import failed')
    })
    
    

    
    
    
}

async function HUMO_Parse(fileName) {
    const inputFilePath = path.resolve(path.join(__dirname, '../temp/' + fileName));

    var db = new sqlite3.Database(path.resolve(path.join(__dirname, '../db/main.db')), sqlite3.OPEN_READWRITE)
    
    const inputFile = await fsPromises.readFile(inputFilePath);
    if (!fs.existsSync(inputFilePath)) {
        reject('error');
    }

    const parsedResult = await parseCSV(inputFile, {
        delimiter: '\t',
        //from_line: 3,
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
        columns: ['h1', 'Handling_Unit', 'Shipment', 'Create_On', 'Create_Time']


    });

    console.log('total import line:' + parsedResult.length)
    const dataLength = parsedResult.length

    return new Promise(async function(resolve, reject) {
        for await ( const row of parsedResult) {

            
            db.run(`update TBL_ZAVGR043_Prod
            set HU_ConfirmDate = '${row.Create_On}'
            , HU_ConfirmTime = '${row.Create_Time}'
            where ShipmentNo = '${row.Shipment}'`, function(error, row){
                if (error) {
                    reject(error)
                }
            })
        }

        db.exec(`update TBL_ZAVGR043_Prod
        set HU_ConfirmDate = replace(HU_ConfirmDate, '/','-')
        , TO_ConfirmDate = replace(TO_ConfirmDate,'/','-')
        , CreateOn = replace(CreateOn, '/','-')
        , EntryDate = replace(EntryDate,'/','-')
        , ShipmentCreateDate = replace(ShipmentCreateDate, '/','-')`)
        resolve('close')
        db.close();
    }).then(null, () => {
        console.log('update failed')
    })

    
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



module.exports = { ZAVGR043_Pares, LT22_Pares, VL06F_Pares, Manifest_Parse, HUMO_Parse }