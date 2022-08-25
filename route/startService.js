const app = require('./app')
const os = require('os');
const path = require('path')
const hostConfig = require('../db/dbConfig/hostConfig')




hostConfig.hostGet().then(function(response){
    console.log(response)
    require('dns').lookup(response.address, function(err) {
        if(err) {
            console.log('dns:'+err)
        }
        console.log('dns: success')
    })
    
    if (response.Status = 1 ) {
        console.log('c')
        const host = os.hostname().toLowerCase();
        const port = '3000';

        console.log(host)

        const server = app.listen(port,host, () => {
            
            console.log(`Express is running on host :${host}, port ${server.address().port}`);
        });

    }else{
        console.log('d')
        const host = response.hostname
        const port = '3000';

        console.log(host)

        const server = app.listen(port,host, () => {
            
            console.log(`Express is running on host :${host}, port ${server.address().port}`);
        });
    }

    


    
})

//if hostConfig.hostGet.hostname = os.hostname()

