/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-05-03 11:42:42
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-05-04 16:52:55
 * @Description: 
 */

const { MongoClient } = require('mongodb');
const { ClientEncryption } = require("mongodb-client-encryption");
const { connectionString, keyVaultNamespace, getKMSProviders, altKeyName } = require('./sharedconst.js');

// 加密
async function encrypt(fieldValue) {
    const kmsProvider = await getKMSProviders()

    const csfleDatabaseConnection = new MongoClient(connectionString, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        monitorCommands: true,
        autoEncryption: {
            keyVaultNamespace: keyVaultNamespace,
            kmsProviders: kmsProvider,
            bypassAutoEncryption: true,
        }
    });
    await csfleDatabaseConnection.connect()

    const encryption = new ClientEncryption(csfleDatabaseConnection, {
        keyVaultNamespace: keyVaultNamespace,
        kmsProviders: kmsProvider,
    });

    const encryptedCreditCard = await encryption.encrypt(
        fieldValue,
        {
            keyAltName: altKeyName,
            algorithm: 'AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic'
        }
    )
    // console.log(encryptedCreditCard)
    await csfleDatabaseConnection.close()
    return encryptedCreditCard;
}

// 解密
async function decrypt(fieldValue) {
    const kmsProvider = await getKMSProviders()

    const csfleDatabaseConnection = new MongoClient(connectionString, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        monitorCommands: true,
        autoEncryption: {
            keyVaultNamespace: keyVaultNamespace,
            kmsProviders: kmsProvider,
            bypassAutoEncryption: true,
        }
    });
    await csfleDatabaseConnection.connect()

    const encryption = new ClientEncryption(csfleDatabaseConnection, {
        keyVaultNamespace: keyVaultNamespace,
        kmsProviders: kmsProvider,
    });

    const decryptedCreditCard = await encryption.decrypt(
        fieldValue
    )
    // console.log(decryptedCreditCard)
    await csfleDatabaseConnection.close()
    return decryptedCreditCard;
}

module.exports = {
    encrypt,
    decrypt
}