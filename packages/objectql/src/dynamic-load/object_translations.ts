import path = require('path');
var util = require('../util');

const _objectTranslations: Array<any> = [];

export const addObjectTranslationsFiles = (filePath: string)=>{
    if(!path.isAbsolute(filePath)){
        throw new Error(`${filePath} must be an absolute path`);
    }

    let objectTranslations = util.loadObjectTranslations(filePath)
    objectTranslations.forEach(element => {
        _objectTranslations.push(element)
    });
}

export const getObjectTranslations = ()=>{
    return _objectTranslations;
}