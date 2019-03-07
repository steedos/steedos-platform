const yaml = require('js-yaml');
const fs = require("fs");
const path = require("path");
import { JsonMap } from '@salesforce/ts-types';

exports.loadJSONFile = (filePath: String)=>{
    return JSON.parse(fs.readFileSync(filePath, 'utf8').normalize('NFC'));
}

exports.loadYmlFile = (filePath: String)=>{
    return yaml.load(fs.readFileSync(filePath, 'utf8'));
}

exports.loadFile = (filePath: String)=>{
    let json:JsonMap = {}
    try {
        let extname = path.extname(filePath);
        if(extname.toLocaleLowerCase() == '.json')
            json = JSON.parse(fs.readFileSync(filePath, 'utf8').normalize('NFC'));
        else if(extname.toLocaleLowerCase() == '.yml')
            json = yaml.load(fs.readFileSync(filePath, 'utf8'));
    } catch (error) {
        console.error('loadFile error', filePath, error);
    }
    return json;
};