Creator.Objects.love_about_me =
	name: "love_about_me"
	label: "关于我"
	icon: "event"
	enable_search: true
	fields:
		mobile:
			type:'text'
			label:"手机号"
		name:
			type:'text'
			label:"姓名"
		sex:
			type:'select'
			label:"性别"
			options:[{label:'先生',value:'男'},{label:'小姐',value:'女'}]
		birthday:
			type:'date'
			label:"生日"
		self_introduction:
			type:'textarea'
			is_wide:true	
			label:"自我介绍"
		live:
			type:'text'
			label:"现居地(定位)"
		hometown:
			type:'text'
			label:"家乡"
		
		height:
			type:'number'
			label:"身高"
		weight:
			type:'number'
			label:"体重"
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
