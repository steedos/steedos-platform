const { execSync } = require('child_process');
const path = require('path');
console.log("Running npm-postinstall.js");

//execSync('cp node_modules/devextreme/dist/css/fonts/* public/fonts/devextreme/');

// fix DevExtreme的 formatISO8601函数没用使用utc时间
// execSync('cp -r .scripts/devextreme/* node_modules/devextreme/');
execSync('rm -rf ./node_modules/crypto');
execSync('rm -rf ./node_modules/bcrypt');

// if (process.platform == "darwin"){
//     execSync('cp -r .scripts/bcrypt-57-darwin-x64/* node_modules/bcrypt/');
//     execSync('cp -r .scripts/bcrypt-57-darwin-x64/* ../node_modules/bcrypt/');
// }
// else if (process.platform == "win32") {
//     execSync('cp -r .scripts/bcrypt-57-win32-x64/* node_modules/bcrypt/');
//     execSync('cp -r .scripts/bcrypt-57-win32-x64/* ../node_modules/bcrypt/');
// }


// 修正 旧版 windows 客户端
execSync('cp -r .scripts/iconv-lite/* node_modules/iconv-lite/');

execSync('rm -rf node_modules/@steedos');
execSync('rm -rf node_modules/steedos-server');
// 执行 platform 下的 bootstrap
execSync('cd .. && yarn bootstrap', {stdio: 'inherit'});
// execSync(`cp -r node_modules/@steedos-ui/builder-community/dist/builder-community.react.css public/`);

if (process.platform == "win32") {
    execSync('mklink /J '+path.join(process.cwd(), '/node_modules/@steedos')+' '+ path.join(process.cwd(), '/../node_modules/@steedos'));
}else{
    execSync('ln -s ' + path.join(process.cwd(), '../node_modules/@steedos') + ' ' + process.cwd() + '/node_modules/@steedos' );
}


execSync('rm -rf node_modules/resolve/test');