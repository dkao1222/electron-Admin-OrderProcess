const path = require('path');
const builder = require('electron-builder');


builder.build({

    projectDir: path.resolve(__dirname),  // 專案路徑 
    //mac: ["dmg"],
    win: ['nsis', 'portable'],  // nsis . portable
    config: {
        "appId": "com.dkao1222.electron.AdminOrderProcess",
        "asar":false,
        "productName": "UPS Admin Order Process Tool", // 應用程式名稱 ( 顯示在應用程式與功能 )
        "files": [    // 打包需要的不過濾的檔案
            "db/**/*",
            "public/**/*",
            "render/**/*",
            "route/**/*",
            "source/**/*",
            "temp/**/*",
            "vbs/**/*", 
            "views/**/*",
            "mainmenu/**/*",
            "main.js",
            "node_modules/**/*",
        
          ],
        //"extraResources": ["../db/main.db","../db/config.db"],
        /*"asarUnpack": [
            "../db/main.db",
            "../db/config.db"
          ],*/
        "directories": {
            "output": "build/win"
        },
        "win": {
            "icon": path.resolve(__dirname, '../public/assist/img/ups_shield.ico'),
        }
        
        
        
    },

})
    .then(
        data => console.log(data),
        err => console.error(err)
    );