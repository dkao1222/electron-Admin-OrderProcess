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


async function LT22_Pares(fileName, plant) {
    const inputFilePath = path.resolve(path.join(__dirname, '../temp/' + fileName));

    //const inputFilePath = path.resolve(tempDir + '/' +fileName);
    const inputFile = await fsPromises.readFile(inputFilePath);
    const parsedResult = await parseCSV(inputFile, {
        delimiter: '\t',
        //from_line: 3,
        
        relax_quotes: true,
        relax_column_count: true,
        skip_empty_lines: true,
        skip_lines_with_error: true,
        //ignore_last_delimiters: true,
        quote: false,
        trim: true,
        columns: ['h1', 'Item', 'TO_Number', 'h19', 'Material', 'h20', 'Source_Typ', 'Source_Bin', 'Source_Target_Qty', 'Dest_Typ', 'Dest_Bin', 'Dest_Target_Qty', 'User1', 'Time', 'Created_On', 'Conf_Date', 'Conf_Time', 'User2', 'CS', 'Batch', 'ActQty', 'Quene','SrceQuant', 'DstnQuant'],
        //columns: true,
    });

    //console.log('parsedResult', parsedResult);
    var db = new sqlite3.Database(path.resolve(path.join(__dirname, '../db/main.db')), sqlite3.OPEN_READWRITE, function (err) {
        if (err) {
            console.log('connecct to DB error', err.message)
            db.close
        }
    })
    db.serialize(function () {
        db.exec('delete from LT22_Temp', function (err, rows) {
            if (err) {
                console.log(`find delete from LT22_Temp error: `, err.message)
            }
        })
    });
    console.log('total import LT22 line:' + parsedResult.length)
    const dataLength = parsedResult.length


    /*var insertSmt = db.prepare(`insert into LT22_Temp (
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
        )`)*/
    var insertString = ''
    for await (const row of parsedResult) {

        if (typeof (row.Batch) == 'undefined') { var Batch = null } else { var Batch = row.Batch }
        if (typeof (row.CS) == 'undefined') { var CS = null } else { var CS = row.CS }
        if (typeof (row.User1) == 'undefined') { var User1 = null } else { var User1 = row.User1 }
        if (typeof (row.User2) == 'undefined') { var User2 = null } else { var User2 = row.User2 }

        /*insertSmt.run(plant
            ,row.Item
            ,row.TO_Number
            ,''
            ,row.Material
            ,''
            ,row.Source_Typ
            ,row.Source_Bin
            ,row.Source_Target_Qty
            ,row.Dest_Typ
            ,row.Dest_Bin
            ,row.Dest_Target_Qty
            ,User1
            ,row.Time
            ,row.Created_On
            ,row.Conf_Date
            ,row.Conf_Time
            ,User2
            ,CS
            ,Batch, function(err, rows) {
                if (err) {
                    console.log('insert LT22 err:' + err)
                }
            })*/
        let query = `insert into LT22_Temp (
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
                                    "Batch",	
                                    "ActQty",
                                    "Quene",
                                    "ScreQuant",
                                    "DstnQuant"
                                ) values ('${plant}'
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
                                ,'${row.ActQty}'
                                ,'${row.Quene}'
                                ,'${row.ScreQuant}'
                                ,'${row.DstnQuant}'
                                );`
                                
        //insertString += query

        db.run(query, function (err, rows) {
            if (err) {
                //return console.log(`find  error: `, err.message)
                console.log('insert into LT22_Temp:' + err.message)
            }
        })




    }




    return new Promise(async function (resolve, reject) {
        db.serialize(function () {
            //insertSmt.finalize();
            /*db.serialize(function(){
                db.exec('delete from LT22_Temp', function (err, rows) {
                    if (err) {
                        console.log(`find delete from LT22_Temp error: `, err.message)
                    }
                })
            });
            db.serialize(function () {
                db.exec(insertString, function (err, rows) {
                    if (err) {
                        //return console.log(`find  error: `, err.message)
                        console.log(err.message)
                    }
                })
            })*/
            db.serialize(function () {
                db.run(`update LT22_Temp
                            set Conf_User = NULL
                            where Conf_User = 'null' or Conf_User = '';`, function (err, rows) {
                    if (err) {
                        //return console.log(`find  error: `, err.message)
                        console.log('update LT22_Temp:' + err.message)
                    }
                })

                db.run(`update LT22_Temp
                            set "CS" = NULL
                            where "CS" = 'null' or "CS" = '';`, function (err, rows) {
                    if (err) {
                        //return console.log(`find  error: `, err.message)
                        console.log('update LT22_Temp:' + err.message)
                    }
                })

                db.run(`update LT22_Temp
                            set "Batch" = NULL
                            where "Batch" = 'null' or "Batch" = '';`, function (err, rows) {
                    if (err) {
                        //return console.log(`find  error: `, err.message)
                        console.log('update LT22_Temp:' + err.message)
                    }
                })
            })
            db.serialize(function () {
                db.run(`update TBL_LT22_Prod
                        set Conf_date = t."Conf_date"
                        ,Conf_time = t."Conf.t"
                        ,Conf_User = t.Conf_User
                        ,Dest_targetqty = t.Dest_targetqty
                        ,ActQty = t.ActQty
                        ,Quene = t.Quene
                        ,ScreQuant = t.ScreQuant
                        ,DstnQuant = t.DstnQuant
                        from ( select * from LT22_Temp ) as t
                        where TBL_LT22_Prod.AutiId = t.field1||'_'||t.TONumber||t.Item;`, function (err, rows) {
                    if (err) {
                        //return console.log(`find  error: `, err.message)
                        console.log('update TBL_LT22_Prod:' + err.message)
                    }
                })
            })

            db.serialize(function () {
                db.run(`insert into TBL_LT22_Prod (AutiId,"Item", TONumber, Material, Source_Typ , Source_Bin, Sourcetargetqty, Dest_Typ, Dest_Bin, Dest_targetqty, Cre_User, "Time", CreatedOn, Conf_date, "Conf_time", Conf_User, "CS", "Batch", "ActQty", "Quene", "ScreQuant", "DstnQuant")
                select LT22_Temp.field1||'_'||LT22_Temp.TONumber ||'_'||LT22_Temp.Item 
                ,LT22_Temp.Item
                ,LT22_Temp.TONumber
                ,LT22_Temp.Material
                ,LT22_Temp.Source_Typ 
                ,LT22_Temp.Source_Bin
                ,LT22_Temp.Sourcetargetqty
                ,LT22_Temp.Dest_Typ
                ,LT22_Temp.Dest_Bin
                ,LT22_Temp.Dest_targetqty
                ,LT22_Temp.Cre_User
                ,LT22_Temp."Time"
                ,LT22_Temp.CreatedOn
                ,LT22_Temp.Conf_date
                ,LT22_Temp."Conf.t"
                ,LT22_Temp.Conf_User
                ,LT22_Temp."CS"
                ,LT22_Temp."Batch"
                ,LT22_Temp."ActQty"
                ,LT22_Temp."Quene"
                ,LT22_Temp."ScreQuant"
                ,LT22_Temp."DstnQuant"
                    from LT22_Temp left join TBL_LT22_Prod
                    on LT22_Temp.field1||'_'||LT22_Temp.TONumber ||'_'||LT22_Temp.Item  = TBL_LT22_Prod.AutiId
                where TBL_LT22_Prod.AutiId is null and LT22_Temp.TONumber ||'_'||LT22_Temp.Item not in ('_' , 'TO Number_Item') ;`, function (err, rows) {
                    if (err) {
                        console.log(`insert into TBL_LT22_Prod: `, err.message)
                        
                    }
                    console.log('insert LT22 Prod close')
                })
                db.run(` update TBL_LT22_Prod
                set CS = 'C'
                from (
                select * from TBL_LT22_Prod
                where Dest_targetqty <> ActQty
                and Conf_date <> ''
                ) t
                where TBL_LT22_Prod.AutiId = t.AutiId`, function (err, rows) {
                    if (err) {
                        reject(`Update TBL_LT22_Prod cancel request: `, err.message)
                        
                    }
                    resolve('Update TBL_LT22_Prod cancel request')
                })
                /*db.run(`delete from TBL_LT22_Prod where CS = 'C'`, function (err, rows) {
                    if (err) {
                        console.log(`remove TBL_LT22_Prod cancel request: `, err.message)
                        reject(err.message)
                    }
                    resolve('remove TBL_LT22_Prod cancel request')
                })*/
            })
            db.serialize(function () {
                db.close()

            })

            /*db.serialize(function() {
                db.close()
               
            })*/

        })







        /*db.get('select max(ROWID) as [Total] from LT22_Temp ', function (err, row) {
            if (err) {
                console.log(err)
                reject(err)
            }
            if (row['Total'] == dataLength) {
                resolve('close')
            }
                /*db.exec(`insert into LT22_insert (task_string) values ('lt22_done')`,function (err, row) {
                    if (err) {
                        console.log(`find insert into LT22_insert error: `,err.message)
                    }
                    
                    //resolve('close')
                })
                db.get('select count(task_string) as Total from  LT22_insert', function(err, row) {
                    if(err) {
                        reject(err)
                    }
                    console.log(row['task_string'])
                    if(row['task_string'] == 0) {
                        resolve('close')
                    }
                })*/

        /*db.serialize(function () {
            db.exec(`update LT22_Temp
                set Conf_User = NULL
                where Conf_User = 'null' or Conf_User = '';
                
                update LT22_Temp
                set "CS" = NULL
                where "CS" = 'null' or "CS" = '';
                
                update LT22_Temp
                set "Batch" = NULL
                where "Batch" = 'null' or "Batch" = '';`, function (err, rows) {
                if (err) {
                    console.log(`find update LT22_Temp error: `, err.message)
                    reject(err.message)
                }
            })
            db.exec(`update TBL_LT22_Prod
                set Conf_date = t."Conf_date"
                ,Conf_time = t."Conf.t"
                ,Conf_User = t.Conf_User
                from ( select * from LT22_Temp ) as t
                where TBL_LT22_Prod.AutiId = t.field1||'_'||t.TONumber||t.Item;
            `,function (err, rows) {
                if (err) {
                    console.log(`find update TBL_LT22_Prod error: `, err.message)
                    reject(err.message)
                }
            })
            db.exec(`insert into TBL_LT22_Prod (AutiId,"Item", TONumber, Material, Source_Typ , Source_Bin, Sourcetargetqty, Dest_Typ, Dest_Bin, Cre_User, "Time", CreatedOn, Conf_date, "Conf_time",
                Conf_User, "CS", "Batch")
            select LT22_Temp.field1||'_'||LT22_Temp.TONumber ||'_'||LT22_Temp.Item 
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
                on LT22_Temp.field1||'_'||LT22_Temp.TONumber ||'_'||LT22_Temp.Item  = TBL_LT22_Prod.AutiId
            where TBL_LT22_Prod.AutiId is null and LT22_Temp.TONumber ||'_'||LT22_Temp.Item not in ('_' , 'TO Number_Item') ;`, function (err, rows) {
                if (err) {
                    console.log(`find insert into TBL_LT22_Prod error: `, err.message)
                    reject(err.message)
                }
            })
            

        })*/

        //db.close






        //})
        try {
            if (fs.existsSync(path.resolve(__dirname, '../temp/LT22.txt'))) {
                fs.unlinkSync(path.resolve(__dirname, '../temp/LT22.txt'))
                //resolve('close')
                //db.close
            }
        } catch (err) {
            reject(err)
        }

        //resolve('close');
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

    db.exec('delete from ZAVGR043_Temp', function (err, rows) {
        if (err) {
            return console.log(`find  error: `, err.message)
        }
    })
    db.exec(`pragma journal_mode = WAL;
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

        }


        insertSmt.finalize();
        db.serialize(function () {
            /*db.exec(`insert into zavgr043_insert (task_string) values ('zavgr043_done')`,function (err, row) {
                if (err) {
                    console.log(err)
                }
                
            })*/
            db.get('select count(field1) as [Total] from zavgr043_temp ', function (err, row) {
                if (err) {
                    console.log(err)
                }
                //console.log(row)
                if (row['Total'] = dataLength) {
                    resolve('close')
                }
            })
            db.close();

        })







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
async function ZAVGR043_Inv_Pares(fileName) {

    //return new Promise(async function (resolve, reject) {



    const inputFilePath = path.resolve(path.join(__dirname, '../temp/' + fileName));


    //const inputFilePath = path.resolve(tempDir + '/' +fileName);
    const inputFile = await fsPromises.readFile(inputFilePath);
    if (!fs.existsSync(inputFilePath)) {
        reject('error');
    }


    var db = new sqlite3.Database(path.resolve(path.join(__dirname, '../db/main.db')), sqlite3.OPEN_READWRITE)

    db.exec('delete from ZAVGR043_Inv_Temp', function (err, rows) {
        if (err) {
            return console.log(`find  error: `, err.message)
        }
    })
    db.exec(`pragma journal_mode = WAL;
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

    var insertSmt = db.prepare(`INSERT INTO ZAVGR043_Inv_Temp (
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

        }


        insertSmt.finalize();
        db.serialize(function () {
            /*db.exec(`insert into zavgr043_insert (task_string) values ('zavgr043_done')`,function (err, row) {
                if (err) {
                    console.log(err)
                }
                
            })*/
            db.get('select count(field1) as [Total] from zavgr043_temp ', function (err, row) {
                if (err) {
                    console.log(err)
                }
                //console.log(row)
                if (row['Total'] = dataLength) {
                    resolve('close')
                }
            })
            db.close();

        })







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
        columns: ['h1', 'Delivery', 'Shipto', 'Ship_Customer_Name', 'Ship_Customer_City']

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

async function VT22_Pares(fileName) {
    const inputFilePath = path.resolve(path.join(__dirname, '../temp/' + fileName));

    var db = new sqlite3.Database(path.resolve(path.join(__dirname, '../db/main.db')), sqlite3.OPEN_READWRITE)

    const inputFile = await fsPromises.readFile(inputFilePath);
    if (!fs.existsSync(inputFilePath)) {
        reject('error');
    }

    const parsedResult = await parseCSV(inputFile, {
        delimiter: '\t',
        from_line: 3,
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
        columns: ['h1','Shipment','DocNumber', 'User','h2','Coo_Date','h3','Coo_Time','Transaction', "Language_Key" ]


    });
    //console.log(parsedResult)
    console.log('total import line:' + parsedResult.length)
    const dataLength = parsedResult.length

    return new Promise(async function (resolve, reject) {
        for await (const row of parsedResult) {


            db.run(`update TBL_ZAVGR043_Prod
            set COO_DocNumber = '${row.DocNumber}'
            , COO_User = '${row.User}'
            , COO_Date = '${row.Coo_Date}'
            , COO_Time = '${row.Coo_Time}'
            , COO_Transaction = '${row.Transaction}'
            where TBL_ZAVGR043_Prod.ShipmentNo = '${row.Shipment}'`, function (error, row) {
                if (error) {
                    console.log(error)
                }
            })
        }
        resolve('close')
        
    })
}

async function Manifest_Parse(fileName) {
    const inputFilePath = path.resolve(path.join(__dirname, '../temp/' + fileName));

    var db = new sqlite3.Database(path.resolve(path.join(__dirname, '../db/main.db')), sqlite3.OPEN_READWRITE)
    db.serialize(function () {
        db.exec('drop table IF EXISTS manifest', function (error, row) {
            if (error) {
                console.log(error)
            }
        })
        db.exec(`create table IF NOT EXISTS manifest (
            Status
            ,Ship_Date
            ,Ship_Time
            ,Ship_from
            ,Delivery_Shipment
            ,Total_Packages
            ,Handling_Unit
            ,Tracking_Number
            ,Package_Weight
            ,Weight_Uom
            ,Shipping_Carrier
            ,ECSID
            ,Ship_Method
            ,Shipping_Cond
            ,Dimensions
            ,Dimensions_Uom
            ,Company
            ,Address1
            ,Address2
            ,ShipToCity
            ,ShipToState
            ,ShipToPostal_Code
            ,ShipToCountry
        );`, function (error, row) {
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
        columns: ['h1',	'Status',	'Ship_Date',	'Ship_Time',	'Ship_from',	'Delivery_Shipment',	'Total_Packages',	'Handling_Unit',	'Tracking_Number',	'Package_Weight',	'Weight_Uom',	'Shipping_Carrier',	'ECSID',	'Ship_Method',	'Shipping_Cond',	'Dimensions',	'Dimensions_Uom',	'Company',	'Address1',	'Address2',	'ShipToCity',	'ShipToState',	'ShipToPostal_Code',	'ShipToCountry']


    });

    console.log('total import line:' + parsedResult.length)
    const dataLength = parsedResult.length

    return new Promise(async function (resolve, reject) {
        for await (const row of parsedResult) {
            db.serialize(function () {
                db.run(`insert into manifest(Status	
                    ,Ship_Date	
                    ,Ship_Time	
                    ,Ship_from	
                    ,Delivery_Shipment	
                    ,Total_Packages	
                    ,Handling_Unit	
                    ,Tracking_Number	
                    ,Package_Weight	
                    ,Weight_Uom	
                    ,Shipping_Carrier	
                    ,ECSID	
                    ,Ship_Method	
                    ,Shipping_Cond	
                    ,Dimensions	
                    ,Dimensions_Uom	
                    ,Company	
                    ,Address1	
                    ,Address2	
                    ,ShipToCity	
                    ,ShipToState	
                    ,ShipToPostal_Code	
                    ,ShipToCountry) 
                values ('${row.Status}',
                '${row.Ship_Date}',
                '${row.Ship_Time}',
                '${row.Ship_from}',
                '${row.Delivery_Shipment}',
                '${row.Total_Packages}',
                '${row.Handling_Unit}',
                '${row.Tracking_Number}',
                '${row.Package_Weight}',
                '${row.Weight_Uom}',
                '${row.Shipping_Carrier.replace('\'','')}',
                '${row.ECSID}',
                '${row.Ship_Method}',
                '${row.Shipping_Cond.replace('\'','')}',
                '${row.Dimensions}',
                '${row.Dimensions_Uom}',
                '${row.Company.replace('\'','')}',
                '${row.Address1.replace('\'','')}',
                '${row.Address2.replace('\'','')}',
                '${row.ShipToCity.replace('\'','')}',
                '${row.ShipToState}',
                '${row.ShipToPostal_Code}',
                '${row.ShipToCountry}'
                )`, function (error, row) {
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
                    console.log('import done')
                }
            })
        })

        db.serialize(function () {
            db.exec(`update TBL_ZAVGR043_Prod
            set Handling_Unit = t.Handling_Unit
            , Tracking_Number = t.Tracking_Number
            , Carrier = t.Ship_Method
            , ShippingCarrier = t.Shipping_Carrier
            from (
                select * from manifest
            ) as t
            where TBL_ZAVGR043_Prod.ShipmentNo = t.Delivery_Shipment`, function(err) {
                if(err) {
                    reject(err)
                }
                //resolve('close')
            })

            db.exec(`delete from manifest where Handling_Unit in ( select Handling_Unit from TBL_Manifest) `, function(err) {
                if(err) {
                    reject(err)
                }
                //resolve('close')
            })
            db.exec(`insert into TBL_Manifest (Status	
                ,Ship_Date	
                ,Ship_Time	
                ,Ship_from	
                ,Delivery_Shipment	
                ,Total_Packages	
                ,Handling_Unit	
                ,Tracking_Number	
                ,Package_Weight	
                ,Weight_Uom	
                ,Shipping_Carrier	
                ,ECSID	
                ,Ship_Method	
                ,Shipping_Cond	
                ,Dimensions	
                ,Dimensions_Uom	
                ,Company	
                ,Address1	
                ,Address2	
                ,ShipToCity	
                ,ShipToState	
                ,ShipToPostal_Code	
                ,ShipToCountry) select * from manifest `, function(err) {
                    if(err) {
                        console.log(err)
                    }
                    //resolve('close')
            })
            db.exec(`update HAWB_ShipmentData
            set Manifest_Tracking = t.Tracking_Number
            from ( 
                select * from TBL_Manifest
            ) t
            where HAWB_ShipmentData.ShipmentNo = t.Delivery_Shipment`, function(err) {
                if(err) {
                    reject(err)
                }
                resolve('close')
        })
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
        columns: ['h1', 'Handling_Unit', 'Shipment', 'Create_On', 'Create_Time', 'Create_By','Change_On','Change_Time','Change_By', 'Width','Length','Height']


    });

    console.log('total import line:' + parsedResult.length)
    const dataLength = parsedResult.length

    return new Promise(async function (resolve, reject) {
        for await (const row of parsedResult) {


            db.run(`update TBL_ZAVGR043_Prod
            set HU_ConfirmDate = '${row.Create_On}'
            , HU_ConfirmTime = '${row.Create_Time}'
            where ShipmentNo = '${row.Shipment}'`, function (error, row) {
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

async function ZAMTR002_Parse(fileName) {
    const inputFilePath = path.resolve(path.join(__dirname, '../temp/' + fileName));

    var db = new sqlite3.Database(path.resolve(path.join(__dirname, '../db/main.db')), sqlite3.OPEN_READWRITE)

    const inputFile = await fsPromises.readFile(inputFilePath);
    if (!fs.existsSync(inputFilePath)) {
        reject('error');
    }

    const parsedResult = await parseCSV(inputFile, {
        delimiter: '\t',
        from_line: 3,
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
        columns: ['h1', 'Delivery',	'ShipmentNo',	'DelItem',	'Created_On',	'Del_Time',	'DPrio',	'ShipToParty',	'Cty',	'Bill_Doc',	'Ref_Doc',	'RefItm',	'Shpt',	'Plant',	'Material_Number',	'BuN',	'ProformaUnitCost',	'Curr',	'Typ',	'Source_Bin',	'Targ_Qty',	'VendorNo',	'TO_Number',	'TOItem',	'TOConfDate',	'TOConfTime',	'TO_Conf_Qty',	'To_Diff_Qty',	'Adj_Diff_Qty',	'PGIQty',	'PGIDate',	'PGITime',	'Mat_Doc']


    });
    //console.log(parsedResult)
    console.log('total import line:' + parsedResult.length)
    const dataLength = parsedResult.length

    return new Promise(async function (resolve, reject) {
        for await (const row of parsedResult) {


            db.run(`update TBL_LT22_Prod
            set ProformaUnitCost = '${row.ProformaUnitCost}'
            ,Curr = '${row.Curr}'
            ,Rcv_Plant = '${row.Plant}'
            ,Ref_Doc = '${row.Ref_Doc}'
            ,Ref_Item = '${row.RefItm}'
            ,Mat_Doc = '${row.Mat_Doc}'
            ,PGI_Qty = '${row.PGIQty}'
            ,TO_Conf_Qty = '${row.TO_Conf_Qty}'
            ,To_Diff_Qty = '${row.To_Diff_Qty}'
            ,Adj_Diff_Qty = '${row.Adj_Diff_Qty}'
            ,Conf_date = '${row.TOConfDate}'
            ,Conf_time = '${row.TOConfTime}'
            ,ActQty = '${row.TO_Conf_Qty}'
            ,BUom = '${row.BuN}'
            ,VendorNo = '${row.VendorNo}'
            where Dest_Bin = '${row.Delivery}'
            and Material = '${row.Material_Number}'
            and TBL_LT22_Prod.TONumber = '${row.TO_Number}'
            and TBL_LT22_Prod.Item = '${row.TOItem}'
            --and ProformaUnitCost is null`, function (error, row) {
                if (error) {
                    console.log(error)
                }
            })
        }
        db.serialize(function() {
            db.exec(`update TBL_ZAVGR043_Prod set Unit_Cost_Check = 1
            from (
                select * from TBL_LT22_Prod
            ) t
            where TBL_ZAVGR043_Prod.Delivery = t.Dest_Bin
            and t.ProformaUnitCost is not null`, function(err) {
                if(err) {
                    reject(err)
                }
                resolve('close')
            })
        })
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



module.exports = { ZAVGR043_Pares, LT22_Pares, VL06F_Pares, Manifest_Parse, HUMO_Parse, ZAMTR002_Parse, ZAVGR043_Inv_Pares, VT22_Pares }