/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-03-28 09:35:34
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2025-02-21 14:33:19
 * @Description: 
 */
import * as I18n from '@steedos/i18n';
import { InitCoreI18n } from '@steedos/i18n/lib/core_i18n'
import { initExportObjectI18nTemplateRouter, initLocalesRouter} from '@steedos/i18n/lib/router'
const objectql = require('@steedos/objectql')
const SteedosRouter = require('@steedos/router');
const app = SteedosRouter.staticRouter();
export const InitI18n = function(){
    InitCoreI18n();
    InitObjectI18n();
    InitI18nRouter();
}

export const InitI18nRouter = function(){
    const pluginContext = {
        app,
        settings: Steedos.settings
    };
    initExportObjectI18nTemplateRouter(pluginContext);
    initLocalesRouter(pluginContext);
    console.log(`app`, app)
    SteedosRouter.staticApp().use(app)
    // WebApp.connectHandlers.use(pluginContext.app);
}

export const InitObjectI18n = function(){
    const objectsI18n = objectql.getObjectsI18n();
    I18n.addObjectsI18n(objectsI18n);
}