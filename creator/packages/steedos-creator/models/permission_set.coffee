Creator.Objects.permission_set = 
	name: "permission_set"
	label: "权限组"
	icon: "user"
	fields: 
		name:
			label: "名称"
			type: "text",
			searchable:true
			index:true
		users:
			label: "用户"
			type: "lookup"
			reference_to: "users"
			multiple: true
		assigned_apps:
			label: "授权应用"
			type: "lookup"
			reference_to: "apps"
			multiple: true

	list_views:
		default:
			columns: ["name", "users"]
		all:
			filter_scope: "space"

	permission_set:
		user:
			allowCreate: false
			allowDelete: false
			allowEdit: false
			allowRead: false
			modifyAllRecords: false
			viewAllRecords: false 
		admin:
			allowCreate: true
			allowDelete: true
			allowEdit: true
			allowRead: true
			modifyAllRecords: true
			viewAllRecords: true 

	triggers:
		"before.insert.server.check": 
			on: "server"
			when: "before.insert"
			todo: (userId, doc)->
				newName = doc?.name
				if newName and Creator.getCollection("permission_set").findOne({name:newName},{fields:{name:1}})
					throw new Meteor.Error 500, "对象名称不能重复"
				
		"before.update.server.check": 
			on: "server"
			when: "before.update"
			todo: (userId, doc, fieldNames, modifier, options)->
				newName = modifier.$set?.name
				if newName and Creator.getCollection("permission_set").findOne({name:newName,_id:{$ne:doc._id}},{fields:{name:1}})
					throw new Meteor.Error 500, "对象名称不能重复"

					

