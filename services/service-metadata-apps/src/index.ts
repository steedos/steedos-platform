import * as _ from 'lodash';
export const METADATA_TYPE = 'apps';

export async function getServiceAppConfig(ctx, serviceName, appApiName) {
    const metadataType = METADATA_TYPE;
    const metadataConfig = await ctx.broker.call(`metadata.getServiceMetadata`, {
        serviceName,
        metadataType,
        metadataApiName: appApiName
    }, {meta: ctx.meta})
    return metadataConfig?.metadata;
}

async function getServicesAppConfigs(ctx, appApiName) {
    const serviceName = '*';
    const metadataType = METADATA_TYPE;
    const configs = await ctx.broker.call(`metadata.getServiceMetadatas`, {
        serviceName,
        metadataType,
        metadataApiName: appApiName
    }, {meta: ctx.meta})
    return _.map(_.orderBy(configs, 'timestamp'), 'metadata');
}

export async function refreshApp(ctx, appApiName) {
    let appConfig: any = {};

    const appConfigs = await getServicesAppConfigs(ctx, appApiName);

    if(appConfigs.length == 0){
        return null
    }

    appConfig = _.defaultsDeep({}, ..._.reverse(appConfigs), appConfig)

    return appConfig;
}
