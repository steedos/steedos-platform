import { SteedosObjectType } from '../types/object';
import { getDataSource } from '../types/datasource';

export function getObjectServiceActionsSchema(objectConfig){
    const object = new SteedosObjectType(objectConfig.name, getDataSource(objectConfig.datasource), objectConfig);
    const actions: any = {};

    actions.find = {
        async handler(ctx) {
            const userSession = null;  //TODO userSession
            return await object.find(ctx.params.query, userSession)
        }
    }

    return actions;
}

export function getObjectServiceSchema(serviceName, objectConfig){
    return {
        name: serviceName,
        actions: getObjectServiceActionsSchema(objectConfig)
    }
}

export function CreateObjectService(broker, serviceName, objectConfig){
    return broker.createService(getObjectServiceSchema(serviceName, objectConfig))
}