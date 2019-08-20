import { Datasources } from './datasources'
import { LoadFiles } from './loadFiles'
import { Core } from './core'
import { Plugins } from './plugins';

export async function init() {
    LoadFiles.initStandardObjects();
    Datasources.create();
    Plugins.init();
    LoadFiles.initProjectObjects()
    Core.load();
    await Datasources.init();
    Core.run();
}