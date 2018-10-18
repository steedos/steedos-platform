Creator.Objects.cms_categories =
	name: "cms_categories"
	icon: "cms"
	label: "文章分类"
	enable_tree: true
	fields:
		name: 
			type: "text"
			required: true
			searchable:true
			index:true
		site:
			label:"站点"
			type: "lookup"
			reference_to: "cms_sites"
		featured:
			type: "boolean"
		menu:
			type: "boolean"
		parent:
			label: "文章分类"
			type: "lookup"
			reference_to: "cms_categories"
			sortable: true

	list_views:
		all:
			columns: ["name", "site"]
			filter_scope: "space"