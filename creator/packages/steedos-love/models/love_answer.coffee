Creator.Objects.love_answer =
	name: "love_answer"
	label: "恋爱小测试"
	icon: "event"
	enable_search: true
	fields:
		
		smoking:
			type:'select'
			label:"你吸烟吗?"
			options:"吸烟:吸烟,不吸烟:不吸烟,偶尔吸烟:偶尔吸烟"
		smoking_o:
			type:'select'
			label:"对方是否吸烟"
			multiple:true
		smoking_i:
			type:'boolean'
			label:"是否重要"
		
		astrological:
			type:'select'
			label:"你相信星座吗？"
			options: "相信:相信,不相信:不相信,无所谓:无所谓"
		astrological_o:
			type:'select'
			label:"对方是否相信星座"
			multiple:true
		astrological_i:
			type:'boolean'
			label:"是否重要"
		
		employed:
			type:'select'
			label:"你的工作状况？"
			options: "全职:全职,兼职:兼职,学生:学生"
		employed_o:
			type:'select'
			label:"对方工作状况"
			multiple:true
		employed_i:
			type:'boolean'
			label:"是否重要"

				
		body_type:
			type:'text'
			label:"你的体型？"
			options: "偏瘦:偏瘦,正常:正常,微胖:微胖"
		body_type_o:
			type:'select'
			label:"对方体型"
			multiple:true
		body_type_i:
			type:'boolean'
			label:"是否重要"


		relationship_status:
			type:'select'
			label:"你的感情状况？"
			options: "单身:单身,恋爱中:恋爱中,已订婚:已订婚,已婚:已婚,离异:离异"
		relationship_status_o:
			type:'select'
			label:"对方感情状况"
			multiple:true
		relationship_status_i:
			type:'boolean'
			label:"是否重要"
		
		education:
			type:'select'
			label:"你的学历？"
			options: "高中:高中,大专:大专,本科:本科,硕士:硕士,博士及博士以上学历:博士及博士以上学历"
		education_o:
			type:'select'
			label:"对方学历"
			multiple:true
		education_i:
			type:'boolean'
			label:"是否重要"
	
	list_views:
		all:
			label: "所有"
			columns: ["how_long", "smoking", "astrological", "employed","zodiac", "education"]
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
