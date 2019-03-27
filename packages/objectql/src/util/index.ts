/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { isJsonMap, JsonMap } from '@salesforce/ts-types';


const yaml = require('js-yaml');
const fs = require("fs");
const path = require("path");
const _ = require("underscore");
const globby = require("globby");
import { has, getJsonMap } from '@salesforce/ts-types';

exports.loadJSONFile = (filePath: string)=>{
    return JSON.parse(fs.readFileSync(filePath, 'utf8').normalize('NFC'));
}

exports.loadYmlFile = (filePath: string)=>{
    return yaml.load(fs.readFileSync(filePath, 'utf8'));
}

let loadFile = (filePath: string)=>{
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
exports.loadFile = loadFile;

exports.loadObjects = (filePath: string) => {
    let results = []
    const filePatten = [
        path.join(filePath, "*.object.yml"),
        path.join(filePath, "*.object.json"),
        path.join(filePath, "*.object.js")
    ]
    const matchedPaths:[string] = globby.sync(filePatten);
    console.log(matchedPaths)
    _.each(matchedPaths, (matchedPath:string)=>{
        let json = loadFile(matchedPath);
        results.push(json)
    })
    return results
}

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

exports.isObjectFile = (filePath: string)=>{
  return !fs.statSync(filePath).isDirectory() && (filePath.endsWith('.object.yml') || filePath.endsWith('.object.js'))
}

exports.isAppFile = (filePath: string)=>{
  return !fs.statSync(filePath).isDirectory() && filePath.endsWith('.app.yml')
}

exports.isTriggerFile = (filePath: string)=>{
  return !fs.statSync(filePath).isDirectory() && filePath.endsWith('.trigger.js')
}

exports.isFieldFile = (filePath: string)=>{
  return !fs.statSync(filePath).isDirectory() && (filePath.endsWith('.field.yml') || filePath.endsWith('.field.js'))
}

exports.isReportFile = (filePath: string)=>{
  return !fs.statSync(filePath).isDirectory() && (filePath.endsWith('.report.yml') || filePath.endsWith('.report.js'))
}