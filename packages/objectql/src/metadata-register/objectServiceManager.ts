export function CreateObjectService(broker, serviceName, objectConfig){
    console.log('CreateObjectService', `${serviceName}`);
    return broker.createService({
        name: serviceName,
        actions: {
            find: {
                rest: {
                    method: "GET",
                    path: `/find`
                },
                async handler(ctx) {
                    return `find ${objectConfig.name}`;
                }
            },
            findOne: {
                rest: {
                    method: "GET",
                    path: `/findOne`
                },
                async handler(ctx) {
                    return `findOne ${objectConfig.name}`;
                }
            }
        }
    })
}