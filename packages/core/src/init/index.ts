import { Datasources } from './datasources'
import { Core, initCreator, initDesignSystem, initPublic } from './core'
import { Plugins } from './plugins';
import { getSteedosSchema } from '@steedos/objectql';
import * as migrate from '@steedos/migrate';
import { initPublicStaticRouter } from '../routes';
// import { InitI18n } from './i18n';
import { loadPackages } from './packages';
import { InitTranslations } from './translations';

export async function init() {
    getSteedosSchema();
    WebAppInternals.setInlineScriptsAllowed(false);
    initPublicStaticRouter();
    initPublic();
    initDesignSystem();
    Plugins.init();
    Datasources.loadFiles();
    loadPackages();
    initCreator();
    await Datasources.init();
    await migrate.init();
    InitTranslations();
    Core.run();
}

export * from './collection';