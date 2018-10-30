Creator.Objects.user_star =
	name: "user_star"
	label: "收藏"
	icon: "apps"
	fields:
		user:
			label: "用户"
			type: "lookup"
			reference_to: "users"
			index:true
		# 暂时有space及post两个表中有用到该功能
		related_to:
			type: "lookup"
			label:"记录"
			omit: true
			is_name: true
			reference_to: ()->
				return _.keys(Creator.Objects)
	list_views:
		all:
			label:"全部"
			columns: ["user", "star_space", "star_post"]
			filter_scope: "space"
	triggers:
		"after.insert.server.user_star":
			on: "server"
			when: "after.insert"
			todo: (userId, doc)->
				object_name = doc.related_to?.o
				_id = doc.related_to?.ids[0]
				if object_name and _id
					Creator.getCollection(object_name).direct.update({_id: _id}, {$inc: {star_count: 1}})

		"after.remove.server.user_star":
			on: "server"
			when: "after.remove"
			todo: (userId, doc)->
				object_name = doc.related_to?.o
				_id = doc.related_to?.ids[0]
				if object_name and _id
					Creator.getCollection(object_name).direct.update({_id: _id}, {$inc: {star_count: -1}})

	permission_set:
		user:
			allowCreate: true
			allowDelete: true
			allowEdit: false
			allowRead: true
			modifyAllRecords: false
			viewAllRecords: false
		admin:
			allowCreate: true
			allowDelete: true
			allowEdit: false
			allowRead: true
			modifyAllRecords: false
			viewAllRecords: false
		member:
			allowCreate: true
			allowDelete: true
			allowEdit: false
			allowRead: true
			modifyAllRecords: false
			viewAllRecords: false
		guest:
			allowCreate: true
			allowDelete: true
			allowEdit: false
			allowRead: true
			modifyAllRecords: false
			viewAllRecords: false