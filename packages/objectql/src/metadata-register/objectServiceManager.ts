const objectService = require('../services/objectService');

export function CreateObjectService(broker, serviceName, objectConfig){
    return broker.createService({
        name: serviceName,
        mixins: [objectService],
        settings: {
            objectConfig: objectConfig
        }
    })
}