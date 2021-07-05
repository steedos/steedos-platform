const { execSync } = require('child_process');
const path = require('path');
console.log("Running npm-postinstall.js");

//execSync('cp node_modules/devextreme/dist/css/fonts/* public/fonts/devextreme/');

// fix DevExtreme的 formatISO8601函数没用使用utc时间
// execSync('rm -rf ./node_modules/crypto');
// execSync('rm -rf ./node_modules/bcrypt');

// if (process.platform == "darwin"){
//     execSync('cp -r .scripts/bcrypt-57-darwin-x64/* node_modules/bcrypt/');
//     execSync('cp -r .scripts/bcrypt-57-darwin-x64/* ../node_modules/bcrypt/');
// }
// else if (process.platform == "win32") {
//     execSync('cp -r .scripts/bcrypt-57-win32-x64/* node_modules/bcrypt/');
//     execSync('cp -r .scripts/bcrypt-57-win32-x64/* ../node_modules/bcrypt/');
// }

// 修正 旧版 windows 客户端

execSync('rm -rf node_modules/@steedos');
execSync('rm -rf node_modules/steedos-server');
if (process.platform == "win32") {
    execSync('mklink /J '+path.join(process.cwd(), '/node_modules/@steedos')+' '+ path.join('../../../steedos-platform/node_modules/@steedos')); //指向本地platform
    execSync('mklink /J '+path.join(process.cwd(), '/node_modules/steedos-server')+' '+ path.join('../../../steedos-platform/node_modules/steedos-server')); //指向本地platform
    execSync('rm -rf node_modules/@steedos/metadata-core');
    execSync('mklink /J '+path.join(process.cwd(), '/node_modules/@steedos/metadata-core')+' '+ path.join(process.cwd(),'../metadata-core'));
}else{
    execSync('ln -s ' + process.cwd() + '/../node_modules/@steedos ' + process.cwd() + '/node_modules/@steedos' );
}