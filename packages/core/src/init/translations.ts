/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-03-28 09:35:34
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-11-16 14:09:00
 * @Description: 
 */
import * as I18n from '@steedos/i18n';
import { InitCoreTranslations } from '@steedos/i18n/lib/core_i18n'
import { initExportObjectI18nTemplateRouter, initLocalesRouter} from '@steedos/i18n/lib/router'
const objectql = require('@steedos/objectql')
const SteedosRouter = require('@steedos/router');
const app = SteedosRouter.staticRouter();

export const InitTranslations = async function(){
    InitCoreTranslations();
    // await loadObjectTranslations();
    // await loadTranslations();
    InitTranslationRouter();
}

export const InitTranslationRouter = function(){
    const pluginContext = {
        app,
        settings: Meteor.settings
    };
    initExportObjectI18nTemplateRouter(pluginContext);
    initLocalesRouter(pluginContext);
    // SteedosApi?.server?.use(pluginContext.app);
    // WebApp.connectHandlers.use(pluginContext.app);
}

export const loadTranslations = async function(){
    const tanslations = await objectql.getTranslations();
    I18n.addTranslations(tanslations);
}

export const loadObjectTranslations = async function(){
    const objectTanslations = await objectql.getObjectTranslations();
    I18n.addObjectsTranslation(objectTanslations);
}