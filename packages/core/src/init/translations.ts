/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-03-28 09:35:34
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2025-02-15 16:58:46
 * @Description: 
 */
import * as I18n from '@steedos/i18n';
import { InitCoreTranslations } from '@steedos/i18n/lib/core_i18n'
import { initExportObjectI18nTemplateRouter, initLocalesRouter} from '@steedos/i18n/lib/router'
import { getObjectTranslations, getTranslations } from '@steedos/metadata-registrar';
const SteedosRouter = require('@steedos/router');

export const InitTranslations = async function(){
    InitCoreTranslations();
    // await loadObjectTranslations();
    // await loadTranslations();
    InitTranslationRouter();
}

export const InitTranslationRouter = function(){
    const app = SteedosRouter.staticRouter();
    const pluginContext = {
        app,
        settings: Steedos.settings
    };
    initExportObjectI18nTemplateRouter(pluginContext);
    initLocalesRouter(pluginContext);
    // SteedosApi?.server?.use(pluginContext.app);
    // WebApp.connectHandlers.use(pluginContext.app);
}

export const loadTranslations = async function(){
    const tanslations = await getTranslations();
    I18n.addTranslations(tanslations);
}

export const loadObjectTranslations = async function(){
    const objectTanslations = await getObjectTranslations();
    I18n.addObjectsTranslation(objectTanslations);
}