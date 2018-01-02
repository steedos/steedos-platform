Creator.Objects.archives_category_entity = 
	name: "archives_category_entity"
	icon: ""
	label: "实体分类"
	fields:
		# id:
		# 	type:"text"
		# 	label:"编号"
		# 	required:true
		name:
			type:"text"
			label:"分类名"
			is_name:true
			required:true
		parentname:
			type:"lookup"
			label:"所属分类"
			reference_to: "archives_category_entity"
	list_views:
		default:
			columns:["name","parentname"]
		all:
			label:"全部分类"