Creator.Objects.archive_classification = 
	name: "archive_classification"
	icon: "product_item"
	label: "门类"
	enable_search: true
	fields:
		parent:
			type:"lookup"
			label:"所属分类"
			reference_to: "archive_classification"
			sortable:true

		name:
			type:"text"
			label:"分类名"
			is_name:true
			required:true
			searchable:true
			index:true
		departments:
			type:"[text]"
			label:"所属部门"
			multiple:true
			is_wide:true
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
	list_views:
		default:
			columns:["parent","name","departments"]
		all:
			label:"全部分类"