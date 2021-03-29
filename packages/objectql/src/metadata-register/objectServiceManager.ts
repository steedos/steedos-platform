const objectService = require('../services/objectService');

export async function createObjectService(broker, serviceName, objectConfig){
    return await broker.createService({
        name: serviceName,
        mixins: [objectService],
        settings: {
            objectConfig: objectConfig
        }
    })
}