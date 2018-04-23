#TODO object的name不能重复，需要考虑到系统表
isRepeatedName = (doc)->
	other = Creator.getCollection("objects").find({_id: {$ne: doc._id}, name: doc.name}, {fields:{_id: 1}})
	if other.count() > 0
		return true
	return false

Creator.Objects.objects =
	name: "objects"
	icon: "orders"
	label: "对象"
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
			type: "lookup"
			optionsFunction: ()->
				options = []
				_.forEach Creator.resources.sldsIcons.standard, (svg)->
					options.push {value: svg, label: svg, icon: svg}
				return options
		is_enable:
			type: "boolean"
			defaultValue: true
		enable_search:
			type: "boolean"
		enable_files:
			type: "boolean"
		enable_tasks:
			type: "boolean"
		enable_notes:
			type: "boolean"
		enable_api:
			type: "boolean"
			defaultValue: true
			hidden: true
		enable_shares:
			type: "boolean"
			defaultValue: false
		is_view:
			type: 'boolean'
			defaultValue: false
			omit: true
		description: 
			label: "Description"
			type: "textarea"
			is_wide: true
		fields:
			blackbox: true
			omit: true
			hidden: true
		list_views:
			blackbox: true
			omit: true
			hidden: true
		actions:
			blackbox: true
			omit: true
			hidden: true
		permission_set:
			blackbox: true
			omit: true
			hidden: true
		triggers:
			blackbox: true
			omit: true
			hidden: true
		custom:
			type: "boolean"
			omit: true
		owner: 
			hidden: true

	list_views:
		default:
			columns: ["name", "label", "is_enable", "modified"]
		all:
			label:"所有对象"
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
				doc.custom = true

		"before.update.server.objects":
			on: "server"
			when: "before.update"
			todo: (userId, doc, fieldNames, modifier, options)->
				if modifier?.$set?.name && doc.name != modifier.$set.name
					console.log "不能修改name"
					throw new Meteor.Error 500, "不能修改name"
				if modifier.$set
					modifier.$set.custom = true

				if modifier.$unset && modifier.$unset.custom
					delete modifier.$unset.custom


		"after.insert.server.objects":
			on: "server"
			when: "after.insert"
			todo: (userId, doc)->
				#新增object时，默认新建一个name字段
				Creator.getCollection("object_fields").insert({object: doc.name, owner: userId, name: "name", space: doc.space, type: "text", required: true, index: true, searchable: true})
				Creator.getCollection("object_listviews").insert({name: "all", space: doc.space, owner: userId, object_name: doc.name, shared: true, filter_scope: "space", columns: ["name"]})
				Creator.getCollection("object_listviews").insert({name: "recent", space: doc.space, owner: userId, object_name: doc.name, shared: true, filter_scope: "space", columns: ["name"]})

		"before.remove.server.objects":
			on: "server"
			when: "before.remove"
			todo: (userId, doc)->
				object_collections = Creator.getCollection(doc.name)

				documents = object_collections.find({},{fields: {_id: 1}})

				if documents.count() > 0
					throw new Meteor.Error 500, "对象(#{doc.name})中已经有记录，请先删除记录后， 再删除此对象"

		"after.remove.server.objects":
			on: "server"
			when: "after.remove"
			todo: (userId, doc)->
				#删除object 后，自动删除fields、actions、triggers、permission_objects
				Creator.getCollection("object_fields").direct.remove({object: doc.name})

				Creator.getCollection("object_actions").direct.remove({object: doc.name})

				Creator.getCollection("object_triggers").direct.remove({object: doc.name})

				Creator.getCollection("permission_objects").direct.remove({object_name: doc.name})

				Creator.getCollection("object_listviews").direct.remove({object_name: doc.name})
				
				#drop collection
				console.log "drop collection", doc.name
				try
					Creator.getCollection(doc.name)._collection.dropCollection()
				catch e
					console.error("#{e.stack}")
					throw new Meteor.Error 500, "对象(#{doc.name})不存在或已被删除"