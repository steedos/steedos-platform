/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-03-28 09:35:34
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-11-18 13:21:31
 * @Description: 
 */
import { getSteedosSchema } from '../types/schema';
import path = require('path');
import * as _ from 'underscore';
import { map, defaultsDeep, each, filter, reverse } from 'lodash';
var util = require('../util');

// const addObjectsTranslation = async (objectApiName, data)=>{
//     return await getSteedosSchema().metadataBroker?.call('translations.addObjectTranslation', {
//         objectApiName, data
//     })
// }

const addObjectTranslations = async (data) => {
    return await getSteedosSchema().metadataBroker?.call('translations.addObjectTranslations', {
        data
    })
}

export const addObjectTranslationsFiles = async (filePath: string)=>{
    if(!path.isAbsolute(filePath)){
        throw new Error(`${filePath} must be an absolute path`);
    }

    let objectTranslations = util.loadObjectTranslations(filePath)
    // for (const element of objectTranslations) {
    //     try {
    //         await addObjectsTranslation(element.objectApiName, element)
    //     } catch (error) {
    //         console.error(`addObjectsTranslation error`, error.message)
    //     }
    // }
    if (objectTranslations && objectTranslations.length > 0) {
        await addObjectTranslations(objectTranslations);
    }
}

export const getObjectTranslations = async ()=>{
    const objectsTranslations = await getSteedosSchema().metadataBroker.call('translations.getObjectTranslations');
    const objectTranslationsTemplates = await getSteedosSchema().metadataBroker.call('translations.getObjectTranslationTemplates');

    const results = [];

    map(objectTranslationsTemplates, ({metadata: defaultTranslation})=>{
        each(['zh-CN', 'en', 'ja'], (lng)=>{
            let objectTranslation = {};
            const objectTranslations: Array<any> = filter(objectsTranslations, {lng: lng, objectApiName: defaultTranslation.objectApiName});
            if(objectTranslations.length > 0){
                objectTranslation = defaultsDeep(objectTranslation, ...(reverse(objectTranslations)))
            }
            results.push(defaultsDeep({ lng: lng }, objectTranslation, defaultTranslation));
        })
    });
    return results;
}   