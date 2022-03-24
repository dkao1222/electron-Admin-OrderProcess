const express = require('express')
const routes = require('./services');
const ejs = require("ejs");
//const cors = require('cors');

const apps = express();
var os = require('os');
const path = require('path')
const sqlite3 = require('sqlite3').verbose()

let posts = require('../db/dbConfig/dbMain');
const { app } = require('electron');

/*
const hostConfig = require('../db/dbConfig/hostConfig')

const host = hostConfig.hostGet().then(function (response) {
  console.log(response)

  if (response.Status = 1) {
    console.log('c')
    return os.hostname().toLowerCase();

    

  } else {
    console.log('d')
    return response.hostname
    
  }
})
*/

const host = os.hostname().toLowerCase();

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

apps.post('/post/InformationSet', (req, res) => {
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
  var query = ''
  var db = new sqlite3.Database(path.join(__dirname, '../db/main.db'), sqlite3.OPEN_READWRITE)

  if (req.query.function == 'zavgr043temp') {

    console.log(req.query.row)
  }

  if (req.query.function == 'vendorchange') {

    db.serialize(function () {
      query = `update HAWB_ShipmentData set Vendor = case when Vendor <> '${req.query.vendor}' then '${req.query.vendor}' else Vendor end
          ,M_HAWB = case when Vendor <> '${req.query.vendor}' then null else M_HAWB end
          ,D_HAWB = case when Vendor <> '${req.query.vendor}' then null else D_HAWB end
          where ShipmentNo = '${req.query.shipmentNo}'`

      db.run(query, [], function (err, rows) {
        if (err) {

          return console.log(`find ${req.params.inputvalues} error: `, err.message)
        }

      })

    })


    db.close


  }

  if (req.query.function == 'hawbChange') {
    if (req.query.vendor == 'CEVA') {
      let HAWBquery = `update HAWB_CEVA set "check" = 1 where HAWB = '${req.query.hawb}';`
      let shipmenDataQuery = `update HAWB_ShipmentData set M_HAWB = '${req.query.hawb}' where shipmentNo = ${req.query.shipmentNo};`


      db.serialize(function () {
        db.run(HAWBquery, [], function (err, rows) {
          if (err) {

            return console.log(`find ${req.params.inputvalues} error: `, err.message)
          }

        })
        db.run(shipmenDataQuery, [], function (err, rows) {
          if (err) {

            return console.log(`find ${req.params.inputvalues} error: `, err.message)
          }

        })
      })
      db.close
      
    }
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
    db.all('select * from HAWB_Vendor', [], function (err, rows) {
      if (err) {

        return console.log(`find ${req.params.inputvalues} error: `, err.message)
      }

      const rendeData = { hostname: host, title: 'Vendor Change', menuTitle: `${req.query.shipmentNo} Vendor Change`, vendor: rows, shipmentNo: req.query.shipmentNo, hostname: host }
      res.render('forwardChange.ejs', rendeData)


    })

    db.close
  }

  if (req.query.function == 'CEVA') {
    db.all('select * from HAWB_CEVA where "Check" = 0 order by HAWB asc limit 20', [], function (err, rows) {
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
    db.all('select * from HAWB_CEVA_K where "Check" = 0 order by HAWB asc limit 20', [], function (err, rows) {
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
  req.query.queryDate
  req.query.shipmentNo
  req.query.pagesize
  req.query.currentPage

  console.log(req.query.function)
  console.log(req.query.queryDate)
  var query = ""
  if (req.query.function == 'temp_history') {
    query = `select * from ZAVGR043_Temp where OverallGMStatus not in ('C') order by Delivery limit 5`

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
  if (req.query.function == 'control_log_downs') {
    
    query = `select * from query_order_downs_54 where importDate = '${req.query.queryDate}' order by logNum desc`
    console.log(query)


    var rawdata = [];
    var db = new sqlite3.Database(path.join(__dirname, '../db/main.db'), sqlite3.OPEN_READWRITE)
    db.all(query, [], function (err, rows) {
      if (err) {

        return console.log(`find ${req.params.inputvalues} error: `, err.message)
      }
      console.log(rows.length)
      reArray = []

      if (rows.length > req.query.pagesize ) {
        if (req.query.currentPage > 1 ) {
          var starNum = Number(((req.query.currentPage -1)  * req.query.pagesize))
          var endNum = Number(((req.query.currentPage-1) * req.query.pagesize) + Number(req.query.pagesize))
          console.log('strat:' + starNum)
          console.log('end:' + endNum)
          reArray = rows.slice(starNum, endNum)

        }else{
          reArray = rows.slice(0, req.query.pagesize)
        }
        
        
      }else{
        reArray = rows.slice(0, rows.length)
      }
      
      //console.log(reArray)

      
      let pagePadding = Math.ceil(Number(rows.length) / Number(req.query.pagesize))
      if (req.query.currentPage > pagePadding ) {
        currentPage = 1
      } else {
        currentPage = req.query.currentPage
      }
      const paggingData = {pageType:req.query.function, pageQurty:req.query.queryDate,  pageSize:req.query.pagesize , currentPage : currentPage,  pagePadding: pagePadding  }
      
      const rendeData = { hostname: host, title: `Control Log(54 Downs) ${req.query.queryDate}`, menuTitle: `54 Downs ${req.query.queryDate}`, data: reArray, paggingData : paggingData}
      res.render('control_log.ejs', rendeData)
    })

    db.close
  }
  if (req.query.function == 'control_log_regular') {

    query = `select * from query_order_regular_54 where importDate = '${req.query.queryDate}' order by logNum desc`
    console.log(query)


    var rawdata = [];
    var db = new sqlite3.Database(path.join(__dirname, '../db/main.db'), sqlite3.OPEN_READWRITE)
    db.all(query, [], function (err, rows) {
      if (err) {

        return console.log(`find ${req.params.inputvalues} error: `, err.message)
      }


      console.log(rows.length)
      reArray = []

      if (rows.length > req.query.pagesize ) {
        if (req.query.currentPage > 1 ) {
          var starNum = Number(((req.query.currentPage -1)  * req.query.pagesize))
          var endNum = Number(((req.query.currentPage-1) * req.query.pagesize) + Number(req.query.pagesize))
          console.log('strat:' + starNum)
          console.log('end:' + endNum)
          reArray = rows.slice(starNum, endNum)

        }else{
          reArray = rows.slice(0, req.query.pagesize)
        }
        
        
      }else{
        reArray = rows.slice(0, rows.length)
      }
      
      let pagePadding = Math.ceil(Number(rows.length) / Number(req.query.pagesize))
      if (req.query.currentPage > pagePadding ) {
        currentPage = 1
      } else {
        currentPage = req.query.currentPage
      }
      const paggingData = {pageType:req.query.function, pageQurty:req.query.queryDate,  pageSize:req.query.pagesize , currentPage : currentPage,  pagePadding: pagePadding  }
      const rendeData = { hostname: host, title: `Control Log(54 Regular nTW) ${req.query.queryDate}`, menuTitle: `54 Regular nTW ${req.query.queryDate}`, data: reArray,  paggingData: paggingData }
      res.render('control_log.ejs', rendeData)
    })

    db.close
  }
  if (req.query.function == 'control_log_regulartw') {

    query = `select * from query_order_regulartw_54 where importDate = '${req.query.queryDate}' order by logNum desc`
    console.log(query)


    var rawdata = [];
    var db = new sqlite3.Database(path.join(__dirname, '../db/main.db'), sqlite3.OPEN_READWRITE)
    db.all(query, [], function (err, rows) {
      if (err) {

        return console.log(`find ${req.params.inputvalues} error: `, err.message)
      }

      console.log(rows.length)
      reArray = []

      if (rows.length > req.query.pagesize ) {
        if (req.query.currentPage > 1 ) {
          var starNum = Number(((req.query.currentPage -1)  * req.query.pagesize))
          var endNum = Number(((req.query.currentPage-1) * req.query.pagesize) + Number(req.query.pagesize))
          console.log('strat:' + starNum)
          console.log('end:' + endNum)
          reArray = rows.slice(starNum, endNum)

        }else{
          reArray = rows.slice(0, req.query.pagesize)
        }
        
        
      }else{
        reArray = rows.slice(0, rows.length)
      }
      
      let pagePadding = Math.ceil(Number(rows.length) / Number(req.query.pagesize))
      if (req.query.currentPage > pagePadding ) {
        currentPage = 1
      } else {
        currentPage = req.query.currentPage
      }
      const paggingData = {pageType:req.query.function, pageQurty:req.query.queryDate,  pageSize:req.query.pagesize , currentPage : currentPage,  pagePadding: pagePadding  }
      const rendeData = { hostname: host, title: `Control Log(54 Regular TW) ${req.query.queryDate}`, menuTitle: `54 Regular TW ${req.query.queryDate}`, data: reArray,  paggingData: paggingData }
      res.render('control_log.ejs', rendeData)
    })

    db.close
  }
  if (req.query.function == 'control_log_amt') {

    query = `select * from query_order_AMT_89 where importDate = '${req.query.queryDate}' order by logNum desc`
    console.log(query)


    var rawdata = [];
    var db = new sqlite3.Database(path.join(__dirname, '../db/main.db'), sqlite3.OPEN_READWRITE)
    db.all(query, [], function (err, rows) {
      if (err) {

        return console.log(`find ${req.params.inputvalues} error: `, err.message)
      }

      console.log(rows.length)
      reArray = []

      if (rows.length > req.query.pagesize ) {
        if (req.query.currentPage > 1 ) {
          var starNum = Number(((req.query.currentPage -1)  * req.query.pagesize))
          var endNum = Number(((req.query.currentPage-1) * req.query.pagesize) + Number(req.query.pagesize))
          console.log('strat:' + starNum)
          console.log('end:' + endNum)
          reArray = rows.slice(starNum, endNum)

        }else{
          reArray = rows.slice(0, req.query.pagesize)
        }
        
        
      }else{
        reArray = rows.slice(0, rows.length)
      }
      
      let pagePadding = Math.ceil(Number(rows.length) / Number(req.query.pagesize))
      if (req.query.currentPage > pagePadding ) {
        currentPage = 1
      } else {
        currentPage = req.query.currentPage
      }
      const paggingData = {pageType:req.query.function, pageQurty:req.query.queryDate,  pageSize:req.query.pagesize , currentPage : currentPage,  pagePadding: pagePadding  }
      const rendeData = { hostname: host, title: `Control Log(AMT Regular) ${req.query.queryDate}`, menuTitle: `AMT Regular ${req.query.queryDate}`, data: reArray, paggingData: paggingData }
      res.render('control_log.ejs', rendeData)
    })

    db.close
  }
  if (req.query.function == 'control_log_amt_downs') {

    query = `select * from query_order_AMT_downs_89 where importDate = '${req.query.queryDate}' order by logNum desc`
    console.log(query)


    var rawdata = [];
    var db = new sqlite3.Database(path.join(__dirname, '../db/main.db'), sqlite3.OPEN_READWRITE)
    db.all(query, [], function (err, rows) {
      if (err) {

        return console.log(`find ${req.params.inputvalues} error: `, err.message)
      }

      console.log(rows.length)
      reArray = []

      if (rows.length > req.query.pagesize ) {
        if (req.query.currentPage > 1 ) {
          var starNum = Number(((req.query.currentPage -1)  * req.query.pagesize))
          var endNum = Number(((req.query.currentPage-1) * req.query.pagesize) + Number(req.query.pagesize))
          console.log('strat:' + starNum)
          console.log('end:' + endNum)
          reArray = rows.slice(starNum, endNum)

        }else{
          reArray = rows.slice(0, req.query.pagesize)
        }
        
        
      }else{
        reArray = rows.slice(0, rows.length)
      }

      
      
      let pagePadding = Math.ceil(Number(rows.length) / Number(req.query.pagesize))
      if (req.query.currentPage > pagePadding ) {
        currentPage = 1
      } else {
        currentPage = req.query.currentPage
      }
      const paggingData = {pageType:req.query.function, pageQurty:req.query.queryDate,  pageSize:req.query.pagesize , currentPage : currentPage,  pagePadding: pagePadding  }
      const rendeData = { hostname: host, title: `Control Log(AMT Downs) ${req.query.queryDate}`, menuTitle: `AMT Downs ${req.query.queryDate}`, data: reArray , paggingData: paggingData }
      res.render('control_log.ejs', rendeData)
    })

    db.close
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
        ,TBL_ZAVGR043_Prod.WaveGrpNo ) as t
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
     from tbl_zavgr043_prod left join TBL_LT22_Prod 
    on tbl_zavgr043_prod.Delivery = TBL_LT22_Prod.Dest_Bin
    where ShipmentNo = '${req.query.shipmentNo}' and TBL_LT22_Prod.Source_Typ not in ('922');`
    var db = new sqlite3.Database(path.join(__dirname, '../db/main.db'), sqlite3.OPEN_READWRITE)

    db.get(`select count(WaveGrpNo) as [Total] from tbl_zavgr043_prod where shipmentNo = ${req.query.shipmentNo} and WaveGrpNo like '200%';`, [], function (err, rows) {
      if (err) {
        return console.log(`find ${req.params.inputvalues} error: `, err.message)
      }

      if (rows['Total'] > 0) {
        db.all(wavequery,[], function(err, row) {
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



  db.close
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