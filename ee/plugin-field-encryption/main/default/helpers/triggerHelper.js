/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-05-03 19:46:49
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2023-05-06 16:28:41
 * @Description: 
 */
const objectql = require('@steedos/objectql');
const _ = require('lodash');
const {
    NEED_CONFIG_MASTER_KEY,
    NEED_PLATFORM_ENTERPRISE
} = require('./consts')
const { isPlatformEnterPrise } = require('@steedos/license')

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
                // 判断是加密字段并且值不为空，且还未加密过
                if (field.enable_encryption && _.has(doc, key) && doc[key] && !doc[key].buffer && !doc[key].sub_type) {
                    doc[key] = await datasource.adapter.encryptValue(doc[key]);
                }
            }
        }
    } catch (error) {
        console.error(`[字段级加密] 对象${objectName}中字段加密失败：`, error);
    }
}

/**
 * 对象开启字段级加密功能时校验许可证，是否是企业版，如不是企业版则提示
 * @param {string} spaceId 工作区ID/魔方ID
 */
async function checkIsEnterprise(triggerContext) {
    const { doc, spaceId } = triggerContext;
    if (doc.enable_encryption) {
        const allow = await isPlatformEnterPrise(spaceId)
        if (!allow) {
            throw new Error(NEED_PLATFORM_ENTERPRISE);
        }
    }
}

/**
 * 检查依赖的环境变量是否配置
 */
function checkMasterKey(triggerContext) {
    const { doc } = triggerContext;
    if (doc.enable_encryption) {
        if (!process.env.STEEDOS_CSFLE_MASTER_KEY) {
            throw new Error(NEED_CONFIG_MASTER_KEY)
        }
    }
}

module.exports = {
    getRequireEncryptionFields,
    encryptFieldValue,
    checkIsEnterprise,
    checkMasterKey
}