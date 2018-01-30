Creator.Objects.cms_categories =
	name: "cms_categories"
	icon: "cms"
	label: "categories"
	fields:
		name: 
			type: "text"
			required: true
		site:
			type: "lookup"
			reference_to: "cms_sites"
		featured:
			type: "boolean"
		menu:
			type: "boolean"

	list_views:
		default:
			columns: ["name", "site"]
		all:
			filter_scope: "space"