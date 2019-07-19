import { Datasources } from './datasources'
import { LoadFiles } from './loadFiles'
import { Core } from './core'
import { Plugins } from './plugins';

export function init() {
    Datasources.init();
    LoadFiles.run()
    Core.run();
    Plugins.init();
}