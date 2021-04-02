// import { Datasources } from './datasources'
import { Core, initCreator, initDesignSystem, initPublic } from './core'
import { Plugins } from './plugins';
import { getSteedosSchema } from '@steedos/objectql';
import * as migrate from '@steedos/migrate';
import { initPublicStaticRouter } from '../routes';
// import { InitI18n } from './i18n';
import { loadPackages } from './packages';
import { InitTranslations } from './translations';
const Future = require('fibers/future');
export async function init(settings) {
    getSteedosSchema();
    WebAppInternals.setInlineScriptsAllowed(false);
    initPublicStaticRouter();
    initPublic();
    initDesignSystem();
    Future.fromPromise(Plugins.init(settings)).wait();
    console.log(`18--------------------`);
    // Datasources.loadFiles();
    Future.fromPromise(loadPackages()).wait();
    initCreator(); //此行代码之前不能出现await
    // await Datasources.init();
    await migrate.init();
    await InitTranslations();
    Core.run();
}
export * from './translations'; 
export * from './collection';