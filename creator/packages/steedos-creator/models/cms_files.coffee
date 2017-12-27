Creator.Objects.cms_files = 
	name: "cms_files"
	label: "Files"
	icon: "ion-ios-people-outline"
	fields:
		name: 
			label: "Name"
			type: "text"
		description: 
			label: "Description"
			type: "textarea"
			optional: true
		extention: 
			type: "text"
		size:
			type: "number"
		versions:
			type: "file"
			multiple: true
	

	list_views:
		default:
			columns: ["name", "description", "modified"]
		all:
			filter_scope: "space"

	permission_set:
		default:
			allowCreate: true
			allowDelete: true
			allowEdit: true
			allowRead: true
			modifyAllRecords: false
			viewAllRecords: false 

