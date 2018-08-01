Creator.Objects.love_answer =
	name: "love_answer"
	label: "交友问答"
	icon: "event"
	enable_search: true
	fields:
		
		smoking:
			type:'select'
			label:"你吸烟吗?"
			options:"经常,偶尔,从不"
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
			options: "骨感:骨感,微瘦:微瘦,标准:标准,微胖:微胖,胖:胖"
		body_type_o:
			type:'select'
			label:"对方体型"
			multiple:true
		body_type_i:
			type:'boolean'
			label:"是否重要"
		
		education:
			type:'select'
			label:"你的学历？"
			options: "高中及以下,大专,本科,硕士,博士及以上"
		education_o:
			type:'select'
			label:"对方学历"
			multiple:true
		education_i:
			type:'boolean'
			label:"是否重要"
		
		morning:
			type:'select'
			label:"你是习惯早起的人吗？"
			options:'是,不是'
		morning_o:
			type:'select'
			label:"对方早起"
			multiple:true
		morning_i:
			type:'boolean'
			label:"是否重要"

		messy:
			type:'select'
			label:"你介意同特别邋遢的人交往吗？"
			options:'介意,不介意'
		messy_o:
			type:'select'
			label:"介意对方邋遢？"
			multiple:true
		messy_i:
			type:'boolean'
			label:"是否重要"

		scary_movie:
			type:'select'
			label:"你喜欢悬疑电影吗？"
			options:'喜欢,不喜欢'
		scary_movie_o:
			type:'select'
			label:"对方悬疑？"
			multiple:true
		scary_movie_i:
			type:'boolean'
			label:"是否重要"
		
		drinking:
			type:'select'
			label:"你喝酒吗?"
			options:"经常,偶尔,从不"
		drinking_o:
			type:'select'
			label:"对方是否喝酒"
			multiple:true
		drinking_i:
			type:'boolean'
			label:"是否重要"
		
		disgust_smoke:
			type:'select'
			label:"你觉得吸烟是令人厌恶的行为吗？"
			options:'是,不是'
		disgust_smoke_o:
			type:'select'
			label:'对方厌恶吸烟'
			multiple:true
		disgust_smoke_i:
			type:'boolean'
			label:"是否重要"
		
		jealousy:
			type:'select'
			label:"你认为吃醋是正常且对恋情有益的吗？"
			options:'是,不是'
		jealousy_o:
			type:'select'
			label:"对方吃醋？"
			multiple:true
		jealousy_i:
			type:'boolean'
			label:"是否重要"
		
		spelling_mistake:
			type:'select'
			label:"看见错别字会让你感觉不舒服吗？"
			options:'是,不是'
		spelling_mistake_o:
			type:'select'
			label:"对方错别字？"
			multiple:true
		spelling_mistake_i:
			type:'boolean'
			label:"是否重要"

		beer:
			type:'select'
			label:"你喜欢啤酒的味道吗？"
			options:'喜欢,不喜欢'
		beer_o:
			type:'select'
			label:"对方啤酒？"
			multiple:true
		beer_i:
			type:'boolean'
			label:"是否重要"

		intellectual:
			type:'select'
			label:"你经常和别人进行理性且深层次的辩论吗？"
			options:'是,不是'
		
		bedroom_tv:
			type:'select'
			label:"你的卧室里有电视吗？"
			options:'有,没有'
		
		married:
			type:'select'
			label:"你想尽快结婚吗？"
			options:'当然,看缘分,不'
		
		politics:
			type:'select'
			label:"你喜欢讨论时政吗？"
			options:'喜欢,不喜欢'

		debt:
			type:'select'
			label:"你介意与有大额债务的人交往吗？"
			options:'不介意,看情况,介意'
		
		appeal_event:
			type:'select'
			label:"下列哪项活动对你最有吸引力？"
			options:'科技展,时装周,音乐会,动漫展,游戏展'

		value_most:
			type:'select'
			label:"下列哪项能力你认为更重要？"
			options:'逻辑/数学,社交/人际关系,视觉/艺术'
		
		communicate:
			type:'select'
			label:"你是不是每天都要和你的另一半交流(电话、微信、当面都可以)？"
			options:'是的，必须的,是的，除非特殊情况,不，没必要,不，我不喜欢每天交流'
		
		worry_about:
			type:'select'
			label:"你会为了一些你控制不了的事情操心吗？"
			options:'会,不会'
		
		do_nothing:
			type:'select'
			label:"如果一天你什么事都没做，你会感觉怎么样？"
			options:'好,不好'
		
		flicp_coin:
			type:'select'
			label:"你会通过抛硬币的方式，来做一些生活中的重要决定吗？"
			options:'会,偶,绝不'
		
		pet:
			type:'select'
			label:"你会让你的宠物睡在你的床上吗？"
			options:'会,不会'
		
		# investigate:
		# 	type:'select'
		# 	label:"你宠物睡在你的床上吗？"
		# 	options:'允许,不允许'
		
		more_into:
			type:'select'
			label:"你希望你的的理想伴侣更热衷于？"
			options:'运动,阅读,音乐,电影'
		meditate:
			type:'select'
			label:"你经常冥思吗？"
			options:'经常,偶尔,从不'
		finance_budget:
			type:'select'
			label:"你会规划自己的财务开支吗？"
			options:'是,否'
		dangerous:
			type:'select'
			label:"你喜欢冒险吗？"
			options:'是,否'
		
		intellectual_debate:
			type:'select'
			label:"你喜欢谈论政治、科学、哲学话题吗？"
			options:'喜欢讨论,有时会,觉得这是一件无聊乏味的事'
		
		appearance_emphasia:
			type:'select'
			label:"你讨厌颜控吗？"
			options:'讨厌,看情况，分程度,不讨厌'
		
		hurt_happened:
			type:'select'
			label:"虽然过了很久，你仍然为曾经发生的过某事而伤心吗?"
			options:'是,否'
		
		consider_adult:
			type:'select'
			label:"不考虑你现在的年龄，你觉得自己是个成年人吗?"
			options:'是,否'
		
		parter_to_be:
			type:'select'
			label:"你更喜欢你的另一半是一个什么样的人？"
			options:'主导的,顺从的,平衡的'
		
		first_date_say:
			type:'select'
			label:"第一次约会之后，Ta说喜欢你，你会是什么反应？"
			options:'甜蜜,惊恐'
		
		show_your_love:
			type:'select'
			label:'你更喜欢如何表达你的爱？'
			options:"语言：说一些爱Ta的话,行为：做一些对Ta好的事,礼物：送给Ta想要的礼物,接触：给Ta一个爱的拥抱或者吻"
		
		date_with_children:
			type:'select'
			label:"如果Ta已经有孩子，你还愿意与Ta交往吗？"
			options:'愿意,不愿意'
		
		inform_detail:
			type:'select'
			label:"在一段认真的感情中，你觉得每天告诉Ta你的生活细节重要吗？"
			options:'重要,不重要,不用每天'
		
		housemate:
			type:'select'
			label:"发现你的约会对象有一个异性的室友，会让你觉得？"
			options:'不舒服,无所谓'
		
		quite:
			type:'select'
			label:"你愿意与一个沉默寡言的人约会吗？"
			options:'愿意,不愿意'
		
		before_meeting:
			type:'select'
			label:"在和一个人约会之前，你至少需要和Ta聊多久？"
			options:'立刻，如果Ta的长相很酷,几天,几周,几个月'

		before_married:
			type:'select'
			label:"你觉得在结婚之前至少需要多久的恋爱期？"
			options:'至少两年,至少一年,至少半年,少于半年或不需要'
		
		simple_complex:
			type:'select'
			label:"你更喜欢单纯还是精明的人？"
			options:'单纯,精明'
		
		previous_picture:
			type:'select'
			label:"Ta还留着前任的照片，会让你觉得恼火吗？"
			options:'是,否'
		
		sleeping:
			type:'select'
			label:"你更喜欢睡觉时..."
			options:'分床睡,一起睡，但是身体不接触,靠着睡,抱着睡'
		
		children:
			type:'select'
			label:"你想要几个孩子？"
			options:'不要,一个,两个,三个及以上'
		
		boyfriend_girlfriend:
			type:'select'
			label:"你有过女朋友/男朋友吗？"
			options:'没有,有过'
		
		challenge:
			type:'select'
			label:"你面临一项挑战，几乎不可能完成，你希望Ta会怎么做？"
			options:'全力支持,提醒你认清现实,不介入，失败的时候安慰你'
		
		dinner:
			type:'select'
			label:"Ta的前任来到你们的城市，Ta将与前任共进晚餐，你会怎么做？"
			options:'相信爱情，不反对,不会激动，但会跟着去,绝不允许'

		thing_work_out:
			type:'select'
			label:"你喜欢花时间研究事物的原理吗？"
			options:'我是信息的海绵,有时会感兴趣,完全没兴趣'
		

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
