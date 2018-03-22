#TODO object的name不能重复，需要考虑到系统表
isRepeatedName = (doc)->
	other = Creator.getCollection("objects").find({_id: {$ne: doc._id}, name: doc.name}, {fields:{_id: 1}})
	if other.count() > 0
		return true
	return false

Creator.Objects.objects =
	name: "objects"
	icon: "orders"
	fields:
		name:
			type: "text"
			searchable:true
			index:true
			required: true
			regEx: SimpleSchema.RegEx.code
		label:
			type: "text"
		icon:
			type: "text"
		is_view:
			type: 'boolean'
		is_enable:
			type: "boolean"
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
		triggers:
			blackbox: true
			omit: true

	list_views:
		default:
			columns: ["name", "label", "icon", "is_enable", "description", "modified"]
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
		"before.insert.server.objects":
			on: "server"
			when: "before.insert"
			todo: (userId, doc)->
				if isRepeatedName(doc)
					throw new Meteor.Error 500, "对象名称不能重复"

		"before.update.server.objects":
			on: "server"
			when: "before.update"
			todo: (userId, doc)->
				if isRepeatedName(doc)
					throw new Meteor.Error 500, "对象名称不能重复"

		"before.update.server.objects":
			on: "server"
			when: "before.update"
			todo: (userId, doc, fieldNames, modifier, options)->
				if modifier?.$set?.name && doc.name != modifier.$set.name
					console.log "不能修改name"
					throw new Meteor.Error 500, "不能修改name"

		"after.insert.server.objects":
			on: "server"
			when: "after.insert"
			todo: (userId, doc)->
				#新增object时，默认新建一个name字段
				Creator.getCollection("object_fields").insert({object: doc._id, owner: userId, name: "name", space: doc.space, type: "text", required: true, index: true, searchable: true})
				Creator.getCollection("object_listviews").insert({name: "all", space: doc.space, owner: userId, object_name: doc.name, shared: true, filter_scope: "space", columns: ["name"], is_default: true})
				Creator.getCollection("object_listviews").insert({name: "recent", space: doc.space, owner: userId, object_name: doc.name, shared: true, filter_scope: "space", columns: ["name"]})

		"before.remove.server.objects":
			on: "server"
			when: "before.remove"
			todo: (userId, doc)->
				object_collections = Creator.getCollection(doc.name)

				documents = object_collections.find({},{fields: {_id: 1}})

				if documents.count() > 0
					throw new Meteor.Error 500, "对象中已经有记录，请先删除记录后， 再删除此对象"

		"after.remove.server.objects":
			on: "server"
			when: "after.remove"
			todo: (userId, doc)->
				#删除object 后，自动删除fields、actions、triggers、permission_objects
				Creator.getCollection("object_fields").direct.remove({object: doc._id})

				Creator.getCollection("object_actions").direct.remove({object: doc._id})

				Creator.getCollection("object_triggers").direct.remove({object: doc._id})

				Creator.getCollection("permission_objects").direct.remove({object_name: doc.name})

				Creator.getCollection("object_listviews").direct.remove({space: doc.space, object_name: doc.name, is_default: true, owner: userId, shared: true, filter_scope: "space"})

				#drop collection
				console.log "drop collection", doc.name
				Creator.getCollection(doc.name)._collection.dropCollection()
#
#				Creator.getCollection(doc.name).rawCollection().drop (err, client)->
#					Creator.removeCollection(doc.name)