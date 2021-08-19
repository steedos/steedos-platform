import { loadFile, SteedosMetadataTypeInfoKeys as TypeInfoKeys, getMetadataTypeInfo } from '@steedos/metadata-core';
import _ from 'underscore';
const path = require('path');
const glob = require('glob');

import { checkNameEquals } from '../../util/check_name_equals'

export class BaseLoadMetadataFile{
    metadataName: string;
    metadataInfo: any;
    constructor(metadataName){
        this.metadataName = metadataName;
        this.metadataInfo = getMetadataTypeInfo(metadataName)
    }
    async load(filePath){
        let matchedPaths = glob.sync(path.join(filePath, this.metadataInfo.defaultDirectory, `*.${this.metadataInfo.ext}.yml`));
        let metadatasJSON = {};
        for (let k=0; k<matchedPaths.length; k++) {
            let matchedPath = matchedPaths[k];
            let json = loadFile(matchedPath);
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