/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-06-13 15:12:07
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-11-05 17:17:01
 * @Description: 
 */
import * as _ from 'underscore';
import { getObjectServiceName } from './index';
import { objectBaseService } from '../services/objectService'
// const objectService = require('../services/objectService');

const LocalObjectServices = {};

function onDestroyObjectService(objectApiName) {
    const serviceName = getObjectServiceName(objectApiName);
    delete LocalObjectServices[serviceName]
}

export async function createObjectService(broker, serviceName, objectConfig) {
    if (LocalObjectServices[serviceName]) {
        return;
    }
    if(objectConfig.datasource === 'meteor'){
        let service = broker.createService({
            name: serviceName,
            mixins: [objectBaseService],
            methods:{
                getObjectConfig: ()=>{
                    return objectConfig
                },
            },
            settings: {
                onDestroyObjectService,
            }
        })
        if (!broker.started) { //如果broker未启动则手动启动service
            await broker._restartService(service)
        }
    }else{
        broker.call('objectServiceFactory.createObjectService', {
            serviceName,
            objectConfig
        })
    }

    LocalObjectServices[serviceName] = true;
    return
}