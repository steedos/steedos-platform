/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-05-03 19:46:49
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-05-13 14:47:59
 * @Description: 
 */
const objectql = require('@steedos/objectql');
const _ = require('lodash');

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
        const datasource = objectql.getDataSource('default');
        const requireEncryptionFields = await getRequireEncryptionFields(objectName);
        for (const key in requireEncryptionFields) {
            if (Object.hasOwnProperty.call(requireEncryptionFields, key)) {
                const field = requireEncryptionFields[key];
                // 判断是加密字段并且值不为空
                if (field.enable_encryption && _.has(doc, key) && doc[key]) {
                    doc[key] = await datasource.adapter.encryptValue(doc[key]);
                }
            }
        }
    } catch (error) {
        console.error(`[字段级加密] 对象${objectName}中字段加密失败：`, error);
    }
}

module.exports = {
    getRequireEncryptionFields,
    encryptFieldValue
}