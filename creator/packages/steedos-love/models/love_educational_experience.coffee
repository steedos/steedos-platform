Creator.Objects.love_educational_experience =
	name: "love_educational_experience"
	label: "教育经历"
	icon: "event"
	enable_search: true
	fields:
		school:
			type:'text'
			label:"学校名称"
			inlineHelpText:'例如:北京大学'
		
		educational_background:
			type:'select'
			label:"学历"	
			options: "高中:高中,大专:大专,本科:本科,硕士:硕士,博士及博士以上:博士及博士以上"
		
		profession:
			type:'text'
			label:"专业"
			inlineHelpText:'例如:计算机科学与技术'
		
		entry_time:
			type:'date'
			label:"入学时间"
		
		separation_time:
			type:'date'
			label:"离校时间"
		
		description:
			type:'textarea'
			is_wide:true	
			label:"在校经历"
	list_views:
		all:
			label: "所有"
			columns: ["school", "educational_background", "profession", "entry_time","separation_time"]
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
