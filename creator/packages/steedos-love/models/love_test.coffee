Creator.Objects.love_test =
	name: "love_test"
	label: "缘分卷"
	icon: "social"
	enable_search: true
	fields:
		previous_picture:
			type:'select'
			label:"对方还留着前任的照片，会让你觉得恼火吗？"
			options:'会,不会'
		previous_picture_o:
			type:'select'
			label:"前任的照片"
			multiple:true
		previous_picture_i:
			type:'number'
			label:'重要程度'
		
		parents_influence:
			type:'select'
			label:"父母对你生活的影响有多大?"
			options:'没有影响，我自己做主,我会考虑他们的意见,我通常会听父母的,完全听父母的'
		parents_influence_o:
			type:'select'
			label:"父母对你生活的影响"
			multiple:true
		parents_influence_i:
			type:'number'
			label:'重要程度'
		
		education:
			type:'select'
			label:"你的学历？"
			options: "高中及以下,大专,本科,硕士,博士及以上"
			is_name: true
		education_o:
			type:'select'
			label:"对方学历"
			multiple:true
		education_i:
			type:'number'
			label:'重要程度'
		
		pet:
			type:'select'
			label:"你会让你的宠物睡在床上吗？"
			options:'会,不会'
		pet_o:
			type:'select'
			label:"宠物"
			multiple:true
		pet_i:
			type:'number'
			label:'重要程度'
		
		body_type:
			type:'select'
			label:"你的体型？"
			options: "骨感,微瘦,标准,健壮,微胖,胖"
		body_type_o:
			type:'select'
			label:"体型"
			multiple:true
		body_type_i:
			type:'number'
			label:'重要程度'
		
		employed:
			type:'select'
			label:"你的工作状况？"
			options: "全职,兼职,学生"
		employed_o:
			type:'select'
			label:"对方工作状况"
			multiple:true
		employed_i: # 重要程度: 跳过 -1， 全选：0 (计算时算作0分)， 未全选： 1 (计算时算作1分)， 重要：2 (计算时算作5分)
			type:'number'
			label:'重要程度'
		
		communicate:
			type:'select'
			label:"你每天都要和你的另一半交流吗？（电话、微信等）"
			options:'是的，雷打不动,是的，除非特殊情况,不，没必要,不，我会很烦'
		communicate_o:
			type:'select'
			label:"每天交流"
			multiple:true
		communicate_i:
			type:'number'
			label:'重要程度'
		
		finance_budget:
			type:'select'
			label:"你会规划自己的财务开支吗？"
			options:'会,不会'
		finance_budget_o:
			type:'select'
			label:"规划自己的财务开支"
			multiple:true
		finance_budget_i:
			type:'number'
			label:'重要程度'
		
		messy:
			type:'select'
			label:"你介意同邋遢的人交往吗？"
			options:'介意,不介意'
		messy_o:
			type:'select'
			label:"介意对方邋遢？"
			multiple:true
		messy_i:
			type:'number'
			label:'重要程度'
		
		disgust_smoke:
			type:'select'
			label:"你觉得吸烟是令人厌恶的行为吗？"
			options:'是,不是'
		disgust_smoke_o:
			type:'select'
			label:'对方厌恶吸烟'
			multiple:true
		disgust_smoke_i:
			type:'number'
			label:'重要程度'

	list_views:
		all:
			label: "所有"
			columns: ["previous_picture", "parents_influence", "education", "pet", "body_type", "employed", "communicate", "finance_budget",
			 "messy", "disgust_smoke"]
			filter_scope: "space"

	permission_set:
		user:
			allowCreate: true
			allowDelete: false
			allowEdit: true
			allowRead: true
			modifyAllRecords: false
			viewAllRecords: true
		admin:
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
			viewAllRecords: true
		guest:
			allowCreate: true
			allowDelete: false
			allowEdit: true
			allowRead: true
			modifyAllRecords: false
			viewAllRecords: true
