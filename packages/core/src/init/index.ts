import { Datasources } from './datasources'
import { LoadFiles } from './loadFiles'
import { Core } from './core'
import { Plugins } from './plugins';

export function init() {
    LoadFiles.initStandardObjects();
    Datasources.create();
    Plugins.init();
    LoadFiles.initProjectObjects()
    Core.run();
    Datasources.init();
}