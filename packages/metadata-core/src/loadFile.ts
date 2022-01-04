import { safeEval } from './util/function';
const fs = require('fs');
const yaml = require('js-yaml');
const clone = require('clone');
const path = require('path');

export function loadFile(filePath){
    let json = {}
    try {
        let extname = path.extname(filePath);
        if(extname.toLocaleLowerCase() === '.json')
            json = JSON.parse(fs.readFileSync(filePath, 'utf8').normalize('NFC'));
        else if(extname.toLocaleLowerCase() ==='.yml')
            json = yaml.load(fs.readFileSync(filePath, 'utf8'));
        else if(extname.toLocaleLowerCase() === '.js'){
            json = safeEval(fs.readFileSync(filePath, 'utf8'), true);
        }
    } catch (error) {
        console.error('loadFile error', filePath, error);
    }
    return json;
};