Creator.Objects.archives_dept = 
	name: "archives_dept"
	icon: ""
	label: "归档部门"
	fields:
		name:
			type:"text"
			label:"部门名称"
			is_wide:true
			required:true
	list_views:
		default:
			columns:["name"]
		all:
			label:"所有部门"