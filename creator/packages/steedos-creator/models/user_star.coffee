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
		star_space:
			label: "店铺"
			type: "lookup"
			reference_to: "spaces"
		star_post:
			label: "文章"
			type: "lookup"
			reference_to: "post"
			index:true
	list_views:
		all:
			label:"所有"
			columns: ["user", "star_space", "star_post"]
			filter_scope: "space"
	triggers:
		"after.insert.server.user_star":
			on: "server"
			when: "after.insert"
			todo: (userId, doc)->
				if doc.star_space
					object_name = "vip_store"
				else
					object_name = "post"
				_id = doc.star_space || doc.star_post
				obj = Creator.getCollection(object_name).findOne({_id: _id})
				if obj._id
					star_count = obj.star_count || 0
					star_count++
					Creator.getCollection(object_name).direct.update({_id: _id}, {$set: {star_count: star_count}})

		"after.remove.server.user_star":
			on: "server"
			when: "after.remove"
			todo: (userId, doc)->
				if doc.star_space
					object_name = "vip_store"
				else
					object_name = "post"
				_id = doc.star_space || doc.star_post
				obj = Creator.getCollection(object_name).findOne({_id: _id})
				if obj._id
					star_count = obj.star_count || 0
					star_count--
					Creator.getCollection(object_name).direct.update({_id: _id}, {$set: {star_count: star_count}})

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