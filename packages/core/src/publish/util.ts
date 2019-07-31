const Fiber = require('fibers')
declare var DDP: any;
declare var DDPCommon: any;

export class Util{
    getCollectionMethod(name, target){
        return name.split('.').reduce(function(o, x) {
            return o[x];
        }, target);
    }

    async dbExec(userId, tableName, command, ...args: any[]){
        let collection = Creator.getCollection(tableName);
        let self = this;
        return await new Promise((resolve, reject) => {
            Fiber(function () {
                try {
                    let invocation = new DDPCommon.MethodInvocation({
                        isSimulation: true,
                        userId: userId,
                        connection: null,
                        randomSeed: DDPCommon.makeRpcSeed()
                    })
                    let result = DDP._CurrentInvocation.withValue(invocation, function () {
                        return self.getCollectionMethod(command, collection).apply(collection, args)
                    })
                    resolve(result);
                } catch (error) {
                    reject(error)
                }
            }).run()
        });
    }
}