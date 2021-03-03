// import { addFormulaMetadata } from './formula';
import { FormulaActionHandler } from './formula/formulaActionHandler';
export type SObject = {
    name: string,
    [x: string]: any
}

export type MetadataObject = {
    nodeID: [string],
    service: {
        name: string,
        version: string | undefined,
        fullName: string
    }, 
    metadata: SObject
}

function cacherKey(APIName: string): string{
    return `$steedos.#objects.${APIName}`
}

export const ActionHandlers = {
    async get(ctx: any): Promise<MetadataObject> {
        return await ctx.broker.call('metadata.get', {key: cacherKey(ctx.params.objectApiName)}, {meta: ctx.meta})
    },
    async add(ctx: any): Promise<boolean>{
        const formulaActionHandler = new FormulaActionHandler(ctx.broker);
        // if(formulaActionHandler){}
        await formulaActionHandler.addFormulaMetadata(ctx.params.data, ctx.params.data.datasource)
        const res = await ctx.broker.call('metadata.add', {key: cacherKey(ctx.params.data.name), data: ctx.params.data}, {meta: ctx.meta})
        return res;
    },
    async change(ctx: any): Promise<boolean> {
        const {data, oldData} = ctx.params;
        if(oldData.name != data.name){
            await ctx.broker.call('metadata.delete', {key: cacherKey(oldData.name)})
        }
        return await ctx.broker.call('metadata.add', {key: cacherKey(data.name), data: data}, {meta: ctx.meta})
    },
    async delete(ctx: any): Promise<boolean>{
        return await ctx.broker.call('metadata.delete', {key: cacherKey(ctx.params.objectApiName)}, {meta: ctx.meta})
    },
    async verify(ctx: any): Promise<boolean>{
        console.log("verify");
        return true;
    }
}