import { Datasources } from './datasources'
import { Core, initCreator, initDesignSystem } from './core'
import { Plugins } from './plugins';
import { getSteedosSchema } from '@steedos/objectql';
import * as migrate from '@steedos/migrate';
import {initPublicStaticRouter} from '../routes'

export async function init() {
    getSteedosSchema();
    WebAppInternals.setInlineScriptsAllowed(true);
    initDesignSystem()
    Plugins.init();
    initCreator();
    await Datasources.init();
    await migrate.init();
    initPublicStaticRouter();
    Core.run();
}