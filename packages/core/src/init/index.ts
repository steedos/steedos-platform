import { Datasources } from './datasources'
import { Core, initCreator, initDesignSystem } from './core'
import { Plugins } from './plugins';
import { getSteedosSchema } from '@steedos/objectql';
import * as migrate from '@steedos/migrate';
import { initPublicStaticRouter } from '../routes';
import { InitI18n } from './i18n';
import { initObjectFieldsFormulas } from '@steedos/objectql';

export async function init() {
    getSteedosSchema();
    WebAppInternals.setInlineScriptsAllowed(false);
    initDesignSystem();
    initPublicStaticRouter();
    Plugins.init();
    Datasources.loadFiles();
    initObjectFieldsFormulas();
    initCreator();
    await Datasources.init();
    await migrate.init();
    InitI18n();
    Core.run();
}

export * from './collection';