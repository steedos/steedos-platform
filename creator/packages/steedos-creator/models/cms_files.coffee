Creator.Objects.cms_files = 
	name: "cms_files"
	label: "Files"
	icon: "drafts"
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
			collection: "files"
			multiple: true
		parent:
			type: "lookup"
			reference_to: ()->
				return _.pluck(Creator.objectsByName, "name")


	list_views:
		default:
			columns: ["name", "owner", "modified"]
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

