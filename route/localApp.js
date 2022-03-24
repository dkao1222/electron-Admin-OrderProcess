const express = require('express')
const routes = require('./services');
//const cors = require('cors');

const apps = express();
var os = require('os');
const path = require('path')
const sqlite3 = require('sqlite3').verbose()

let configPost = require('../db/dbConfig/dbConfig')
const host = os.hostname().toLowerCase();
const port = '3010'

//+'\\node_modules\\dsmorse-gridster\\dist''
//apps.use('/bootstrap', express.static(path.resolve(__dirname, '../node_modules/bootstrap')))
//apps.use('/jquery', express.static(path.resolve(__dirname, '../node_modules/jquery/dist')))
//apps.use('/popper', express.static(path.resolve(__dirname, '../node_modules/@popperjs\\core/dist')))



//apps.use(express.static('public'))
//require('../public/assist/img')
//apps.use('/img', express.static(path.resolve(__dirname , '../public/assist/img')))
//apps.use('/functionJS', express.static(path.resolve(__dirname ,'../public/function')))

apps.use('/', routes);

apps.set('view engine', 'ejs')

apps.get('/get/query', (req, res) => {

  console.log(req.query.table)
  console.log(req.query.query)
  var query = ""
  if(typeof(req.query.query) == 'undefined') {
    query = "select * from " + req.query.table + " " 
  } else {
    query = "select * from " + req.query.table + " " + req.query.query
  }
  
  configPost.configPost(query).then(function(response){
    res.json(response)
  })

  
})


apps.post('/set/setLog', (req, res) => {

  console.log(req.query.status)
  console.log(req.query.desc)


  var desc = ""
  var status = ""
  if(typeof(req.query.status) == 'undefined' || typeof(req.query.desc) == 'undefined') {
    
  } else {
    status = req.query.status
    desc = req.query.desc

    

    configPost.hostSet(status,desc ).then(function(response){
      res.json(response)
    })
  }
  
  

  
})

module.exports = apps; 