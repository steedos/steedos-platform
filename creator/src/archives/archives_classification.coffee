Creator.Objects.archives_classification = 
	name: "archives_classification"
	icon: "product_item"
	label: "档案门类"
	fields:
		parentname:
			type:"lookup"
			label:"所属分类"
			reference_to: "archives_classification"
			sortable:true

		name:
			type:"text"
			label:"分类名"
			is_name:true
			required:true
		
	list_views:
		default:
			columns:["parentname","name"]
		all:
			label:"全部分类"