import { addResourceBundle } from './index';
const path = require('path');
const objectql = require('@steedos/objectql');
const _ = require("underscore");

export const InitCoreI18n = function(){
    let filePath = path.join(__dirname, '..', 'i18n', '**');
    let results = objectql.loadI18n(filePath);
    _.each(results, function(item){
        addResourceBundle(item.lng, 'translation', item.data);
    })
}