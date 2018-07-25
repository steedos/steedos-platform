Creator.Objects.love_answer =
	name: "love_answer"
	label: "必答题答案"
	icon: "event"
	enable_search: true
	fields:
		how_long:
			type:'text'
			label:"你希望这段关系维持多久"
			options:['一周','短期','长期','余生']
		how_long_o:
			type:'text'
			label:"对方希望这段关系维持多久"
		how_long_i:
			type:'boolean'
			label:"是否重要"
		
		smoking:
			type:'boolean'
			label:"是否吸烟"
			options:['是','否','几乎不']
		smoking_o:
			type:'boolean'
			label:"对方是否吸烟"
		smoking_i:
			type:'boolean'
			label:"是否重要"
		
		astrological:
			type:'boolean'
			label:"是否相信星座"
		astrological_o:
			type:'boolean'
			label:"对方是否相信星座"
		astrological_i:
			type:'boolean'
			label:"是否重要"
		
		employed:
			type:'boolean'
			label:"有没有工作"
			options:['全职工作','小时工','没有工作','学生']
		employed_o:
			type:'boolean'
			label:"对方有没有工作"
		employed_i:
			type:'boolean'
			label:"是否重要"

		relationship_status:
			type:'text'
			label:"感情状况"
			options:['单身','恋爱中']
		relationship_status_o:
			type:'text'
			label:"对方感情状况"
		relationship_status_i:
			type:'boolean'
			label:"是否重要"
		
		marital_status:
			type:'text'
			label:"婚姻状况"
			options:['未婚','已婚','离异']
		marital_status_o:
			type:'text'
			label:"婚姻状况"
		marital_status_i:
			type:'boolean'
			label:"是否重要"
		
		zodiac:
			type:'object'
			label:"生肖"
		zodiac_o:
			type:'object'
			label:"对方生肖"
		zodiac_i:
			type:'boolean'
			label:"是否重要"
		
		education:
			type:'text'
			label:"学历"
		education_o:
			type:'text'
			label:"对方学历"
		education_i:
			type:'boolean'
			label:"是否重要"
		
		hometown:
			type:'object'
			label:"家乡"
		hometown_o:
			type:'object'
			label:"对方家乡"
		hometown_i:
			type:'boolean'
			label:"是否重要"