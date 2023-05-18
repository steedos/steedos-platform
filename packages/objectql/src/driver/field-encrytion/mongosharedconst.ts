/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-05-03 11:37:54
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-05-18 11:30:59
 * @Description: 
 */

import { Binary } from "mongodb";
import { parse } from 'mongodb-uri';
// var MY_LOCAL_KEY = crypto.randomBytes(96).toString('base64')
// 主密钥

export function getMongoFieldEncryptionConsts() {
    const MY_LOCAL_KEY = process.env.STEEDOS_CSFLE_MASTER_KEY;
    const MONGO_URL = process.env.MONGO_URL;
    // 密钥管理服务
    const getKMSProviders = function getKMSProviders() {
        return {
            "local": {
                "key": new Binary(Buffer.from(MY_LOCAL_KEY, "base64"), 0)
            }
        }
    }

    const defaultUriObj = parse(MONGO_URL);
    // 密钥保管库库名
    const keyVaultDb = process.env.STEEDOS_CSFLE_KEY_VAULT_DB || defaultUriObj.database; // 默认当前MONGO_URL的db
    // 密钥保管库表名
    const keyVaultCollection = process.env.STEEDOS_CSFLE_KEY_VAULT_COLLECTION || '__keystore'; // 默认 __keystore
    // 密钥保管库命名空间
    const keyVaultNamespace = `${keyVaultDb}.${keyVaultCollection}`;
    // const connectionString = `mongodb+srv://${USER}:${PWD}@${HOST}/?retryWrites=true&w=majority`;
    // 密钥保管库连接字符串
    const connectionString = process.env.STEEDOS_CSFLE_MONGO_URL || process.env.MONGO_URL; // 默认 MONGO_URL
    // 主密钥别名
    const altKeyName = process.env.STEEDOS_CSFLE_ALT_KEY_NAME || 'steedos'; // 默认 steedos

    return {
        getKMSProviders,
        keyVaultDb,
        keyVaultCollection,
        keyVaultNamespace,
        connectionString,
        altKeyName
    }
}