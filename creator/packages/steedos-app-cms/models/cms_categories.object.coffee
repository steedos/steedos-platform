Creator.Objects.cms_categories =
	name: "cms_categories"
	icon: "cms"
	label: "文章分类"
	fields:
		name: 
			type: "text"
			required: true
			searchable:true
			index:true
		site:
			type: "lookup"
			reference_to: "cms_sites"
		featured:
			type: "boolean"
		menu:
			type: "boolean"

	list_views:
		all:
			columns: ["name", "site"]
			filter_scope: "space"