_syncToObject = (doc) ->
	object_actions = Creator.getCollection("object_actions").find({object: doc.object}, {
		fields: {
			created: 0,
			modified: 0,
			owner: 0,
			created_by: 0,
			modified_by: 0
		}
	}).fetch()

	actions = {}

	_.forEach object_actions, (f)->
		actions[f.name] = f

	Creator.getCollection("objects").update({_id: doc.object}, {
		$set:
			actions: actions
	})
isRepeatedName = (doc, name)->
	other = Creator.getCollection("object_actions").find({object: doc.object, _id: {$ne: doc._id}, name: name || doc.name})
	if other.count() > 0
		return true
	return false
Creator.Objects.object_actions =
	name: "object_actions"
	label: "Actions"
	icon: "marketing_actions"
	fields:
		object:
			type: "master_detail"
			reference_to: "objects"
		name:
			label: "Name"
			type: "text"
			searchable:true
			index:true
			regEx: SimpleSchema.RegEx.code
		label:
			type: "text"
		visible:
			type: "boolean"
		on:
			type: "lookup"
			is_wide:true
			optionsFunction: ()->
				[
					{label: "显示在列表右上角", value: "list", icon: "contact_list"}
					{label: "显示在记录查看页右上角", value: "record", icon: "contract"}
				]
		todo:
			label: "执行的脚本"
			type: "textarea"
			required: true
			is_wide:true


	list_views:
		default:
			columns: ["name", "label", "object", "on", "visible", "modified"]
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
		"after.insert.server.object_actions":
			on: "server"
			when: "after.insert"
			todo: (userId, doc)->
				_syncToObject(doc)
		"after.update.server.object_actions":
			on: "server"
			when: "after.update"
			todo: (userId, doc)->
				_syncToObject(doc)
		"after.remove.server.object_actions":
			on: "server"
			when: "after.remove"
			todo: (userId, doc)->
				_syncToObject(doc)

		"before.update.server.object_actions":
			on: "server"
			when: "before.update"
			todo: (userId, doc, fieldNames, modifier, options)->
				if modifier?.$set?.name && isRepeatedName(doc, modifier.$set.name)
					throw new Meteor.Error 500, "对象名称不能重复"

		"before.insert.server.object_actions":
			on: "server"
			when: "before.insert"
			todo: (userId, doc)->
				if isRepeatedName(doc)
					throw new Meteor.Error 500, "对象名称不能重复"