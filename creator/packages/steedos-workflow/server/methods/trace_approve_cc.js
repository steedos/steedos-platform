/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2023-01-13 17:35:13
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2023-03-11 10:51:29
 * @Description: 
 */
const { workflowMethods } = require('@steedos/workflow')
Meteor.methods({
	cc_do: function (approve, cc_user_ids, description) {
		return workflowMethods.cc_do.apply(this, arguments)
	},

	cc_read: function (approve) {
		return workflowMethods.cc_read.apply(this, arguments)
	},

	cc_submit: function (ins_id, description, myApprove, ccHasEditPermission) {
		return workflowMethods.cc_submit.apply(this, arguments)
	},

	cc_remove: function (instanceId, approveId) {
		return workflowMethods.cc_remove.apply(this, arguments)
	},

	batch_cancel_cc: function (instance_id, approve_ids) {
		return workflowMethods.batch_cancel_cc.apply(this, arguments)
	},

	cc_save: function (ins_id, description, myApprove, ccHasEditPermission) {
		return workflowMethods.cc_save.apply(this, arguments)
	}
})