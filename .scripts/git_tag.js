const { execSync } = require('child_process');
const fs = require('fs');

const loadJSONFile = (filePath)=>{
    return JSON.parse(fs.readFileSync(filePath, 'utf8').normalize('NFC'));
}

const lernaInfo = loadJSONFile('lerna.json');

if(lernaInfo && lernaInfo.version){
    execSync(`git tag -a v${lernaInfo.version} -m 'published v${lernaInfo.version}' && git push origin --tags`);
}

