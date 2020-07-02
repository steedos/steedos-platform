Meteor.publish "creator_objects", (space)->
	#TODO 根据权限返回Objects记录
	Creator.getCollection("objects").find({space: {$in: [null, space]}}, {fields: {_id: 1, modified: 1}})