Creator.Objects.archives_category = 
	name: "archives_category"
	icon: ""
	label: "实体分类"
	fields:
		id:
			type:"text"
			label:"编号"
			is_name:true
			required:true
		name:
			type:"text"
			label:"分类名"
			required:true
		parentid:
			type:"text"
			label:"所属分类"
			required:true
	list_views:
		default:
			columns:["id","name","parentid"]
		all:
			label:"全部分类"