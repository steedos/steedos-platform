/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-03-28 09:35:34
 * @Description: 
 */
import { getMetadataTypeInfo } from '../typeInfo';
import { loadFile } from '../loadFile'
import _ from 'underscore';
const path = require('path');
const globby = require('globby');

import { checkNameEquals } from '../util/check_name_equals'

export class BaseLoadMetadataFile{
    metadataName: string;
    metadataInfo: any;
    ext: string = 'yml';
    constructor(metadataName, ext?){
        if(ext){
            this.ext = ext;
        }
        this.metadataName = metadataName;
        this.metadataInfo = getMetadataTypeInfo(metadataName)
    }
    load(filePath){
        const filePatten = [
            path.join(filePath, this.metadataInfo.defaultDirectory, `*.${this.metadataInfo.ext}.${this.ext}`),
            "!" + path.join(filePath, "node_modules"),
        ];
        
        let matchedPaths = globby.sync(filePatten);
        let metadatasJSON = {};
        for (let k=0; k<matchedPaths.length; k++) {
            let matchedPath = matchedPaths[k];
            let json: any = loadFile(matchedPath);
            let apiName = matchedPath.substring(matchedPath.lastIndexOf('/')+1, matchedPath.indexOf(`.${this.metadataInfo.ext}`));
            let metadata = {};
            try {
                if(json){  
                    checkNameEquals(json, apiName, matchedPath, this.metadataName);
                    let keys = _.keys(json);
                    for(let m in keys){
                        let key = keys[m];
                        if(typeof key === 'function'){
                            continue;
                        }
                        let val = json[key];
                        if(typeof val === 'function' ){
                            json[key] = val.toString();
                        }
                        metadata[key] = json[key];
                    }
                    json.__filename = matchedPath
                    metadatasJSON[apiName] = json;    
                }
            } catch (error) {
                console.error(`load${this.metadataInfo.nameForMsgsPlural} error`, matchedPath, error);
                throw error
            }
        }
        return metadatasJSON;
    }
}