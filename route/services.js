const express = require('express');

//const {getQuery } = require('../db/dbConfig/dbconfig')
const http = require('http');
const { Http2ServerRequest } = require('http2');
const { json } = require('express');

const router = express.Router();









router.get('/', (req, res) => {



  res.sendFile(path.join(__dirname, '../views/index.html'));

  //res.send('It works!');
});

module.exports = router;