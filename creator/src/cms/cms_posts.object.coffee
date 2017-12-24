Creator.Objects.cms_posts = 
	name: "cms_posts"
	icon: "cms"
	label: "Posts"
	fields:
		title: 
			type: "text"
			required: true
		postDate: 
			type: "datetime"
		site:
			type: "master_detail"
			reference_to: "cms_sites"
		author: 
			type: "lookup"
			reference_to: "users"
	list_views:
		default:
			columns: ["title", "site", "postDate", "author"]