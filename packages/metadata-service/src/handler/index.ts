export function getMetadata(ctx, config){
    return {
        nodeID: ctx.nodeID,
        service: ctx.service, 
        metadata: config
    }
}

export class Cacher{
    constructor(){
        
    }
}