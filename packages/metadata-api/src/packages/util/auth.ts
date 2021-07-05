import { getAPIKeyAuthHeader } from '@steedos/auth';

export const STEEDOS_DEVELOPER_SERVER = 'https://huayan.my.steedos.com:8443/';
export async function getAuthHeader(spaceId){
    return await getAPIKeyAuthHeader(spaceId);
}

export function getSteedosDeveloperServer(){
    if(process.env.STEEDOS_DEVELOPER_SERVER){
        return process.env.STEEDOS_DEVELOPER_SERVER;
    }
    return STEEDOS_DEVELOPER_SERVER
}

export function throwError(errorCode){
    if(errorCode === 401){
        throw new Error('api_key_invalid');
    }else{
        throw new Error('steedos_developer_service_exception');
    }
}