const objectService = require('../services/objectService');

export async function createObjectService(broker, serviceName, objectConfig) {
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
    return
}