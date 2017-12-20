Creator.baseObject = 
	fields: 
		owner:
			type: "lookup",
			reference_to: "users"
		space:
			type: "text",
			omit: true
		created:
			type: "datetime",
			omit: true
		created_by:
			type: "lookup",
			reference_to: "users"
			omit: true
		modified:
			type: "datetime",
			omit: true
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

	list_views:
		default:
			columns: ["name"]
		recent:
			filter_scope: "space"
		all:
			filter_scope: "space"

	permissions:
		user:
			allowCreate: true
			allowDelete: true
			allowEdit: true
			allowRead: true
			modifyAllRecords: false
			viewAllRecords: true 
		admin:
			allowCreate: true
			allowDelete: true
			allowEdit: true
			allowRead: true
			modifyAllRecords: true
			viewAllRecords: true 

	triggers:
		
		"before.insert": (userId, doc)->
			doc.owner = userId
			doc.created_by = userId;
			doc.created = new Date();
			doc.modified_by = userId;
			doc.modified = new Date();

		"before.update": (userId, doc, fieldNames, modifier, options)->
			modifier.$set = modifier.$set || {};
			modifier.$set.modified_by = userId
			modifier.$set.modified = new Date();
