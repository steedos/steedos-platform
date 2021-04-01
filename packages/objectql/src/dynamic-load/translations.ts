import { getSteedosSchema } from '../types/schema';
import path = require('path');
import * as _ from 'underscore';
// import { loadCoreTranslations } from '@steedos/i18n'
import { getMD5 } from '../util';

var util = require('../util');

const brokeEmitEvents = async(filePath)=>{
    let schema = getSteedosSchema();
    await schema.broker?.emit(`translations.change`, {
        filePath
    });
}

const addTranslation = async (key, data)=>{
    return await getSteedosSchema().metadataBroker?.call('translations.addTranslation', {
        key, data
    })
}

// export const addCoreTranslations = async  (filePath: string)=>{
//     let coreTranslations = loadCoreTranslations(filePath);
//     for (const element of coreTranslations) {
//         try {
//             await addTranslation(getMD5(element.__filename), element)
//         } catch (error) {
//             console.error(`addTranslation error`, error.message)
//         }
//     }
// }

export const addTranslationsFiles = async (filePath: string)=>{
    if(!path.isAbsolute(filePath)){
        throw new Error(`${filePath} must be an absolute path`);
    }

    let translations = util.loadTranslations(filePath)
    for (const element of translations) {
        try {
            await addTranslation(getMD5(element.__filename), element)
        } catch (error) {
            console.error(`addTranslation error`, error.message)
        }
    }
    await brokeEmitEvents(filePath)
}

export const getTranslations = async ()=>{
    const metadataObjectTranslations = await getSteedosSchema().metadataBroker.call('translations.getTranslations')
    return _.pluck(metadataObjectTranslations, 'metadata')
}