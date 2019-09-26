import { Datasources } from './datasources'
import { LoadFiles } from './loadFiles'
import { Core } from './core'
import { Plugins } from './plugins';
import * as migrate from '@steedos/migrate';

export async function init() {
    Core.createBaseObject()
    LoadFiles.initStandardObjects();
    Core.addStaticJs()
    Datasources.create();
    Plugins.init();
    LoadFiles.initProjectObjects()
    Core.load();
    await Datasources.init();
    await migrate.init();
    Core.run();
}