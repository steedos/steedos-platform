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
		
	list_views:
		default:
			columns:["parent","name"]
		all:
			label:"全部分类"