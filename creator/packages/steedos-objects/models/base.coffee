Creator.baseObject = 
	fields: 
		owner:
			label:"所有者"
			type: "lookup"
			reference_to: "users"
			omit: true
			sortable: true
			index: true
			defaultValue: "{{userId}}"
		space:
			type: "text"
			omit: true
			index: true
			hidden: true
		created:
			type: "datetime"
			label:"创建日期"
			omit: true
			sortable: true
		created_by:
			type: "lookup"
			label:"创建人"
			reference_to: "users"
			omit: true
			index: true
		modified:
			label:"修改时间"
			type: "datetime"
			omit: true
			sortable: true
			index: true
		modified_by:
			label:"修改人"
			type: "lookup"
			reference_to: "users"
			omit: true
		is_deleted:
			type: "boolean"
			omit: true
			index: true
			hidden: true

	permission_set:
		none: 
			allowCreate: false
			allowDelete: false
			allowEdit: false
			allowRead: false
			modifyAllRecords: false
		user:
			allowCreate: true
			allowDelete: true
			allowEdit: true
			allowRead: true
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
		
		"before.insert.server.default": 
			on: "server"
			when: "before.insert"
			todo: (userId, doc)->
				doc.created = new Date();
				doc.modified = new Date();
				if userId
					doc.owner = userId
					doc.created_by = userId;
					doc.modified_by = userId;
				if !doc.name
					object_name = this.object_name
					name_field_key = Creator.getObject(object_name).NAME_FIELD_KEY
					doc.name = doc[name_field_key]

		"before.update.server.default": 
			on: "server"
			when: "before.update"
			todo: (userId, doc, fieldNames, modifier, options)->
				modifier.$set?.modified = new Date();
				if userId
					modifier.$set = modifier.$set || {};
					modifier.$set?.modified_by = userId

		"before.insert.client.default": 
			on: "client"
			when: "before.insert"
			todo: (userId, doc)->
				doc.space = Session.get("spaceId")

		"after.insert.client.default":
			on: "client"
			when: "after.insert"
			todo: (userId, doc)->
				Meteor.call "object_recent_viewed", this.object_name, doc._id

	actions:

		standard_new:
			label: "新建"
			visible: ()->
				permissions = Creator.getPermissions()
				if permissions
					return permissions["allowCreate"]
			on: "list"
			todo: "standard_new"

		standard_edit:
			label: "编辑"
			sort: 0
			visible: (object_name, record_id, record_permissions)->
				if record_permissions
					return record_permissions["allowEdit"]
				else
					record = Creator.Collections[object_name].findOne record_id
					record_permissions = Creator.getRecordPermissions object_name, record, Meteor.userId()
					if record_permissions
						return record_permissions["allowEdit"]
			on: "record"
			todo: "standard_edit"

		standard_delete:
			label: "删除"
			visible: (object_name, record_id, record_permissions)->
				if record_permissions
					return record_permissions["allowDelete"]
				else
					record = Creator.Collections[object_name].findOne record_id
					record_permissions = Creator.getRecordPermissions object_name, record, Meteor.userId()
					if record_permissions
						return record_permissions["allowDelete"]
			on: "record_more"
			todo: "standard_delete"

		"export":
			label: "Export"
			visible: false
			on: "list"
			todo: (object_name, record_id, fields)->
				alert("please write code in baseObject to export data for " + this.object_name)


		
