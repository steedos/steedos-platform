Creator.Objects.love_about_me =
	name: "love_about_me"
	label: "我的资料"
	icon: "event"
	enable_search: true
	fields:
		name:
			type:'text'
			label:"你的姓名？"
		sex:
			type:'select'
			label:"你的性别？"
			options:[{label:'男生',value:'男'},{label:'女生',value:'女'}]	
		height:
			type:'number'
			label:"你的身高？"
		birthday:
			type:'date'
			label:"你的生日？"
		live:
			type:'text'
			label:"你的现居地？"
		hometown:
			type:'text'
			label:"你的家乡？"
		self_introduction:
			type:'textarea'
			is_wide:true	
			label:"自我介绍"
	list_views:
		all:
			label: "所有"
			columns: ["name", "mobile", "sex", "birthday","live", "height", "weight", "self_introduction" ]
			filter_scope: "space"
		
	permission_set:
		user:
			allowCreate: true
			allowDelete: false
			allowEdit: true
			allowRead: true
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
			allowRead: true
			modifyAllRecords: false
			viewAllRecords: false
		guest:
			allowCreate: true
			allowDelete: false
			allowEdit: true
			allowRead: true
			modifyAllRecords: false
			viewAllRecords: false
