import * as I18n from '@steedos/i18n';
import { InitCoreTranslations } from '@steedos/i18n/lib/core_i18n'
import { initExportObjectI18nTemplateRouter, initLocalesRouter} from '@steedos/i18n/lib/router'
const express = require('express');
const objectql = require('@steedos/objectql')
const app = express();

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
    WebApp.connectHandlers.use(pluginContext.app);
}

export const loadTranslations = async function(){
    const tanslations = await objectql.getTranslations();
    I18n.addTranslations(tanslations);
}

export const loadObjectTranslations = async function(){
    const objectTanslations = await objectql.getObjectTranslations();
    I18n.addObjectsTranslation(objectTanslations);
}