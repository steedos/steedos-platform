const path = require("path");
const fs = require("fs");
const yaml = require('js-yaml');

const SteedosConfig = {}
const configName = 'steedos-config.yml'


function getBaseDirectory(){
    return require('app-root-path').path
}

function getSteedosConfig(){
    let config: any;
    let configPath = path.join(getBaseDirectory(), configName)
    if (fs.existsSync(configPath) && !fs.statSync(configPath).isDirectory()) {
        config = yaml.load(fs.readFileSync(configPath, 'utf8'));
    }else{
        console.info('not found steedos-config.yml', configPath);
    }
    return config;
}

export function initConfig(options?){
    Object.assign(SteedosConfig, getSteedosConfig(), options)
}

export default SteedosConfig