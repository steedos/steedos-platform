Creator.Objects.love_answer =
	name: "love_answer"
	label: "玫瑰卷"
	icon: "event"
	enable_search: true
	fields:					
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
		
		education:
			type:'select'
			label:"你的学历？"
			options: "高中及以下,大专,本科,硕士,博士及以上"
		education_o:
			type:'select'
			label:"对方学历"
			multiple:true
		education_i:
			type:'number'
			label:'重要程度'
		
		morning:
			type:'select'
			label:"你习惯早起吗？"
			options:'是,不是'
		morning_o:
			type:'select'
			label:"对方早起"
			multiple:true
		morning_i:
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

		married:
			type:'select'
			label:"你想尽快结婚吗？"
			options:'我想尽快结婚,看缘分,暂时没有结婚的打算'
		married_o:
			type:'select'
			label:"尽快结婚"
			multiple:true
		married_i:
			type:'number'
			label:'重要程度'
		
		communicate:
			type:'select'
			label:"你是不是每天都要和你的另一半交流（电话、微信、当面都可以）？"
			options:'是的，雷打不动,是的，除非特殊情况,不，没必要,不，我会很烦'
		communicate_o:
			type:'select'
			label:"每天交流"
			multiple:true
		communicate_i:
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
		
		show_your_love:
			type:'select'
			label:'你更喜欢如何表达你的爱？'
			options:"语言：说一些甜蜜的话,行动：做一些浪漫的事（比如约会）,礼物：花、首饰、小物件,拥抱：一个爱的拥抱"
		show_your_love_o:
			type:'select'
			label:"表达你的爱"
			multiple:true
		show_your_love_i:
			type:'number'
			label:'重要程度'
		
		before_meeting:
			type:'select'
			label:"你至少需要和对方聊多久，才愿意出来见面？"
			options:'立刻，如果是我喜欢的类型,几天,几周,几个月'
		before_meeting_o:
			type:'select'
			label:"约会之前"
			multiple:true
		before_meeting_i:
			type:'number'
			label:'重要程度'
		
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
		
		minimum_page:
			type:'select'
			label:"对方满足于现在的低工资，没有计划找一份更有挑战/高薪工作。你能接受吗？"
			options:'能接受,看情况，毕竟这是Ta的人生,不，我不能接受'
		minimum_page_o:
			type:'select'
			label:"低工资"
			multiple:true
		minimum_page_i:
			type:'number'
			label:'重要程度'
		
		parents_influence:
			type:'select'
			label:"父母对你生活的影响有多大?"
			options:'没有影响，我自己做主,我会考虑他们的意见，但是自己做决定,多数情况下，我会做父母认为对的事,完全听父母的'
		parents_influence_o:
			type:'select'
			label:"父母对你生活的影响"
			multiple:true
		parents_influence_i:
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
		employed_i:
			type:'number'
			label:'重要程度'

		intellectual:
			type:'select'
			label:"你经常和别人进行理性且深层次的辩论吗？"
			options:'是,不是'
		intellectual_o:
			type:'select'
			label:"理性且深层次的辩论"
			multiple:true
		intellectual_i:
			type:'number'
			label:'重要程度'

		appeal_event:
			type:'select'
			label:"下列哪项活动对你最有吸引力？"
			options:'科技展,时装周,音乐会,动漫展,马拉松,车展'
		appeal_event_o:
			type:'select'
			label:"最吸引的活动"
			multiple:true
		appeal_event_i:
			type:'number'
			label:'重要程度'
		
		parter_to_be:
			type:'select'
			label:"你希望另一半是一个什么样的人？"
			options:'主导的,顺从的,平衡的'
		parter_to_be_o:
			type:'select'
			label:"另一半是一个什么样的人"
			multiple:true
		parter_to_be_i:
			type:'number'
			label:'重要程度'

		boyfriend_girlfriend:
			type:'select'
			label:"你谈过恋爱吗？"
			options:'谈过,没谈过'
		boyfriend_girlfriend_o:
			type:'select'
			label:"谈过恋爱"
			multiple:true
		boyfriend_girlfriend_i:
			type:'number'
			label:'重要程度'

		video_game:
			type:'select'
			label:"你愿意与一个每天都会花费两个小时在游戏上的人交往吗？"
			options:'愿意，我会一起玩,愿意，有时我会一起玩,愿意，但是我不玩游戏,不愿意'
		video_game_o:
			type:'select'
			label:"每天都会花费两个小时在游戏上"
			multiple:true
		video_game_i:
			type:'number'
			label:'重要程度'
		
		flicp_coin:
			type:'select'
			label:"对于生活中一些重要事项，你会考虑用抛硬币的方式来决定吗？"
			options:'会,不会'
		flicp_coin_o:
			type:'select'
			label:"抛硬币"
			multiple:true
		flicp_coin_i:
			type:'number'
			label:'重要程度'

		spelling_mistake:
			type:'select'
			label:"你看见错别字会感觉很不舒服吗？"
			options:'会,不会'
		spelling_mistake_o:
			type:'select'
			label:"对方错别字？"
			multiple:true
		spelling_mistake_i:
			type:'number'
			label:'重要程度'
		
		jealousy:
			type:'select'
			label:"你认为吃醋是对恋情有益的吗？"
			options:'是,不是'
		jealousy_o:
			type:'select'
			label:"对方吃醋"
			multiple:true
		jealousy_i:
			type:'number'
			label:'重要程度'
	
		value_most:
			type:'select'
			label:"下列哪项能力你认为更重要？"
			options:'逻辑/数学,社交/人际关系,视觉/艺术'
		value_most_o:
			type:'select'
			label:"更重要的能力"
			multiple:true
		value_most_i:
			type:'number'
			label:'重要程度'

		before_married:
			type:'select'
			label:"你觉得在结婚之前至少需要谈多久的恋爱？"
			options:'至少两年,至少一年,至少半年,少于半年或不需要'
		before_married_o:
			type:'select'
			label:"结婚之前"
			multiple:true
		before_married_i:
			type:'number'
			label:'重要程度'

		beer:
			type:'select'
			label:"你喜欢啤酒的味道吗？"
			options:'喜欢,不喜欢'
		beer_o:
			type:'select'
			label:"对方啤酒"
			multiple:true
		beer_i:
			type:'number'
			label:'重要程度'
	
		consider_adult:
			type:'select'
			label:"不考虑你现在的实际年龄，你觉得自己是个成年人吗?"
			options:'是,否'
		consider_adult_o:
			type:'select'
			label:"成年人"
			multiple:true
		consider_adult_i:
			type:'number'
			label:'重要程度'
		
	list_views:
		all:
			label: "所有"
			columns: ["finance_budget", "education", "consider_adult", "beer","zodiac", "before_married"]
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
