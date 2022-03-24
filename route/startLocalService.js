const app = require('./localApp')
const os = require('os');
const path = require('path');


const host = os.hostname().toLowerCase();
const port = '3010';



const server = app.listen(port, () => {
            
    console.log(`Express is running on host :${host}, port ${server.address().port}`);
});

