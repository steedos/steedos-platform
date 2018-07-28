Creator.Objects.love_looking_for =
	name: "love_looking_for"
	label: "我喜欢的"
	icon: "event"
	enable_search: true
	fields:
		sex:
			type:'select'
			label:"我希望对方的性别？"
			options: "男:男,女:女"
		
		age:
			type:'number'
			label:"我希望对方的年龄？"
		age_max:
			type:'number'
			label:"最大年龄"
		
		height:
			type:'number'
			label:"我希望对方的身高？"
		height_max:
			type:'number'
			label:"最大身高"
	
	list_views:
		all:
			label: "所有"
			columns: ["looking_forward", "sex", "age_range" ,"height_range"]
			filter_scope: "space"
		
	permission_set:
		user:
			allowCreate: true
			allowDelete: false
			allowEdit: true
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
		member:
			allowCreate: true
			allowDelete: false
			allowEdit: true
			allowRead: false
			modifyAllRecords: false
			viewAllRecords: false
		guest:
			allowCreate: true
			allowDelete: false
			allowEdit: true
			allowRead: false
			modifyAllRecords: false
			viewAllRecords: false