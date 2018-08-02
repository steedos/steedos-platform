Creator.Objects.love_answer =
	name: "love_answer"
	label: "交友问答"
	icon: "event"
	enable_search: true
	fields:	
		astrological:
			type:'select'
			label:"你相信星座吗？"
			options: "相信:相信,不相信:不相信,无所谓:无所谓"
		astrological_o:
			type:'select'
			label:"对方是否相信星座"
			multiple:true
		astrological_i:
			type:'select'
			label:[{label:'跳过',value:-1},
					{label:'全选',value:0},
					{label:'未全选',value:1},
					{label:'重要',value:2}]
		
		employed:
			type:'select'
			label:"你的工作状况？"
			options: "全职:全职,兼职:兼职,学生:学生"
		employed_o:
			type:'select'
			label:"对方工作状况"
			multiple:true
		employed_i:
			type:'select'
			label:[{label:'跳过',value:-1},
					{label:'全选',value:0},
					{label:'未全选',value:1},
					{label:'重要',value:2}]
				
		body_type:
			type:'text'
			label:"你的体型？"
			options: "骨感:骨感,微瘦:微瘦,标准:标准,微胖:微胖,胖:胖"
		body_type_o:
			type:'select'
			label:"对方体型"
			multiple:true
		body_type_i:
			type:'select'
			label:[{label:'跳过',value:-1},
					{label:'全选',value:0},
					{label:'未全选',value:1},
					{label:'重要',value:2}]
		
		education:
			type:'select'
			label:"你的学历？"
			options: "高中及以下,大专,本科,硕士,博士及以上"
		education_o:
			type:'select'
			label:"对方学历"
			multiple:true
		education_i:
			type:'select'
			label:[{label:'跳过',value:-1},
					{label:'全选',value:0},
					{label:'未全选',value:1},
					{label:'重要',value:2}]
		
		morning:
			type:'select'
			label:"你是习惯早起的人吗？"
			options:'是,不是'
		morning_o:
			type:'select'
			label:"对方早起"
			multiple:true
		morning_i:
			type:'select'
			label:[{label:'跳过',value:-1},
					{label:'全选',value:0},
					{label:'未全选',value:1},
					{label:'重要',value:2}]

		messy:
			type:'select'
			label:"你介意同特别邋遢的人交往吗？"
			options:'介意,不介意'
		messy_o:
			type:'select'
			label:"介意对方邋遢？"
			multiple:true
		messy_i:
			type:'select'
			label:[{label:'跳过',value:-1},
					{label:'全选',value:0},
					{label:'未全选',value:1},
					{label:'重要',value:2}]

		scary_movie:
			type:'select'
			label:"你喜欢悬疑电影吗？"
			options:'喜欢,不喜欢'
		scary_movie_o:
			type:'select'
			label:"对方悬疑？"
			multiple:true
		scary_movie_i:
			type:'select'
			label:[{label:'跳过',value:-1},
					{label:'全选',value:0},
					{label:'未全选',value:1},
					{label:'重要',value:2}]

		disgust_smoke:
			type:'select'
			label:"你觉得吸烟是令人厌恶的行为吗？"
			options:'是,不是'
		disgust_smoke_o:
			type:'select'
			label:'对方厌恶吸烟'
			multiple:true
		disgust_smoke_i:
			type:'select'
			label:[{label:'跳过',value:-1},
					{label:'全选',value:0},
					{label:'未全选',value:1},
					{label:'重要',value:2}]
		
		jealousy:
			type:'select'
			label:"你认为吃醋是正常且对恋情有益的吗？"
			options:'是,不是'
		jealousy_o:
			type:'select'
			label:"对方吃醋？"
			multiple:true
		jealousy_i:
			type:'select'
			label:[{label:'跳过',value:-1},
					{label:'全选',value:0},
					{label:'未全选',value:1},
					{label:'重要',value:2}]
		
		spelling_mistake:
			type:'select'
			label:"看见错别字会让你感觉不舒服吗？"
			options:'是,不是'
		spelling_mistake_o:
			type:'select'
			label:"对方错别字？"
			multiple:true
		spelling_mistake_i:
			type:'select'
			label:[{label:'跳过',value:-1},
					{label:'全选',value:0},
					{label:'未全选',value:1},
					{label:'重要',value:2}]

		beer:
			type:'select'
			label:"你喜欢啤酒的味道吗？"
			options:'喜欢,不喜欢'
		beer_o:
			type:'select'
			label:"对方啤酒？"
			multiple:true
		beer_i:
			type:'select'
			label:[{label:'跳过',value:-1},
					{label:'全选',value:0},
					{label:'未全选',value:1},
					{label:'重要',value:2}]

		intellectual:
			type:'select'
			label:"你经常和别人进行理性且深层次的辩论吗？"
			options:'是,不是'
		intellectual_o:
			type:'select'
			label:"理性且深层次的辩论"
			multiple:true
		intellectual_i:
			type:'select'
			label:[{label:'跳过',value:-1},
					{label:'全选',value:0},
					{label:'未全选',value:1},
					{label:'重要',value:2}]
		
		bedroom_tv:
			type:'select'
			label:"你的卧室里有电视吗？"
			options:'有,没有'
		bedroom_tv_o:
			type:'select'
			label:"卧室电视"
			multiple:true
		bedroom_tv_i:
			type:'select'
			label:[{label:'跳过',value:-1},
					{label:'全选',value:0},
					{label:'未全选',value:1},
					{label:'重要',value:2}]
		
		married:
			type:'select'
			label:"你想尽快结婚吗？"
			options:'当然,看缘分,不'
		married_o:
			type:'select'
			label:"尽快结婚"
			multiple:true
		married_i:
			type:'select'
			label:[{label:'跳过',value:-1},
					{label:'全选',value:0},
					{label:'未全选',value:1},
					{label:'重要',value:2}]
		
		politics:
			type:'select'
			label:"你喜欢讨论时政吗？"
			options:'喜欢,不喜欢'
		politics_o:
			type:'select'
			label:"讨论时政"
			multiple:true
		politics_i:
			type:'select'
			label:[{label:'跳过',value:-1},
					{label:'全选',value:0},
					{label:'未全选',value:1},
					{label:'重要',value:2}]

		debt:
			type:'select'
			label:"你介意与有大额债务的人交往吗？"
			options:'不介意,看情况,介意'
		debt_o:
			type:'select'
			label:"大额债务"
			multiple:true
		debt_i:
			type:'select'
			label:[{label:'跳过',value:-1},
					{label:'全选',value:0},
					{label:'未全选',value:1},
					{label:'重要',value:2}]
		
		appeal_event:
			type:'select'
			label:"下列哪项活动对你最有吸引力？"
			options:'科技展,时装周,音乐会,动漫展,游戏展'
		appeal_event_o:
			type:'select'
			label:"最吸引的活动"
			multiple:true
		appeal_event_i:
			type:'select'
			label:[{label:'跳过',value:-1},
					{label:'全选',value:0},
					{label:'未全选',value:1},
					{label:'重要',value:2}]
		value_most:
			type:'select'
			label:"下列哪项能力你认为更重要？"
			options:'逻辑/数学,社交/人际关系,视觉/艺术'
		value_most_o:
			type:'select'
			label:"更重要的能力"
			multiple:true
		value_most_i:
			type:'select'
			label:[{label:'跳过',value:-1},
					{label:'全选',value:0},
					{label:'未全选',value:1},
					{label:'重要',value:2}]
		
		communicate:
			type:'select'
			label:"你是不是每天都要和你的另一半交流(电话、微信、当面都可以)？"
			options:'是的，必须的,是的，除非特殊情况,不，没必要,不，我不喜欢每天交流'
		communicate_o:
			type:'select'
			label:"每天交流"
			multiple:true
		communicate_i:
			type:'select'
			label:[{label:'跳过',value:-1},
					{label:'全选',value:0},
					{label:'未全选',value:1},
					{label:'重要',value:2}]
		
		worry_about:
			type:'select'
			label:"你会为了一些你控制不了的事情操心吗？"
			options:'会,不会'
		worry_about_o:
			type:'select'
			label:"控制不了的事情操心"
			multiple:true
		worry_about_i:
			type:'select'
			label:[{label:'跳过',value:-1},
					{label:'全选',value:0},
					{label:'未全选',value:1},
					{label:'重要',value:2}]
		
		do_nothing:
			type:'select'
			label:"如果一天你什么事都没做，你会感觉怎么样？"
			options:'好,不好'
		do_nothing_o:
			type:'select'
			label:"什么事都没做，你的心情"
			multiple:true
		do_nothing_i:
			type:'select'
			label:[{label:'跳过',value:-1},
					{label:'全选',value:0},
					{label:'未全选',value:1},
					{label:'重要',value:2}]
		
		flicp_coin:
			type:'select'
			label:"你会通过抛硬币的方式，来做一些生活中的重要决定吗？"
			options:'会,偶,绝不'
		flicp_coin_o:
			type:'select'
			label:"抛硬币"
			multiple:true
		flicp_coin_i:
			type:'select'
			label:[{label:'跳过',value:-1},
					{label:'全选',value:0},
					{label:'未全选',value:1},
					{label:'重要',value:2}]
		
		pet:
			type:'select'
			label:"你会让你的宠物睡在你的床上吗？"
			options:'会,不会'
		pet_o:
			type:'select'
			label:"宠物"
			multiple:true
		pet_i:
			type:'select'
			label:[{label:'跳过',value:-1},
					{label:'全选',value:0},
					{label:'未全选',value:1},
					{label:'重要',value:2}]
		
		# investigate:
		# 	type:'select'
		# 	label:"你宠物睡在你的床上吗？"
		# 	options:'允许,不允许'
		
		more_into:
			type:'select'
			label:"你希望你的的理想伴侣更热衷于？"
			options:'运动,阅读,音乐,电影'
		more_into_o:
			type:'select'
			label:"理想伴侣更热衷于"
			multiple:true
		more_into_i:
			type:'select'
			label:[{label:'跳过',value:-1},
					{label:'全选',value:0},
					{label:'未全选',value:1},
					{label:'重要',value:2}]
		
		meditate:
			type:'select'
			label:"你经常冥思吗？"
			options:'经常,偶尔,从不'
		meditate_o:
			type:'select'
			label:"理想冥思伴侣更热衷于"
			multiple:true
		meditate_i:
			type:'select'
			label:[{label:'跳过',value:-1},
					{label:'全选',value:0},
					{label:'未全选',value:1},
					{label:'重要',value:2}]
		
		finance_budget:
			type:'select'
			label:"你会规划自己的财务开支吗？"
			options:'是,否'
		finance_budget_o:
			type:'select'
			label:"规划自己的财务开支"
			multiple:true
		finance_budget_i:
			type:'select'
			label:[{label:'跳过',value:-1},
					{label:'全选',value:0},
					{label:'未全选',value:1},
					{label:'重要',value:2}]
		
		dangerous:
			type:'select'
			label:"你喜欢冒险吗？"
			options:'是,否'
		dangerous_o:
			type:'select'
			label:"喜欢冒险"
			multiple:true
		dangerous_i:
			type:'select'
			label:[{label:'跳过',value:-1},
					{label:'全选',value:0},
					{label:'未全选',value:1},
					{label:'重要',value:2}]
		
		intellectual_debate:
			type:'select'
			label:"你喜欢谈论政治、科学、哲学话题吗？"
			options:'喜欢讨论,有时会,觉得这是一件无聊乏味的事'
		intellectual_debate_o:
			type:'select'
			label:"谈论政治、科学、哲学"
			multiple:true
		intellectual_debate_i:
			type:'select'
			label:[{label:'跳过',value:-1},
					{label:'全选',value:0},
					{label:'未全选',value:1},
					{label:'重要',value:2}]
		
		appearance_emphasia:
			type:'select'
			label:"你讨厌颜控吗？"
			options:'讨厌,看情况，分程度,不讨厌'
		appearance_emphasia_o:
			type:'select'
			label:"讨厌颜控"
			multiple:true
		appearance_emphasia_i:
			type:'select'
			label:[{label:'跳过',value:-1},
					{label:'全选',value:0},
					{label:'未全选',value:1},
					{label:'重要',value:2}]
		
		hurt_happened:
			type:'select'
			label:"虽然过了很久，你仍然为曾经发生的过某事而伤心吗?"
			options:'是,否'
		hurt_happened_o:
			type:'select'
			label:"为曾经发生的过某事而伤心"
			multiple:true
		hurt_happened_i:
			type:'select'
			label:[{label:'跳过',value:-1},
					{label:'全选',value:0},
					{label:'未全选',value:1},
					{label:'重要',value:2}]
		
		consider_adult:
			type:'select'
			label:"不考虑你现在的年龄，你觉得自己是个成年人吗?"
			options:'是,否'
		consider_adult_o:
			type:'select'
			label:"成年人"
			multiple:true
		consider_adult_i:
			type:'select'
			label:[{label:'跳过',value:-1},
					{label:'全选',value:0},
					{label:'未全选',value:1},
					{label:'重要',value:2}]
		
		parter_to_be:
			type:'select'
			label:"你更喜欢你的另一半是一个什么样的人？"
			options:'主导的,顺从的,平衡的'
		parter_to_be_o:
			type:'select'
			label:"另一半是一个什么样的人"
			multiple:true
		parter_to_be_i:
			type:'select'
			label:[{label:'跳过',value:-1},
					{label:'全选',value:0},
					{label:'未全选',value:1},
					{label:'重要',value:2}]
		
		first_date_say:
			type:'select'
			label:"第一次约会之后，Ta说喜欢你，你会是什么反应？"
			options:'甜蜜,惊恐'
		first_date_say_o:
			type:'select'
			label:"第一次约会之后，Ta说喜欢你"
			multiple:true
		first_date_say_i:
			type:'select'
			label:[{label:'跳过',value:-1},
					{label:'全选',value:0},
					{label:'未全选',value:1},
					{label:'重要',value:2}]
		
		show_your_love:
			type:'select'
			label:'你更喜欢如何表达你的爱？'
			options:"语言：说一些爱Ta的话,行为：做一些对Ta好的事,礼物：送给Ta想要的礼物,接触：给Ta一个爱的拥抱或者吻"
		show_your_love_o:
			type:'select'
			label:"表达你的爱"
			multiple:true
		show_your_love_i:
			type:'select'
			label:[{label:'跳过',value:-1},
					{label:'全选',value:0},
					{label:'未全选',value:1},
					{label:'重要',value:2}]
		
		parter_with_children:
			type:'select'
			label:"如果Ta已经有孩子，你还愿意与Ta交往吗？"
			options:'愿意,不愿意'
		parter_with_children_o:
			type:'select'
			label:"Ta已经有孩子"
			multiple:true
		parter_with_children_i:
			type:'select'
			label:[{label:'跳过',value:-1},
					{label:'全选',value:0},
					{label:'未全选',value:1},
					{label:'重要',value:2}]
		
		inform_detail:
			type:'select'
			label:"在一段认真的感情中，你觉得每天告诉Ta你的生活细节重要吗？"
			options:'重要,不重要,不用每天'
		inform_detail_o:
			type:'select'
			label:"每天告诉Ta你的生活细节"
			multiple:true
		inform_detail_i:
			type:'select'
			label:[{label:'跳过',value:-1},
					{label:'全选',value:0},
					{label:'未全选',value:1},
					{label:'重要',value:2}]
		
		housemate:
			type:'select'
			label:"发现你的约会对象有一个异性的室友，会让你觉得？"
			options:'不舒服,无所谓'
		housemate_o:
			type:'select'
			label:"每天告诉Ta你的生活细节"
			multiple:true
		housemate_i:
			type:'select'
			label:[{label:'跳过',value:-1},
					{label:'全选',value:0},
					{label:'未全选',value:1},
					{label:'重要',value:2}]
		
		quite:
			type:'select'
			label:"你愿意与一个沉默寡言的人约会吗？"
			options:'愿意,不愿意'
		quite_o:
			type:'select'
			label:"沉默寡言的人"
			multiple:true
		quite_i:
			type:'select'
			label:[{label:'跳过',value:-1},
					{label:'全选',value:0},
					{label:'未全选',value:1},
					{label:'重要',value:2}]
		
		before_meeting:
			type:'select'
			label:"在和一个人约会之前，你至少需要和Ta聊多久？"
			options:'立刻，如果Ta的长相很酷,几天,几周,几个月'
		before_meeting_o:
			type:'select'
			label:"约会之前"
			multiple:true
		before_meeting_i:
			type:'select'
			label:[{label:'跳过',value:-1},
					{label:'全选',value:0},
					{label:'未全选',value:1},
					{label:'重要',value:2}]

		before_married:
			type:'select'
			label:"你觉得在结婚之前至少需要多久的恋爱期？"
			options:'至少两年,至少一年,至少半年,少于半年或不需要'
		before_married_o:
			type:'select'
			label:"结婚之前"
			multiple:true
		before_married_i:
			type:'select'
			label:[{label:'跳过',value:-1},
					{label:'全选',value:0},
					{label:'未全选',value:1},
					{label:'重要',value:2}]
		
		simple_complex:
			type:'select'
			label:"你更喜欢单纯还是精明的人？"
			options:'单纯,精明'
		simple_complex_o:
			type:'select'
			label:"单纯还是精明"
			multiple:true
		simple_complex_i:
			type:'select'
			label:[{label:'跳过',value:-1},
					{label:'全选',value:0},
					{label:'未全选',value:1},
					{label:'重要',value:2}]
		
		previous_picture:
			type:'select'
			label:"Ta还留着前任的照片，会让你觉得恼火吗？"
			options:'是,否'
		previous_picture_o:
			type:'select'
			label:"前任的照片"
			multiple:true
		previous_picture_i:
			type:'select'
			label:[{label:'跳过',value:-1},
					{label:'全选',value:0},
					{label:'未全选',value:1},
					{label:'重要',value:2}]
		
		sleeping:
			type:'select'
			label:"你更喜欢睡觉时..."
			options:'分床睡,一起睡，但是身体不接触,靠着睡,抱着睡'
		sleeping_o:
			type:'select'
			label:"前任的照片"
			multiple:true
		sleeping_i:
			type:'select'
			label:[{label:'跳过',value:-1},
					{label:'全选',value:0},
					{label:'未全选',value:1},
					{label:'重要',value:2}]
		
		children:
			type:'select'
			label:"你想要几个孩子？"
			options:'不要,一个,两个,三个及以上'
		children_o:
			type:'select'
			label:"想要几个孩子"
			multiple:true
		children_i:
			type:'select'
			label:[{label:'跳过',value:-1},
					{label:'全选',value:0},
					{label:'未全选',value:1},
					{label:'重要',value:2}]
		
		boyfriend_girlfriend:
			type:'select'
			label:"你有过女朋友/男朋友吗？"
			options:'没有,有过'
		boyfriend_girlfriend_o:
			type:'select'
			label:"女朋友/男朋友"
			multiple:true
		boyfriend_girlfriend_i:
			type:'select'
			label:[{label:'跳过',value:-1},
					{label:'全选',value:0},
					{label:'未全选',value:1},
					{label:'重要',value:2}]
		
		challenge:
			type:'select'
			label:"你面临一项挑战，几乎不可能完成，你希望Ta会怎么做？"
			options:'全力支持,提醒你认清现实,不介入，失败的时候安慰你'
		challenge_o:
			type:'select'
			label:"面临一项挑战"
			multiple:true
		challenge_i:
			type:'select'
			label:[{label:'跳过',value:-1},
					{label:'全选',value:0},
					{label:'未全选',value:1},
					{label:'重要',value:2}]
		
		dinner:
			type:'select'
			label:"Ta的前任来到你们的城市，Ta将与前任共进晚餐，你会怎么做？"
			options:'相信爱情，不反对,不会激动，但会跟着去,绝不允许'
		dinner_o:
			type:'select'
			label:"共进晚餐"
			multiple:true
		dinner_i:
			type:'select'
			label:[{label:'跳过',value:-1},
					{label:'全选',value:0},
					{label:'未全选',value:1},
					{label:'重要',value:2}]


		thing_work_out:
			type:'select'
			label:"你喜欢花时间研究事物的原理吗？"
			options:'我是信息的海绵,有时会感兴趣,完全没兴趣'
		
		alone:
			type:'select'
			label:"你愿意和一个需要大量个人时间的人交往吗？"
			options:'愿意,不愿意'
		
		minimum_page:
			type:'select'
			label:"你的另一半对自己现在极低的工资很满意，也没有机会找一份高薪工作。你觉得是问题吗？"
			options:'是的，我不能接受,看情况，毕竟这是Ta的自由,不是问题'
		
		high_income:
			type:'select'
			label:"你需要自己的理想伴侣有很好的财政收入或者至少有高收入的潜能吗？"
			options:'是的，这很重要,有点看重,无所谓'
		
		parents_influence:
			type:'select'
			label:"父母对你生活的影响有多大?"
			options:'双亲不在了,我会考虑他们的意见，但是听从自己的想法,多数情况下，我会做父母认为对的事,完全按听从父母的'
		
		inclined_interest:
			type:'select'
			label:"除了工作和学习，你有多大可能调查你感兴趣的东西？"
			options:'极大可能,,有点可能,没可能'
		
		food_clothes:
			type:'select'
			label:"你在食品上的开销大还是服装上的开销大？"
			options:'食品,,服装'
		
		video_game:
			type:'select'
			label:"你愿意与一个每天都会花费两个小时在电子游戏上的人交往吗？"
			options:'愿意，我会陪Ta玩,愿意，有时我会陪Ta玩,愿意，但是我不玩游戏,不愿意'
		
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
