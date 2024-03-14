/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2024-03-08 16:43:23
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2024-03-08 16:44:28
 * @Description: 
 */
module.exports = {
    handler: async function (ctx) {
        const { organizations, spaceInfo, idFieldName, parentFieldName } = ctx.params;
        return await this.upsetOrgs(organizations, spaceInfo, idFieldName, parentFieldName)
    }
}