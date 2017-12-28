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
			type:"select"
			label:"所属分类"
			options: [
				{label: "01党群工作类", value: "01党群工作类"},
				{label: "02行政管理类", value: "02行政管理类"},
				{label: "03经营管理类", value: "03经营管理类"},
				{label: "04生产技术管理类", value: "04生产技术管理类"}
			]
			required:true
	list_views:
		default:
			columns:["name","parentname"]
		all:
			label:"全部分类"