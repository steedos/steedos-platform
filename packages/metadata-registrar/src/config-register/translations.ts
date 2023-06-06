/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2023-05-27 15:06:41
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-05-27 16:43:30
 * @Description: 
 */
import path = require('path');
import * as _ from 'underscore';
// import { loadCoreTranslations } from '@steedos/i18n'
import { getMD5, LoadTranslationFile } from '@steedos/metadata-core';

const translationFile = new LoadTranslationFile();

const brokeEmitEvents = async(filePath)=>{
    await broker.emit(`translations.change`, {
        filePath
    });
}

const addTranslation = async (key, data)=>{
    return await broker.call('translations.addTranslation', {
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

    let translations = translationFile.load(filePath)
    for (const element of translations) {
        try {
            await addTranslation(getMD5(element.__filename), element)
        } catch (error) {
            console.error(`addTranslation error`, error.message)
        }
    }
    if (translations && translations.length > 0) {
        await brokeEmitEvents(filePath)
    }
}

export const getTranslations = async ()=>{
    const metadataObjectTranslations = await broker.call('translations.getTranslations')
    return _.pluck(metadataObjectTranslations, 'metadata')
}