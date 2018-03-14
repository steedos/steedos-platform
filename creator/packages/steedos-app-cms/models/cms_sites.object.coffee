Creator.Objects.cms_sites = 
	name: "cms_sites"
	icon: "cms"
	label: "站点"
	fields:
		name: 
			type: "text"
			required: true
			searchable:true
			index:true
	list_views:
		default:
			columns: ["name"]
		all:
			filter_scope: "space"