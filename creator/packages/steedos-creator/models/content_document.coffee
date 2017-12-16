Creator.Objects.content_documents = 
	name: "content_documents"
	label: "Documents"
	icon: "ion-ios-people-outline"
	fields:
		name: 
			label: "Name"
			type: "text"
		description: 
			label: "Description"
			type: "textarea"
		size:
			type: "number"
		published_version_id:
			type: "string"
	

	list_views:
		default:
			columns: ["name", "description", "modified"]
	permissions:
		default:
			allowCreate: false
			allowDelete: false
			allowEdit: false
			allowRead: true
			modifyAllRecords: false
			viewAllRecords: false 