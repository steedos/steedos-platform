import * as _ from 'underscore';
import { getObjectServiceName } from './index';
import { objectBaseService } from '../services/objectService'

const LocalObjectServices = {};

function onDestroyObjectService(objectApiName) {
    const serviceName = getObjectServiceName(objectApiName);
    delete LocalObjectServices[serviceName]
}

export async function createObjectService(broker, serviceName, objectConfig) {
    if (LocalObjectServices[serviceName]) {
        return;
    }
    let service = broker.createService({
        name: serviceName,
        mixins: [objectBaseService],
        methods:{
            getObjectConfig: ()=>{
                return objectConfig
            },
        },
        settings: {
            // objectConfig: objectConfig,
            onDestroyObjectService,
        },
    })
    if (!broker.started) { //如果broker未启动则手动启动service
        await broker._restartService(service)
    }
    LocalObjectServices[serviceName] = true;
    return
}