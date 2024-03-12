/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-03-28 09:35:35
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2024-02-23 10:13:41
 * @Description: 
 */
import * as _ from 'lodash';
export const METADATA_TYPE = 'tabs';

export async function getServiceConfig(ctx, serviceName, apiName) {
    const metadataType = METADATA_TYPE;
    const metadataConfig = await ctx.broker.call(`metadata.getServiceMetadata`, {
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
    return _.map(_.orderBy(configs, 'timestamp'), 'metadata');
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
