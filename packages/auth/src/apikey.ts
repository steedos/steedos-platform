import { getObject, SteedosError } from '@steedos/objectql';

const HEADER_AUTH = 'Authorization';
const AUTH_TYPE = 'Bearer';

export function isAPIKey(token) {
    return token.startsWith('apikey,')
}

export async function verifyAPIKey(token) {
    if (isAPIKey(token)) {
        const apikey = token.replace('apikey,', '');
        const records = await getObject('api_keys').find({ filters: [['api_key', '=', apikey], ['active', '=', true]] });
        if (records.length > 0) {
            const record = records[0];
            await getObject('api_keys').update(record._id, { last_use_time: new Date() });
            return { userId: record.owner, spaceId: record.space };
        }
    }
}

export async function getAPIKey(spaceId) {
    const space = await getObject('spaces').findOne(spaceId, {});
    if (space) {
        return space.api_key;
    }
}

export async function getAPIKeyAuthHeader(spaceId) {
    const api_key = await getAPIKey(spaceId);
    if (!api_key) {
        throw new SteedosError('space_apikey_notfind');
    }else{
        return {[HEADER_AUTH]: `${AUTH_TYPE} apikey,${api_key}`};
    }
}