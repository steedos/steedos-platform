/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2021-05-24 12:32:56
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-12-22 15:18:59
 * @Description: 
 */
const { workflowMethods } = require('@steedos/workflow')
Meteor.methods({

	get_instance_data: function (instance_id, formCached, flowCached) {
		return workflowMethods.get_instance_data.apply(this, arguments)
	}

});
