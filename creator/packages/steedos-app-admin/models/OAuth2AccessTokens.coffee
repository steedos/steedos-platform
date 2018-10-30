Creator.Objects.OAuth2AccessTokens = 
	name: "OAuth2AccessTokens"
	icon: "entity"
	label: "OAuth2 Token"
	enable_search: false
	fields: 
		userId:
			label: "用户"
			type: "lookup"
			reference_to: "users"
			sortable: true
		expires:
			type: "datetime"
			label:"有效期限"
		clientId:
			type: "text"
			omit: true
			defaultValue: "creator"
		accessToken:
			type:"text"
			label:"Token"
			defaultValue: ()->
				return Random.id(38)
		
	list_views:
		all:
			label:"全部"
			columns:["userId","expires","accessToken"]		
	permission_set:
		user:
			allowCreate: false
			allowDelete: false
			allowEdit: false
			allowRead: false
			modifyAllRecords: false
			viewAllRecords: false 
		admin:
			allowCreate: true
			allowDelete: true
			allowEdit: true
			allowRead: true
			modifyAllRecords: true
			viewAllRecords: true 