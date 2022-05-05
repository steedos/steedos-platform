/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-05-03 19:46:49
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-05-05 16:43:53
 * @Description: 
 */
const objectql = require('@steedos/objectql');
const { encrypt, decrypt } = require('../helpers/manualEncryption.js');
const _ = require('lodash');
const { Binary } = require('mongodb');

/**
 * 获取需要加密的字段
 * @param {*} objectName 
 * @returns 
 */
async function getRequireEncryptionFields(objectName) {
    const objFields = await objectql.getObject(objectName).getFields();
    const requireEncryptionFields = {};
    // 遍历所有字段，整理出要求加密的字段
    for (const key in objFields) {
        if (Object.hasOwnProperty.call(objFields, key)) {
            const field = objFields[key];
            if (field.enable_encryption) {
                requireEncryptionFields[key] = field;
            }
        }
    }
    return requireEncryptionFields;
}
/**
 * 加密字段值
 * @param {*} objectName 
 * @param {*} doc 
 */
async function encryptFieldValue(objectName, doc) {
    try {
        const requireEncryptionFields = await getRequireEncryptionFields(objectName);
        for (const key in requireEncryptionFields) {
            if (Object.hasOwnProperty.call(requireEncryptionFields, key)) {
                const field = requireEncryptionFields[key];
                // 判断是加密字段并且值不为空
                if (field.enable_encryption && _.has(doc, key) && doc[key]) {
                    doc[key] = await encrypt(doc[key]);
                }
            }
        }
    } catch (error) {
        console.error(`[字段级加密] 对象${objectName}中字段加密失败：`, error);
    }
}
/**
 * 解密字段值
 * @param {*} objectName 
 * @param {*} docs 
 */
async function decryptFieldValue(objectName, docs) {
    try {
        const requireEncryptionFields = await getRequireEncryptionFields(objectName);
        const _decrypt = async function (doc) {
            for (const key in requireEncryptionFields) {
                if (Object.hasOwnProperty.call(requireEncryptionFields, key)) {
                    const field = requireEncryptionFields[key];
                    // 判断是加密字段并且值是BinData类型
                    if (field.enable_encryption && _.has(doc, key) && doc[key] && doc[key].buffer) {
                        /** 
                         * 转为Binary格式后再解密
                         * 由于meteor对象和自定义对象的aggregate和findOne方法返回的结果中加密字段中的buffer格式不一致，故此处需要单独解析
                         * 
                         * meteor对象，如space_users中的test加密字段:
                         * aggregate: { 
                         *  buffer:
                         *     _bsontype: "Binary'
                         *     buffer: Buffer
                         *     position: 
                         *     sub_type: 0
                         *  position: 
                         *  sub_type: 6
                         * }
                         * findOne: { 
                         *  _bsontype: "Binary'
                         *  buffer: Buffer
                         *  position: 
                         *  sub_type: 6
                         * }
                         * 
                         * 自定义对象，如test对象中的test加密字段:
                         * aggregate: { 
                         *  _bsontype: "Binary'
                         *  buffer: Buffer
                         *  position: 
                         *  sub_type: 6
                         * }
                         * findOne: { 
                         *  buffer: Unit8Array
                         *  position: 
                         *  sub_type: 6
                         * }
                         * 
                         */
                        let buffer = doc[key].buffer; // 获取自定义对象加密字段的buffer，包含了 自定义对象的aggregate、findOne和meteor对象的findOne
                        if (buffer._bsontype === 'Binary') {
                            buffer = buffer.buffer;
                        }
                        doc[key] = await decrypt(new Binary(buffer, Binary.SUBTYPE_ENCRYPTED));
                    }
                }
            }
        }
        // 多条记录
        if (_.isArray(docs)) {
            for (const doc of docs) {
                await _decrypt(doc);
            }
        }
        // 单条记录
        if (_.isObject(docs)) {
            await _decrypt(docs);
        }
    } catch (error) {
        console.error(`[字段级解密] 对象${objectName}中字段解密失败：`, error);
    }
}

module.exports = {
    getRequireEncryptionFields,
    encryptFieldValue,
    decryptFieldValue
}