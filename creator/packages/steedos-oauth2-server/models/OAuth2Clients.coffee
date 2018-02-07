Creator.Objects.OAuth2Clients = 
	name: "OAuth2Clients"
	icon: "entity"
	label: "OAuth2配置"
	enable_search: false
	fields: 
		clientName:
			type:"text"
			label:"名称"
			is_name:true
			required:true
		active:
			type:"boolean"
			label:"是否激活"
			defaultValue:true
		redirectUri:
			type:"text"
			label:"回调URL"
			is_wide:true
			required:true
		clientSecret:
			type:"text"
			label:"Secret"
			is_wide:true
			required:true
		spaceId:
			type:"lookup"
			label:"工作区"
			reference_to: "spaces"
			is_wide:true
			required:true
		
	list_views:
		default:
			columns:["clientName","active","redirectUri"]
		all:
			label:"所有"

	permission_set:
		user:
			allowCreate: true
			allowDelete: true
			allowEdit: true
			allowRead: true
			modifyAllRecords: true
			viewAllRecords: true 
		admin:
			allowCreate: true
			allowDelete: true
			allowEdit: true
			allowRead: true
			modifyAllRecords: true
			viewAllRecords: true 