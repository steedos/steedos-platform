import { createAction } from './base';
export var PLUGIN_INSTANCE_RECEIVED_ACTION = 'PLUGIN_INSTANCE_RECEIVED';
export var PLUGIN_COMPONENT_RECEIVED_ACTION = 'PLUGIN_COMPONENT_RECEIVED';

export function receivePluginInstance(name: string, instance: any) {
    return createAction(PLUGIN_INSTANCE_RECEIVED_ACTION, 'received', { name, instance }, null)
}

export function receivePluginComponent(name: string, data: any) {
    return createAction(PLUGIN_COMPONENT_RECEIVED_ACTION, 'received', { name, data }, null)
}
