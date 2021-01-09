const { execSync } = require('child_process');
const path = require('path');
const _ = require('underscore');
const fs = require('fs');
const gitUtil = require('./git_util');

let appsPath = path.join(process.cwd(), 'apps')
let apps = fs.readdirSync(appsPath);

_.each(apps, function(item){
    let fPath = path.join(appsPath, item);
    let stat = fs.statSync(fPath);
    if(stat.isDirectory() === true) {
        const appBranch = gitUtil.getAppBranch(item);
        execSync(`cd ${fPath} && git checkout ${appBranch} && git pull`);
    }
})
