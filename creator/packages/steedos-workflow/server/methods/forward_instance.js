/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2021-05-24 12:32:56
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-12-22 15:18:38
 * @Description: 
 */
const { workflowMethods } = require('@steedos/workflow')
Meteor.methods({
	// 改为通过api调用
	forward_instance: function (instance_id, space_id, flow_id, hasSaveInstanceToAttachment, description, isForwardAttachments, selectedUsers, action_type, related, from_approve_id) {
		if (!this.userId)
			throw new Meteor.Error('not-authorized');

		return;
	},


	forward_remove: function (instance_id, trace_id, approve_id) {
		return workflowMethods.forward_remove.apply(this, arguments)
	},

	cancelDistribute: function (instance_id, approve_ids) {
		return workflowMethods.cancelDistribute.apply(this, arguments)
	}


})