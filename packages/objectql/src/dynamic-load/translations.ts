import path = require('path');
var util = require('../util');

const _translations: Array<any> = [];

export const addTranslationsFiles = (filePath: string)=>{
    if(!path.isAbsolute(filePath)){
        throw new Error(`${filePath} must be an absolute path`);
    }

    let translations = util.loadTranslations(filePath)
    translations.forEach(element => {
        _translations.push(element)
    });
}

export const getTranslations = ()=>{
    return _translations;
}