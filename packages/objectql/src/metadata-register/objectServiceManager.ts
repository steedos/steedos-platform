export function CreateObjectService(broker, objectConfig){
    console.log('CreateObjectService', `#${objectConfig.name}`);
    return broker.createService({
        name: `#${objectConfig.name}`,
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