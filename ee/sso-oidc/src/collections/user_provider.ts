/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-06-29 10:48:48
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-06-29 18:09:45
 * @Description: 
 */

import { getObject } from '@steedos/objectql';
import { getTenantId } from '../context';


export class UserProvider {
    static async link(user){
        const { thirdPartyUser, _id } = user;
        const { params } = thirdPartyUser; 
        const collection = getObject('user_providers');
        const record = await UserProvider.findByProvider(thirdPartyUser);
        if(record){
            return await collection.update(record._id, {
                access_token: thirdPartyUser.oauth2?.accessToken,
                refresh_token: thirdPartyUser.oauth2?.refreshToken,
                expires_in: params?.expires_in,
                refresh_expires_in: params?.refresh_expires_in,
                provider_user_id: thirdPartyUser.userId, 
                id_token: thirdPartyUser.idToken,
                oauth_token: null, 
                oauth_token_secret: null,
                session_state: params?.session_state,
                scope: params?.scope,
                token_type: params?.token_type,
                updated: new Date(),
                space: getTenantId(),
            });
        }else{
            return await collection.insert({
                user: _id,
                provider: thirdPartyUser.providerType, // thirdPartyUser.provider,
                type: 'oauth', // thirdPartyUser.providerType
                access_token: thirdPartyUser.oauth2?.accessToken,
                refresh_token: thirdPartyUser.oauth2?.refreshToken,
                expires_in: params?.expires_in,
                refresh_expires_in: params?.refresh_expires_in,
                provider_user_id: thirdPartyUser.userId, 
                id_token: thirdPartyUser.idToken,
                oauth_token: null, 
                oauth_token_secret: null,
                session_state: params?.session_state,
                scope: params?.scope,
                token_type: params?.token_type,
                created: new Date(),
                updated: new Date(),
                space: getTenantId(),
            })
        }
    }

    static async findByProvider(thirdPartyUser){
        const collection = getObject('user_providers');
        const records = await collection.find({filters: [[
            'provider', '=', thirdPartyUser.providerType,
            'user', '=', thirdPartyUser.userId
        ]]});

        if(records.length > 0){
            return records[0];
        }else{
            return null;
        }
    }
}