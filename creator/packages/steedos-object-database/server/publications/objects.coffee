objectql = require("@steedos/objectql");
Meteor.publish "creator_objects", (space)->
	#TODO 根据权限返回Objects记录
	config = objectql.getSteedosConfig();
	if config.tenant && config.tenant.saas
		return
	Creator.getCollection("objects").find({space: {$in: [null, space]}, is_deleted: {$ne: true}}, {fields: {_id: 1, modified: 1, is_enable: 1, in_development: 1}})