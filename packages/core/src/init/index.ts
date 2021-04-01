// import { Datasources } from './datasources'
import { Core, initCreator, initDesignSystem, initPublic } from './core'
import { Plugins } from './plugins';
import { getSteedosSchema } from '@steedos/objectql';
import * as migrate from '@steedos/migrate';
import { initPublicStaticRouter } from '../routes';
// import { InitI18n } from './i18n';
import { loadPackages } from './packages';
import { InitTranslations } from './translations';
import { wrapAsync } from '@steedos/objectql';
export async function init() {
    getSteedosSchema();
    WebAppInternals.setInlineScriptsAllowed(false);
    initPublicStaticRouter();
    initPublic();
    initDesignSystem();
    wrapAsync(async ()=>{
        await Plugins.init(this)
    }, {});
    // Datasources.loadFiles();
    wrapAsync(()=>{
        loadPackages()
    }, {});
    await initCreator(); //此行代码之前不能出现await
    // await Datasources.init();
    await migrate.init();
    await InitTranslations();
    Core.run();
}
export * from './translations'; 
export * from './collection';