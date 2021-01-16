const { execSync } = require('child_process');
const path = require('path');
const _ = require('underscore');
const fs = require('fs');

let appsPath = path.join(process.cwd(), 'apps')
let apps = fs.readdirSync(appsPath);

_.each(apps, function(item){
    let fPath = path.join(appsPath, item);
    let stat = fs.statSync(fPath);
    if(stat.isDirectory() === true) {
        let packagePath = path.join(fPath, "steedos-app")
        
        execSync(`cd ${fPath} && steedos package:build -n ${item} -p ${packagePath}`);
    }
})
