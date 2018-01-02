Creator.baseObject = 
	fields: 
		owner:
			type: "lookup",
			reference_to: "users"
			omit: true
			sortable: true
		space:
			type: "text",
			omit: true
		created:
			type: "datetime",
			label:"提交日期"
			omit: true
			sortable: true
		created_by:
			type: "lookup"
			label:"提交人"
			reference_to: "users"
			omit: true
		modified:
			type: "datetime",
			omit: true
			sortable: true
		modified_by:
			type: "lookup",
			reference_to: "users"
			omit: true
		last_activity: 
			type: "datetime",
			omit: true
		last_referenced: 
			type: "datetime",
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
				doc.owner = userId
				doc.created_by = userId;
				doc.created = new Date();
				doc.modified_by = userId;
				doc.modified = new Date();

		"before.update.server.default": 
			on: "server"
			when: "before.update"
			todo: (userId, doc, fieldNames, modifier, options)->
				modifier.$set = modifier.$set || {};
				modifier.$set.modified_by = userId
				modifier.$set.modified = new Date();

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

		"export":
			label: "Export"
			visible: false
			on: "list"
			todo: ()->
				alert("please write code in baseObject to export data for " + this.object_name)


		
