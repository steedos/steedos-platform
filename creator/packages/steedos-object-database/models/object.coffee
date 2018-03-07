Creator.Objects.objects = 
	name: "objects"
	label: "对象"
	icon: "orders"
	fields:
		name: 
			label: "Name"
			type: "text"
			searchable:true
			index:true
		label:
			type: "text"
		icon: 
			label: "Icon"
			type: "text"
		description: 
			label: "Description"
			type: "text"
		fields:
			blackbox: true
			omit: true
		list_views:
			blackbox: true
			omit: true
		actions:
			blackbox: true
			omit: true
		permission_set:
			blackbox: true
			omit: true


	list_views:
		default:
			columns: ["name", "description", "modified"]
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
		"before.update.server.objects":
			on: "server"
			when: "before.update"
			todo: (userId, doc, fieldNames, modifier, options)->
				if modifier?.$set?.name && doc.name != modifier.$set.name
					console.log "不能修改name"
					throw new Meteor.Error "不能修改name"

		"after.insert.server.objects":
			on: "server"
			when: "after.insert"
			todo: (userId, doc)->
				Creator.getCollection("object_fields").insert({object: doc._id, name: "name", space: doc.space, type: "text", required: true, index: true})