import { Datasources } from './datasources'
import { Core, initCreator, initDesignSystem } from './core'
import { Plugins } from './plugins';
import { loadStandardObjects } from '@steedos/objectql';
import * as migrate from '@steedos/migrate';

export async function init() {
    initDesignSystem()
    loadStandardObjects();
    Plugins.init();
    initCreator();
    await Datasources.init();
    await migrate.init();
    Core.run();
}