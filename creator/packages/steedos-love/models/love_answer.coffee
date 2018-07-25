Creator.Objects.love_answer =
	name: "love_answer"
	label: "必答题答案"
	icon: "event"
	enable_search: true
	fields:
		how_long:
			type:'select'
			label:"你希望这段关系维持多久"
			options: "一周:一周,短期:短期,长期:长期,余生:余生"
		how_long_o:
			type:'select'
			label:"对方希望这段关系维持多久"
			multiple:true
		how_long_i:
			type:'boolean'
			label:"是否重要"
		
		smoking:
			type:'select'
			label:"是否吸烟"
			options:"是:是,否:否,几乎不:几乎不"
		smoking_o:
			type:'select'
			label:"对方是否吸烟"
			multiple:true
		smoking_i:
			type:'boolean'
			label:"是否重要"
		
		astrological:
			type:'select'
			label:"是否相信星座"
		astrological_o:
			type:'select'
			label:"对方是否相信星座"
			multiple:true
		astrological_i:
			type:'boolean'
			label:"是否重要"
		
		employed:
			type:'select'
			label:"工作状况"
			options: "全职工作:全职工作,小时工:小时工,没有工作:没有工作,学生:学生"
		employed_o:
			type:'select'
			label:"对方工作状况"
			multiple:true
		employed_i:
			type:'boolean'
			label:"是否重要"

		relationship_status:
			type:'select'
			label:"感情状况"
			options: "单身:单身,恋爱中:恋爱中"
		relationship_status_o:
			type:'select'
			label:"对方感情状况"
			multiple:true
		relationship_status_i:
			type:'boolean'
			label:"是否重要"
		
		marital_status:
			type:'select'
			label:"婚姻状况"
			options: "未婚:未婚,已婚:已婚,离异:离异"
		marital_status_o:
			type:'select'
			label:"对方婚姻状况"
			multiple:true
		marital_status_i:
			type:'boolean'
			label:"是否重要"
		
		zodiac:
			type:'select'
			label:"生肖"
			options: "鼠:鼠,牛:牛,虎:虎,龙:龙,兔:兔,蛇:蛇,马:马,羊:羊,猴:猴,鸡:鸡,狗:狗,猪:猪"
		zodiac_o:
			type:'select'
			label:"对方生肖"
			multiple:true
		zodiac_i:
			type:'boolean'
			label:"是否重要"
		
		education:
			type:'select'
			label:"学历"
			options: "初中:初中,高中:高中,专科:专科,本科:本科,硕士:硕士,博士:博士"
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
