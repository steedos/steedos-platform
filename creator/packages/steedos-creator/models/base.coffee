Creator.baseObject = 
	fields: 
		owner:
			label:"作者"
			type: "lookup"
			reference_to: "users"
			omit: true
			sortable: true
		space:
			type: "text"
			omit: true
		created:
			type: "datetime"
			label:"提交日期"
			omit: true
			sortable: true
		created_by:
			type: "lookup"
			label:"提交人"
			reference_to: "users"
			omit: true
		modified:
			label:"最后修改时间"
			type: "datetime"
			omit: true
			sortable: true
		modified_by:
			type: "lookup"
			reference_to: "users"
			omit: true
		last_activity: 
			type: "datetime"
			omit: true
		last_referenced: 
			type: "datetime"
			omit: true
		is_deleted:
			type: "boolean"
			omit: true

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

		"before.update.server.default": 
			on: "server"
			when: "before.update"
			todo: (userId, doc, fieldNames, modifier, options)->
				modifier.$set.modified = new Date();
				if userId
					modifier.$set = modifier.$set || {};
					modifier.$set.modified_by = userId

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


		
