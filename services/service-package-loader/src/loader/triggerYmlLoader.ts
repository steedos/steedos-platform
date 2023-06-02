/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2023-04-25 16:52:28
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-05-18 09:27:20
 * @Description: 
 */

import { LoadTriggerFile } from '@steedos/metadata-core'
import path = require('path');
import _ = require('lodash');

const loadTriggerFile = new LoadTriggerFile();
function isPatternTrigger(data){
    const {listenTo} = data;
    if(listenTo === '*'){
        return true;
    }else if(_.isArray(listenTo)){
        return true;
    }else if(_.isRegExp(listenTo)){
        return true;
    }else if(_.isString(listenTo) && listenTo.startsWith("/")){
        try {
            if(_.isRegExp(eval(listenTo))){
                return true;
            }
        } catch (error) {
            return false
        }
        return false;
    }
    return false;
}
export async function load(broker: any, packagePath: string, packageServiceName: string) {
    let filePath = path.join(packagePath, "**");
    let triggers: any = loadTriggerFile.load(filePath);
    if (_.isEmpty(triggers)) {
        return;
    }
    for (const apiName in triggers) {
        const trigger = triggers[apiName];
        if(isPatternTrigger(trigger)){
            trigger.isPattern = true
        }
        await broker.call(`object_triggers.add`, { apiName: `${trigger.listenTo}.${trigger.name}`, data: trigger }, {
            meta: {
            metadataServiceName: packageServiceName,
            caller: {
                nodeID: broker.nodeID,
                service: {
                    name: packageServiceName,
                }
            }
        }});
        broker.broadcast('metadata.object_triggers.change', {apiName: `${trigger.listenTo}.${trigger.name}`, listenTo: trigger.listenTo})
    }
}