import * as _ from 'lodash';
import { METADATA_TYPE } from '..';

export async function getServicePermissionsetConfig(ctx, serviceName, permissionsetApiName) {
    const metadataType = METADATA_TYPE;
    const metadataConfig = await ctx.broker.call(`metadata.getServiceMetadata`, {
        serviceName,
        metadataType,
        metadataApiName: permissionsetApiName
    }, {meta: ctx.meta})
    return metadataConfig?.metadata;
}

async function getServicesPermissionsetConfigs(ctx, permissionsetApiName) {
    const serviceName = '*';
    const metadataType = METADATA_TYPE;
    const configs = await ctx.broker.call(`metadata.getServiceMetadatas`, {
        serviceName,
        metadataType,
        metadataApiName: permissionsetApiName
    }, {meta: ctx.meta})
    return _.map(configs, 'metadata');
}

export async function refreshPermissionset(ctx, permissionsetApiName) {
    let permissionsetConfig: any = {};

    const permissionsetConfigs = await getServicesPermissionsetConfigs(ctx, permissionsetApiName);

    if(permissionsetConfigs.length == 0){
        return null
    }

    permissionsetConfig = _.defaultsDeep({}, ..._.reverse(permissionsetConfigs), permissionsetConfig)

    return permissionsetConfig;
}
