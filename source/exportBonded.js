const Excel = require('exceljs');
const sqlite3 = require('sqlite3').verbose()
var os = require('os');
const path = require('path')
const http = require('http');

const {hostGet, hostSet} = require('../db/dbConfig/hostConfig');
const { resolve } = require('path');

const host = hostGet().then(function( response ) {
    
    console.log(response)
    if (response[0].Status == 1) {
      console.log('app, c')
      return os.hostname().toLowerCase();
  
      
  
    } else {
      console.log('app, d')
      return response[0].hostname
      
    }
  
  
  });

const options = {
    
    host: 'http://127.0.0.1' ,
    port: 3000,
    url: '/get/deliveryInform?function=cuttime_report&queryDate=2022-04&minLogNum=1&maxLogNum=10&controllog=control_log_regular',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };

var req = http.get(options, async function(res) {
    consle.log(res)
})