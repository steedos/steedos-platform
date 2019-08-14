const { execSync } = require('child_process');

console.log("Running npm-postinstall.js");

//execSync('cp node_modules/devextreme/dist/css/fonts/* public/fonts/devextreme/');

// fix DevExtreme的 formatISO8601函数没用使用utc时间
execSync('cp -r .scripts/devextreme/* node_modules/devextreme/');
