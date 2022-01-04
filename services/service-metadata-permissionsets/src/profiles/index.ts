import * as _ from 'lodash';
import { PROFILE_METADATA_TYPE } from '..';


export async function getServiceProfileConfig(ctx, serviceName, profileApiName) {
    const metadataType = PROFILE_METADATA_TYPE;
    const metadataConfig = await ctx.broker.call(`metadata.getServiceMetadata`, {
        serviceName,
        metadataType,
        metadataApiName: profileApiName
    }, {meta: ctx.meta})
    return metadataConfig?.metadata;
}

async function getServicesProfileConfigs(ctx, profileApiName) {
    const serviceName = '*';
    const metadataType = PROFILE_METADATA_TYPE;
    const configs = await ctx.broker.call(`metadata.getServiceMetadatas`, {
        serviceName,
        metadataType,
        metadataApiName: profileApiName
    }, {meta: ctx.meta})
    return _.map(configs, 'metadata');
}

export async function refreshProfile(ctx, profileApiName) {
    let profileConfig: any = {};

    const profileConfigs = await getServicesProfileConfigs(ctx, profileApiName);

    if(profileConfigs.length == 0){
        return null
    }

    profileConfig = _.defaultsDeep({}, ..._.reverse(profileConfigs), profileConfig)

    return profileConfig;
}
