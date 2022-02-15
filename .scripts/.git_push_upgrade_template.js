const { execSync } = require('child_process');
const path = require('path');
const _ = require('underscore');
const fs = require('fs');

let appsPath = path.join(process.cwd(), 'packages', 'create-steedos-app', 'templates')
let apps = fs.readdirSync(appsPath);
let versionInfo = require('../lerna.json');
_.each(apps, function(item){
    let fPath = path.join(appsPath, item);
    let stat = fs.statSync(fPath);
    if(stat.isDirectory() === true) {
        try {
            execSync(`cd ${fPath} && git add . && git commit -m "upgrade template @${versionInfo.version}" && git push`);
        } catch (error) {
            console.error(error.stdout.toString())
        }
    }
})
