import * as I18n from '@steedos/i18n';
const express = require('express');
const app = express();

export const I18nInit = function(){
    const pluginContext = {
        app,
        settings: Meteor.settings
    };
    I18n.init(pluginContext);
    WebApp.connectHandlers.use(pluginContext.app);
}
