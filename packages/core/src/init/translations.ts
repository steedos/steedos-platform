import * as I18n from '@steedos/i18n';
import { InitCoreTranslations } from '@steedos/i18n/lib/core_i18n'
import { initExportObjectI18nTemplateRouter, initLocalesRouter} from '@steedos/i18n/lib/router'
const express = require('express');
const objectql = require('@steedos/objectql')
const app = express();

export const InitTranslations = function(){
    console.log('InitTranslations....');
    InitCoreTranslations();
    console.log('loadObjectTranslations....');
    loadObjectTranslations();
    console.log('loadTranslations....');
    loadTranslations();
    console.log('InitTranslationRouter....');
    InitTranslationRouter();
}

export const InitTranslationRouter = function(){
    const pluginContext = {
        app,
        settings: Meteor.settings
    };
    initExportObjectI18nTemplateRouter(pluginContext);
    initLocalesRouter(pluginContext);
    WebApp.connectHandlers.use(pluginContext.app);
}

export const loadTranslations = function(){
    const tanslations = objectql.getTranslations();
    I18n.addTranslations(tanslations);
}

export const loadObjectTranslations = function(){
    const objectTanslations = objectql.getObjectTranslations();
    I18n.addObjectsTranslation(objectTanslations);
}