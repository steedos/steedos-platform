import * as _ from 'lodash';
export const METADATA_TYPE = 'layouts';

export async function getServiceConfig(ctx, serviceName, apiName) {
    const metadataType = METADATA_TYPE;
    const metadataConfig:any = await ctx.broker.call(`metadata.getServiceMetadata`, {
        serviceName,
        metadataType,
        metadataApiName: apiName
    }, {meta: ctx.meta})
    return metadataConfig?.metadata;
}

async function getServicesConfigs(ctx, apiName) {
    const serviceName = '*';
    const metadataType = METADATA_TYPE;
    const configs = await ctx.broker.call(`metadata.getServiceMetadatas`, {
        serviceName,
        metadataType,
        metadataApiName: apiName
    }, {meta: ctx.meta})
    return _.map(configs, 'metadata');
}

export async function refresh(ctx, apiName) {
    let config: any = {};

    const configs = await getServicesConfigs(ctx, apiName);

    if(configs.length == 0){
        return null
    }

    config = _.defaultsDeep({}, ..._.reverse(configs), config)

    return config;
}
