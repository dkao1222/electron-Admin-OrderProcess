const path = require('path')

const sqlite3 = require('sqlite3').verbose()

let db = new sqlite3.Database(path.resolve(__dirname.replace("app.asar",''), '../../db/config.db'), sqlite3.OPEN_READWRITE)

const hostGet = function () {
    return new Promise(function (resolve, reject) {
        let query = 'select * from hostnameConfig'
        console.log(query)
        db.serialize(function () {
            db.all(query, function (err, rows) {
                
                if(!err) {
                    resolve(rows)
                } else {
                    reject(err)
                }
            })
        })
    })
    //db.close()
}

const hostSet = function (status, desc) {
    return new Promise(function (resolve, reject) {
        let query = `insert into LOG (Status, Description) values ("${status}", "${desc}")`
        console.log(query)
        db.serialize(function () {
            db.run(query, function (err, rows) {
                
                if(!err) {
                    resolve(rows)
                } else {
                    reject(err)
                }
            })
        })
    })
    //db.close()
}

const hostUpdate = function (hostname) {
    const os = require('os')

    return new Promise(function (resolve, reject) {
        let query = `update hostnameConfig set hostname = '${hostname.toLowerCase()}'`
        console.log(query)
        db.serialize(function () {
            db.run(query, function (err, rows) {
                
                if(!err) {
                    resolve(rows)
                } else {
                    reject(err)
                }
            })
        })
    })
    //db.close()
}

module.exports = {hostGet, hostSet, hostUpdate} 