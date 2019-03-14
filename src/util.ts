const yaml = require('js-yaml');
const fs = require("fs");
const path = require("path");
const _ = require("underscore");
import { JsonMap, isJsonMap, has, getJsonMap } from '@salesforce/ts-types';

exports.loadJSONFile = (filePath: string)=>{
    return JSON.parse(fs.readFileSync(filePath, 'utf8').normalize('NFC'));
}

exports.loadYmlFile = (filePath: string)=>{
    return yaml.load(fs.readFileSync(filePath, 'utf8'));
}

exports.loadFile = (filePath: string)=>{
    let json:JsonMap = {}
    try {
        let extname = path.extname(filePath);
        if(extname.toLocaleLowerCase() == '.json')
            json = JSON.parse(fs.readFileSync(filePath, 'utf8').normalize('NFC'));
        else if(extname.toLocaleLowerCase() == '.yml')
            json = yaml.load(fs.readFileSync(filePath, 'utf8'));
        else if(extname.toLocaleLowerCase() == '.js')
            json = require(filePath);
    } catch (error) {
        console.error('loadFile error', filePath, error);
    }
    return json;
};

exports.extend = (destination: JsonMap, sources: JsonMap)=>{
    _.each(sources, (v:never, k: string)=>{
        if(!has(destination, k)){
            destination[k] = v
        }else if(isJsonMap(v)){
            let _d = getJsonMap(destination, k);
            if(isJsonMap(_d)){
                this.extend(_d, v)
            }else{
                destination[k] = v
            }
        }else{
            destination[k] = v
        }
    })
}