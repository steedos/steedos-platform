import * as I18n from '@steedos/i18n';
import { InitCoreI18n } from '@steedos/i18n/lib/core_i18n'
import { initExportObjectI18nTemplateRouter, initLocalesRouter} from '@steedos/i18n/lib/router'
const express = require('express');
const objectql = require('@steedos/objectql')
const app = express();

export const InitI18n = function(){
    InitCoreI18n();
    InitObjectI18n();
    InitI18nRouter();
}

export const InitI18nRouter = function(){
    const pluginContext = {
        app,
        settings: Meteor.settings
    };
    initExportObjectI18nTemplateRouter(pluginContext);
    initLocalesRouter(pluginContext);
    WebApp.connectHandlers.use(pluginContext.app);
}

export const InitObjectI18n = function(){
    const objectsI18n = objectql.getObjectsI18n();
    I18n.addObjectsI18n(objectsI18n);
}