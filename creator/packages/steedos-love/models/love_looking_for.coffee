Creator.Objects.love_looking_for =
	name: "love_looking_for"
	label: "筛选条件"
	icon: "campaign"
	enable_search: true
	fields:
		sex:
			type:'select'
			label:"你希望对方的性别？"
			options: "男:男,女:女"
			is_name: true
		
		age:
			type:'select'
			label:"你希望对方的年龄？"
			options:'18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50'
		age_max:
			type:'select'
			label:"最大年龄"
			options:'18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50'
		
		height:
			label:"你希望对方的身高？"
			type:'select'
			options:"140,141,142,143,144,145,146,147,148,149,150,151,152,153,154,155,156,157,158,159,160,161,162,163,164,165,166,167,168,169,170,171,172,173,174,175,176,177,178,179,180,181,182,183,184,185,186,187,188,189,190,191,192,193,194,195,196,197,198,199,200"
		height_max:
			label:"最大身高"
			type:'select'
			options:"140,141,142,143,144,145,146,147,148,149,150,151,152,153,154,155,156,157,158,159,160,161,162,163,164,165,166,167,168,169,170,171,172,173,174,175,176,177,178,179,180,181,182,183,184,185,186,187,188,189,190,191,192,193,194,195,196,197,198,199,200"

	list_views:
		all:
			label: "所有"
			columns: ["sex", "age", "age_max", "height", "height_max"]
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