const objectService = require('../services/objectService');

export async function CreateObjectService(broker, serviceName, objectConfig){
    return await broker.createService({
        name: serviceName,
        mixins: [objectService],
        settings: {
            objectConfig: objectConfig
        }
    })
}