Creator.Objects.apps = 
	name: "apps"
	label: "Apps"
	icon: "apps"
	fields:
		name: 
			label: "Name"
			type: "text"
			defaultValue: ""
			description: ""
			inlineHelpText: ""
			required: true
			searchable:true
			index:true
		objects:
			type: "[text]"
	list_views:
		default:
			columns: ["name"]
		all:
			filter_scope: "spacex"
	permission_set:
		user:
			allowCreate: false
			allowDelete: false
			allowEdit: false
			allowRead: true
			modifyAllRecords: false
			viewAllRecords: true 
		admin:
			allowCreate: false
			allowDelete: false
			allowEdit: false
			allowRead: true
			modifyAllRecords: false
			viewAllRecords: true 