/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-12-22 14:01:44
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-12-22 14:03:13
 * @Description: 
 */
module.exports = {
    flow_copy: function (spaceId, flowId, options) {
        if (!this.userId) {
            return;
        }
        if (!WorkflowCore.checkCreatePermissions(spaceId, this.userId, options != null ? options.company_id : void 0)) {
            throw Meteor.Error("No permission");
        }
        return db.flows.copy(this.userId, spaceId, flowId, options, false);
    }
};
