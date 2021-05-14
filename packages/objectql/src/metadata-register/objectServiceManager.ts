import * as _ from 'underscore';
const objectService = require('../services/objectService');

const LocalObjectServices = [];
export async function createObjectService(broker, serviceName, objectConfig) {
    if(_.include(LocalObjectServices, serviceName)){
        return ;
    }
    let service = broker.createService({
        name: serviceName,
        mixins: [objectService],
        settings: {
            objectConfig: objectConfig
        }
    })
    if (!broker.started) { //如果broker未启动则手动启动service
        await broker._restartService(service)
    }
    LocalObjectServices.push(serviceName);
    return
}