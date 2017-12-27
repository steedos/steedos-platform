Creator.Objects.archives_archivedept = 
	name: "archives_archivedept"
	icon: ""
	label: "归档部门"
	fields:
		name:
			type:"text"
			label:"部门名称"
			required:true
	list_views:
		default:
			columns:["name"]
		all:
			label:"所有部门"