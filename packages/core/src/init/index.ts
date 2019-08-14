import { Datasources } from './datasources'
import { LoadFiles } from './loadFiles'
import { Core } from './core'
import { Plugins } from './plugins';

export function init() {
    LoadFiles.run();
    Datasources.create();
    Plugins.init();
    Datasources.init();
    Core.run();
}