/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-05-04 18:57:59
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-05-12 19:04:35
 * @Description: 
 */
const { MongoClient, Binary } = require('mongodb');
const { ClientEncryption } = require("mongodb-client-encryption");
const { connectionString, keyVaultNamespace, getKMSProviders, altKeyName, keyVaultDb, keyVaultCollection } = require('./sharedconst.js');
/**
 * 初始化密钥，如果已经存在，则不再初始化
 */
async function initKey() {
    const client = new MongoClient(connectionString, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    try {
        await client.connect();

        const keyDB = client.db(keyVaultDb);
        const keyColl = keyDB.collection(keyVaultCollection);

        const dataKeyDoc = await keyColl.findOne({
            keyAltNames: altKeyName,
        });

        if (!dataKeyDoc) {
            const kmsProvider = getKMSProviders()

            const encryption = new ClientEncryption(client, {
                keyVaultNamespace: keyVaultNamespace,
                kmsProviders: kmsProvider,
            });

            const key = await encryption.createDataKey("local", {
                keyAltNames: [altKeyName]
            });

            const base64DataKeyId = key.toString("base64");

            const query = {
                _id: new Binary(Buffer.from(base64DataKeyId, "base64"), 4),
            };
            const dataKey = await keyColl.findOne(query);
            if (!dataKey) {
                throw new Error('[CSFLE] Data key init failed.');
            }

            // 设置keyAltNames唯一索引
            await keyColl.createIndex({
                keyAltNames: 1
            }, {
                unique: true
            });

        }

    } finally {
        await client.close();
    }
}

module.exports = {
    initKey
}