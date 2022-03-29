// import { Datasources } from './datasources'
import { Core, initCreator, initDesignSystem } from './core'
import { Plugins } from './plugins';
import { getSteedosSchema } from '@steedos/objectql';
import * as migrate from '@steedos/migrate';
import { initPublicStaticRouter } from '../routes';
// import { InitI18n } from './i18n';
// import { loadPackages } from './packages';
import { InitTranslations } from './translations';
export { loadClientScripts, loadRouters, removeRouter } from './core'
export { loadPackage } from './packages'
export async function init(settings: any = {}) {
    getSteedosSchema();
    WebAppInternals.setInlineScriptsAllowed(false);
    initPublicStaticRouter();
    initDesignSystem();
    await Plugins.init(settings);
    // Datasources.loadFiles();
    // await loadPackages();
    await initCreator();
    // await Datasources.init();
    await migrate.init();
    await InitTranslations();
    Core.run();
}
export * from './translations';
export * from './collection';