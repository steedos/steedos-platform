/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-06-23 15:17:20
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-06-23 18:55:36
 * @Description: 
 */
const objectql = require('@steedos/objectql')

/**
 * 对象开启字段级加密功能时校验许可证，是否是企业版，如不是企业版则提示
 * @param {string} spaceId 工作区ID/魔方ID
 */
async function checkIsEnterprise(triggerContext) {
    const { doc, spaceId } = triggerContext;
    if (doc.enable_encryption) {
        const allow = await objectql.isPlatformEnterPrise(spaceId)
        if (!allow) {
            throw new Error(`请购买企业版许可证，以使用字段加密功能。`);
        }
    }
}

module.exports = {
    listenTo: "object_fields",

    beforeInsert: async function () {
        await checkIsEnterprise(this)
    },

    beforeUpdate: async function () {
        await checkIsEnterprise(this)
    },

}