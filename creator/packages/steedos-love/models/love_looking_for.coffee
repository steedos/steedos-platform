Creator.Objects.love_looking_for =
	name: "love_looking_for"
	label: "我喜欢的"
	icon: "event"
	enable_search: true
	fields:
		looking_forward:
			type:'select'
			label:"我想找的类型"
			options: "一周:一周,短期:短期,长期:长期,余生:余生"
		sex:
			type:'select'
			label:"性别"
			options:['男','女']
		age_range:
			type:'text'
			label:"年龄段(范围)"
		height_range:
			type:'text'
			label:"身高(范围）"
		body_type:
			type:'text'
			label:"体型"
	
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