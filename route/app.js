const express = require('express')
const routes = require('./services');
const ejs = require("ejs");
//const cors = require('cors');
const http = require('http')
const bwipjs = require('bwip-js');
const Excel = require('exceljs');
const { spawn, exec, spawnSync, execSync } = require('child_process');

const { hostGet, hostSet } = require('../db/dbConfig/hostConfig')

const apps = express();
var os = require('os');
const path = require('path')
const sqlite3 = require('sqlite3').verbose()

let posts = require('../db/dbConfig/dbMain');
const { app } = require('electron');

const host = hostGet().then(function (response) {

  console.log(response)
  if (response[0].Status == 1) {
    console.log('app, c')
    return os.hostname().toLowerCase();



  } else {
    console.log('app, d')
    return response[0].hostname

  }


});

/*
const hostConfig = require('../db/dbConfig/hostConfig')

const host = hostConfig.hostGet().then(function (response) {
  console.log(response)

  if (response.Status = 1) {
    console.log('c')
    return os.hostname().toLowerCase();
F
    

  } else {
    console.log('d')
    return response.hostname
    
  }
})
*/


//const host = os.hostname().toLowerCase();

//const host = configPost.configPost('select * from hostnameConfig;').hostname
const port = '3000'

const ip = require('dns').lookup(require('os').hostname(), function (err, add, fam) {
  console.log('addr: ' + add);

})

apps.use(function (req, res, next) {

  let url = 'http://' + host + ':3000'
  let ips = 'http://' + ip + ':3000'

  const allowedOrigins = [url, ips];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    // Website you wish to allow to connect

    res.setHeader('Access-Control-Allow-Origin', origin);

  }

  //res.setHeader('Access-Control-Allow-Origin', url);
  //res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});


//+'\\node_modules\\dsmorse-gridster\\dist''

apps.use('/bootstrap', express.static(path.join(__dirname, '../node_modules/bootstrap')))
apps.use('/bwip', express.static(path.join(__dirname, '../node_modules/bwip-js/dist')))
apps.use('/jquery', express.static(path.join(__dirname, '../node_modules/jquery')))
apps.use('/popper', express.static(path.join(__dirname, '../node_modules/@popperjs\\core')))
apps.use('/ionicons', express.static(path.join(__dirname, '../node_modules/ionicons')))



apps.use(express.static('public'))
//require('../public/assist/img')
apps.use('/img', express.static(path.resolve(__dirname, '../public/assist/img')))
apps.use('/functionJS', express.static(path.resolve(__dirname, '../public/function')))
apps.use('/functions', express.static(path.resolve(__dirname, '../views/functions')))




apps.engine('ejs', ejs.__express);
apps.set('views', path.resolve(__dirname, '../views'))

//apps.set('view engine', 'ejs')
apps.get('/get/query', (req, res) => {

  console.log(req.query.table)
  console.log(req.query.query)
  var query = ""
  if (typeof (req.query.query) == 'undefined') {
    query = "select * from " + req.query.table + " "
  } else {
    query = "select * from " + req.query.table + " " + req.query.query
  }

  posts.getPosts(query).then(function (response) {
    //res.send(JSON.stringify(response))
    res.json(response)
  })


})

apps.post('/post/set/rule', (req, res) => {

  req.query.country
  req.query.condition
  req.query.shpt
  req.query.shipto
  req.query.forward
  req.query.mon
  req.query.tue
  req.query.wed
  req.query.thu
  req.query.fri
  req.query.sat
  req.query.sun

  posts.setInsertHAWBRule(req.query.country,
    req.query.condition,
    req.query.shpt,
    req.query.shipto,
    req.query.forward,
    req.query.mon,
    req.query.tue,
    req.query.wed,
    req.query.thu,
    req.query.fri,
    req.query.sat,
    req.query.sun,
    req.query.explan).then(function (response) {
      res.json(response)
    })
})

apps.post('/post/set/zavgr043Prod', (req, res) => {

  req.query.country
  req.query.condition
  req.query.shpt
  req.query.shipto
  req.query.forward

  posts.setInsert043FromTemp().then(function (response) {
    res.json(response)
  })
})


apps.get('/get/temp/ZAVGR043dd/:inputvalues', (req, res) => {

  console.log(req.params.inputvalues)
  var query = ""
  if (req.params.inputvalues = 'temp_history') {
    query = 'select * from ZAVGR043_Temp limit 2'
  }


  //const getData = getQuery('select * from ZAVGR043_Temp')

  var rawdata = [];
  var db = new sqlite3.Database(path.resolve(__dirname, '../db/main.db'), sqlite3.OPEN_READWRITE)
  db.all(query, [], function (err, rows) {
    if (err) {

      return console.log(`find ${req.params.inputvalues} error: `, err.message)
    }
    res.send(JSON.stringify(rows))
  })

  db.close

  console.log('getData: ' + rawdata)

  //res.end()





})

apps.get('/get/function/:inputvalues', (req, res) => {

  console.log(req.params.inputvalues)
  if (req.params.inputvalues = 'ruleassign') {
    const title = 'Function'
    const menuTitle = 'Rule Assign'
    const rendeData = { hostname: host, title: title, menuTitle: menuTitle }

    res.render('ruleassign.ejs', rendeData)
  }



})


apps.get('/get/information/:inputvalues', (req, res) => {

  console.log(req.params.inputvalues)

  if (req.params.inputvalues == 'country') {
    var db = new sqlite3.Database(path.resolve(__dirname, '../db/main.db'), sqlite3.OPEN_READWRITE)
    let query = "select Country from HAWB_Country"
    db.all(query, [], function (err, rows) {
      if (err) {

        return console.log(`find ${req.params.inputvalues} error: `, err.message)
      }

      res.send(JSON.stringify(rows));
    })

    db.close
  }
  //res.end();



})

apps.post('/post/InformationSet', async (req, res) => {
  req.query.function
  req.query.queryDate
  req.query.shipmentNo
  req.query.vendor
  req.query.hawb
  req.query.pkgDescription

  console.log(req.query.function)
  console.log(req.query.queryDate)
  console.log(req.query.shipmentNo)
  console.log(req.query.type)
  console.log(req.query.pickupDateTime)
  var query = ''
  var db = new sqlite3.Database(path.join(__dirname, '../db/main.db'), sqlite3.OPEN_READWRITE)

  if (req.query.function == 'zavgr043temp') {

    console.log(req.query.row)
  }

  if (req.query.function == 'vendorchange') {

    db.serialize(function () {
      query = `update HAWB_ShipmentData set Vendor = case when Vendor <> '${req.query.vendor}' or Vendor is null then '${req.query.vendor}' else Vendor end
          ,M_HAWB = case when Vendor <> '${req.query.vendor}' or Vendor is null then null else M_HAWB end
          ,D_HAWB = case when Vendor <> '${req.query.vendor}' or Vendor is null then null else D_HAWB end
          where ShipmentNo = '${req.query.shipmentNo}';`
      let startWith1 = `UPDATE HAWB_ShipmentData
      set Start_With = t.Start_With
      from (
          select * from HAWB_Import_Check
      ) as t
      where HAWB_ShipmentData.Vendor = t.Vendor
      and HAWB_ShipmentData.DP = t.DP
      and HAWB_ShipmentData.SHPCondition = t.SHPCondition
      and HAWB_ShipmentData.plant = t.plant
      and HAWB_ShipmentData.Vendor is not null
      AND HAWB_ShipmentData.ShipmentNo = '${req.query.shipmentNo}';`

      let startWith2 = `UPDATE HAWB_ShipmentData
      set Start_With = t.Start_With
      from (
          select * from HAWB_Import_Check
      ) as t
      where HAWB_ShipmentData.Vendor = t.Vendor
      and HAWB_ShipmentData.DP = t.DP
      and t.SHPCondition is null
      and HAWB_ShipmentData.plant = t.plant
      and HAWB_ShipmentData.Vendor is not null
      AND HAWB_ShipmentData.ShipmentNo = '${req.query.shipmentNo}';`

      db.exec(query + startWith1 + startWith2, function (err, rows) {
        if (err) {

          console.log(`find ${req.params.inputvalues} error: `, err.message)
        }

      })

    })


    db.close


  }

  if (req.query.function == 'hawbChange') {
    /*if (req.query.vendor == 'CEVA') {*/
    let HAWBquery = `update HAWB_Primary set "check" = 1 where HAWB = '${req.query.hawb}';`
    let shipmenDataQuery = `update HAWB_ShipmentData set M_HAWB = '${req.query.hawb}' where shipmentNo = ${req.query.shipmentNo};`


    db.serialize(function () {
      db.exec(HAWBquery, function (err, rows) {
        if (err) {

          console.log(`find ${req.params.inputvalues} error: `, err.message)
        }

      })
      db.exec(shipmenDataQuery, function (err, rows) {
        if (err) {

          console.log(`find ${req.params.inputvalues} error: `, err.message)
        }

      })
      db.exec(`update HAWB_Primary
          set HAWB_Count_date = t.R_CutTime
          ,Shipto = t.Shipto
          from (
            select * from HAWB_ShipmentData
          ) as t
          where HAWB_Primary.HAWB = t.M_HAWB and HAWB_Count_date is null`, function (err, rows) {
        if (err) {

          console.log(`find ${req.params.inputvalues} error: `, err.message)
        }

      })
    })
    db.close

    /*}*/
  }

  if (req.query.function == 'deletShipment') {
    db.serialize(function () {


      db.exec(`update Order_ShipmentData_Downs
      set ShipmentNo = ShipmentNo ||'_'|| strftime('%Y-%m-%d %H:%M%s','now')
      , pkg_description = '${req.query.pkgDescription}'
      , Cancel_Check = 1
      where ShipmentNo = '${req.query.shipmentNo}'`)

      db.exec(`update Order_ShipmentData_AMT_Downs
      set ShipmentNo = ShipmentNo ||'_'|| strftime('%Y-%m-%d %H:%M%s','now')
      ,pkg_description = '${req.query.pkgDescription}'
      , Cancel_Check = 1
      where ShipmentNo = '${req.query.shipmentNo}'`)

      db.each(`update Order_ShipmentData_AMT
      set ShipmentNo = ShipmentNo ||'_'|| strftime('%Y-%m-%d %H:%M%s','now')
      ,pkg_description = '${req.query.pkgDescription}'
      , Cancel_Check = 1
      where ShipmentNo = '${req.query.shipmentNo}'`)

      db.exec(`update Order_ShipmentData_Regular
      set ShipmentNo = ShipmentNo ||'_'|| strftime('%Y-%m-%d %H:%M%s','now')
      ,pkg_description = '${req.query.pkgDescription}'
      , Cancel_Check = 1
      where ShipmentNo = '${req.query.shipmentNo}'`)

      db.exec(`update Order_ShipmentData_RegularTW
      set ShipmentNo = ShipmentNo ||'_'|| strftime('%Y-%m-%d %H:%M%s','now')
      ,pkg_description = '${req.query.pkgDescription}'
      , Cancel_Check = 1
      where ShipmentNo = '${req.query.shipmentNo}'`)

      // Update HAWB_ShipmentData
      db.exec(`update HAWB_ShipmentData
      set ShipmentNo = ShipmentNo ||'_'|| strftime('%Y-%m-%d %H:%M%s','now')
      where ShipmentNo = '${req.query.shipmentNo}'`)


      db.exec(`delete from TBL_LT22_Prod
      where Dest_Bin in (select Delivery from TBL_ZAVGR043_Prod where ShipmentNo = '${req.query.shipmentNo}')`)

      db.exec(`delete from TBL_LT22_Prod
      where Dest_Bin in (select WaveGrpNo from TBL_ZAVGR043_Prod where ShipmentNo = '${req.query.shipmentNo}')`)


      db.exec(`delete from TBL_ZAVGR043_Prod where ShipmentNo = '${req.query.shipmentNo}'`)



    })



    //res.render('control_log.ejs', rendeData)
    db.close
    res.send(`Delete Shipment: [${req.query.shipmentNo}] done `)

    //res.sendStatus(200)
  }
  if (req.query.function == 'updateShipment') {
    db.serialize(function () {
      db.exec(`update Order_ShipmentData_Downs
      set pkg_description = '${req.query.pkgDescription}'
      where ShipmentNo = '${req.query.shipmentNo}'`)

      db.exec(`update Order_ShipmentData_AMT_Downs
      set pkg_description = '${req.query.pkgDescription}'
      where ShipmentNo = '${req.query.shipmentNo}'`)

      db.each(`update Order_ShipmentData_AMT
      set pkg_description = '${req.query.pkgDescription}'
      where ShipmentNo = '${req.query.shipmentNo}'`)

      db.exec(`update Order_ShipmentData_Regular
      set pkg_description = '${req.query.pkgDescription}'
      where ShipmentNo = '${req.query.shipmentNo}'`)

      db.exec(`update Order_ShipmentData_RegularTW
      set pkg_description = '${req.query.pkgDescription}'
      where ShipmentNo = '${req.query.shipmentNo}'`)

      db.exec(`update TBL_ZAVGR043_Prod
      set pkg_description = '${req.query.pkgDescription}'
      where ShipmentNo = '${req.query.shipmentNo}'`)
    })
    db.close()
    res.send(`Update Shipment: [${req.query.shipmentNo}] tag: ${req.query.pkgDescription} `)
  }

  if (req.query.function == 'deleteDelivery') {
    db.serialize(function () {
      db.exec(`delete from TBL_LT22_Prod
      where Dest_Bin in (select Delivery from TBL_ZAVGR043_Prod where Delivery = '${req.query.Delivery}')`)

      /*db.exec(`delete from TBL_LT22_Prod
      where Dest_Bin in (select WaveGrpNo from TBL_ZAVGR043_Prod where ShipmentNo = '${req.query.Delivery}')`)*/


      db.exec(`delete from TBL_ZAVGR043_Prod where Delivery = '${req.query.Delivery}'`)

    })
    db.close
    res.send(`Delete Delivery: [${req.query.Delivery}] done `)
  }

  if (req.query.function == 'deleteWave') {
    db.serialize(function () {
      db.exec(`delete from TBL_LT22_Prod
      where Dest_Bin in (select Delivery from TBL_ZAVGR043_Prod where WaveGrpNo = '${req.query.WaveGrpNo}')`)

      /*db.exec(`delete from TBL_LT22_Prod
      where Dest_Bin in (select WaveGrpNo from TBL_ZAVGR043_Prod where ShipmentNo = '${req.query.Delivery}')`)*/


      db.exec(`delete from TBL_ZAVGR043_Prod where WaveGrpNo = '${req.query.WaveGrpNo}'`)

    })

    db.close
    res.send(`Delete WaveGrpNo: [${req.query.WaveGrpNo}] done `)
  }

  if (req.query.function == 'deleteTransferItem') {
    db.serialize(function () {
      db.exec(`delete from TBL_LT22_Prod
      where TOnumber = '${req.query.TOnumber}' and Item = '${req.query.TOitem}' and Material = '${req.query.Material}'
      --where Dest_Bin in (select Delivery from TBL_ZAVGR043_Prod where Delivery = '${req.query.Delivery}')`)
    })

    db.close
    res.send(`Delete TO#: [${req.query.TOnumber}], Item:[${req.query.TOitem}], Material:[${req.query.Material}] done `)
  }

  if (req.query.function == 'addShipmentToT1') {

    req.query.Shipment
    db.serialize(function () {
      db.exec(`--insert Shipemtn to CutTimeReport_Shipment
      insert into CutTimeReport_Shipment(ShipmentNo) values (${req.query.Shipment})
      `)
    })
    db.close
    res.send(`Add Shipment: ${req.query.Shipment}done `)
  }
  if (req.query.function == 'addShipmentToInvoceCheck') {
    req.query.Shipment
    db.serialize(function () {
      db.exec(`--insert Shipemtn to Invoice_Shipment
      insert into Invoice_Shipment(ShipmentNo) values (${req.query.Shipment})
      `)
    })
    db.close
    res.send(`Add Shipment: ${req.query.Shipment}done `)
  }
  if (req.query.function == 'clearShipmentToInvoceCheck') {
    req.query.Shipment
    db.serialize(function () {
      db.exec(`--insert Shipemtn to Invoice_Shipment
      delete from  Invoice_Shipment
      `)
    })
    db.close
    res.send(`Add Shipment: ${req.query.Shipment}done `)
  }
  if (req.query.function == 'changePickupDateTime') {
    db.exec(`update HAWB_ShipmentData
    set R_PickupTime = strftime('%Y-%m-%d %H:%M','${req.query.pickupDateTime}')
    where ShipmentNo = '${req.query.shipmentNo}'`, function (err) {
      if (err) {
        console.log(err)
      }
      res.send('close')
    })

  }

  if (req.query.function == 'cleanDatabase') {
    db.serialize(function () {
      db.exec(`
      delete from Order_ShipmentData_AMT;
      delete from Order_ShipmentData_AMT_Downs;
      delete from Order_ShipmentData_Downs;
      delete from Order_ShipmentData_Regular;
      delete from Order_ShipmentData_RegularTW;
      delete from TBL_ZAVGR043_Prod;
      delete from TBL_LT22_Prod;
      delete from HAWB_ShipmentData;
      delete from HAWB_Primary;
      delete from TBL_Manifest;

      `, function (err, row) {
        if (err) {
          console.log('clean DB err:' + err)
          res.sendStatus('404')
        }
        res.sendStatus('200')
      })
    })

  }

  if (req.query.function == 'transferWaitApproved') {
    var query = ''
    req.query.shipmentNo
    db.get(`select *, case when ShPt like '5%' then 5 when ShPt like '8%' then 8 else 0 end as C_ShPt  from ZAVGR043_Temp where ShipmentNo = ${req.query.shipmentNo}`, function (err, rows) {
      if (err) {
        console.log(err.message)
      }
      console.log(rows)
      if (rows.C_ShPt == 5) {
        if (rows.DP == 1 || rows.DP == 3) {
          query = `insert into Order_ShipmentData_Downs (Shpt, DP, SHPCondition, Country, Ordes,  StorageLocation, ShipTo, ShipmentNo )
            select Shpt, DP,ShippingCondition, Country, Orde, StorageLocation, "Ship-To", ShipmentNo from ZAVGR043_Temp
            where dp in (1,3) and OrderNotFinish_Control = 0 and Piece_Control = 0 and TOCreateItem > 0
            and OverallGMStatus = 'A' and  ShipmentNo <>''  and Shpt like '5%' and ShipmentNo = '${req.query.shipmentNo}'
            group by Shpt, DP,ShippingCondition, Country, Orde, StorageLocation, "Ship-To", ShipmentNo ;`

          db.exec(`-- insert new data to HAWB_ShipmentData
              insert into HAWB_ShipmentData (Shpt, DP, SHPCondition, Delivery, Country, "Items", Ordes,  StorageLocation, ShipTo, ShipmentNo )
              select Shpt, DP,ShippingCondition, Delivery, Country, "#Items", Orde, StorageLocation, "Ship-To", ShipmentNo from ZAVGR043_Temp where dp in (1,3) and Piece_Control = 0 and TOCreateItem > 0
              --and OverallPickingStatus = 'C'
              and OverallGMStatus = 'A' and ShipmentNo <>'' and Shpt like '5%' and Country not in ('TW') and ShipmentNo = '${req.query.shipmentNo}';`, function (err, rows) {
            if (err) {
              console.log(err.message)
            }
            console.log('insert new data to HAWB_ShipmentData 1')
          })

        } else {
          if (rows.Country == 'TW') {
            query = `insert into Order_ShipmentData_RegularTW (Shpt, DP, SHPCondition, Country, Ordes,  StorageLocation, ShipTo, ShipmentNo )
              select Shpt, DP,ShippingCondition, Country, Orde, StorageLocation, "Ship-To", ShipmentNo from ZAVGR043_Temp 
              where dp in (4) and OrderNotFinish_Control = 0 and Piece_Control = 0 and TOCreateItem > 0 
              --and OverallPickingStatus = 'C'
              and OverallGMStatus = 'A' and  ShipmentNo <>''  and Shpt like '5%' and Country in ('TW') and ShipmentNo = '${req.query.shipmentNo}'
              group by Shpt, DP,ShippingCondition, Country, Orde, StorageLocation, "Ship-To", ShipmentNo ;`

            /*db.run(`-- insert new data to HAWB_ShipmentData
              insert into HAWB_ShipmentData (Shpt, DP, SHPCondition, Delivery, Country, "Items", Ordes,  StorageLocation, ShipTo, ShipmentNo )
              select Shpt, DP,ShippingCondition, Delivery, Country, "#Items", Orde, StorageLocation, "Ship-To", ShipmentNo from ZAVGR043_Temp where dp in (1, 3) and CN_Ctrl_Parts = 0 and HAZ_Control = 0 and W_Parts_Control = 0 and UNR_Control = 0 and OrderNotFinish_Control = 0 and Piece_Control = 0 and TOCreateItem > 0
              and OverallPickingStatus = 'C'
              and OverallGMStatus = 'A' and ShipmentNo <>'' and Shpt like '5%' and Country not in ('TW') and  ShipmentNo = '${req.query.shipmentNo}'`, function (err, rows) {
              if (err) {
                console.log(err.message)
              }
              console.log('insert new data to HAWB_ShipmentData 1')
            })*/

          } else {
            query = `insert into Order_ShipmentData_Regular (Shpt, DP, SHPCondition, Country, Ordes,  StorageLocation, ShipTo, ShipmentNo )
              select Shpt, DP,ShippingCondition, Country, Orde, StorageLocation, "Ship-To", ShipmentNo from ZAVGR043_Temp  
              where dp in (4) and OrderNotFinish_Control = 0 and Piece_Control = 0 and TOCreateItem > 0 
              --and OverallPickingStatus = 'C'
              and OverallGMStatus = 'A' and  ShipmentNo <>''  and Shpt like '5%' and Country not in ('TW') and ShipmentNo = '${req.query.shipmentNo}' 
              group by Shpt, DP,ShippingCondition, Country, Orde, StorageLocation, "Ship-To", ShipmentNo ;`

            db.exec(`-- insert new data to HAWB_ShipmentData
              insert into HAWB_ShipmentData (Shpt, DP, SHPCondition, Delivery, Country, "Items", Ordes,  StorageLocation, ShipTo, ShipmentNo )
              select Shpt, DP,ShippingCondition, Delivery, Country, "#Items", Orde, StorageLocation, "Ship-To", ShipmentNo from ZAVGR043_Temp where dp in (4) and Piece_Control = 0 and TOCreateItem > 0
              --and OverallPickingStatus = 'C'
              and OverallGMStatus = 'A' and ShipmentNo <>'' and Shpt like '5%' and Country not in ('TW') and ShipmentNo = '${req.query.shipmentNo}';`, function (err, rows) {
              if (err) {
                console.log(err.message)
              }
              console.log('insert new data to HAWB_ShipmentData 1')
            })
          }
        }
      } else {
        if (rows.DP == 1 || rows.DP == 3) {
          query = `insert into Order_ShipmentData_AMT_Downs (Shpt, DP, SHPCondition, Country, Ordes,  StorageLocation, ShipTo, ShipmentNo )
            select Shpt, DP,ShippingCondition, Country, Orde, StorageLocation, "Ship-To", ShipmentNo from ZAVGR043_Temp 
            where dp in (1, 3) and OrderNotFinish_Control = 0 and Piece_Control = 0 and TOCreateItem > 0 
            --and OverallPickingStatus = 'C'
            and OverallGMStatus = 'A' and  ShipmentNo <>''  and Shpt not like '5%' and ShipmentNo = '${req.query.shipmentNo}'  
            group by Shpt, DP,ShippingCondition, Country, Orde, StorageLocation, "Ship-To", ShipmentNo ;`

        } else {
          query = `insert into Order_ShipmentData_AMT_Downs (Shpt, DP, SHPCondition, Country, Ordes,  StorageLocation, ShipTo, ShipmentNo )
            select Shpt, DP,ShippingCondition, Country, Orde, StorageLocation, "Ship-To", ShipmentNo from ZAVGR043_Temp 
            where dp in (1, 3) and OrderNotFinish_Control = 0 and Piece_Control = 0 and TOCreateItem > 0 
            --and OverallPickingStatus = 'C'
            and OverallGMStatus = 'A' and  ShipmentNo <>''  and Shpt not like '5%' and ShipmentNo = '${req.query.shipmentNo}' 
            group by Shpt, DP,ShippingCondition, Country, Orde, StorageLocation, "Ship-To", ShipmentNo ;`
        }
      }
      db.serialize(function () {
        db.exec(`-- insert new data to TBL_ZAVGR043_Prod
            INSERT INTO TBL_ZAVGR043_Prod (
            Shpt
            ,DP
            ,Delivery
            ,Country
            ,"Items"
            ,Ordes
            ,StorageLocation
            ,"ShipTo"
            ,Consignee
            ,CreateOn
            ,"CreateTime"
            ,TransferOrder
            ,TO_CreateDate
            ,TO_CreateTime
            ,ShipmentNo
            ,ShipmentCreateDate
            ,ShipmentCreateTime
            ,SHPCondition
            ,ProformaD
            ,Route
            ,SOrg
            ,Billoflading
            ,OvrPickingStus
            ,OvrWMStus
            ,OvrGMStus
            ,DivT
            ,CustomerPONo
            ,WaveGrpNo
            ,ShippingInstructions
            )
            SELECT Shpt
            ,DP
            ,Delivery
            ,Country
            ,"#Items"
            ,Orde
            ,StorageLocation
            ,"Ship-To"
            ,Consignee
            ,Createdon
            ,"Time"
            ,TransferOrder
            ,TOCreateDate
            ,TOCreateTime
            ,ShipmentNo
            ,ShipmentCreateDate
            ,ShipmentCreateTime
            ,ShippingCondition
            ,ProformaD
            ,Route
            ,SOrg
            ,Billoflading
            ,OverallPickingStatus
            ,OverallWMStatus
            ,OverallGMStatus
            ,DlvT
            ,"CustomerPONo."
            ,"WaveGrpNo."
            ,ShippingInstructions
            FROM ZAVGR043_Temp
            WHERE  TOCreateItem > 0
            --and OverallPickingStatus = 'C'
            and OverallGMStatus = 'A'
            AND ShipmentNo <> ''
            AND ShipmentNo = ${req.query.shipmentNo}`, function (err, rows) {
          if (err) {
            console.log(err.message)
          }
          console.log('insert new data to TBL_ZAVGR043_Prod')
        })
        db.exec(query, function (err) {
          if (err) {
            console.log(err)
          }
        })

        db.exec(`delete from ZAVGR043_Temp where ShipmentNo = ${req.query.shipmentNo}`, function (err, row) {
          if (err) {
            console.log(err)
          }

        })
        db.exec(`-- plant
                update Order_ShipmentData_Downs
                set plant = case when Shpt like '5%' then '54' else null end
                where plant is null;
                
                update Order_ShipmentData_Regular
                set plant = case when Shpt like '5%' then '54' else null end
                where plant is null;
                
                update Order_ShipmentData_AMT
                set plant = case when Shpt not like '5%' then '89' else null end
                where plant is null;`, function (err, rows) {
          if (err) {
            console.log(err.message)
          }
          console.log('Update plant')
        })

        db.exec(`-- Update Bond / non-Bonded
                Update Order_ShipmentData_Downs
                set Bonded = t.NonBonded
                ,NonBonded = t.Bonded
                ,TotalItem = t.total
                from (
                select 
                
                count(case when TBL_LT22_Prod.Source_Typ <> 'UNR' and TBL_LT22_Prod.Source_Typ like '%N%' then 'NB'  end ) as NonBonded 
                ,count(case when TBL_LT22_Prod.Source_Typ = 'UNR' or TBL_LT22_Prod.Source_Typ not like '%N%' then 'B'  end ) as Bonded 
                ,count(TBL_LT22_Prod.Material) as total
                
                , TBL_ZAVGR043_Prod.ShipmentNo
                from TBL_ZAVGR043_Prod inner join TBL_LT22_Prod
                on TBL_ZAVGR043_Prod.Delivery = TBL_LT22_Prod.Dest_Bin
                where TBL_ZAVGR043_Prod.ShipmentNo <> '' and TBL_LT22_Prod.Source_Typ not in ('922')
                and TBL_ZAVGR043_Prod.WaveGrpNo not like '200%'
                group by  TBL_ZAVGR043_Prod.ShipmentNo ) as t
                where Order_ShipmentData_Downs.ShipmentNo = t.ShipmentNo
                and Order_ShipmentData_Downs.Bonded + Order_ShipmentData_Downs.NonBonded = 0;
                
                Update Order_ShipmentData_AMT
                set Bonded = t.NonBonded
                ,NonBonded = t.Bonded
                ,TotalItem = t.total
                from (
                select 
                
                count(case when TBL_LT22_Prod.Source_Typ <> 'UNR' and TBL_LT22_Prod.Source_Typ like '%N%' then 'NB'  end ) as NonBonded 
                ,count(case when TBL_LT22_Prod.Source_Typ = 'UNR' or TBL_LT22_Prod.Source_Typ not like '%N%' then 'B'  end ) as Bonded 
                ,count(TBL_LT22_Prod.Material) as total
                
                , TBL_ZAVGR043_Prod.ShipmentNo
                from TBL_ZAVGR043_Prod inner join TBL_LT22_Prod
                on TBL_ZAVGR043_Prod.Delivery = TBL_LT22_Prod.Dest_Bin
                where TBL_ZAVGR043_Prod.ShipmentNo <> '' and TBL_LT22_Prod.Source_Typ not in ('922')
                and TBL_ZAVGR043_Prod.WaveGrpNo not like '200%'
                group by  TBL_ZAVGR043_Prod.ShipmentNo ) as t
                where Order_ShipmentData_AMT.ShipmentNo = t.ShipmentNo
                and Order_ShipmentData_AMT.Bonded + Order_ShipmentData_AMT.NonBonded = 0;
                
                Update Order_ShipmentData_AMT_Downs
                set Bonded = t.NonBonded
                ,NonBonded = t.Bonded
                ,TotalItem = t.total
                from (
                select 
                
                count(case when TBL_LT22_Prod.Source_Typ <> 'UNR' and TBL_LT22_Prod.Source_Typ like '%N%' then 'NB'  end ) as NonBonded 
                ,count(case when TBL_LT22_Prod.Source_Typ = 'UNR' or TBL_LT22_Prod.Source_Typ not like '%N%' then 'B'  end ) as Bonded 
                ,count(TBL_LT22_Prod.Material) as total
                
                , TBL_ZAVGR043_Prod.ShipmentNo
                from TBL_ZAVGR043_Prod inner join TBL_LT22_Prod
                on TBL_ZAVGR043_Prod.Delivery = TBL_LT22_Prod.Dest_Bin
                where TBL_ZAVGR043_Prod.ShipmentNo <> '' and TBL_LT22_Prod.Source_Typ not in ('922')
                and TBL_ZAVGR043_Prod.WaveGrpNo not like '200%'
                group by  TBL_ZAVGR043_Prod.ShipmentNo ) as t
                where Order_ShipmentData_AMT_Downs.ShipmentNo = t.ShipmentNo
                and Order_ShipmentData_AMT_Downs.Bonded + Order_ShipmentData_AMT_Downs.NonBonded = 0;
                
                Update Order_ShipmentData_Regular
                set Bonded = t.NonBonded
                ,NonBonded = t.Bonded
                ,TotalItem = t.total
                from (
                select 
                
                count(case when TBL_LT22_Prod.Source_Typ <> 'UNR' and TBL_LT22_Prod.Source_Typ like '%N%' then 'NB'  end ) as NonBonded 
                ,count(case when TBL_LT22_Prod.Source_Typ = 'UNR' or TBL_LT22_Prod.Source_Typ not like '%N%' then 'B'  end ) as Bonded 
                ,count(TBL_LT22_Prod.Material) as total
                
                , TBL_ZAVGR043_Prod.ShipmentNo
                from TBL_ZAVGR043_Prod inner join TBL_LT22_Prod
                on TBL_ZAVGR043_Prod.Delivery = TBL_LT22_Prod.Dest_Bin
                where TBL_ZAVGR043_Prod.ShipmentNo <> '' and TBL_LT22_Prod.Source_Typ not in ('922')
                and TBL_ZAVGR043_Prod.WaveGrpNo not like '200%'
                group by  TBL_ZAVGR043_Prod.ShipmentNo ) as t
                where Order_ShipmentData_Regular.ShipmentNo = t.ShipmentNo
                and Order_ShipmentData_Regular.Bonded + Order_ShipmentData_Regular.NonBonded = 0;
                
                Update Order_ShipmentData_RegularTW
                set Bonded = t.NonBonded
                ,NonBonded = t.Bonded
                ,TotalItem = t.total
                from (
                select 
                
                count(case when TBL_LT22_Prod.Source_Typ <> 'UNR' and TBL_LT22_Prod.Source_Typ like '%N%' then 'NB'  end ) as NonBonded 
                ,count(case when TBL_LT22_Prod.Source_Typ = 'UNR' or TBL_LT22_Prod.Source_Typ not like '%N%' then 'B'  end ) as Bonded 
                ,count(TBL_LT22_Prod.Material) as total
                
                , TBL_ZAVGR043_Prod.ShipmentNo
                from TBL_ZAVGR043_Prod inner join TBL_LT22_Prod
                on TBL_ZAVGR043_Prod.Delivery = TBL_LT22_Prod.Dest_Bin
                where TBL_ZAVGR043_Prod.ShipmentNo <> '' and TBL_LT22_Prod.Source_Typ not in ('922')
                and TBL_ZAVGR043_Prod.WaveGrpNo not like '200%'
                group by  TBL_ZAVGR043_Prod.ShipmentNo ) as t
                where Order_ShipmentData_RegularTW.ShipmentNo = t.ShipmentNo
                and Order_ShipmentData_RegularTW.Bonded + Order_ShipmentData_RegularTW.NonBonded = 0;
                
                Update Order_ShipmentData_Downs
                set Bonded = tt.NonBonded
                ,NonBonded = tt.Bonded
                ,TotalItem = tt.total
                from (
                select  NonBonded, Bonded , "total", Dest_Bin, TBL_ZAVGR043_Prod.ShipmentNo, TBL_ZAVGR043_Prod.WaveGrpNo from (
                select 
                count(case when TBL_LT22_Prod.Source_Typ <> 'UNR' and TBL_LT22_Prod.Source_Typ like '%N%' then 'NB'  end )  as NonBonded
                ,count(case when TBL_LT22_Prod.Source_Typ = 'UNR' or TBL_LT22_Prod.Source_Typ not like '%N%' then 'B'  end ) as Bonded 
                ,count(TBL_LT22_Prod.Material) as total
                , TBL_LT22_Prod.Dest_Bin
                from TBL_LT22_Prod
                group by TBL_LT22_Prod.Dest_Bin
                ) as t inner join TBL_ZAVGR043_Prod
                on t.Dest_Bin = TBL_ZAVGR043_Prod.WaveGrpNo
                ) as tt
                where Order_ShipmentData_Downs.ShipmentNo = tt.ShipmentNo
                and Order_ShipmentData_Downs.Bonded + Order_ShipmentData_Downs.NonBonded = 0;
                
                Update Order_ShipmentData_AMT
                set Bonded = tt.NonBonded
                ,NonBonded = tt.Bonded
                ,TotalItem = tt.total
                from (
                select  NonBonded, Bonded , "total", Dest_Bin, TBL_ZAVGR043_Prod.ShipmentNo, TBL_ZAVGR043_Prod.WaveGrpNo from (
                select 
                count(case when TBL_LT22_Prod.Source_Typ <> 'UNR' and TBL_LT22_Prod.Source_Typ like '%N%' then 'NB'  end )  as NonBonded
                ,count(case when TBL_LT22_Prod.Source_Typ = 'UNR' or TBL_LT22_Prod.Source_Typ not like '%N%' then 'B'  end ) as Bonded 
                ,count(TBL_LT22_Prod.Material) as total
                , TBL_LT22_Prod.Dest_Bin
                from TBL_LT22_Prod
                group by TBL_LT22_Prod.Dest_Bin
                ) as t inner join TBL_ZAVGR043_Prod
                on t.Dest_Bin = TBL_ZAVGR043_Prod.WaveGrpNo
                ) as tt
                where Order_ShipmentData_AMT.ShipmentNo = tt.ShipmentNo
                and Order_ShipmentData_AMT.Bonded + Order_ShipmentData_AMT.NonBonded = 0;
                
                Update Order_ShipmentData_AMT_Downs
                set Bonded = tt.NonBonded
                ,NonBonded = tt.Bonded
                ,TotalItem = tt.total
                from (
                select  NonBonded, Bonded , "total", Dest_Bin, TBL_ZAVGR043_Prod.ShipmentNo, TBL_ZAVGR043_Prod.WaveGrpNo from (
                select 
                count(case when TBL_LT22_Prod.Source_Typ <> 'UNR' and TBL_LT22_Prod.Source_Typ like '%N%' then 'NB'  end )  as NonBonded
                ,count(case when TBL_LT22_Prod.Source_Typ = 'UNR' or TBL_LT22_Prod.Source_Typ not like '%N%' then 'B'  end ) as Bonded 
                ,count(TBL_LT22_Prod.Material) as total
                , TBL_LT22_Prod.Dest_Bin
                from TBL_LT22_Prod
                group by TBL_LT22_Prod.Dest_Bin
                ) as t inner join TBL_ZAVGR043_Prod
                on t.Dest_Bin = TBL_ZAVGR043_Prod.WaveGrpNo
                ) as tt
                where Order_ShipmentData_AMT_Downs.ShipmentNo = tt.ShipmentNo
                and Order_ShipmentData_AMT_Downs.Bonded + Order_ShipmentData_AMT_Downs.NonBonded = 0;
                
                Update Order_ShipmentData_Regular
                set Bonded = tt.NonBonded
                ,NonBonded = tt.Bonded
                ,TotalItem = tt.total
                from (
                select  NonBonded, Bonded , "total", Dest_Bin, TBL_ZAVGR043_Prod.ShipmentNo, TBL_ZAVGR043_Prod.WaveGrpNo from (
                select 
                count(case when TBL_LT22_Prod.Source_Typ <> 'UNR' and TBL_LT22_Prod.Source_Typ like '%N%' then 'NB'  end )  as NonBonded
                ,count(case when TBL_LT22_Prod.Source_Typ = 'UNR' or TBL_LT22_Prod.Source_Typ not like '%N%' then 'B'  end ) as Bonded 
                ,count(TBL_LT22_Prod.Material) as total
                , TBL_LT22_Prod.Dest_Bin
                from TBL_LT22_Prod
                group by TBL_LT22_Prod.Dest_Bin
                ) as t inner join TBL_ZAVGR043_Prod
                on t.Dest_Bin = TBL_ZAVGR043_Prod.WaveGrpNo
                ) as tt
                where Order_ShipmentData_Regular.ShipmentNo = tt.ShipmentNo
                and Order_ShipmentData_Regular.Bonded + Order_ShipmentData_Regular.NonBonded = 0;
                
                Update Order_ShipmentData_RegularTW
                set Bonded = tt.NonBonded
                ,NonBonded = tt.Bonded
                ,TotalItem = tt.total
                from (
                select  NonBonded, Bonded , "total", Dest_Bin, TBL_ZAVGR043_Prod.ShipmentNo, TBL_ZAVGR043_Prod.WaveGrpNo from (
                select 
                count(case when TBL_LT22_Prod.Source_Typ <> 'UNR' and TBL_LT22_Prod.Source_Typ like '%N%' then 'NB'  end )  as NonBonded
                ,count(case when TBL_LT22_Prod.Source_Typ = 'UNR' or TBL_LT22_Prod.Source_Typ not like '%N%' then 'B'  end ) as Bonded 
                ,count(TBL_LT22_Prod.Material) as total
                , TBL_LT22_Prod.Dest_Bin
                from TBL_LT22_Prod
                group by TBL_LT22_Prod.Dest_Bin
                ) as t inner join TBL_ZAVGR043_Prod
                on t.Dest_Bin = TBL_ZAVGR043_Prod.WaveGrpNo
                ) as tt
                where Order_ShipmentData_RegularTW.ShipmentNo = tt.ShipmentNo
                and Order_ShipmentData_RegularTW.Bonded + Order_ShipmentData_RegularTW.NonBonded = 0;

                `, function (err, rows) {
          if (err) {
            console.log(err.message)
          }
          console.log('Update Bonded / N-Bonded')
        })

        db.exec(`-- Update Transfer Order confirm date/time
                update TBL_ZAVGR043_Prod
                set TO_ConfirmDate = case when t.Conf_date = '' then NULL else t.Conf_date end
                ,TO_ConfirmTime = case when t.Conf_time = '00:00:00' then NULL else t.Conf_time end
                from (
                    select * from TBL_LT22_Prod
                ) as t
                where TBL_ZAVGR043_Prod.Delivery = t.Dest_Bin
                and TBL_ZAVGR043_Prod.TO_ConfirmDate is null;
                
                
                Update TBL_ZAVGR043_Prod
                set CN_Ctrl_Parts = 1
                from (
                    select ShipmentNo from TBL_ZAVGR043_Prod
                where Delivery in (select Dest_Bin from TBL_LT22_Prod where TBL_LT22_Prod.CN_Ctrl_Parts = 1  )
                group by ShipmentNo
                ) as t
                where TBL_ZAVGR043_Prod.ShipmentNo = t.ShipmentNo;

                Update TBL_ZAVGR043_Prod
                set W_Parts_Control = 1
                from (
                    select ShipmentNo from TBL_ZAVGR043_Prod
                where Delivery in (select Dest_Bin from TBL_LT22_Prod where TBL_LT22_Prod.W_Parts_Control = 1  )
                group by ShipmentNo
                ) as t
                where TBL_ZAVGR043_Prod.ShipmentNo = t.ShipmentNo;

                Update TBL_ZAVGR043_Prod
                set UNR_Control = 1
                from (
                    select ShipmentNo from TBL_ZAVGR043_Prod
                where Delivery in (select Dest_Bin from TBL_LT22_Prod where TBL_LT22_Prod.UNR_Control = 1 )
                group by ShipmentNo
                ) as t
                where TBL_ZAVGR043_Prod.ShipmentNo = t.ShipmentNo;

                Update TBL_ZAVGR043_Prod
                set HAZ_Control = 1
                from (
                    select ShipmentNo from TBL_ZAVGR043_Prod
                where Delivery in (select Dest_Bin from TBL_LT22_Prod where TBL_LT22_Prod.HAZ_Control = 1  )
                group by ShipmentNo
                ) as t
                where TBL_ZAVGR043_Prod.ShipmentNo = t.ShipmentNo;
                ----
                Update TBL_ZAVGR043_Prod
                set CN_Ctrl_Parts = 1
                from (
                    select ShipmentNo from TBL_ZAVGR043_Prod
                where WaveGrpNo in (select Dest_Bin from TBL_LT22_Prod where TBL_LT22_Prod.CN_Ctrl_Parts = 1  )
                group by ShipmentNo
                ) as t
                where TBL_ZAVGR043_Prod.ShipmentNo = t.ShipmentNo;

                Update TBL_ZAVGR043_Prod
                set W_Parts_Control = 1
                from (
                    select ShipmentNo from TBL_ZAVGR043_Prod
                where WaveGrpNo in (select Dest_Bin from TBL_LT22_Prod where TBL_LT22_Prod.W_Parts_Control = 1  )
                group by ShipmentNo
                ) as t
                where TBL_ZAVGR043_Prod.ShipmentNo = t.ShipmentNo;

                Update TBL_ZAVGR043_Prod
                set UNR_Control = 1
                from (
                    select ShipmentNo from TBL_ZAVGR043_Prod
                where WaveGrpNo in (select Dest_Bin from TBL_LT22_Prod where TBL_LT22_Prod.UNR_Control = 1  )
                group by ShipmentNo
                ) as t
                where TBL_ZAVGR043_Prod.ShipmentNo = t.ShipmentNo;

                Update TBL_ZAVGR043_Prod
                set HAZ_Control = 1
                from (
                    select ShipmentNo from TBL_ZAVGR043_Prod
                where WaveGrpNo in (select Dest_Bin from TBL_LT22_Prod where TBL_LT22_Prod.HAZ_Control = 1  )
                group by ShipmentNo
                ) as t
                where TBL_ZAVGR043_Prod.ShipmentNo = t.ShipmentNo;
                
                update TBL_ZAVGR043_Prod
                set Customer_Name = t.Name
                , Customer_Feb = t.Feb
                , Location = t.AirPort_Code
                , pkg_description = t."Remark"
                from (
                  select * from Local_CustomerShipto
                ) t
                where TBL_ZAVGR043_Prod.ShipTo = t.Shipto;
                `, function (err, rows) {
          if (err) {
            console.log(err.message)
          }
          console.log('Update Transfer Order confirm date/time')
        })

        db.exec(`-- Update ID to HAWB_ShipmentData

        update HAWB_ShipmentData
            set Country_Id = (select AutoId from HAWB_Country where HAWB_Country.Country = HAWB_ShipmentData.Country)
            ,Shpt_Id = (select autoid from HAWB_ShptPoint where HAWB_ShptPoint.Shpt_Point = HAWB_ShipmentData.Shpt)
            ,Shipto_Id = (select autoid from HAWB_ShipTo where HAWB_ShipTo.ShipTo = HAWB_ShipmentData.ShipTo)
            ,SHPCondition_id =  (select autoid from HAWB_ShptCondition where HAWB_ShptCondition.Shpt_Condition = HAWB_ShipmentData.SHPCondition)
            , Confirm = 1
            where Confirm = 0;

        UPDATE HAWB_ShipmentData
SET Vendor = tt.Forward
	,HAWB_Expand = tt.HAWB_Expand
	,confirmForward = 1
	,Cut_Time = tt.Cut_Time
	,Pickup_Time = tt.Pickup_Time
	,Cus_Import = tt.Cus_Import
FROM (
	select * from (
		SELECT AutoId
			,Country_Id
			,Condition_Id
			,Shpt_Id
			,Shipto_Id
			,Forward
			,HAWB_Expand
			,Cut_Time
			,Pickup_Time
			,Cus_Import
			,CASE 
				WHEN Mon = 1
					THEN '1'
				END AS Mons
			,CASE 
				WHEN Tue = 1
					THEN '2'
				END AS Tues
			,CASE 
				WHEN Wed = 1
					THEN '3'
				END AS Weds
			,CASE 
				WHEN Thu = 1
					THEN '4'
				END AS Thus
			,CASE 
				WHEN Fri = 1
					THEN '5'
				END AS Fris
			,CASE 
				WHEN Sat = 1
					THEN '6'
				END AS Sats
			,CASE 
				WHEN Sun = 1
					THEN '7'
				END AS Suns
		FROM HAWB_Rule
		) as t
		where instr(ifnull(t.Mons,0) || ',' || ifnull(t.Tues,0) || ',' || ifnull(t.Weds,0) || ',' || ifnull(t.Thus,0) || ',' || ifnull(t.Fris,0) || ',' || ifnull(t.Sats,0) || ',' || ifnull(t.Suns,0), strftime('%w', date('now'))) > 0
	) AS tt
WHERE ifnull(HAWB_ShipmentData.Country_Id, 0) || '-' || ifnull(HAWB_ShipmentData.SHPCondition_id, 0) || '-' || ifnull(HAWB_ShipmentData.Shpt_Id, 0) || '-' || ifnull(HAWB_ShipmentData.Shipto_Id, 0) = ifnull(tt.Country_Id, 0) || '-' || ifnull(tt.Condition_Id, 0) || '-' || ifnull(tt.Shpt_Id, 0) || '-' || ifnull(tt.Shipto_Id, 0)
	AND confirmForward = 0
	AND Vendor IS NULL;
	
                
                
    UPDATE HAWB_ShipmentData
    SET Vendor = tt.Forward
        ,HAWB_Expand = tt.HAWB_Expand
        ,confirmForward = 1
        ,Cut_Time = tt.Cut_Time
        ,Pickup_Time = tt.Pickup_Time
        ,Cus_Import = tt.Cus_Import
    FROM (
        select * from (
            SELECT AutoId
                ,Country_Id
                ,Condition_Id
                ,Shpt_Id
                ,Shipto_Id
                ,Forward
                ,HAWB_Expand
                ,Cut_Time
                ,Pickup_Time
                ,Cus_Import
                ,CASE 
                    WHEN Mon = 1
                        THEN '1'
                    END AS Mons
                ,CASE 
                    WHEN Tue = 1
                        THEN '2'
                    END AS Tues
                ,CASE 
                    WHEN Wed = 1
                        THEN '3'
                    END AS Weds
                ,CASE 
                    WHEN Thu = 1
                        THEN '4'
                    END AS Thus
                ,CASE 
                    WHEN Fri = 1
                        THEN '5'
                    END AS Fris
                ,CASE 
                    WHEN Sat = 1
                        THEN '6'
                    END AS Sats
                ,CASE 
                    WHEN Sun = 1
                        THEN '7'
                    END AS Suns
            FROM HAWB_Rule
            ) as t
            where instr(ifnull(t.Mons,0) || ',' || ifnull(t.Tues,0) || ',' || ifnull(t.Weds,0) || ',' || ifnull(t.Thus,0) || ',' || ifnull(t.Fris,0) || ',' || ifnull(t.Sats,0) || ',' || ifnull(t.Suns,0), strftime('%w', date('now'))) > 0
        ) AS tt
    WHERE ifnull(HAWB_ShipmentData.SHPCondition_id, 0) || '-' || ifnull(HAWB_ShipmentData.Shpt_Id, 0) = ifnull(tt.Condition_Id, 0) || '-' || ifnull(tt.Shpt_Id, 0)
        AND confirmForward = 0
        AND Vendor IS NULL;
        
	
                
                
        UPDATE HAWB_ShipmentData
        SET Vendor = tt.Forward
            ,HAWB_Expand = tt.HAWB_Expand
            ,confirmForward = 1
            ,Cut_Time = tt.Cut_Time
            ,Pickup_Time = tt.Pickup_Time
            ,Cus_Import = tt.Cus_Import
        FROM (
            select * from (
                SELECT AutoId
                    ,Country_Id
                    ,Condition_Id
                    ,Shpt_Id
                    ,Shipto_Id
                    ,Forward
                    ,HAWB_Expand
                    ,Cut_Time
                    ,Pickup_Time
                    ,Cus_Import
                    ,CASE 
                        WHEN Mon = 1
                            THEN '1'
                        END AS Mons
                    ,CASE 
                        WHEN Tue = 1
                            THEN '2'
                        END AS Tues
                    ,CASE 
                        WHEN Wed = 1
                            THEN '3'
                        END AS Weds
                    ,CASE 
                        WHEN Thu = 1
                            THEN '4'
                        END AS Thus
                    ,CASE 
                        WHEN Fri = 1
                            THEN '5'
                        END AS Fris
                    ,CASE 
                        WHEN Sat = 1
                            THEN '6'
                        END AS Sats
                    ,CASE 
                        WHEN Sun = 1
                            THEN '7'
                        END AS Suns
                FROM HAWB_Rule
                ) as t
                where instr(ifnull(t.Mons,0) || ',' || ifnull(t.Tues,0) || ',' || ifnull(t.Weds,0) || ',' || ifnull(t.Thus,0) || ',' || ifnull(t.Fris,0) || ',' || ifnull(t.Sats,0) || ',' || ifnull(t.Suns,0), strftime('%w', date('now'))) > 0
            ) AS tt
        WHERE ifnull(HAWB_ShipmentData.Country_Id, 0) || '-' || ifnull(HAWB_ShipmentData.SHPCondition_id, 0) = ifnull(tt.Country_Id, 0) || '-' || ifnull(tt.Condition_Id, 0)
            AND confirmForward = 0
            AND Vendor IS NULL;
                
                update HAWB_ShipmentData
                set R_CutTime = case when Cut_Time is null then strftime('%Y-%m-%d %H:%M',strftime('%Y-%m-%d %H:%M',datetime(ImportDateTime,'+10 hours')))
                    when Cut_Time is not null and strftime('%Y-%m-%d %H:%M',datetime(ImportDateTime,'+8 hours')) < strftime('%Y-%m-%d %H:%M',strftime('%Y-%m-%d',strftime('%Y-%m-%d %H:%M',datetime(ImportDateTime,'+8 hours')))||' '||Cut_Time) 
                    then strftime('%Y-%m-%d %H:%M',strftime('%Y-%m-%d',strftime('%Y-%m-%d %H:%M',datetime(ImportDateTime,'+8 hours')))||' '||Cut_Time) 
                    ELSE strftime('%Y-%m-%d %H:%M',date(strftime('%Y-%m-%d',strftime('%Y-%m-%d %H:%M',datetime(ImportDateTime,'+8 hours'))),'+1 day')||' '||Cut_Time)
                    end
                , R_PickupTime = case when Pickup_Time is not null and strftime('%Y-%m-%d %H:%M',datetime(ImportDateTime,'+8 hours')) < strftime('%Y-%m-%d %H:%M',strftime('%Y-%m-%d',strftime('%Y-%m-%d %H:%M',datetime(ImportDateTime,'+8 hours')))||' '||Cut_Time)
                    then strftime('%Y-%m-%d %H:%M',strftime('%Y-%m-%d',strftime('%Y-%m-%d %H:%M',datetime(ImportDateTime,'+8 hours')))||' '||Pickup_Time)
                    when Pickup_Time is null and Cus_Import is not null then strftime('%Y-%m-%d %H:%M',datetime(strftime('%Y-%m-%d %H:%M',datetime(ImportDateTime,'+8 hours'))), cus_import) 
                    else strftime('%Y-%m-%d %H:%M',date(strftime('%Y-%m-%d',strftime('%Y-%m-%d %H:%M',datetime(ImportDateTime,'+8 hours'))),'+1 day')||' '||Pickup_Time)
                    end
                    
                where R_CutTime is NULL;`, function (err, rows) {
          if (err) {
            console.log(err.message)
          }
          console.log('Update Vendor ')
        })

        db.exec(`-- reupdate plant

                update TBL_ZAVGR043_Prod
                set plant = t.plant
                from (
                    select * from TBL_Plant
                ) t
                where TBL_ZAVGR043_Prod.Shpt = t.Shpt and TBL_ZAVGR043_Prod.plant is null;

                update HAWB_ShipmentData
                set plant = t.plant
                from (
                    select * from TBL_Plant
                ) t
                where HAWB_ShipmentData.Shpt = t.Shpt and HAWB_ShipmentData.plant is null;
                
                update HAWB_ShipmentData
                set plant = case when Shpt like '5%' then '5400'
                when Shpt like '8%' then '5400'
                else NULL end 
                where plant is null; 
                
                update HAWB_ShipmentData
                set plant = 5400
                
                where plant like'54%' and plant not in ('5401','5402');
                
                update HAWB_ShipmentData
                set plant = 8900
                
                where plant like'89%' and plant not in ('8930','8960');`, function (err, rows) {
          if (err) {
            console.log(err.message)
          }
          console.log('re-Update Plant ')
        })

        db.exec(`-- update Start_Woth from HAWB_Import_Check
                UPDATE HAWB_ShipmentData
                set Start_With = t.Start_With
                from (
                    select * from HAWB_Import_Check
                ) as t
                where HAWB_ShipmentData.Vendor = t.Vendor
                and HAWB_ShipmentData.DP = t.DP
                and HAWB_ShipmentData.SHPCondition = t.SHPCondition
                and HAWB_ShipmentData.plant = t.plant
                and HAWB_ShipmentData.Vendor is not null
                AND HAWB_ShipmentData.Start_With IS NULL;
                
                UPDATE HAWB_ShipmentData
                set Start_With = t.Start_With
                from (
                    select * from HAWB_Import_Check
                ) as t
                where HAWB_ShipmentData.Vendor = t.Vendor
                and HAWB_ShipmentData.DP = t.DP
                and t.SHPCondition is null
                and HAWB_ShipmentData.plant = t.plant
                and HAWB_ShipmentData.Vendor is not null
                AND HAWB_ShipmentData.Start_With IS NULL;`, function (err, rows) {
          if (err) {
            console.log(err.message)
          }
          console.log('update Start_Woth from HAWB_Import_Check')
        })
      })
      db.serialize(function () {
        db.exec(`-- assign tracking by singal
        -- assign tracking by singal
        delete from TempRuleAssign;
        WITH RECURSIVE
            cnt( ImportDateTime,  ShipmentNo, shipto, Vendor , Cut_Time, DP, SHPCondition, Start_With )  AS 
            ( select  ImportDateTime,  ShipmentNo, shipto, Vendor , Cut_Time, max(DP), max(SHPCondition), Start_With  from HAWB_ShipmentData where HAWB_Expand = 0 and Duplicate_Control = 0 and M_HAWB is null group by ImportDateTime,  ShipmentNo, shipto, Vendor , Cut_Time , Start_With order by ImportDateTime )
            insert into TempRuleAssign ( ImportDateTime,  ShipmentNo, shipto, Vendor , Cut_Time, DP, SHPCondition, Start_With )  select AutoId, ImportDateTime,  ShipmentNo, shipto, Vendor , Cut_Time, DP, SHPCondition, Start_With  from cnt;
            
        -- assign tracking by expand
        delete from TempRuleRunTime;
        delete from TempRuleAssignExpand;
        insert into TempRuleAssignExpand ( AutoId, ImportDateTime,  ShipmentNo, shipto, Vendor , Cut_Time, DP, SHPCondition, Start_With ) 
        select MAX(AutoId), ImportDateTime,  ShipmentNo, shipto, Vendor, R_CutTime , DP, SHPCondition, Start_With
        from HAWB_ShipmentData where HAWB_Expand = 1 and length(ShipmentNo) = 8 and Duplicate_Control = 0 
        group by ImportDateTime,  ShipmentNo, shipto, Vendor, R_CutTime , DP, SHPCondition, Start_With
        order by  MAX(AutoId), ShipTo ;
        
        --assign duplicate tracking
        delete from TempRuleAssignDup;
        WITH RECURSIVE
        cnt( AutoId, ImportDateTime,  ShipmentNo, shipto, Vendor , Cut_Time, DP, SHPCondition, Start_With, R_PickupTime ) AS ( select AutoId, ImportDateTime,  ShipmentNo, shipto, Vendor, R_CutTime , DP, SHPCondition, Start_With, R_PickupTime from HAWB_ShipmentData where  Duplicate_Control = 1 and R_PickupTime is not null order by ImportDateTime, AutoId )
        insert into TempRuleAssignDup (AutoId, ImportDateTime,  ShipmentNo, shipto, Vendor , Cut_Time, DP, SHPCondition, Start_With, R_PickupTime) select AutoId, ImportDateTime,  ShipmentNo, shipto, Vendor , Cut_Time, DP, SHPCondition, Start_With, R_PickupTime  from cnt;

        --assign duplicate tracking for regular
            delete from TempRuleAssignDup;
            WITH RECURSIVE
            cnt( AutoId, ImportDateTime,  ShipmentNo, shipto, Vendor , Cut_Time, DP, SHPCondition, Start_With, R_PickupTime ) AS ( select AutoId, ImportDateTime,  ShipmentNo, shipto, Vendor, R_CutTime , DP, SHPCondition, Start_With, R_PickupTime from HAWB_ShipmentData where  Duplicate_Control = 1 and R_PickupTime is null and date(ImportDateTime) = date('now') order by ImportDateTime, AutoId )
            insert into TempRuleAssignDup (AutoId, ImportDateTime,  ShipmentNo, shipto, Vendor , Cut_Time, DP, SHPCondition, Start_With, R_PickupTime) select AutoId, ImportDateTime,  ShipmentNo, shipto, Vendor , Cut_Time, DP, SHPCondition, Start_With, R_PickupTime  from cnt;
            
                    `, function (err, rows) {
          if (err) {
            console.log(err.message)
          }
          console.log('assign tracking')
        })
      })
      db.serialize(function () {
        db.exec(`UPDATE TBL_ZAVGR043_Prod
                set CreateOn = replace(CreateOn, '/','-')
                ,ShipmentCreateDate = replace(ShipmentCreateDate, '/','-')
                ,EntryDate = replace(EntryDate,'/','-')
                ,TO_ConfirmDate = replace(TO_ConfirmDate,'/','-')
                ,TO_CreateDate = replace(TO_CreateDate,'/','-');
                
                update TBL_ZAVGR043_Prod
                set KPI_Hour = t.Service
                , KPI_Ctrl = 1
                , WithoutHolday = t.WithoutHolday
                , CountryContro = t.CountryContro
                from ( select * from service_KPI ) as t
                where case when TBL_ZAVGR043_Prod.Shpt like '5%' then '54'
                when  TBL_ZAVGR043_Prod.Shpt like '8%' then '89'
                when TBL_ZAVGR043_Prod.Shpt = '317' then '89'
                else null end = t.plant
                and TBL_ZAVGR043_Prod.DP = t.DP
                --and ifnull(TBL_ZAVGR043_Prod.SHPCondition,0) = ifnull(t.Condition,0)
                and TBL_ZAVGR043_Prod.KPI_Ctrl = 0;


                
                update TBL_ZAVGR043_Prod
                set Service_Start = datetime(ShipmentCreateDate ||' '|| ShipmentCreateTime, (select'+'||TimeZoneValues||' Hours'))
                , start_Week_Day = case when strftime('%w',datetime(ShipmentCreateDate ||' '|| ShipmentCreateTime, (select'+'||TimeZoneValues||' Hours'))) = '0' then '7' else strftime('%w',datetime(ShipmentCreateDate ||' '|| ShipmentCreateTime, (select'+'||TimeZoneValues||' Hours'))) end
                where Service_Start is null;

                UPDATE TBL_ZAVGR043_Prod
                set Service_End = datetime(Service_Start, (select'+'||KPI_Hour||' Hours'))
                , end_Week_Day = case when strftime('%w',datetime(Service_Start, (select'+'||KPI_Hour||' Hours'))) = '0' then '7' else strftime('%w',datetime(Service_Start, (select'+'||KPI_Hour||' Hours'))) end
                where Service_End is null;
                
                
                update TBL_ZAVGR043_Prod
                set diff_work_Day = case WHEN start_Week_Day = '4' then '4'
                WHEN start_Week_Day = '5' then '3'
                WHEN start_Week_Day = '6' then '2'
                WHEN start_Week_Day = '7' then '1'
                else end_Week_Day - start_Week_Day end
                , kpi_work_day = KPI_Hour / 8
                where diff_work_Day is NULL;
                
                update TBL_ZAVGR043_Prod
                set Service_Start = case when datetime(ShipmentCreateDate ||' '|| ShipmentCreateTime, (select'+'||TimeZoneValues||' Hours')) < datetime(date(datetime(ShipmentCreateDate ||' '|| ShipmentCreateTime, (select'+'||TimeZoneValues||' Hours')))||' '||'09:00')
                then datetime(date(datetime(ShipmentCreateDate ||' '|| ShipmentCreateTime, (select'+'||TimeZoneValues||' Hours')))||' '||'09:00')
                when datetime(ShipmentCreateDate ||' '|| ShipmentCreateTime, (select'+'||TimeZoneValues||' Hours')) > datetime(date(datetime(ShipmentCreateDate ||' '|| ShipmentCreateTime, (select'+'||TimeZoneValues||' Hours')))||' '||'18:00')
                then datetime(datetime(ShipmentCreateDate ||' '|| ShipmentCreateTime, (select'+'||TimeZoneValues||' Hours')), (select'+'||diff_work_Day||' day'))
                else  datetime(ShipmentCreateDate ||' '|| ShipmentCreateTime, (select'+'||TimeZoneValues||' Hours')) end
                , Serverice_Ctrl = 1
                WHERE plant like '89%' and Serverice_Ctrl = 0
               

                
                `, function (err, rows) {
          if (err) {
            console.log(err.message)
          }
          console.log('update services level')
        })


        db.close()
        res.send(`Insert Shipment: [${req.query.shipmentNo}] done`)
      })

    })

  }

  if (req.query.function == 'upload') {
    if (req.query.Vendor == 'CEVA') {

    }
  }


})

apps.get('/get/deliveryInform', async function (req, res) {

  req.query.function
  req.query.controllog
  req.query.queryDate
  req.query.shipmentNo
  req.query.pagesize
  req.query.currentPage
  req.query.InputValue
  req.query.minLogNum
  req.query.maxLogNum

  if (req.query.function == 'barcode') {


    if (req.query.codeType == 'code128') {

      if (req.query.InputValue !== '') {
        var input = req.query.InputValue
      } else {
        var input = 'empty'
      }

      if (Number(req.query.Weight) > 0) {
        var weight = req.query.Weight
      } else {
        var weight = 1
      }

      if (Number(req.query.Height) > 0) {
        var height = req.query.Height
      } else {
        var height = 1
      }




      var code = {
        bcid: 'code128',       // Barcode type
        text: `${input}`,    // Text to encode
        scale: 3,               // 3x scaling factor
        width: weight,               // Bar weight, in millimeters
        height: height,              // Bar height, in millimeters
        includetext: true,            // Show human-readable text
        textxalign: 'center',        // Always good to set this
      }

    }
    else if (req.query.codeType == 'code39') {

      if (req.query.InputValue !== '') {
        var input = req.query.InputValue
      } else {
        var input = 'empty'
      }

      if (Number(req.query.Weight) > 0) {
        var weight = req.query.Weight
      } else {
        var weight = 1
      }

      if (Number(req.query.Height) > 0) {
        var height = req.query.Height
      } else {
        var height = 1
      }




      var code = {
        bcid: 'code39ext',       // Barcode type
        text: `${input}`,    // Text to encode
        scale: 3,               // 3x scaling factor
        width: weight,               // Bar weight, in millimeters
        height: height,              // Bar height, in millimeters
        includetext: true,            // Show human-readable text
        textxalign: 'center',        // Always good to set this
      }

    }
    else if (req.query.codeType == 'qrcode') {

      if (req.query.InputValue !== '') {
        var input = req.query.InputValue
      } else {
        var input = 'empty'
      }

      if (Number(req.query.Weight) > 0) {
        var weight = req.query.Weight
      } else {
        var weight = 1
      }

      if (Number(req.query.Height) > 0) {
        var height = req.query.Height
      } else {
        var height = 1
      }




      var code = {
        bcid: 'qrcode',       // Barcode type
        text: `${input}`,    // Text to encode
        scale: 3,               // 3x scaling factor
        width: weight,               // Bar weight, in millimeters
        height: height,              // Bar height, in millimeters
        includetext: true,            // Show human-readable text
        textxalign: 'center',        // Always good to set this
      }

    }
    else if (req.query.codeType == 'pdf417') {

      if (req.query.InputValue !== '') {
        var input = req.query.InputValue
      } else {
        var input = 'empty'
      }

      if (Number(req.query.Weight) > 0) {
        var weight = req.query.Weight
      } else {
        var weight = 1
      }

      if (Number(req.query.Height) > 0) {
        var height = req.query.Height
      } else {
        var height = 1
      }




      var code = {
        bcid: 'pdf417',       // Barcode type
        text: `${input}`,    // Text to encode
        scale: 3,               // 3x scaling factor
        width: weight,               // Bar weight, in millimeters
        height: height,              // Bar height, in millimeters
        includetext: true,            // Show human-readable text
        textxalign: 'center',        // Always good to set this
      }

    }
    else {
      if (req.query.InputValue !== '') {
        var input = req.query.InputValue
      } else {
        var input = 'empty'
      }

      if (Number(req.query.Weight) > 0) {
        var weight = req.query.Weight
      } else {
        var weight = 1
      }

      if (Number(req.query.Height) > 0) {
        var height = req.query.Height
      } else {
        var height = 1
      }




      var code = {
        bcid: 'code128',       // Barcode type
        text: `${input}`,    // Text to encode
        scale: 3,               // 3x scaling factor
        width: weight,               // Bar weight, in millimeters
        height: height,              // Bar height, in millimeters
        includetext: true,            // Show human-readable text
        textxalign: 'center',        // Always good to set this
      }
    }




    bwipjs.toBuffer(code, function (err, png) {
      if (err) {
        // `err` may be a string or Error object
      } else {
        if (req.query.base64 == 'base64') {
          res.send(png.toString('base64'))
        } else {
          res.send('<img src="data:image/png;base64,' + png.toString('base64') + '"></img>')
        }

        // `png` is a Buffer
        // png.length           : PNG file length
        // png.readUInt32BE(16) : PNG image width
        // png.readUInt32BE(20) : PNG image height
      }
    });




  }
  if (req.query.function == 'cuttime_report') {

    const getinformation = function () {
      var db = new sqlite3.Database(path.resolve(__dirname, '../db/main.db'), sqlite3.OPEN_READWRITE)
      const fs = require('fs')

      //return new Promise (function(resolve, reject) {
      var query = ''
      if (req.query.controllog == 'control_log_downs') {
        query = `select * , case 
        when query_order_downs_54.Bonded > 0 and query_order_downs_54.NonBonded > 0 and query_order_downs_54.Country <> 'TW' then 'G3/D5'
        when query_order_downs_54.Bonded > 0 and query_order_downs_54.NonBonded = 0 and query_order_downs_54.Country <> 'TW' then 'D5' 
        when query_order_downs_54.Bonded > 0 and query_order_downs_54.NonBonded = 0 and query_order_downs_54.Country = 'TW' then 'D2' 
        else 'G3' end as [5105a]  , trim(ifnull(HAWB_ShipmentData.M_HAWB,'')||ifnull(HAWB_ShipmentData.D_HAWB,'')) as HAWB_NO 
          from query_order_downs_54 inner join HAWB_ShipmentData
            on query_order_downs_54.ShipmentNo = HAWB_ShipmentData.ShipmentNo
            where logNum between ${req.query.minLogNum} and ${req.query.maxLogNum} and ImportDate = '${req.query.queryDate}'
            order by logNum`

      } else if (req.query.controllog == 'control_log_regular') {
        query = `select *, case 
        when query_order_Regular_54.Bonded > 0 and query_order_Regular_54.NonBonded > 0 and query_order_Regular_54.Country <> 'TW' then 'G3/D5'
        when query_order_Regular_54.Bonded > 0 and query_order_Regular_54.NonBonded = 0 and query_order_Regular_54.Country <> 'TW' then 'D5' 
        when query_order_Regular_54.Bonded > 0 and query_order_Regular_54.NonBonded = 0 and query_order_Regular_54.Country = 'TW' then 'D2' 
        else 'G3' end as [5105a] , trim(ifnull(HAWB_ShipmentData.M_HAWB,'')||ifnull(HAWB_ShipmentData.D_HAWB,'')) as HAWB_NO 
          from query_order_Regular_54 inner join HAWB_ShipmentData
            on query_order_Regular_54.ShipmentNo = HAWB_ShipmentData.ShipmentNo
            where logNum between ${req.query.minLogNum} and ${req.query.maxLogNum} and ImportDate = '${req.query.queryDate}'
            order by logNum`

      } else {
        console.log('error table')
      }

      try {
        if (fs.existsSync(path.resolve(__dirname, '../temp/cuttime_report.xlsx'))) {
          fs.unlinkSync(path.resolve(__dirname, '../temp/cuttime_report.xlsx'))

        }
      } catch (err) {
        console.error(err)
        //reject(err)
      }
      return new Promise(function (resolve, reject) {
        if (query.length !== 0) {
          db.all(query, [], async function (err, rows) {
            if (err) {
              reject(err)
            }
            resolve(rows)
          })
        } else {
          res.send('no data')
          res.end()
        }
      })
    }

    getinformation().then(async function (rows) {
      console.log(rows)
      const workbook = new Excel.Workbook();
      const worksheet = workbook.addWorksheet("Data");
      const fileName = 'cuttime_report.xlsx'




      worksheet.columns = [
        //{ header: 'NowToActuatDelivery', key: 'NowToActuatDelivery', width: 20 },
        { header: "Time", key: "ImportDateTime", width: 20 },
        { header: "S#", key: "logNum", width: 10 },
        { header: "Shpt", key: "Shpt", width: 5 },
        { header: "HAWB NO", key: "HAWB_NO", width: 20 },
        { header: "報單類別", key: "5105a", width: 10 },
        { header: "DP", key: "DP", width: 10 },
        { header: "Delivery", key: "Delivery", width: 10 },
        { header: "ShipmentNo", key: "ShipmentNo", width: 20 },
        { header: "Country", key: "Country", width: 20 },
        { header: "ShipTo", key: "ShipTo", width: 20 },
        { header: "Tracking#", key: "", width: 20 },
        { header: "預計提貨時間", key: "R_PickupTime", width: 20 },
        { header: "TT", key: "", width: 20 },


      ];

      worksheet.addRows(rows)

      //const buffer = await workbook.xlsx.writeBuffer()
      /*workbook.xlsx.writeFile(fileName).then(function () {
        console.log('is OK')
      })*/

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
      res.setHeader("Content-Disposition", "attachment; filename=" + fileName);
      await workbook.xlsx.write(res).then(function () {
        res.end();
      });

    })






  }
  if (req.query.function == 'changePickupDateTime') {

    req.query.shipmentNo

    var db = new sqlite3.Database(path.resolve(__dirname, '../db/main.db'), sqlite3.OPEN_READWRITE)
    db.all(`select replace(date(R_PickupTime),'-','/') as PickupDate
    ,strftime('%H',R_PickupTime) as PickupHour
    ,strftime('%m',R_PickupTime) as PickupMin, * from HAWB_ShipmentData where ShipmentNo = '${req.query.shipmentNo}'`, [], function (err, rows) {
      if (err) {
        console.log(err)
      }

      const rendeData = { title: 'Change Pickup Date Time', menuTitle: req.query.shipmentNo, data: rows }
      res.render('changeDateTime.ejs', rendeData)
    })



  }

  if (req.query.function == 'cuttime_report_Entry') {



    var db = new sqlite3.Database(path.resolve(__dirname, '../db/main.db'), sqlite3.OPEN_READWRITE)
    const fs = require('fs')

    //return new Promise (function(resolve, reject) {
    var query = ''
    if (req.query.controllog == 'control_log_downs') {
      query = `select * 
      ,CutTimeReport_Shipment.ImportDateTime as Act_ImportDateTime
      , case 
        when query_order_downs_54.Bonded > 0 and query_order_downs_54.NonBonded > 0 and query_order_downs_54.Country <> 'TW' then 'G3/D5'
        when query_order_downs_54.Bonded > 0 and query_order_downs_54.NonBonded = 0 and query_order_downs_54.Country <> 'TW' then 'D5' 
        when query_order_downs_54.Bonded > 0 and query_order_downs_54.NonBonded = 0 and query_order_downs_54.Country = 'TW' then 'D2' 
        else 'G3' end as [5105a]  
        , case when query_order_downs_54.Country = 'TW' then 'D' || '-' || date() || '-' || query_order_downs_54.logNum
		else trim(ifnull(HAWB_ShipmentData.M_HAWB,'')||ifnull(HAWB_ShipmentData.D_HAWB,'')) end as HAWB_NO 
		, query_order_downs_54.ShipmentNo as Act_ShipmentNO
    , query_order_downs_54.Country as Act_Country
		, query_order_downs_54.ShipTo as Act_ShipTo
          from CutTimeReport_Shipment inner join query_order_downs_54
          on CutTimeReport_Shipment.ShipmentNo = query_order_downs_54.ShipmentNo
          left join HAWB_ShipmentData
          on CutTimeReport_Shipment.ShipmentNo = HAWB_ShipmentData.ShipmentNo`

    } else if (req.query.controllog == 'control_log_regular') {
      query = `select *
      ,CutTimeReport_Shipment.ImportDateTime as Act_ImportDateTime
      , case 
        when query_order_Regular_54.Bonded > 0 and query_order_Regular_54.NonBonded > 0 and query_order_Regular_54.Country <> 'TW' then 'G3/D5'
        when query_order_Regular_54.Bonded > 0 and query_order_Regular_54.NonBonded = 0 and query_order_Regular_54.Country <> 'TW' then 'D5' 
        when query_order_Regular_54.Bonded > 0 and query_order_Regular_54.NonBonded = 0 and query_order_Regular_54.Country = 'TW' then 'D2' 
        else 'G3' end as [5105a] 
        , case when query_order_Regular_54.Country = 'TW' then 'D' || '-' || date() || '-' || query_order_Regular_54.logNum
        else trim(ifnull(HAWB_ShipmentData.M_HAWB,'')||ifnull(HAWB_ShipmentData.D_HAWB,'')) end as HAWB_NO 
        , query_order_Regular_54.ShipmentNo as Act_ShipmentNO 
        , query_order_Regular_54.Country as Act_Country
		, query_order_Regular_54.ShipTo as Act_ShipTo
        from CutTimeReport_Shipment inner join query_order_Regular_54
        on CutTimeReport_Shipment.ShipmentNo = query_order_Regular_54.ShipmentNo
        left join HAWB_ShipmentData
        on query_order_Regular_54.ShipmentNo = HAWB_ShipmentData.ShipmentNo`

    } else {
      console.log('error table')
    }


    db.all(query, [], async function (err, rows) {
      if (err) {
        console.log(err)
      }

      const rendeData = { title: 'T1 Report', menuTitle: req.query.controllog, data: rows }
      res.render('cuttimeReport_Shipment.ejs', rendeData)
    })
    db.close
  }
  if (req.query.function == 'invoice_report_Entry') {

    var db = new sqlite3.Database(path.resolve(__dirname, '../db/main.db'), sqlite3.OPEN_READWRITE)
    let query = 'select * from Invoice_Shipment;'
    db.all(query, [], async function (err, rows) {
      if (err) {
        console.log(err)
      }

      const rendeData = { title: 'Create Invoice Report', data: rows }
      res.render('invoiceReport_Shipment.ejs', rendeData)
    })
    db.close


  }
  if (req.query.function == 'downs_check_list') {

    var db = new sqlite3.Database(path.resolve(__dirname, '../db/main.db'), sqlite3.OPEN_READWRITE)
    let query = `select * from query_order_downs_54 where ShipmentNo = '${req.query.shipmentNo}'`

    let dnInform = `select * from TBL_ZAVGR043_Prod where ShipmentNo = '${req.query.shipmentNo}'`

    db.exec(`update  TBL_ZAVGR043_Prod set Print_Act_Flg = 1 where ShipmentNo = '${req.query.shipmentNo}'`)
    async function getQueryData() {
      return new Promise((resolve, rejects) => {
        db.all(query, [], function (err, rows) {
          if (err) {

            //return console.log(`find ${req.query.function} error: `, err.message)
            rejects(err.message)
          }
          console.log('row length:' + rows.length)
          resolve(rows)
        })
        db.close
      })
    }

    async function getQueryInforData() {
      return new Promise((resolve, rejects) => {
        db.all(dnInform, [], function (err, rows) {
          if (err) {

            //return console.log(`find ${req.query.function} error: `, err.message)

            rejects(err.message)
          }
          resolve(rows)

        })
        db.close
      })


    }

    async function getTrackingBarcode() {
      return new Promise((resolve, rejects) => {
        db.all(query, [], function (err, rows) {
          if (err) {

            rejects(err.message)
          }

          if (rows[0].D_HAWB == null) {
            var input = rows[0].M_HAWB
          } else {
            var input = rows[0].M_HAWB + rows[0].D_HAWB
          }

          var code = {
            bcid: 'code128',       // Barcode type
            text: `${input}`,    // Text to encode
            scale: 3,               // 3x scaling factor
            width: 20,               // Bar weight, in millimeters
            height: 3,              // Bar height, in millimeters
            includetext: true,            // Show human-readable text
            textxalign: 'center',        // Always good to set this
            textsize: 4,
          }

          bwipjs.toBuffer(code)
            .then(png => {

              resolve(png.toString('base64'))

            })
            .then(err => {
              rejects(err)
            })



        })
        db.close
      })
    }

    console.log('getQueryData:' + getQueryData())

    const rendeData = { data: await getQueryData(), dbData: await getQueryInforData(), tracking: await getTrackingBarcode() }
    res.render('controllog_checklist_new.ejs', rendeData)


  }
  if (req.query.function == 'downs_check_list_batch') {

    var db = new sqlite3.Database(path.resolve(__dirname, '../db/main.db'), sqlite3.OPEN_READWRITE)

    req.query.minLogNum
    req.query.maxLogNum
    req.query.queryDate
    const fs = require('fs')
    try {
      if (fs.existsSync(path.resolve(__dirname, '../temp/batchJob.pdf'))) {
        fs.unlinkSync(path.resolve(__dirname, '../temp/batchJob.pdf'))

      }
    } catch (err) {
      console.error(err)
      //reject(err)
    }

    let query = `select ShipmentNo from query_order_downs_54 where logNum between ${req.query.minLogNum} and ${req.query.maxLogNum} and ImportDate = '${req.query.queryDate}' order by logNum asc`
    db.exec(`update  TBL_ZAVGR043_Prod set Print_Act_Flg = 1 where ShipmentNo in ( select ShipmentNo from query_order_downs_54 where logNum between ${req.query.minLogNum} and ${req.query.maxLogNum} and ImportDate = '${req.query.queryDate}' order by logNum asc )`)

    const getShipmentNo = async function (query) {
      return new Promise((resolve, rejects) => {
        db.all(query, function (error, rows) {
          if (error) {
            console.log(error)
            rejects(error)
          }

          console.log(rows)
          resolve(rows)


        })

        db.close()
      })
    }
    //const merge = require('easy-pdf-merge');
    const { PDFDocument } = require('pdf-lib');


    await getShipmentNo(query).then(async function (result) {

      console.log('shipment: ' + result)




      const puppeteer = require('puppeteer-core');
      const edgePaths = require("edge-paths");

      const EDGE_PATH = edgePaths.getEdgePath();
      (async () => {
        var fileName = []

        for (let i = 0; i < result.length; i++) {
          //const element = array[index];
          const browser = await puppeteer.launch(
            {
              headless: true,
              executablePath: EDGE_PATH
              //"args": ["--no-sandbox"]
              //"args": ["--kiosk-printing"]
            });
          const page = await browser.newPage();


          console.log(result[i]['ShipmentNo'])

          //const browser = await puppeteer.launch();
          //res.write(`<h4> Transfer Shipment: ${result[i]['ShipmentNo']} to PDF </h4>`)

          console.log('openL' + `http://${await host}:3000/get/deliveryInform?function=downs_check_list&shipmentNo=${result[i]['ShipmentNo']}`)
          await page.goto(`http://${await host}:3000/get/deliveryInform?function=downs_check_list&shipmentNo=${result[i]['ShipmentNo']}`);

          await page.pdf({ path: path.resolve(__dirname, `../temp/${result[i]['ShipmentNo']}.pdf`), format: 'A4' });

          fileName.push(path.resolve(__dirname, `../temp/${result[i]['ShipmentNo']}.pdf`))

          await browser.close();

        };
        //await page.evaluate(() => { window.print() })


        console.log(fileName)
        await pdfLibMerge(fileName)
        //await mergeMultiplePDF(fileName)
        await removeNonusedFilename(fileName)
        await showbathjob()


      })();



    })

    const pdfLibMerge = async (fileName) => {
      const pdfDoc = await PDFDocument.create()
      //const doc = await PDFDocument.create();
      //const dataPage = []
      for (let i = 0; i < fileName.length; i++) {
        //const element = fileName[i];
        const filestream = require('fs/promises');
        const pdfData = await filestream.readFile(fileName[i])
        const coverpage = await PDFDocument.load(pdfData);
        const [dataPage] = await pdfDoc.copyPages(coverpage, [0])
        pdfDoc.addPage(dataPage);

        //pdfDoc.addPage(coverpage);
      }

      const pdfByte = await pdfDoc.save()
      //await pdfByte.writeFile(path.resolve(__dirname, '../temp/batchJob.pdf'))
      fs.writeFileSync(path.resolve(__dirname, '../temp/batchJob.pdf'), pdfByte)
      //await pdfDoc.save()

      //fs.writeFileSync(path.resolve(__dirname, '../temp/batchJob.pdf'), await pdfDoc.save());
      //pdfDoc.save
      //const cover = await PDFDocument.load(fs.readFileSync('./cover.pdf'));
    }

    /*const mergeMultiplePDF = (pdfFiles) => {
      //res.write('<h4> merge all shipment to one PDF</h4>')
      const opts = {
        maxBuffer: 1024 * 1024 * pdfFiles.length, // 500kb
        maxHeap: '2g' // for setting JVM heap limits to 2GB
      };
      return new Promise((resolve, reject) => {

        merge(pdfFiles, path.resolve(__dirname, '../temp/batchJob.pdf'), opts, function (err) {
          if (err) {
            console.log(err);
            reject(err)
          }
          console.log('Saved as: ' + path.resolve(__dirname, '../temp/batchJob.pdf'));

          resolve()
        });
      });
    };*/

    const removeNonusedFilename = (pdfFiles) => {
      //const fs = require('fs')

      return new Promise(function (resolve, reject) {
        for (i = 0; i < pdfFiles.length; i++) {
          try {
            if (fs.existsSync(pdfFiles[i])) {
              fs.unlinkSync(pdfFiles[i])

            }
          } catch (err) {
            console.error(err)
            reject(err)
          }
        }

        resolve('success')
      })

    }
    const showbathjob = async () => {
      //const fs = require('fs')
      //var stream = fs.ReadStream(path.resolve(__dirname,'../temp'));
      //var filename = "batchJob.pdf"
      console.log('pdf');

      res.setHeader('content-type', 'application/pdf');

      res.sendFile(path.resolve(__dirname, '../temp/batchJob.pdf'))
      //res.end()
      console.log('pdf end');

    }

  }
  if (req.query.function == 'ETA_Report') {
    const rendeData = { title: 'ETA Report', controllog: req.query.controllog }
    res.render('ETA_Report.ejs', rendeData)
  }



})

apps.get('/get/mailInfor', function (req, res) {

  if (req.query.function == 'cuttime_report_mail_outlook') {


    var db = new sqlite3.Database(path.resolve(__dirname, '../db/main.db'), sqlite3.OPEN_READWRITE)
    var query = ''
    if (req.query.controllog == 'control_log_downs') {
      query = `select * , case 
      when query_order_downs_54.Bonded > 0 and query_order_downs_54.NonBonded > 0 and query_order_downs_54.Country <> 'TW' then 'G3/D5'
      when query_order_downs_54.Bonded > 0 and query_order_downs_54.NonBonded = 0 and query_order_downs_54.Country <> 'TW' then 'D5' 
      when query_order_downs_54.Bonded > 0 and query_order_downs_54.NonBonded = 0 and query_order_downs_54.Country = 'TW' then 'D2' 
      else 'G3' end as [5105a]  
      , case when query_order_downs_54.Country = 'TW' then 'D' || '-' || date() || '-' || query_order_downs_54.logNum
      else trim(ifnull(HAWB_ShipmentData.M_HAWB,'')||ifnull(HAWB_ShipmentData.D_HAWB,'')) end as HAWB_NO 
      , query_order_downs_54.ShipmentNo as Act_ShipmentNO
        from query_order_downs_54 left join HAWB_ShipmentData
          on query_order_downs_54.ShipmentNo = HAWB_ShipmentData.ShipmentNo
          where logNum between ${req.query.minLogNum} and ${req.query.maxLogNum} and ImportDate = '${req.query.queryDate}'
          order by logNum`

    } else if (req.query.controllog == 'control_log_regular') {
      query = `select *, case 
      when query_order_Regular_54.Bonded > 0 and query_order_Regular_54.NonBonded > 0 and query_order_Regular_54.Country <> 'TW' then 'G3/D5'
      when query_order_Regular_54.Bonded > 0 and query_order_Regular_54.NonBonded = 0 and query_order_Regular_54.Country <> 'TW' then 'D5' 
      when query_order_Regular_54.Bonded > 0 and query_order_Regular_54.NonBonded = 0 and query_order_Regular_54.Country = 'TW' then 'D2' 
      else 'G3' end as [5105a] 
      , case when query_order_Regular_54.Country = 'TW' then 'D' || '-' || date() || '-' || query_order_Regular_54.logNum
      else trim(ifnull(HAWB_ShipmentData.M_HAWB,'')||ifnull(HAWB_ShipmentData.D_HAWB,'')) end as HAWB_NO 
      , query_order_Regular_54.ShipmentNo as Act_ShipmentNO
        from query_order_Regular_54 left join HAWB_ShipmentData
          on query_order_Regular_54.ShipmentNo = HAWB_ShipmentData.ShipmentNo
          where logNum between ${req.query.minLogNum} and ${req.query.maxLogNum} and ImportDate = '${req.query.queryDate}'
          order by logNum`

    } else {
      console.log('error table')
    }




    if (query.length !== 0) {
      console.log('query: ' + query)

      const mailInfomation = function (query) {
        return new Promise(function (resolve, reject) {
          db.all(query, [], function (err, rows) {
            if (err) {
              reject(err)
            }
            resolve(rows)
          })
        })
      }

      const getAttachment = async function (query) {
        return new Promise(function (resolve, reject) {
          db.all(query, [], function (err, rows) {
            if (err) {
              reject(err)
            }
            resolve(rows)
          })
        })
      }


      getAttachment(query).then(async function (rows) {
        console.log(rows)
        const workbook = new Excel.Workbook();
        const worksheet = workbook.addWorksheet("Data");
        const fileName = path.resolve(__dirname, '../temp/cuttime_report.xlsx') //'cuttime_report.xlsx'




        worksheet.columns = [
          //{ header: 'NowToActuatDelivery', key: 'NowToActuatDelivery', width: 20 },
          { header: "Time", key: "ImportDateTime", width: 20 },
          { header: "S#", key: "logNum", width: 10 },
          { header: "Shpt", key: "Shpt", width: 5 },
          { header: "HAWB NO", key: "HAWB_NO", width: 20 },
          { header: "報單類別", key: "5105a", width: 10 },
          { header: "DP", key: "DP", width: 10 },
          { header: "Delivery", key: "Delivery", width: 10 },
          { header: "ShipmentNo", key: "Act_ShipmentNO", width: 20 },
          { header: "Country", key: "Act_Country", width: 20 },
          { header: "ShipTo", key: "Act_ShipTo", width: 20 },
          { header: "Tracking#", key: "", width: 20 },
          { header: "預計提貨時間", key: "R_PickupTime", width: 20 },
          { header: "TT", key: "", width: 20 },


        ];

        worksheet.addRows(rows)

        //const buffer = await workbook.xlsx.writeBuffer()
        await workbook.xlsx.writeFile(fileName).then(function () {
          console.log('is OK')
        })




      })
      mailInfomation(query).then(function (rows) {


        const header = `<table class="table table-bordered border-dark">
                        <thead class="table-dark">
                            <tr>
                                <td class="col">Time</td>
                                <td class="col">S#</td>
                                <td class="col">Shpt</td>
                                <td class="col">HAWB NO</td>
                                <td class="col">Type</td>
                                <td class="col">DP</td>
                                <td class="col">Delivery</td>
                                <td class="col">Shipment</td>
                                <td class="col">Country</td>
                                <td class="col">Ship To</td>
                                <td class="col">Tracking</td>
                                <td class="col">ETA</td>
                                <td class="col">TT</td>
                            </tr>
                        </thead>`

        const datas = rows.map(data =>
          '<tr><td>' + data.ShipmentCreateDateTime + '</td>' +
          '<td>' + data.logNum + '</td>' +
          '<td>' + data.Shpt + '</td>' +
          '<td>' + data.HAWB_NO + '</td>' +
          '<td>' + data['5105a'] + '</td>' +
          '<td>' + data.Delivery + '</td>' +
          '<td>' + data.ShipmentNo + '</td>' +
          '<td>' + data.Country + '</td>' +
          '<td>' + data.ShipTo + '</td>' +
          '<td></td>' +
          '<td>' + data.R_PickupTime + '</td>' +
          '<td></td></tr>')
        const bodydata = datas.join('')
        const mailbody = `${header}<tbody>${bodydata}</tbody>`
        console.log(mailbody)
        let attachmentPath = path.resolve(__dirname, '../temp/cuttime_report.xlsx')

        exec(`$body = @"
        ${mailbody}
"@
$ol = New-Object -ComObject Outlook.Application
$mail = $ol.CreateItem(0)
$mail.Subject = "Cut Time Report"
$mail.Htmlbody = $body
$mail.Attachments.add("${attachmentPath}")
$inst = $mail.GetInspector
$inst.Display()
      `, { 'shell': 'powershell.exe' }, (error) => {
          // do whatever with stdout
          if (error) {
            console.log(error)
            //messageBox('error', `Get Clipboard Err`, `${error}`)
            //reject();
          }
        }).on('close', () => {
          console.log('get Clipboard')
          res.end()

          //resolve();


        }).on('error', () => {
          res.end()

        })




      })










    } else {
      res.send('no data')
      res.end()
    }


    //const callOutlook = async function () {
    //return new Promise(function (resolve, reject) {
    /*
    exec(`$ol = New-Object -ComObject Outlook.Application
      $mail = $ol.CreateItem(0)
      $mail.Subject = "Cut Time Report"
      $inst = $mail.GetInspector
      $inst.Display()
      `, { 'shell': 'powershell.exe' }, (error) => {
      // do whatever with stdout
      if (error) {
        console.log(error)
        messageBox('error', `Get Clipboard Err`, `${error}`)
        //reject();
      }
    }).on('close', () => {
      console.log('get Clipboard')


      //resolve();


    })
    */
    // })
    //}

    //callOutlook()

  }
  if (req.query.function == 'cuttime_report_mail_webGet') {


    var db = new sqlite3.Database(path.resolve(__dirname, '../db/main.db'), sqlite3.OPEN_READWRITE)
    var query = ''
    let t2Query = `select 
    Delivery
    ,TBL_ZAVGR043_Prod.ShipmentNo
    ,CreateOn
    ,CreateTime
    ,DP
    ,"ShipTo"
    ,Country
    ,ProformaD
    ,TBL_LT22_Prod.Ref_Doc
    ,TBL_LT22_Prod.Ref_Item
    ,Shpt
    ,TBL_LT22_Prod.Rcv_Plant
    ,TBL_LT22_Prod.Material
    ,"EA" as "BUom"
    ,TBL_LT22_Prod.ProformaUnitCost
    ,TBL_LT22_Prod.Curr
    ,TBL_LT22_Prod.Source_Typ
    ,TBL_LT22_Prod.Source_Bin
    ,TBL_LT22_Prod.Sourcetargetqty
    ,"" as Vendor
    , TBL_LT22_Prod.TONumber
    ,TBL_LT22_Prod.Item
    ,TBL_LT22_Prod.Conf_date
    ,TBL_LT22_Prod.Conf_time
    ,TBL_LT22_Prod.TO_Conf_Qty
    ,TBL_LT22_Prod.To_Diff_Qty
    ,TBL_LT22_Prod.Adj_Diff_Qty
    ,TBL_LT22_Prod.PGI_Qty 
    ,TBL_ZAVGR043_Prod.EntryDate
    ,TBL_ZAVGR043_Prod.PGITime
    ,TBL_LT22_Prod.Mat_Doc
    from TBL_ZAVGR043_Prod inner join TBL_LT22_Prod
    on TBL_ZAVGR043_Prod.Delivery = TBL_LT22_Prod.Dest_Bin
    inner join CutTimeReport_Shipment
    on TBL_ZAVGR043_Prod.ShipmentNo = CutTimeReport_Shipment.ShipmentNo
    where TBL_LT22_Prod.Source_Typ not in ('TSP','922')
    and ProformaD <> ''
    and TBL_LT22_Prod.CS is null
    order by TBL_ZAVGR043_Prod.ShipmentNo , TBL_LT22_Prod.TONumber, TBL_LT22_Prod.Item`
    if (req.query.controllog == 'control_log_downs') {
      query = `select * 
      ,CutTimeReport_Shipment.ImportDateTime as Act_ImportDateTime
      , case 
        when query_order_downs_54.Bonded > 0 and query_order_downs_54.NonBonded > 0 and query_order_downs_54.Country <> 'TW' then 'G3/D5'
        when query_order_downs_54.Bonded > 0 and query_order_downs_54.NonBonded = 0 and query_order_downs_54.Country <> 'TW' then 'D5' 
        when query_order_downs_54.Bonded > 0 and query_order_downs_54.NonBonded = 0 and query_order_downs_54.Country = 'TW' then 'D2' 
        else 'G3' end as [5105a]  
        , case when query_order_downs_54.Country = 'TW' then 'D' || '-' || date() || '-' || query_order_downs_54.logNum
      else trim(ifnull(HAWB_ShipmentData.M_HAWB,'')||ifnull(HAWB_ShipmentData.D_HAWB,'')) end as HAWB_NO 
      , query_order_downs_54.ShipmentNo as Act_ShipmentNO
      , query_order_downs_54.Country as Act_Country
		, query_order_downs_54.ShipTo as Act_ShipTo
          from CutTimeReport_Shipment inner join query_order_downs_54
          on CutTimeReport_Shipment.ShipmentNo = query_order_downs_54.ShipmentNo
          left join HAWB_ShipmentData
          on CutTimeReport_Shipment.ShipmentNo = HAWB_ShipmentData.ShipmentNo
          order by CutTimeReport_Shipment.ImportDateTime `

    } else if (req.query.controllog == 'control_log_regular') {
      query = `select *
      ,CutTimeReport_Shipment.ImportDateTime as Act_ImportDateTime
      , case 
        when query_order_Regular_54.Bonded > 0 and query_order_Regular_54.NonBonded > 0 and query_order_Regular_54.Country <> 'TW' then 'G3/D5'
        when query_order_Regular_54.Bonded > 0 and query_order_Regular_54.NonBonded = 0 and query_order_Regular_54.Country <> 'TW' then 'D5' 
        when query_order_Regular_54.Bonded > 0 and query_order_Regular_54.NonBonded = 0 and query_order_Regular_54.Country = 'TW' then 'D2' 
        else 'G3' end as [5105a] 
        , case when query_order_Regular_54.Country = 'TW' then 'D' || '-' || date() || '-' || query_order_Regular_54.logNum
      else trim(ifnull(HAWB_ShipmentData.M_HAWB,'')||ifnull(HAWB_ShipmentData.D_HAWB,'')) end as HAWB_NO 
      , query_order_Regular_54.ShipmentNo as Act_ShipmentNO 
      , query_order_Regular_54.Country as Act_Country
		, query_order_Regular_54.ShipTo as Act_ShipTo
        from CutTimeReport_Shipment inner join query_order_Regular_54
        on CutTimeReport_Shipment.ShipmentNo = query_order_Regular_54.ShipmentNo
        left join HAWB_ShipmentData
        on query_order_Regular_54.ShipmentNo = HAWB_ShipmentData.ShipmentNo
        order by CutTimeReport_Shipment.ImportDateTime `

    } else {
      console.log('error table')
    }




    if (query.length !== 0) {
      console.log('query: ' + query)

      const mailInfomation = function (query) {
        return new Promise(function (resolve, reject) {
          db.all(query, [], function (err, rows) {
            if (err) {
              reject(err)
            }
            resolve(rows)
          })
        })
      }
      const getT2Attachment = async function (query) {
        return new Promise(function (resolve, reject) {
          db.all(query, [], function (err, rows) {
            if (err) {
              reject(err)
            }
            resolve(rows)
          })
        })
      }
      const getAttachment = async function (query) {
        return new Promise(function (resolve, reject) {
          db.all(query, [], function (err, rows) {
            if (err) {
              reject(err)
            }
            resolve(rows)
          })
        })
      }





      getAttachment(query).then(async function (rows) {
        console.log(rows)

        const workbook = new Excel.Workbook();
        const T1 = workbook.addWorksheet("T1");
        const T2 = workbook.addWorksheet("T2");
        const fileName = path.resolve(__dirname, '../temp/cuttime_report.xlsx') //'cuttime_report.xlsx'

        T1.columns = [
          //{ header: 'NowToActuatDelivery', key: 'NowToActuatDelivery', width: 20 },
          { header: "Time", key: "ImportDateTime", width: 20 },
          { header: "S#", key: "logNum", width: 10 },
          { header: "Shpt", key: "Shpt", width: 5 },
          { header: "HAWB NO", key: "HAWB_NO", width: 20 },
          { header: "報單類別", key: "5105a", width: 10 },
          { header: "DP", key: "DP", width: 10 },
          { header: "Delivery", key: "Delivery", width: 10 },
          { header: "ShipmentNo", key: "Act_ShipmentNO", width: 20 },
          { header: "Country", key: "Act_Country", width: 20 },
          { header: "ShipTo", key: "Act_ShipTo", width: 20 },
          { header: "Tracking#", key: "", width: 20 },
          { header: "預計提貨時間", key: "R_PickupTime", width: 20 },
          { header: "TT", key: "", width: 20 },


        ];

        T1.addRows(rows)

        //const buffer = await workbook.xlsx.writeBuffer()
        getT2Attachment(t2Query).then(async function (rows) {
          console.log(rows)

          T2.columns = [
            //{ header: 'NowToActuatDelivery', key: 'NowToActuatDelivery', width: 20 },
            { header: "Delivery", key: "Delivery", width: 20 },
            { header: "Shipment", key: "ShipmentNo", width: 20 },
            { header: "Delitem", key: "", width: 20 },
            { header: "Creted On", key: "CreateOn", width: 20 },
            { header: "Create Time", key: "CreateTime", width: 20 },
            { header: "Delivery Priority", key: "DP", width: 20 },
            { header: "Ship-to party", key: "ShipTo", width: 20 },
            { header: "Country", key: "Country", width: 20 },
            { header: "Billing Document", key: "ProformaD", width: 20 },
            { header: "Reference Document", key: "Ref_Doc", width: 20 },
            { header: "Reerence Item", key: "Ref_Item", width: 20 },
            { header: "Shipping point / Receiving Point", key: "Shpt", width: 20 },
            { header: "Plant", key: "Rcv_Plant", width: 20 },
            { header: "Material Number", key: "Material", width: 20 },
            { header: "Base Unit of Measure", key: "BUom", width: 20 },
            { header: "Proforma Unit Cost", key: "ProformaUnitCost", width: 20 },
            { header: "Document Currency", key: "Curr", width: 20 },
            { header: "Source Storage Type", key: "Source_Typ", width: 20 },
            { header: "Source Storage Bin", key: "Source_Bin", width: 20 },
            { header: "Target Qty", key: "Sourcetargetqty", width: 20 },
            { header: "Vendor No", key: "", width: 20 },
            { header: "Transefer Order No", key: "TONumber", width: 20 },
            { header: "TOItem", key: "Item", width: 20 },
            { header: "TO Confirm Date", key: "Conf_date", width: 20 },
            { header: "TO Confirm Time", key: "Conf_time", width: 20 },
            { header: "TO Confirm Qty", key: "TO_Conf_Qty", width: 20 },
            { header: "TO Diff Qty", key: "To_Diff_Qty", width: 20 },
            { header: "Adj Diff Qty", key: "Adj_Diff_Qty", width: 20 },
            { header: "PGI Qty", key: "PGI_Qty", width: 20 },
            { header: "PGI Date", key: "EntryDate", width: 20 },
            { header: "PGI Time", key: "PGITime", width: 20 },
            { header: "Material Number", key: "Mat_Doc", width: 20 },


          ];

          T2.addRows(rows)

          //const buffer = await workbook.xlsx.writeBuffer()
          await workbook.xlsx.writeFile(fileName).then(function () {
            console.log('is OK')
          })


        })


      })










      mailInfomation(query).then(function (rows) {


        const header = `<table class="table table-bordered border-dark">
                        <thead class="table-dark">
                            <tr>
                                <td class="col">Time</td>
                                <td class="col">S#</td>
                                <td class="col">Shpt</td>
                                <td class="col">HAWB NO</td>
                                <td class="col">Type</td>
                                <td class="col">DP</td>
                                <td class="col">Delivery</td>
                                <td class="col">Shipment</td>
                                <td class="col">Country</td>
                                <td class="col">Ship To</td>
                                <td class="col">Tracking</td>
                                <td class="col">ETA</td>
                                <td class="col">TT</td>
                            </tr>
                        </thead>`

        const datas = rows.map(data =>
          '<tr><td>' + data.ShipmentCreateDateTime + '</td>' +
          '<td>' + data.logNum + '</td>' +
          '<td>' + data.Shpt + '</td>' +
          '<td>' + data.HAWB_NO + '</td>' +
          '<td>' + data['5105a'] + '</td>' +
          '<td>' + data.Delivery + '</td>' +
          '<td>' + data.Act_ShipmentNO + '</td>' +
          '<td>' + data.Act_Country + '</td>' +
          '<td>' + data.Act_ShipTo + '</td>' +
          '<td></td>' +
          '<td>' + data.R_PickupTime + '</td>' +
          '<td></td></tr>')
        const bodydata = datas.join('')
        const mailbody = `${header}<tbody>${bodydata}</tbody>`
        console.log(mailbody)
        let attachmentPath = path.resolve(__dirname, '../temp/cuttime_report.xlsx')

        exec(`$body = @"
        ${mailbody}
"@
$ol = New-Object -ComObject Outlook.Application
$mail = $ol.CreateItem(0)
$mail.Subject = "Cut Time Report"
$mail.Htmlbody = $body
$mail.Attachments.add("${attachmentPath}")
$inst = $mail.GetInspector
$inst.Display()
      `, { 'shell': 'powershell.exe' }, (error) => {
          // do whatever with stdout
          if (error) {
            console.log(error)
            //messageBox('error', `Get Clipboard Err`, `${error}`)
            //reject();
          }
        }).on('close', () => {
          console.log('get Clipboard')

          db.run('delete from CutTimeReport_Shipment', function (err) {
            if (err) {
              console.log(err)
            }
            res.end()
          })

          //resolve();


        }).on('error', () => {
          res.end()

        })




      })










    } else {
      res.send('no data')
      res.end()
    }

  }
  if (req.query.function == 'eta_report_mail_webGet') {
    var db = new sqlite3.Database(path.resolve(__dirname, '../db/main.db'), sqlite3.OPEN_READWRITE)
    var query = ''
    var queryRegular = ''
    var querySuperDown = ''
    var queryHaz = ''

    if (req.query.controllog == 'control_log_downs') {
      query = `select 
      a.logNum
      ,a.SHPCondition
      ,b.M_HAWB || ifnull(b.D_HAWB,'') as HAWB
      ,a.ShipTo
      ,b.R_PickupTime
      ,a.ShipmentNo
      ,case when a.NonBonded > 0 then 'Yes' else 'No' end as "G3"
      ,case when a.Bonded > 0 then 'Yes' else 'No' end as "D5"
      ,c.ECSID
      ,c.Handling_Unit
      ,c.Package_Weight
      ,c.Dimensions
      ,a.Country
      ,c.Company
      ,c.Address1
      ,c.ShipToCity
      ,c.ShipToPostal_Code
      ,a.pkg_description as "REMARK"
      ,c.Tracking_Number
      ,c.Shipping_Carrier
      from Order_ShipmentData_Downs_LogNum a inner join HAWB_ShipmentData b
      on a.ShipmentNo = b.ShipmentNo
      LEFT join TBL_Manifest c 
      on a.ShipmentNo = c.Delivery_Shipment
      where b.R_PickupTime = '${req.query.pickupDateTime}'
      and a.SHPCondition in (0, 3)
      order by a.logNum;`

      querySuperDown = `select 
      a.logNum
      ,a.SHPCondition
      ,b.M_HAWB || ifnull(b.D_HAWB,'') as HAWB
      ,a.ShipTo
      ,b.R_PickupTime
      ,a.ShipmentNo
      ,case when a.NonBonded > 0 then 'Yes' else 'No' end as "G3"
      ,case when a.Bonded > 0 then 'Yes' else 'No' end as "D5"
      ,c.ECSID
      ,c.Handling_Unit
      ,c.Package_Weight
      ,c.Dimensions
      ,a.Country
      ,c.Company
      ,c.Address1
      ,c.ShipToCity
      ,c.ShipToPostal_Code
      ,a.pkg_description as "REMARK"
      ,c.Tracking_Number
      ,c.Shipping_Carrier
      ,b.Vendor
      from Order_ShipmentData_Downs_LogNum a inner join HAWB_ShipmentData b
      on a.ShipmentNo = b.ShipmentNo
      INNER join TBL_Manifest c 
      on a.ShipmentNo = c.Delivery_Shipment
      where b.R_PickupTime = '${req.query.pickupDateTime}'
      and a.SHPCondition in (1)
      order by a.logNum;`

      queryHaz = `select 
      a.logNum
      ,a.SHPCondition
      ,b.M_HAWB || ifnull(b.D_HAWB,'') as HAWB
      ,a.ShipTo
      ,b.R_PickupTime
      ,a.ShipmentNo
      ,case when a.NonBonded > 0 then 'Yes' else 'No' end as "G3"
      ,case when a.Bonded > 0 then 'Yes' else 'No' end as "D5"
      ,c.ECSID
      ,c.Handling_Unit
      ,c.Package_Weight
      ,c.Dimensions
      ,a.Country
      ,c.Company
      ,c.Address1
      ,c.ShipToCity
      ,c.ShipToPostal_Code
      ,a.pkg_description as "REMARK"
      ,c.Tracking_Number
      ,c.Shipping_Carrier
      from Order_ShipmentData_Downs_LogNum a inner join HAWB_ShipmentData b
      on a.ShipmentNo = b.ShipmentNo
      INNER join TBL_Manifest c 
      on a.ShipmentNo = c.Delivery_Shipment
      INNER join TBL_ZAVGR043_Prod d 
      on a.ShipmentNo = d.ShipmentNo
      where b.R_PickupTime = '${req.query.pickupDateTime}'
      and d.UNR_Control = 1
      and a.SHPCondition in (0, 1, 3)
      order by a.logNum;`

    } else if (req.query.controllog == 'control_log_regular') {
      queryRegular = `select 
      a.logNum
      ,a.SHPCondition
      ,b.M_HAWB || ifnull(b.D_HAWB,'') as HAWB
      ,a.ShipTo
      ,b.R_PickupTime
      ,a.ShipmentNo
      ,case when a.NonBonded > 0 then 'Yes' else 'No' end as "G3"
      ,case when a.Bonded > 0 then 'Yes' else 'No' end as "D5"
      ,c.ECSID
      ,c.Handling_Unit
      ,c.Package_Weight
      ,c.Dimensions
      ,a.Country
      ,c.Company
      ,c.Address1
      ,c.ShipToCity
      ,c.ShipToPostal_Code
      ,a.pkg_description as "REMARK"
      ,c.Tracking_Number
      ,c.Shipping_Carrier
      from Order_ShipmentData_Regular_LogNum a inner join HAWB_ShipmentData b
      on a.ShipmentNo = b.ShipmentNo
      INNER join TBL_Manifest c 
      on a.ShipmentNo = c.Delivery_Shipment
      where b.R_PickupTime = '${req.query.pickupDateTime}'
      and a.SHPCondition in (11, 12)
      order by a.logNum;`

      queryHaz = `select 
      a.logNum
      ,a.SHPCondition
      ,b.M_HAWB || ifnull(b.D_HAWB,'') as HAWB
      ,a.ShipTo
      ,b.R_PickupTime
      ,a.ShipmentNo
      ,case when a.NonBonded > 0 then 'Yes' else 'No' end as "G3"
      ,case when a.Bonded > 0 then 'Yes' else 'No' end as "D5"
      ,c.ECSID
      ,c.Handling_Unit
      ,c.Package_Weight
      ,c.Dimensions
      ,a.Country
      ,c.Company
      ,c.Address1
      ,c.ShipToCity
      ,c.ShipToPostal_Code
      ,a.pkg_description as "REMARK"
      ,c.Tracking_Number
      ,c.Shipping_Carrier
      from Order_ShipmentData_Downs_LogNum a inner join HAWB_ShipmentData b
      on a.ShipmentNo = b.ShipmentNo
      INNER join TBL_Manifest c 
      on a.ShipmentNo = c.Delivery_Shipment
      INNER join TBL_ZAVGR043_Prod d 
      on a.ShipmentNo = d.ShipmentNo
      where b.R_PickupTime = '${req.query.pickupDateTime}'
      and d.UNR_Control = 1
      and a.SHPCondition in (11, 12)
      order by a.logNum;`

    } else {
      console.log('error table')
    }
    if (query.length !== 0) {
      console.log('query: ' + query)
      const mailInfomation = function (query) {
        return new Promise(function (resolve, reject) {
          db.all(query, [], function (err, rows) {
            if (err) {
              reject(err)
            }
            resolve(rows)
          })
        })
      }
      const getAttachment = async function (query) {
        return new Promise(function (resolve, reject) {
          db.all(query, [], function (err, rows) {
            if (err) {
              reject(err)
            }
            resolve(rows)
          })
        })
      }

      getAttachment(query).then(async function (rows) {
        const workbook = new Excel.Workbook();
        const ETA = workbook.addWorksheet("ETA");
        const fileName = path.resolve(__dirname, '../temp/Downs_ETA_report.xlsx') //'cuttime_report.xlsx'

        ETA.columns = [
          { header: "S#", key: "logNum", widht: 20 },
          { header: "Shipping Condition", key: "SHPCondition", widht: 20 },
          { header: "HB#", key: "HAWB", widht: 20 },
          { header: "ship to code", key: "ShipTo", widht: 20 },
          { header: "預計提貨時間", key: "R_PickupTime", widht: 20 },
          { header: "shipment", key: "ShipmentNo", widht: 20 },
          { header: "G3", key: "G3", widht: 20 },
          { header: "D5", key: "D5", widht: 20 },
          { header: "ECSID", key: "ECSID", widht: 20 },
          { header: "HU#", key: "Handling_Unit", widht: 20 },
          { header: "Weight(KG)", key: "Package_Weight", widht: 20 },
          { header: "Dimension(CM)", key: "Dimensions", widht: 20 },
          { header: "Delivery", key: "", widht: 20 },
          { header: "Country", key: "Country", widht: 20 },
          { header: "Company", key: "Company", widht: 20 },
          { header: "Address 1", key: "Address1", widht: 20 },
          { header: "ShipToCity", key: "ShipToCity", widht: 20 },
          { header: "ShipToPostal Code", key: "ShipToPostal_Code", widht: 20 },
          { header: "REMARK", key: "REMARK", widht: 20 },
          { header: "tracking#", key: "Tracking_Number", widht: 20 },

        ]

        ETA.addRows(rows)

        //const buffer = await workbook.xlsx.writeBuffer()
        await workbook.xlsx.writeFile(fileName).then(function () {
          console.log('is OK')
        })


      })

      mailInfomation(query).then(function (rows) {


        let attachmentPath = path.resolve(__dirname, '../temp/Downs_ETA_report.xlsx')

        exec(`
$ol = New-Object -ComObject Outlook.Application
$mail = $ol.CreateItem(0)
$mail.Subject = "Downs ETA Report"
$mail.Attachments.add("${attachmentPath}")
$inst = $mail.GetInspector
$inst.Display()
      `, { 'shell': 'powershell.exe' }, (error) => {
          // do whatever with stdout
          if (error) {
            console.log(error)
            //messageBox('error', `Get Clipboard Err`, `${error}`)
            //reject();
          }
        }).on('close', () => {
          console.log('get Clipboard')

          /*db.run('delete from CutTimeReport_Shipment', function (err) {
            if (err) {
              console.log(err)
            }
            res.end()
          })*/

          //resolve();


        }).on('error', () => {
          res.end()

        })




      })










    } /*else {
      res.send('no data')
      //res.end()
    } */

    if (queryRegular.length !== 0) {
      console.log('query: ' + query)
      const mailInfomation = function (query) {
        return new Promise(function (resolve, reject) {
          db.all(query, [], function (err, rows) {
            if (err) {
              reject(err)
            }
            resolve(rows)
          })
        })
      }
      const getAttachment = async function (query) {
        return new Promise(function (resolve, reject) {
          db.all(query, [], function (err, rows) {
            if (err) {
              reject(err)
            }
            resolve(rows)
          })
        })
      }

      getAttachment(queryRegular).then(async function (rows) {
        const workbook = new Excel.Workbook();
        const ETA = workbook.addWorksheet("ETA");
        const fileName = path.resolve(__dirname, '../temp/Regular_ETA_report.xlsx') //'cuttime_report.xlsx'

        ETA.columns = [

          { header: "S#", key: "logNum", widht: 20 },
          { header: "HB#", key: "HAWB", widht: 20 },
          { header: "ship to code", key: "ShipTo", widht: 20 },
          { header: "P/U Time Date", key: "R_PickupTime", widht: 20 },
          { header: "shipment", key: "ShipmentNo", widht: 20 },
          { header: "HU#", key: "Handling_Unit", widht: 20 },
          { header: "ECSID", key: "ECSID", widht: 20 },
          { header: "Weight(KG)", key: "Package_Weight", widht: 20 },
          { header: "Dimension(CM)", key: "Dimensions", widht: 20 },
          { header: "Company", key: "Company", widht: 20 },
          { header: "Address 1", key: "Address1", widht: 20 },
          { header: "ShipToCity", key: "ShipToCity", widht: 20 },
          { header: "ShipToPostal Code", key: "ShipToPostal_Code", widht: 20 },
          { header: "Country", key: "Country", widht: 20 },
          { header: "tracking#", key: "Tracking_Number", widht: 20 },
          { header: "REMARK-XIY", key: "REMARK", widht: 20 },


        ]

        ETA.addRows(rows)

        //const buffer = await workbook.xlsx.writeBuffer()
        await workbook.xlsx.writeFile(fileName).then(function () {
          console.log('is OK')
        })


      })

      mailInfomation(queryRegular).then(function (rows) {


        let attachmentPath = path.resolve(__dirname, '../temp/Regular_ETA_report.xlsx')

        exec(`
$ol = New-Object -ComObject Outlook.Application
$mail = $ol.CreateItem(0)
$mail.Subject = "Regular ETA Report"
$mail.Attachments.add("${attachmentPath}")
$inst = $mail.GetInspector
$inst.Display()
      `, { 'shell': 'powershell.exe' }, (error) => {
          // do whatever with stdout
          if (error) {
            console.log(error)
            //messageBox('error', `Get Clipboard Err`, `${error}`)
            //reject();
          }
        }).on('close', () => {
          console.log('get Clipboard')

          /*db.run('delete from CutTimeReport_Shipment', function (err) {
            if (err) {
              console.log(err)
            }
            res.end()
          })*/

          //resolve();


        }).on('error', () => {
          res.end()

        })




      })










    } /*else {
      res.send('no data')
      //res.end()
    } */


    if (querySuperDown.length !== 0) {
      console.log('query: ' + query)
      const mailInfomation = function (query) {
        return new Promise(function (resolve, reject) {
          db.all(query, [], function (err, rows) {
            if (err) {
              reject(err)
            }
            resolve(rows)
          })
        })
      }
      const getAttachment = async function (query) {
        return new Promise(function (resolve, reject) {
          db.all(query, [], function (err, rows) {
            if (err) {
              reject(err)
            }
            resolve(rows)
          })
        })
      }

      getAttachment(querySuperDown).then(async function (rows) {
        const workbook = new Excel.Workbook();
        const ETA = workbook.addWorksheet("ETA");
        const fileName = path.resolve(__dirname, '../temp/SuperDown_ETA_report.xlsx') //'cuttime_report.xlsx'

        ETA.columns = [
          { header: "HB#", key: "HAWB", widht: 20 },
          { header: "ship to code", key: "ShipTo", widht: 20 },
          { header: "預計提貨時間", key: "R_PickupTime", widht: 20 },
          { header: "shipment", key: "ShipmentNo", widht: 20 },
          { header: "tracking#", key: "Tracking_Number", widht: 20 },
          { header: "Weight(KG)", key: "Package_Weight", widht: 20 },
          { header: "Dimension(CM)", key: "Dimensions", widht: 20 },
          { header: "G3", key: "G3", widht: 20 },
          { header: "D5", key: "D5", widht: 20 },
          { header: "Delivery Reference", key: "", widht: 20 },
          { header: "Delivery", key: "Delivery", widht: 20 },
          { header: "CARRIER", key: "Vendor", widht: 20 },


        ]

        ETA.addRows(rows)

        //const buffer = await workbook.xlsx.writeBuffer()
        await workbook.xlsx.writeFile(fileName).then(function () {
          console.log('is OK')
        })


      })

      mailInfomation(querySuperDown).then(function (rows) {


        let attachmentPath = path.resolve(__dirname, '../temp/SuperDown_ETA_report.xlsx')

        exec(`
$ol = New-Object -ComObject Outlook.Application
$mail = $ol.CreateItem(0)
$mail.Subject = "SuperDown ETA Report"
$mail.Attachments.add("${attachmentPath}")
$inst = $mail.GetInspector
$inst.Display()
      `, { 'shell': 'powershell.exe' }, (error) => {
          // do whatever with stdout
          if (error) {
            console.log(error)
            //messageBox('error', `Get Clipboard Err`, `${error}`)
            //reject();
          }
        }).on('close', () => {
          console.log('get Clipboard')

          /*db.run('delete from CutTimeReport_Shipment', function (err) {
            if (err) {
              console.log(err)
            }
            res.end()
          })*/

          //resolve();


        }).on('error', () => {
          res.end()

        })




      })










    } /*else {
      res.send('no data')
      //res.end()
    }*/

    if (queryHaz.length !== 0) {
      console.log('query: ' + query)
      const mailInfomation = function (query) {
        return new Promise(function (resolve, reject) {
          db.all(queryHaz, [], function (err, rows) {
            if (err) {
              reject(err)
            }
            resolve(rows)
          })
        })
      }
      const getAttachment = async function (query) {
        return new Promise(function (resolve, reject) {
          db.all(query, [], function (err, rows) {
            if (err) {
              reject(err)
            }
            resolve(rows)
          })
        })
      }

      getAttachment(queryHaz).then(async function (rows) {
        const workbook = new Excel.Workbook();
        const ETA = workbook.addWorksheet("ETA");
        const fileName = path.resolve(__dirname, '../temp/UNR_ETA_report.xlsx') //'cuttime_report.xlsx'

        ETA.columns = [

          { header: "HB#", key: "HAWB", widht: 20 },
          { header: "ShipToCity", key: "ShipToCity", widht: 20 },
          { header: "ship to code", key: "ShipTo", widht: 20 },
          { header: "FAX Date", key: "", widht: 20 },
          { header: "FAX Date", key: "", widht: 20 },
          { header: "shipment", key: "ShipmentNo", widht: 20 },
          { header: "G3", key: "G3", widht: 20 },
          { header: "D5", key: "D5", widht: 20 },

        ]

        ETA.addRows(rows)

        //const buffer = await workbook.xlsx.writeBuffer()
        await workbook.xlsx.writeFile(fileName).then(function () {
          console.log('is OK')
        })


      })

      mailInfomation(queryHaz).then(function (rows) {


        let attachmentPath = path.resolve(__dirname, '../temp/UNR_ETA_report.xlsx')

        exec(`
$ol = New-Object -ComObject Outlook.Application
$mail = $ol.CreateItem(0)
$mail.Subject = "UNR ETA Report"
$mail.Attachments.add("${attachmentPath}")
$inst = $mail.GetInspector
$inst.Display()
      `, { 'shell': 'powershell.exe' }, (error) => {
          // do whatever with stdout
          if (error) {
            console.log(error)
            //messageBox('error', `Get Clipboard Err`, `${error}`)
            //reject();
          }
        }).on('close', () => {
          console.log('get Clipboard')

          /*db.run('delete from CutTimeReport_Shipment', function (err) {
            if (err) {
              console.log(err)
            }
            res.end()
          })*/

          //resolve();


        }).on('error', () => {
          res.end()

        })




      })










    } /*else {
      res.send('no data')
      //res.end()
    }*/

    res.send('no data')

    //}

  }
  if (req.query.function == 'cuttime_report_mail') {

    var db = new sqlite3.Database(path.resolve(__dirname, '../db/main.db'), sqlite3.OPEN_READWRITE)
    //const fs = require('fs')

    //return new Promise (function(resolve, reject) {
    var query = ''
    if (req.query.controllog == 'control_log_downs') {
      query = `select * , case when query_order_downs_54.Bonded > 0 and query_order_downs_54.Country <> 'TW' then 'D5' when query_order_downs_54.Bonded > 0 and query_order_downs_54.Country - 'TW' then 'D2' else 'G3' end as [5105a] , trim(ifnull(HAWB_ShipmentData.M_HAWB,'')||ifnull(HAWB_ShipmentData.D_HAWB,'')) as HAWB_NO 
        from query_order_downs_54 inner join HAWB_ShipmentData
          on query_order_downs_54.ShipmentNo = HAWB_ShipmentData.ShipmentNo
          where logNum between ${req.query.minLogNum} and ${req.query.maxLogNum} and ImportDate = '${req.query.queryDate}'
          order by logNum`

    } else if (req.query.controllog == 'control_log_regular') {
      query = `select *, case when query_order_Regular_54.Bonded > 0 and query_order_Regular_54.Country <> 'TW' then 'D5' when query_order_Regular_54.Bonded > 0 and query_order_Regular_54.Country - 'TW' then 'D2' else 'G3' end as [5105a], trim(ifnull(HAWB_ShipmentData.M_HAWB,'')||ifnull(HAWB_ShipmentData.D_HAWB,'')) as HAWB_NO 
        from query_order_Regular_54 inner join HAWB_ShipmentData
          on query_order_Regular_54.ShipmentNo = HAWB_ShipmentData.ShipmentNo
          where logNum between ${req.query.minLogNum} and ${req.query.maxLogNum} and ImportDate = '${req.query.queryDate}'
          order by logNum`

    } else {
      console.log('error table')
    }


    //return new Promise(function (resolve, reject) {
    if (query.length !== 0) {


      db.all(query, [], function (err, rows) {

        if (err) {
          console.log(err)

        }

        res.send(rows)


        //const rendeData = { data: rows }

        //res.render('report_ILC.ejs',rendeData )

        //res.send(`mailto:?subject=ILC Cut-Time report&body&body=${data}`)

        //rows.ShipmentCreateDateTime


      })




    } else {
      res.send('no data')
      res.end()
    }
    //})





  }
})

apps.get('/get/hawbInformation', (req, res) => {
  req.query.function
  req.query.queryDate
  req.query.shipmentNo

  console.log(req.query.function)
  console.log(req.query.queryDate)
  console.log(req.query.shipmentNo)



  var db = new sqlite3.Database(path.join(__dirname, '../db/main.db'), sqlite3.OPEN_READWRITE)
  if (req.query.function == 'vendor') {

    db.serialize(function () {
      db.exec(`
              drop TABLE if EXISTS vendor_temp;
              create TABLE if not EXISTS vendor_temp(
                vendor_name TEXT
              );
              insert into vendor_temp (vendor_name) values ('CEVA');
              insert into vendor_temp (vendor_name) values ('CEVA-K');
              insert into vendor_temp (vendor_name) values ('DHL');
              insert into vendor_temp (vendor_name) values ('CNW');
              insert into vendor_temp (vendor_name) values ('UPS');
              insert into vendor_temp (vendor_name) values ('FEDEX');
              insert into vendor_temp (vendor_name) values ('AIR_Ocean');
              INSERT into vendor_temp (vendor_name) select Vendor from HAWB_Primary where Vendor not in (select Vendor from HAWB_ShipmentData where ShipmentNo = '${req.query.shipmentNo}')  group by Vendor;
              `, function (err) {
              if (err) {
                console.log(err)
              
              }
            }
          )

      db.all(`select vendor_name as "Vendor" from vendor_temp group by vendor_name`, [], function (err, rows) {
        if (err) {

          return console.log(`find ${req.params.inputvalues} error: `, err.message)
        }

        const rendeData = { hostname: host, title: 'Vendor Change', menuTitle: `${req.query.shipmentNo} Vendor Change`, vendor: rows, shipmentNo: req.query.shipmentNo, hostname: host }
        res.render('forwardChange.ejs', rendeData)


      })

      db.close
    })

  }

  if (req.query.function == 'changeHAWB') {
    req.query.Vendor
    req.query.ShipmentNo
    console.log('changeHAWB')
    if (req.query.Vendor == 'CEVA' || req.query.Vendor == 'CEVA-K') {
      db.all(`select * from HAWB_Primary 
        where Vendor = (select Vendor from HAWB_ShipmentData where ShipmentNo = '${req.query.ShipmentNo}' ) 
        and "Check" = 0 
        --and Vendor not like 'CEVA%'
        and substr(HAWB,1,1) = (select Start_With from HAWB_ShipmentData where ShipmentNo = '${req.query.ShipmentNo}')
        order by HAWB asc limit 20`, [], function (err, rows) {
        if (err) {

          return console.log(`find ${req.params.inputvalues} error: `, err.message)
        }

        const rendeData = { hostname: host, title: 'Assign HAWB', menuTitle: `${req.query.ShipmentNo} Assign HAWB(${req.query.Vendor})`, hawb: rows, shipmentNo: req.query.ShipmentNo, hostname: host, vendor: req.query.Vendor }
        res.render('hawbChange.ejs', rendeData)
      })
    } else {
      db.all(`select * from HAWB_Primary 
        where Vendor = (select Vendor from HAWB_ShipmentData where ShipmentNo = '${req.query.ShipmentNo}') 
        and "Check" = 0 
        --and substr(HAWB,1,1) = (select Start_With from HAWB_ShipmentData where ShipmentNo = '${req.query.ShipmentNo}')
        order by HAWB asc limit 20`, [], function (err, rows) {
        if (err) {

          return console.log(`find ${req.params.inputvalues} error: `, err.message)
        }

        const rendeData = { hostname: host, title: 'Assign HAWB', menuTitle: `${req.query.ShipmentNo} Assign HAWB(${req.query.Vendor})`, hawb: rows, shipmentNo: req.query.ShipmentNo, hostname: host, vendor: req.query.Vendor }
        res.render('hawbChange.ejs', rendeData)
      })
    }


  }
  if (req.query.function == 'CEVA') {
    db.all(`select * from HAWB_CEVA where "Check" = 0 order by HAWB asc limit 20`, [], function (err, rows) {
      if (err) {

        return console.log(`find ${req.params.inputvalues} error: `, err.message)
      }

      const rendeData = { hostname: host, title: 'Assign HAWB', menuTitle: `${req.query.shipmentNo} Assign HAWB(CEVA)`, hawb: rows, shipmentNo: req.query.shipmentNo, hostname: host, vendor: 'CEVA' }
      res.render('hawbChange.ejs', rendeData)
    })
  }

  if (req.query.function == 'DHL') {
    db.all('select * from HAWB_DHL where "Check" = 0 order by HAWB asc limit 20', [], function (err, rows) {
      if (err) {

        return console.log(`find ${req.params.inputvalues} error: `, err.message)
      }

      const rendeData = { hostname: host, title: 'Assign HAWB', menuTitle: `${req.query.shipmentNo} Assign HAWB(DHL)`, hawb: rows, shipmentNo: req.query.shipmentNo, hostname: host, vendor: 'CEVA' }
      res.render('hawbChange.ejs', rendeData)
    })
  }

  if (req.query.function == 'CEVA-K') {
    db.all(`select * from HAWB_CEVA_K where "Check" = 0 order by HAWB asc limit 20`, [], function (err, rows) {
      if (err) {

        return console.log(`find ${req.params.inputvalues} error: `, err.message)
      }

      const rendeData = { hostname: host, title: 'Assign HAWB', menuTitle: `${req.query.shipmentNo} Assign HAWB(CEVA-K)`, hawb: rows, shipmentNo: req.query.shipmentNo, hostname: host, vendor: 'CEVA' }
      res.render('hawbChange.ejs', rendeData)
    })
  }

  if (req.query.function == 'CNW') {
    db.all('select * from HAWB_CNW where "Check" = 0 order by HAWB asc limit 20', [], function (err, rows) {
      if (err) {

        return console.log(`find ${req.params.inputvalues} error: `, err.message)
      }

      const rendeData = { hostname: host, title: 'Assign HAWB', menuTitle: `${req.query.shipmentNo} Assign HAWB(CNW)`, hawb: rows, shipmentNo: req.query.shipmentNo, hostname: host, vendor: 'CEVA' }
      res.render('hawbChange.ejs', rendeData)
    })
  }

  if (req.query.function == 'SCH') {
    db.all('select * from HAWB_SCH where "Check" = 0 order by HAWB asc limit 20', [], function (err, rows) {
      if (err) {

        return console.log(`find ${req.params.inputvalues} error: `, err.message)
      }

      const rendeData = { hostname: host, title: 'Assign HAWB', menuTitle: `${req.query.shipmentNo} Assign HAWB(SCH)`, hawb: rows, shipmentNo: req.query.shipmentNo, hostname: host, vendor: 'CEVA' }
      res.render('hawbChange.ejs', rendeData)
    })
  }

  if (req.query.function == 'KWE') {
    db.all('select * from HAWB_KWE where "Check" = 0 order by HAWB asc limit 20', [], function (err, rows) {
      if (err) {

        return console.log(`find ${req.params.inputvalues} error: `, err.message)
      }

      const rendeData = { hostname: host, title: 'Assign HAWB', menuTitle: `${req.query.shipmentNo} Assign HAWB(KWE)`, hawb: rows, shipmentNo: req.query.shipmentNo, hostname: host, vendor: 'CEVA' }
      res.render('hawbChange.ejs', rendeData)
    })
  }






})

apps.get('/get/dashboard', (req, res) => {


  req.query.function
  req.query.queryFunc
  req.query.plant
  req.query.queryDate
  req.query.shipmentNo
  req.query.pagesize
  req.query.currentPage
  req.query.serachQuery

  console.log(req.query.function)
  console.log(req.query.queryDate)
  var query = ""
  if (req.query.function == 'temp_history') {
    query = `select * from ZAVGR043_Temp where (CN_Ctrl_Parts = 1 or HAZ_Control = 1 or W_Parts_Control = 1 or UNR_Control = 1 or  OrderNotFinish_Control = 1 or Piece_Control = 1 ) and OverallPickingStatus = 'C'
    and OverallGMStatus = 'A'
    AND ShipmentNo <> ''`

    var rawdata = [];
    var db = new sqlite3.Database(path.join(__dirname, '../db/main.db'), sqlite3.OPEN_READWRITE)
    db.all(query, [], function (err, rows) {
      if (err) {

        return console.log(`find ${req.params.inputvalues} error: `, err.message)
      }
      const rendeData = { hostname: host, title: 'Non-PGI Data not import', menuTitle: 'Temp Data', data: rows }
      res.render('temp_zavgr043.ejs', rendeData)
    })

    db.close
  }
  if (req.query.function == 'not_import_Data') {
    var query = ''
    if (req.query.plant == '54') {

      query = `select Shpt
    ,DP
    ,Country
    ,Count(Delivery) as TotalDN
    ,Sum("#Items") as TotalItem
    ,sum("#Pieces") as TotalPieces
    ,Orde
    ,StorageLocation
    ,"Ship-To"
    ,Consignee
    ,ShipmentNo
    ,datetime(datetime(date(replace( ZAVGR043_Temp.ShipmentCreateDate, '/','-')) || ' '|| time( ZAVGR043_Temp.ShipmentCreateTime) ), '+15 Hour') as ShipmentCreateDateTime
    ,OverallPickingStatus
    ,OverallWMStatus
    ,OverallGMStatus
    ,CASE when "WaveGrpNo." like '5%' or "WaveGrpNo." = '' then NULL else "WaveGrpNo." end as "WaveGrpNo."
    ,CN_Ctrl_Parts 
    ,HAZ_Control 
    ,W_Parts_Control 
    ,UNR_Control 
    ,OrderNotFinish_Control 
    ,Piece_Control
    from ZAVGR043_Temp 
    where (CN_Ctrl_Parts = 1 or HAZ_Control = 1 or W_Parts_Control = 1 or UNR_Control = 1 or  OrderNotFinish_Control = 1 or Piece_Control = 1  )  
    AND Shpt LIKE '5%'
    --and OverallPickingStatus = 'C'
    and OverallGMStatus = 'A'
    AND ShipmentNo <> ''
    group by
    Shpt
    ,DP
    ,Country
    ,Orde
    ,StorageLocation
    ,"Ship-To"
    ,Consignee
    ,ShipmentNo
    ,datetime(datetime(date(replace( ZAVGR043_Temp.ShipmentCreateDate, '/','-')) || ' '|| time( ZAVGR043_Temp.ShipmentCreateTime) ), '+15 Hour')
    ,OverallPickingStatus
    ,OverallWMStatus
    ,OverallGMStatus
    ,CASE when "WaveGrpNo." like '5%' or "WaveGrpNo." = '' then NULL else "WaveGrpNo." end 
    ,CN_Ctrl_Parts 
    ,HAZ_Control 
    ,W_Parts_Control 
    ,UNR_Control 
    ,OrderNotFinish_Control 
    ,Piece_Control
    order by DP, ShipmentNo, datetime(datetime(date(replace( ZAVGR043_Temp.ShipmentCreateDate, '/','-')) || ' '|| time( ZAVGR043_Temp.ShipmentCreateTime) ), '+15 Hour');`
    }

    if (req.query.plant == '89') {

      query = `select Shpt
      ,DP
      ,Country
      ,Count(Delivery) as TotalDN
      ,Sum("#Items") as TotalItem
      ,sum("#Pieces") as TotalPieces
      ,Orde
      ,StorageLocation
      ,"Ship-To"
      ,Consignee
      ,ShipmentNo
      ,datetime(datetime(date(replace( ZAVGR043_Temp.ShipmentCreateDate, '/','-')) || ' '|| time( ZAVGR043_Temp.ShipmentCreateTime) ), '+15 Hour') as ShipmentCreateDateTime
      ,OverallPickingStatus
      ,OverallWMStatus
      ,OverallGMStatus
      ,CASE when "WaveGrpNo." like '5%' or "WaveGrpNo." = '' then NULL else "WaveGrpNo." end as "WaveGrpNo."
      ,CN_Ctrl_Parts 
      ,HAZ_Control 
      ,W_Parts_Control 
      ,UNR_Control 
      ,OrderNotFinish_Control 
      ,Piece_Control
      from ZAVGR043_Temp 
      where (CN_Ctrl_Parts = 1 or HAZ_Control = 1 or W_Parts_Control = 1 or UNR_Control = 1 or  OrderNotFinish_Control = 1 or Piece_Control = 1 )  
      AND Shpt LIKE '8%'
      --and OverallPickingStatus = 'C'
      and OverallGMStatus = 'A'
      AND ShipmentNo <> ''
      group by
      Shpt
      ,DP
      ,Country
      ,Orde
      ,StorageLocation
      ,"Ship-To"
      ,Consignee
      ,ShipmentNo
      ,datetime(datetime(date(replace( ZAVGR043_Temp.ShipmentCreateDate, '/','-')) || ' '|| time( ZAVGR043_Temp.ShipmentCreateTime) ), '+15 Hour')
      ,OverallPickingStatus
      ,OverallWMStatus
      ,OverallGMStatus
      ,CASE when "WaveGrpNo." like '5%' or "WaveGrpNo." = '' then NULL else "WaveGrpNo." end 
      ,CN_Ctrl_Parts 
      ,HAZ_Control 
      ,W_Parts_Control 
      ,UNR_Control 
      ,OrderNotFinish_Control 
      ,Piece_Control
      order by DP, ShipmentNo, datetime(datetime(date(replace( ZAVGR043_Temp.ShipmentCreateDate, '/','-')) || ' '|| time( ZAVGR043_Temp.ShipmentCreateTime) ), '+15 Hour');`
    }

    var db = new sqlite3.Database(path.join(__dirname, '../db/main.db'), sqlite3.OPEN_READWRITE)
    db.all(query, [], function (err, rows) {
      if (err) {

        return console.log(`find ${req.params.inputvalues} error: `, err.message)
      }
      const rendeData = { hostname: host, title: 'Wait Approced', menuTitle: 'Check Shipment to Approved', data: rows }
      res.render('wait_Approved.ejs', rendeData)
    })

    db.close
  }
  if (req.query.function == 'control_log_downs') {

    var rawdata = [];
    var db = new sqlite3.Database(path.join(__dirname, '../db/main.db'), sqlite3.OPEN_READWRITE)

    if (req.query.queryFunc == 'search') {

      //deliveryquery = `select * from query_order_downs_54 where Delivery = '${req.query.serachQuery}' order by logNum desc`

      db.get(`select count(LogNum) as Total from query_order_downs_54 where ShipmentNo = '${req.query.serachQuery}'`, function (err, rows) {
        if (err) {
          const rendeData = { hostname: host, title: `Control Log(54 Downs) ${req.query.queryDate}`, menuTitle: `54 Downs ${req.query.queryDate}`, data: 'not find page' }
          res.render('errorPage.ejs', rendeData)
        }
        // search by Shipment
        if (rows.Total > 0) {
          let shipmentquery = `select * from query_order_downs_54 where ShipmentNo = '${req.query.serachQuery}' order by logNum desc`
          db.all(shipmentquery, [], function (err, rows) {
            if (err) {
              return console.log(`find ${req.params.inputvalues} error: `, err.message)
            }

            console.log(rows.length)
            reArray = []

            const paggingData = { pageType: req.query.function, pageQurty: req.query.queryDate, pageSize: req.query.pagesize, currentPage: req.query.currentPage, pagePadding: 1 }

            const rendeData = { hostname: host, title: `Control Log(54 Downs)`, menuTitle: `54 Downs`, data: rows, paggingData: paggingData, ImportDate: '', checkListFunction: req.query.function }
            res.render('control_log.ejs', rendeData)
          })
        } else {
          const rendeData = { hostname: host, title: `Control Log(54 Downs) ${req.query.queryDate}`, menuTitle: `54 Downs ${req.query.queryDate}`, data: 'not find page' }
          res.render('errorPage.ejs', rendeData)
        }
      })



    } else {





      db.get(`select count(LogNum) as Total from query_order_downs_54 where importDate = '${req.query.queryDate}'`, function (err, rows) {
        if (err) {
          console.log(err.message)
        }
        if (rows.Total > 0) {
          query = `select * from query_order_downs_54 where importDate = '${req.query.queryDate}' order by logNum desc`
          console.log(query)
          db.all(query, [], function (err, rows) {
            if (err) {

              return console.log(`find ${req.params.inputvalues} error: `, err.message)
            }
            console.log(rows.length)
            reArray = []

            if (rows.length > req.query.pagesize) {
              if (req.query.currentPage > 1) {
                var starNum = Number(((req.query.currentPage - 1) * req.query.pagesize))
                var endNum = Number(((req.query.currentPage - 1) * req.query.pagesize) + Number(req.query.pagesize))
                console.log('strat:' + starNum)
                console.log('end:' + endNum)
                reArray = rows.slice(starNum, endNum)

              } else {
                reArray = rows.slice(0, req.query.pagesize)
              }


            } else {
              reArray = rows.slice(0, rows.length)
            }

            //console.log(reArray)


            let pagePadding = Math.ceil(Number(rows.length) / Number(req.query.pagesize))
            if (req.query.currentPage > pagePadding) {
              currentPage = 1
            } else {
              currentPage = req.query.currentPage
            }
            const paggingData = { pageType: req.query.function, pageQurty: req.query.queryDate, pageSize: req.query.pagesize, currentPage: currentPage, pagePadding: pagePadding }

            const rendeData = { hostname: host, title: `Control Log(54 Downs) ${req.query.queryDate}`, menuTitle: `54 Downs ${req.query.queryDate}`, data: reArray, paggingData: paggingData, ImportDate: req.query.queryDate, checkListFunction: req.query.function }
            res.render('control_log.ejs', rendeData)
          })
        } else {
          const rendeData = { hostname: host, title: `Control Log(54 Downs) ${req.query.queryDate}`, menuTitle: `54 Downs ${req.query.queryDate}`, data: 'not find page' }
          res.render('errorPage.ejs', rendeData)
        }



      })



    }


    //console.log('page size status:' + checkCount)




    //db.close
  }
  if (req.query.function == 'control_log_regular') {



    var rawdata = [];
    var db = new sqlite3.Database(path.join(__dirname, '../db/main.db'), sqlite3.OPEN_READWRITE)
    if (req.query.queryFunc == 'search') {

      //deliveryquery = `select * from query_order_downs_54 where Delivery = '${req.query.serachQuery}' order by logNum desc`

      db.get(`select count(LogNum) as Total from query_order_regular_54 where ShipmentNo = '${req.query.serachQuery}'`, function (err, rows) {
        if (err) {
          const rendeData = { hostname: host, title: `Control Log(54 Regular nTW) ${req.query.queryDate}`, menuTitle: `54 Regular nTW ${req.query.queryDate}`, data: 'not find page' }
          res.render('errorPage.ejs', rendeData)
        }
        // search by Shipment
        if (rows.Total > 0) {
          let shipmentquery = `select * from query_order_regular_54 where ShipmentNo = '${req.query.serachQuery}' order by logNum desc`
          db.all(shipmentquery, [], function (err, rows) {
            if (err) {
              return console.log(`find ${req.params.inputvalues} error: `, err.message)
            }

            console.log(rows.length)
            reArray = []

            const paggingData = { pageType: req.query.function, pageQurty: req.query.queryDate, pageSize: req.query.pagesize, currentPage: req.query.currentPage, pagePadding: 1 }

            const rendeData = { hostname: host, title: `Control Log(54 Regular nTW)`, menuTitle: `54 Regular nTW`, data: rows, paggingData: paggingData, ImportDate: '', checkListFunction: req.query.function }
            res.render('control_log.ejs', rendeData)
          })
        } else {
          const rendeData = { hostname: host, title: `Control Log(54 Regular nTW) ${req.query.queryDate}`, menuTitle: `54 Regular nTW ${req.query.queryDate}`, data: 'not find page' }
          res.render('errorPage.ejs', rendeData)
        }

      })


    } else {

      db.get(`select count(LogNum) as Total from query_order_regular_54 where importDate = '${req.query.queryDate}'`, function (err, rows) {
        if (err) {
          console.log(err.message)
        }
        if (rows.Total > 0) {
          query = `select * from query_order_regular_54 where importDate = '${req.query.queryDate}' order by logNum desc`
          console.log(query)

          db.all(query, [], function (err, rows) {
            if (err) {

              return console.log(`find ${req.params.inputvalues} error: `, err.message)
            }


            console.log(rows.length)
            reArray = []

            if (rows.length > req.query.pagesize) {
              if (req.query.currentPage > 1) {
                var starNum = Number(((req.query.currentPage - 1) * req.query.pagesize))
                var endNum = Number(((req.query.currentPage - 1) * req.query.pagesize) + Number(req.query.pagesize))
                console.log('strat:' + starNum)
                console.log('end:' + endNum)
                reArray = rows.slice(starNum, endNum)

              } else {
                reArray = rows.slice(0, req.query.pagesize)
              }


            } else {
              reArray = rows.slice(0, rows.length)
            }

            let pagePadding = Math.ceil(Number(rows.length) / Number(req.query.pagesize))
            if (req.query.currentPage > pagePadding) {
              currentPage = 1
            } else {
              currentPage = req.query.currentPage
            }
            const paggingData = { pageType: req.query.function, pageQurty: req.query.queryDate, pageSize: req.query.pagesize, currentPage: currentPage, pagePadding: pagePadding }
            const rendeData = { hostname: host, title: `Control Log(54 Regular nTW) ${req.query.queryDate}`, menuTitle: `54 Regular nTW ${req.query.queryDate}`, data: reArray, paggingData: paggingData, ImportDate: req.query.queryDate, checkListFunction: req.query.function }
            res.render('control_log.ejs', rendeData)
          })

        } else {
          const rendeData = { hostname: host, title: `Control Log(54 Downs) ${req.query.queryDate}`, menuTitle: `54 Downs ${req.query.queryDate}`, data: 'not find page' }
          res.render('errorPage.ejs', rendeData)
        }


      })

    }
    //db.close
  }
  if (req.query.function == 'control_log_regulartw') {




    var rawdata = [];
    var db = new sqlite3.Database(path.join(__dirname, '../db/main.db'), sqlite3.OPEN_READWRITE)
    if (req.query.queryFunc == 'search') {

      //deliveryquery = `select * from query_order_downs_54 where Delivery = '${req.query.serachQuery}' order by logNum desc`

      db.get(`select count(LogNum) as Total from query_order_regular_54 where ShipmentNo = '${req.query.serachQuery}'`, function (err, rows) {
        if (err) {
          const rendeData = { hostname: host, title: `Control Log(54 Regular TW) ${req.query.queryDate}`, menuTitle: `54 Regular TW ${req.query.queryDate}`, data: 'not find page' }
          res.render('errorPage.ejs', rendeData)
        }
        // search by Shipment
        if (rows.Total > 0) {
          let shipmentquery = `select * from query_order_regular_54 where ShipmentNo = '${req.query.serachQuery}' order by logNum desc`
          db.all(shipmentquery, [], function (err, rows) {
            if (err) {
              return console.log(`find ${req.params.inputvalues} error: `, err.message)
            }

            console.log(rows.length)
            reArray = []

            const paggingData = { pageType: req.query.function, pageQurty: req.query.queryDate, pageSize: req.query.pagesize, currentPage: req.query.currentPage, pagePadding: 1 }

            const rendeData = { hostname: host, title: `Control Log(54 Regular TW)`, menuTitle: `54 Regular TW`, data: rows, paggingData: paggingData, ImportDate: '', checkListFunction: req.query.function }
            res.render('control_log.ejs', rendeData)
          })
        } else {
          const rendeData = { hostname: host, title: `Control Log(54 Regular TW) ${req.query.queryDate}`, menuTitle: `54 Regular TW ${req.query.queryDate}`, data: 'not find page' }
          res.render('errorPage.ejs', rendeData)
        }
      })


    } else {
      db.get(`select count(LogNum) as Total from query_order_regular_54 where importDate = '${req.query.queryDate}'`, function (err, rows) {
        if (err) {
          console.log(err.message)
        }
        if (rows.Total > 0) {
          query = `select * from query_order_regulartw_54 where importDate = '${req.query.queryDate}' order by logNum desc`
          console.log(query)
          db.all(query, [], function (err, rows) {
            if (err) {

              return console.log(`find ${req.params.inputvalues} error: `, err.message)
            }

            console.log(rows.length)
            reArray = []

            if (rows.length > req.query.pagesize) {
              if (req.query.currentPage > 1) {
                var starNum = Number(((req.query.currentPage - 1) * req.query.pagesize))
                var endNum = Number(((req.query.currentPage - 1) * req.query.pagesize) + Number(req.query.pagesize))
                console.log('strat:' + starNum)
                console.log('end:' + endNum)
                reArray = rows.slice(starNum, endNum)

              } else {
                reArray = rows.slice(0, req.query.pagesize)
              }


            } else {
              reArray = rows.slice(0, rows.length)
            }

            let pagePadding = Math.ceil(Number(rows.length) / Number(req.query.pagesize))
            if (req.query.currentPage > pagePadding) {
              currentPage = 1
            } else {
              currentPage = req.query.currentPage
            }
            const paggingData = { pageType: req.query.function, pageQurty: req.query.queryDate, pageSize: req.query.pagesize, currentPage: currentPage, pagePadding: pagePadding }
            const rendeData = { hostname: host, title: `Control Log(54 Regular TW) ${req.query.queryDate}`, menuTitle: `54 Regular TW ${req.query.queryDate}`, data: reArray, paggingData: paggingData, ImportDate: req.query.queryDate, checkListFunction: req.query.function }
            res.render('control_log.ejs', rendeData)
          })
        } else {
          const rendeData = { hostname: host, title: `Control Log(54 Regular TW) ${req.query.queryDate}`, menuTitle: `54 Regular TW ${req.query.queryDate}`, data: 'not find page' }
          res.render('errorPage.ejs', rendeData)
        }


      })
    }
    //db.close
  }
  if (req.query.function == 'control_log_amt') {



    var rawdata = [];
    var db = new sqlite3.Database(path.join(__dirname, '../db/main.db'), sqlite3.OPEN_READWRITE)
    if (req.query.queryFunc == 'search') {

      //deliveryquery = `select * from query_order_downs_54 where Delivery = '${req.query.serachQuery}' order by logNum desc`

      db.get(`select count(LogNum) as Total from query_order_AMT_89 where ShipmentNo = '${req.query.serachQuery}'`, function (err, rows) {
        if (err) {
          const rendeData = { hostname: host, title: `Control Log(AMT Regular) ${req.query.queryDate}`, menuTitle: `AMT Regular ${req.query.queryDate}`, data: 'not find page' }
          res.render('errorPage.ejs', rendeData)
        }
        // search by Shipment
        if (rows.Total > 0) {
          let shipmentquery = `select * from query_order_AMT_89 where ShipmentNo = '${req.query.serachQuery}' order by logNum desc`
          db.all(shipmentquery, [], function (err, rows) {
            if (err) {
              return console.log(`find ${req.params.inputvalues} error: `, err.message)
            }

            console.log(rows.length)
            reArray = []

            const paggingData = { pageType: req.query.function, pageQurty: req.query.queryDate, pageSize: req.query.pagesize, currentPage: req.query.currentPage, pagePadding: 1 }

            const rendeData = { hostname: host, title: `Control Log(AMT Regular)`, menuTitle: `AMT Regular`, data: rows, paggingData: paggingData, ImportDate: '', checkListFunction: req.query.function }
            res.render('control_log.ejs', rendeData)
          })
        } else {
          const rendeData = { hostname: host, title: `Control Log(AMT Regular) ${req.query.queryDate}`, menuTitle: `AMT Regular ${req.query.queryDate}`, data: 'not find page' }
          res.render('errorPage.ejs', rendeData)
        }
      })


    } else {
      db.get(`select count(LogNum) as Total from query_order_AMT_89 where importDate = '${req.query.queryDate}'`, function (err, rows) {
        if (err) {
          console.log(err.message)
        }
        if (rows.Total > 0) {
          query = `select * from query_order_AMT_89 where importDate = '${req.query.queryDate}' order by logNum desc`
          console.log(query)

          db.all(query, [], function (err, rows) {
            if (err) {

              return console.log(`find ${req.params.inputvalues} error: `, err.message)
            }

            console.log(rows.length)
            reArray = []

            if (rows.length > req.query.pagesize) {
              if (req.query.currentPage > 1) {
                var starNum = Number(((req.query.currentPage - 1) * req.query.pagesize))
                var endNum = Number(((req.query.currentPage - 1) * req.query.pagesize) + Number(req.query.pagesize))
                console.log('strat:' + starNum)
                console.log('end:' + endNum)
                reArray = rows.slice(starNum, endNum)

              } else {
                reArray = rows.slice(0, req.query.pagesize)
              }


            } else {
              reArray = rows.slice(0, rows.length)
            }

            let pagePadding = Math.ceil(Number(rows.length) / Number(req.query.pagesize))
            if (req.query.currentPage > pagePadding) {
              currentPage = 1
            } else {
              currentPage = req.query.currentPage
            }
            const paggingData = { pageType: req.query.function, pageQurty: req.query.queryDate, pageSize: req.query.pagesize, currentPage: currentPage, pagePadding: pagePadding }
            const rendeData = { hostname: host, title: `Control Log(AMT Regular) ${req.query.queryDate}`, menuTitle: `AMT Regular ${req.query.queryDate}`, data: reArray, paggingData: paggingData, ImportDate: req.query.queryDate, checkListFunction: req.query.function }
            res.render('control_log.ejs', rendeData)
          })
        } else {
          const rendeData = { hostname: host, title: `Control Log(AMT Regular) ${req.query.queryDate}`, menuTitle: `AMT Regular ${req.query.queryDate}`, data: 'not find page' }
          res.render('errorPage.ejs', rendeData)
        }


      })
    }
    //db.close
  }
  if (req.query.function == 'control_log_amt_downs') {



    var rawdata = [];
    var db = new sqlite3.Database(path.join(__dirname, '../db/main.db'), sqlite3.OPEN_READWRITE)
    if (req.query.queryFunc == 'search') {

      //deliveryquery = `select * from query_order_downs_54 where Delivery = '${req.query.serachQuery}' order by logNum desc`

      db.get(`select count(LogNum) as Total from query_order_AMT_downs_89 where ShipmentNo = '${req.query.serachQuery}'`, function (err, rows) {
        if (err) {
          const rendeData = { hostname: host, title: `Control Log(54 Downs) ${req.query.queryDate}`, menuTitle: `54 Downs ${req.query.queryDate}`, data: 'not find page' }
          res.render('errorPage.ejs', rendeData)
        }
        // search by Shipment
        if (rows.Total > 0) {
          let shipmentquery = `select * from query_order_AMT_downs_89 where ShipmentNo = '${req.query.serachQuery}' order by logNum desc`
          db.all(shipmentquery, [], function (err, rows) {
            if (err) {
              return console.log(`find ${req.params.inputvalues} error: `, err.message)
            }

            console.log(rows.length)
            reArray = []

            const paggingData = { pageType: req.query.function, pageQurty: req.query.queryDate, pageSize: req.query.pagesize, currentPage: req.query.currentPage, pagePadding: 1 }

            const rendeData = { hostname: host, title: `Control Log(54 Downs)`, menuTitle: `54 Downs`, data: rows, paggingData: paggingData, ImportDate: '', checkListFunction: req.query.function }
            res.render('control_log.ejs', rendeData)
          })
        } else {
          const rendeData = { hostname: host, title: `Control Log(54 Downs) ${req.query.queryDate}`, menuTitle: `54 Downs ${req.query.queryDate}`, data: 'not find page' }
          res.render('errorPage.ejs', rendeData)
        }
      })


    } else {
      db.get(`select count(LogNum) as Total from query_order_AMT_downs_89 where importDate = '${req.query.queryDate}'`, function (err, rows) {
        if (err) {
          console.log(err.message)
        }
        if (rows.Total > 0) {

          query = `select * from query_order_AMT_downs_89 where importDate = '${req.query.queryDate}' order by logNum desc`
          console.log(query)

          db.all(query, [], function (err, rows) {
            if (err) {

              return console.log(`find ${req.params.inputvalues} error: `, err.message)
            }

            console.log(rows.length)
            reArray = []

            if (rows.length > req.query.pagesize) {
              if (req.query.currentPage > 1) {
                var starNum = Number(((req.query.currentPage - 1) * req.query.pagesize))
                var endNum = Number(((req.query.currentPage - 1) * req.query.pagesize) + Number(req.query.pagesize))
                console.log('strat:' + starNum)
                console.log('end:' + endNum)
                reArray = rows.slice(starNum, endNum)

              } else {
                reArray = rows.slice(0, req.query.pagesize)
              }


            } else {
              reArray = rows.slice(0, rows.length)
            }



            let pagePadding = Math.ceil(Number(rows.length) / Number(req.query.pagesize))
            if (req.query.currentPage > pagePadding) {
              currentPage = 1
            } else {
              currentPage = req.query.currentPage
            }
            const paggingData = { pageType: req.query.function, pageQurty: req.query.queryDate, pageSize: req.query.pagesize, currentPage: currentPage, pagePadding: pagePadding }
            const rendeData = { hostname: host, title: `Control Log(AMT Downs) ${req.query.queryDate}`, menuTitle: `AMT Downs ${req.query.queryDate}`, data: reArray, paggingData: paggingData, ImportDate: req.query.queryDate, checkListFunction: req.query.function }
            res.render('control_log.ejs', rendeData)
          })

        } else {
          const rendeData = { hostname: host, title: `Control Log(AMT Downs) ${req.query.queryDate}`, menuTitle: `54 Downs ${req.query.queryDate}`, data: 'not find page' }
          res.render('errorPage.ejs', rendeData)
        }


      })
    }
    //db.close
  }


  if (req.query.function == 'getShipmentChild') {
    countQuery = `select count(TBL_LT22_Prod.TONumber||'_'||TBL_LT22_Prod.Item) as Total from tbl_zavgr043_prod left join TBL_LT22_Prod 
    on tbl_zavgr043_prod.Delivery = TBL_LT22_Prod.Dest_Bin
    where ShipmentNo = '${req.query.shipmentNo}' and TBL_LT22_Prod.Source_Typ not in ('922');`
    wavequery = `select 
    t.Shpt
    ,t.DP
    ,t.Country
    ,t.Shipto
    ,t.ShipmentNo
    ,t.WaveGrpNo
    ,TBL_LT22_Prod.TONumber
    ,TBL_LT22_Prod.Item
    ,TBL_LT22_Prod.Material
    ,TBL_LT22_Prod.Source_Typ
    ,TBL_LT22_Prod.Source_Bin
    ,TBL_LT22_Prod.Sourcetargetqty
    ,TBL_LT22_Prod.Dest_Bin
    ,TBL_LT22_Prod.CS
    ,TBL_LT22_Prod.Batch
    ,TBL_LT22_Prod.CN_Ctrl_Parts
	,TBL_LT22_Prod.W_Parts_Control
	,TBL_LT22_Prod.UNR_Control
	,TBL_LT22_Prod.HAZ_Control
    from TBL_LT22_Prod inner join (
    select TBL_ZAVGR043_Prod.Shpt
        ,TBL_ZAVGR043_Prod.DP
        ,TBL_ZAVGR043_Prod.Country
        ,TBL_ZAVGR043_Prod.Shipto
        ,TBL_ZAVGR043_Prod.ShipmentNo
        ,TBL_ZAVGR043_Prod.WaveGrpNo
         from tbl_zavgr043_prod 
       where TBL_ZAVGR043_Prod.WaveGrpNo like '200%'
       group by TBL_ZAVGR043_Prod.Shpt
        ,TBL_ZAVGR043_Prod.DP
        ,TBL_ZAVGR043_Prod.Country
        ,TBL_ZAVGR043_Prod.Shipto
        ,TBL_ZAVGR043_Prod.ShipmentNo
        ,TBL_ZAVGR043_Prod.WaveGrpNo) as t
      on TBL_LT22_Prod.Dest_Bin = t.WaveGrpNo
      where t.ShipmentNo = '${req.query.shipmentNo}' and TBL_LT22_Prod.Source_Typ not in ('922')`

    query = `select TBL_ZAVGR043_Prod.Shpt
    ,TBL_ZAVGR043_Prod.DP
    ,TBL_ZAVGR043_Prod.Delivery
    ,TBL_ZAVGR043_Prod.Country
    ,TBL_ZAVGR043_Prod.Items
    ,TBL_ZAVGR043_Prod.Ordes
    ,TBL_ZAVGR043_Prod.StorageLocation
    ,TBL_ZAVGR043_Prod.Shipto
    ,TBL_ZAVGR043_Prod.ShipmentNo
    ,TBL_ZAVGR043_Prod.WaveGrpNo
    ,TBL_LT22_Prod.TONumber
    ,TBL_LT22_Prod.Item
    ,TBL_LT22_Prod.Material
    ,TBL_LT22_Prod.Source_Typ
    ,TBL_LT22_Prod.Source_Bin
    ,TBL_LT22_Prod.Sourcetargetqty
    ,TBL_LT22_Prod.CS
    ,TBL_LT22_Prod.Batch
    ,TBL_LT22_Prod.CN_Ctrl_Parts
    ,TBL_LT22_Prod.W_Parts_Control
    ,TBL_LT22_Prod.UNR_Control
    ,TBL_LT22_Prod.HAZ_Control
     from tbl_zavgr043_prod left join TBL_LT22_Prod 
    on tbl_zavgr043_prod.Delivery = TBL_LT22_Prod.Dest_Bin
    where ShipmentNo = '${req.query.shipmentNo}' and TBL_LT22_Prod.Source_Typ not in ('922');`
    var db = new sqlite3.Database(path.join(__dirname, '../db/main.db'), sqlite3.OPEN_READWRITE)

    db.get(`select count(WaveGrpNo) as [Total] from tbl_zavgr043_prod where shipmentNo = ${req.query.shipmentNo} and WaveGrpNo like '200%';`, [], function (err, rows) {
      if (err) {
        return console.log(`find ${req.params.inputvalues} error: `, err.message)
      }

      if (rows['Total'] > 0) {
        db.all(wavequery, [], function (err, row) {
          if (err) {


            //const rendeData = { hostname: host, title: `Shipment detail`, menuTitle: `Shipment ${req.query.shipmentNo}`, data: 'Data Could not be found' }
            //res.render('errorPage.ejs', rendeData)

            return console.log(`find ${req.params.inputvalues} error: `, err.message)
          }

          const rendeData = { hostname: host, title: `Shipment detail`, menuTitle: `Shipment ${req.query.shipmentNo}`, data: row }
          res.render('shipmentChild.ejs', rendeData)
          //db.get();
        })

      } else {
        db.get(countQuery, [], function (err, rows) {
          if (err) {

            return console.log(`find ${req.params.inputvalues} error: `, err.message)
          } else {
            console.log(rows)
            if (rows.Total == 0) {
              const rendeData = { hostname: host, title: `Shipment detail`, menuTitle: `Shipment ${req.query.shipmentNo}`, data: 'Data Could not be found' }
              res.render('errorPage.ejs', rendeData)
            } else {
              db.all(query, [], function (err, rows) {
                if (err) {

                  return console.log(`find ${req.params.inputvalues} error: `, err.message)
                }
                const rendeData = { hostname: host, title: `Shipment detail`, menuTitle: `Shipment ${req.query.shipmentNo}`, data: rows }
                res.render('shipmentChild.ejs', rendeData)
                //res.send(html);
              })
            }
          }
        })
      }
    })



    //res.send(html);
    //})



    //db.close
  }

  if (req.query.function == 'getShipmentChild_WaitApprove') {
    countQuery = `select count(TBL_LT22_Prod.TONumber||'_'||TBL_LT22_Prod.Item) as Total from ZAVGR043_Temp left join TBL_LT22_Prod 
    on ZAVGR043_Temp.Delivery = TBL_LT22_Prod.Dest_Bin
    where ShipmentNo = '${req.query.shipmentNo}' and TBL_LT22_Prod.Source_Typ not in ('922');`
    wavequery = `select 
    t.Shpt
    ,t.DP
    ,t.Country
    ,t."Ship-To"
    ,t.ShipmentNo
    ,t."WaveGrpNo."
    ,t.TOCreateItem
    ,TBL_LT22_Prod.TONumber
    ,TBL_LT22_Prod.Item
    ,TBL_LT22_Prod.Material
    ,TBL_LT22_Prod.Source_Typ
    ,TBL_LT22_Prod.Source_Bin
    ,TBL_LT22_Prod.Sourcetargetqty
    ,TBL_LT22_Prod.Dest_Bin
    ,TBL_LT22_Prod.CS
    ,TBL_LT22_Prod.Batch
    ,TBL_LT22_Prod.CN_Ctrl_Parts
	,TBL_LT22_Prod.W_Parts_Control
	,TBL_LT22_Prod.UNR_Control
	,TBL_LT22_Prod.HAZ_Control
    from TBL_LT22_Prod inner join (
    select ZAVGR043_Temp.Shpt
        ,ZAVGR043_Temp.DP
        ,ZAVGR043_Temp.Country
        ,ZAVGR043_Temp."Ship-To"
        ,ZAVGR043_Temp.ShipmentNo
        ,ZAVGR043_Temp."WaveGrpNo."
        ,ZAVGR043_Temp.TOCreateItem
         from ZAVGR043_Temp 
       where ZAVGR043_Temp."WaveGrpNo." like '200%'
       group by ZAVGR043_Temp.Shpt
        ,ZAVGR043_Temp.DP
        ,ZAVGR043_Temp.Country
        ,ZAVGR043_Temp."Ship-To"
        ,ZAVGR043_Temp.ShipmentNo
        ,ZAVGR043_Temp."WaveGrpNo."
        ,ZAVGR043_Temp.TOCreateItem) as t
      on TBL_LT22_Prod.Dest_Bin = t."WaveGrpNo."
      where t.ShipmentNo = '${req.query.shipmentNo}' and TBL_LT22_Prod.Source_Typ not in ('922')`

    query = `select ZAVGR043_Temp.Shpt
    ,ZAVGR043_Temp.DP
    ,ZAVGR043_Temp.Delivery
    ,ZAVGR043_Temp.Country
    ,ZAVGR043_Temp."#Items"
    ,ZAVGR043_Temp.Orde
    ,ZAVGR043_Temp.StorageLocation
    ,ZAVGR043_Temp."Ship-To"
    ,ZAVGR043_Temp.ShipmentNo
    ,ZAVGR043_Temp."WaveGrpNo."
    ,ZAVGR043_Temp.TOCreateItem
    ,TBL_LT22_Prod.TONumber
    ,TBL_LT22_Prod.Item
    ,TBL_LT22_Prod.Material
    ,TBL_LT22_Prod.Source_Typ
    ,TBL_LT22_Prod.Source_Bin
    ,TBL_LT22_Prod.Sourcetargetqty
    ,TBL_LT22_Prod.CS
    ,TBL_LT22_Prod.Batch
    ,TBL_LT22_Prod.CN_Ctrl_Parts
    ,TBL_LT22_Prod.W_Parts_Control
    ,TBL_LT22_Prod.UNR_Control
    ,TBL_LT22_Prod.HAZ_Control
     from ZAVGR043_Temp left join TBL_LT22_Prod 
    on ZAVGR043_Temp.Delivery = TBL_LT22_Prod.Dest_Bin
    where ShipmentNo = '${req.query.shipmentNo}' and TBL_LT22_Prod.Source_Typ not in ('922');`
    var db = new sqlite3.Database(path.join(__dirname, '../db/main.db'), sqlite3.OPEN_READWRITE)

    db.get(`select count("WaveGrpNo.") as [Total] from ZAVGR043_Temp where shipmentNo = ${req.query.shipmentNo} and "WaveGrpNo." like '200%';`, [], function (err, rows) {
      if (err) {
        return console.log(`find ${req.params.inputvalues} error: `, err.message)
      }

      if (rows['Total'] > 0) {
        db.all(wavequery, [], function (err, row) {
          if (err) {


            //const rendeData = { hostname: host, title: `Shipment detail`, menuTitle: `Shipment ${req.query.shipmentNo}`, data: 'Data Could not be found' }
            //res.render('errorPage.ejs', rendeData)

            return console.log(`find ${req.params.inputvalues} error: `, err.message)
          }

          const rendeData = { hostname: host, title: `Shipment detail`, menuTitle: `Shipment ${req.query.shipmentNo}`, data: row }
          res.render('shipmentChild_WaitApprove.ejs', rendeData)
          //db.get();
        })

      } else {
        db.get(countQuery, [], function (err, rows) {
          if (err) {

            return console.log(`find ${req.params.inputvalues} error: `, err.message)
          } else {
            console.log(rows)
            if (rows.Total == 0) {
              const rendeData = { hostname: host, title: `Shipment detail`, menuTitle: `Shipment ${req.query.shipmentNo}`, data: 'Data Could not be found' }
              res.render('errorPage.ejs', rendeData)
            } else {
              db.all(query, [], function (err, rows) {
                if (err) {

                  return console.log(`find ${req.params.inputvalues} error: `, err.message)
                }
                const rendeData = { hostname: host, title: `Shipment detail`, menuTitle: `Shipment ${req.query.shipmentNo}`, data: rows }
                res.render('shipmentChild_WaitApprove.ejs', rendeData)
                //res.send(html);
              })
            }
          }
        })
      }
    })



    //res.send(html);
    //})



    //db.close
  }
  if (req.query.function == 'Labeling_check') {

  }
  if (req.query.function == 'Delivery_check') {

  }


  if (req.query.function == 'dashboard') {
    let query = `SELECT  Team_Name
          ,Shpt
          ,Dp
          ,SHPCondition
          ,Country
          ,Ordes
          ,StorageLocation
          ,ShipTo
          ,ShipmentNo
          ,OvrPickingStus
          ,OvrWMStus
          ,OvrGMStus
          ,CN_Ctrl_Parts
          , case when TO_ConfirmDate is null then 0 else 1 end as TO_Stus
          , case when Handling_Unit is  null then 0 else 1 end as HU_Stus
          , case when ProformaD = '' and Shpt like '5%' then 0 else 1  end as Inv_Stus
          ,KPI_Hour
          ,Service_Start
          ,Service_End
          ,pkg_description
          , round( ((    julianday(datetime( Service_End))   -  julianday(datetime('now','localtime'))  )  *24 *60) , 2) as RemainTime
        FROM TBL_ZAVGR043_Prod
        where OvrGMStus not in ('C')
        group by Team_Name
        ,Shpt
        ,Dp
        ,SHPCondition
        ,Country
        ,Ordes
        ,StorageLocation
        ,ShipTo
        ,ShipmentNo
        ,OvrPickingStus
        ,OvrWMStus
        ,OvrGMStus
        ,CN_Ctrl_Parts
        ,KPI_Hour
        ,Service_Start
        ,Service_End
        ,pkg_description
        order by  round( ((    julianday(datetime( Service_End))   -  julianday(datetime('now','localtime'))  )  *24 *60) , 2) asc
        --limit 1`

    var db = new sqlite3.Database(path.join(__dirname, '../db/main.db'), sqlite3.OPEN_READWRITE)

    db.all(query, [], function (err, rows) {
      if (err) {
        console.log(err.message)
      }

      const rendeData = { hostname: host, title: `Dashboard`, data: rows }
      res.render('Master_Dashboard.ejs', rendeData)
      //res.send(rows)
    })
  }

  //const getData = getQuery('select * from ZAVGR043_Temp')




  //res.status(204).send();

  //res.end()





})

apps.get('/checkEjs', (req, res) => {

  let rendeData = { title: '什麼都略懂一點，生活更多彩一些' }

  res.render('index', rendeData)
})

apps.get('/test', (req, res) => {
  console.log('get /test')
  console.log(path.join(__dirname, '../node_modules/bootstrap/dist'))
  res.sendFile(path.join(__dirname, '../views/index.html'));
  //res.end();

})


apps.use('/', routes);


module.exports = apps;