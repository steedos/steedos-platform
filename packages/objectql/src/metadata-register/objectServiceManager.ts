import { SteedosObjectType } from '../types/object';
import { getDataSource } from '../types/datasource';

export function getObjectServiceMethodsSchema(objectConfig){
    const object = new SteedosObjectType(objectConfig.name, getDataSource(objectConfig.datasource), objectConfig);
    const methods: any = {};
    methods.find = {
        async handler(query, userSession) {
            return await object.find(query, userSession)
        }
    }
    return methods;
}

export function getObjectServiceActionsSchema(objectConfig){
    const actions: any = {};
    actions.find = {
        async handler(ctx) {
            const userSession = null;  //TODO userSession
            return this.find(ctx.params.query, userSession)
        }
    }
    return actions;
}

export function getObjectServiceSchema(serviceName, objectConfig){
    return {
        name: serviceName,
        actions: getObjectServiceActionsSchema(objectConfig),
        methods: getObjectServiceMethodsSchema(objectConfig)
    }
}

export function CreateObjectService(broker, serviceName, objectConfig){
    return broker.createService(getObjectServiceSchema(serviceName, objectConfig))
}