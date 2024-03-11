module.exports = {
    handler: async function (ctx) {
        const { spaceUsers, spaceInfo, idFieldName, orgIdFieldName } = ctx.params;
        return await this.upsetSpaceUsers(spaceUsers, spaceInfo, idFieldName, orgIdFieldName)
    }
}