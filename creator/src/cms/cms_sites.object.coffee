Creator.Objects.cms_sites = 
	name: "cms_sites"
	icon: "cms"
	label: "Sites"
	fields:
		name: 
			type: "text"
			required: true

	list_views:
		default:
			columns: ["name"]
		all:
			filter_scope: "space"