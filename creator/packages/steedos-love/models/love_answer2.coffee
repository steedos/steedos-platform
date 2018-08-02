Creator.Objects.love_answer =
	name: "love_answer"
	label: "交友问答(中阶)"
	icon: "event"
	enable_search: true
	fields:					
		astrological:
			type:'select'
			label:"你相信星座吗？"
			options: "相信,不相信,无所谓"
		astrological_o:
			type:'select'
			label:"对方是否相信星座"
			multiple:true
		astrological_i:
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
		
		scary_movie:
			type:'select'
			label:"你喜欢悬疑电影吗？"
			options:'喜欢,不喜欢'
		scary_movie_o:
			type:'select'
			label:"对方悬疑"
			multiple:true
		scary_movie_i:
			type:'number'
			label:'重要程度'

		debt:
			type:'select'
			label:"你介意与有大额债务的人交往吗？"
			options:'不介意,看情况,介意'
		debt_o:
			type:'select'
			label:"大额债务"
			multiple:true
		debt_i:
			type:'number'
			label:'重要程度'

		do_nothing:
			type:'select'
			label:"如果一天你什么事都没做，你会感觉怎么样？"
			options:'好,不好'
		do_nothing_o:
			type:'select'
			label:"什么事都没做，你的心情"
			multiple:true
		do_nothing_i:
			type:'number'
			label:'重要程度'

		more_into:
			type:'select'
			label:"你希望你的的理想伴侣更热衷于？"
			options:'运动,阅读,音乐,电影'
		more_into_o:
			type:'select'
			label:"理想伴侣更热衷于"
			multiple:true
		more_into_i:
			type:'number'
			label:'重要程度'

		appearance_emphasia:
			type:'select'
			label:"你讨厌颜控吗？"
			options:'讨厌,看情况，分程度,不讨厌'
		appearance_emphasia_o:
			type:'select'
			label:"讨厌颜控"
			multiple:true
		appearance_emphasia_i:
			type:'number'
			label:'重要程度'
		
		hurt_happened:
			type:'select'
			label:"有没有一些事情，虽然过了很久，你还是感觉很受伤?"
			options:'是,否'
		hurt_happened_o:
			type:'select'
			label:"为曾经发生的过某事而伤心"
			multiple:true
		hurt_happened_i:
			type:'number'
			label:'重要程度'

		first_date_say:
			type:'select'
			label:"你和刚认识的某人第一次约会，临别时，Ta说：“我觉得我爱上你了”，你会觉得？"
			options:'甜蜜,可怕'
		first_date_say_o:
			type:'select'
			label:"第一次约会之后，Ta说喜欢你"
			multiple:true
		first_date_say_i:
			type:'number'
			label:'重要程度'

		parter_with_children:
			type:'select'
			label:"如果对方已经有孩子，你还愿意交往吗？"
			options:'愿意,不愿意'
		parter_with_children_o:
			type:'select'
			label:"Ta已经有孩子"
			multiple:true
		parter_with_children_i:
			type:'number'
			label:'重要程度'

		quite:
			type:'select'
			label:"你愿意与一个安静的人约会吗？"
			options:'愿意,不愿意'
		quite_o:
			type:'select'
			label:"安静的人"
			multiple:true
		quite_i:
			type:'number'
			label:'重要程度'

		thing_work_out:
			type:'select'
			label:"你喜欢花时间探索事物背后的工作原理吗？"
			options:'我都会很感兴趣,有时会感兴趣,完全没兴趣'
		thing_work_out_o:
			type:'select'
			label:"探索事物背后的工作原理"
			multiple:true
		thing_work_out_i:
			type:'number'
			label:'重要程度'

		alone:
			type:'select'
			label:"你愿意和一个需要大量独处时间的人交往吗？"
			options:'愿意,不愿意'
		alone_o:
			type:'select'
			label:"大量独处时间的人"
			multiple:true
		alone_i:
			type:'number'
			label:'重要程度'

		high_income:
			type:'select'
			label:"你的理想伴侣是高收入者，或者有成为高收入者的潜力？"
			options:'是的，这很重要,有点看重,无所谓'
		high_income_o:
			type:'select'
			label:"高收入"
			multiple:true
		high_income_i:
			type:'number'
			label:'重要程度'

		intellectual_debate:
			type:'select'
			label:"你喜欢讨论科学、哲学话题吗？"
			options:'喜欢讨论,有时会,觉得这是一件无聊乏味的事'
		intellectual_debate_o:
			type:'select'
			label:"谈论科学、哲学"
			multiple:true
		intellectual_debate_i:
			type:'number'
			label:'重要程度'

		simple_complex:
			type:'select'
			label:"你更喜欢单纯还是精明的人？"
			options:'单纯,精明'
		simple_complex_o:
			type:'select'
			label:"单纯还是精明"
			multiple:true
		simple_complex_i:
			type:'number'
			label:'重要程度'

		sleeping:
			type:'select'
			label:"你更喜欢睡觉时..."
			options:'分床睡,一起睡，但是不挨着,靠着睡,抱着睡'
		sleeping_o:
			type:'select'
			label:"喜欢睡觉时"
			multiple:true
		sleeping_i:
			type:'number'
			label:'重要程度'

		children:
			type:'select'
			label:"你想要几个孩子？"
			options:'不要,一个,两个,三个及以上'
		children_o:
			type:'select'
			label:"想要几个孩子"
			multiple:true
		children_i:
			type:'number'
			label:'重要程度'

		dinner:
			type:'select'
			label:"Ta的前任来到你们的城市，Ta计划独自与前任共进晚餐，你会怎么做？"
			options:'相信爱情，不反对,不会激动，但会跟着去,绝不允许'
		dinner_o:
			type:'select'
			label:"共进晚餐"
			multiple:true
		dinner_i:
			type:'number'
			label:'重要程度'

		housemate:
			type:'select'
			label:"发现你的约会对象有一个异性的室友，会让你觉得？"
			options:'不舒服,无所谓'
		housemate_o:
			type:'select'
			label:"异性的室友"
			multiple:true
		housemate_i:
			type:'number'
			label:'重要程度'
		
		politics:
			type:'select'
			label:"你喜欢讨论时政吗？"
			options:'喜欢,不喜欢'
		politics_o:
			type:'select'
			label:"讨论时政"
			multiple:true
		politics_i:
			type:'number'
			label:'重要程度'

		worry_about:
			type:'select'
			label:"你会经常发现自己为一些控制不了事情而操心吗？"
			options:'会,不会'
		worry_about_o:
			type:'select'
			label:"控制不了的事情操心"
			multiple:true
		worry_about_i:
			type:'number'
			label:'重要程度'

		meditate:
			type:'select'
			label:"你经常沉思吗？"
			options:'经常,偶尔,从不'
		meditate_o:
			type:'select'
			label:"沉思"
			multiple:true
		meditate_i:
			type:'number'
			label:'重要程度'

		dangerous:
			type:'select'
			label:"你喜欢极限运动吗？"
			options:'喜欢,不喜欢'
		dangerous_o:
			type:'select'
			label:"喜欢极限运动"
			multiple:true
		dangerous_i:
			type:'number'
			label:'重要程度'
		
		challenge:
			type:'select'
			label:"你面临一项挑战，几乎不可能完成，你希望Ta会怎么做？"
			options:'全力支持,提醒你认清现实,不介入，失败的时候安慰你'
		challenge_o:
			type:'select'
			label:"面临一项挑战"
			multiple:true
		challenge_i:
			type:'number'
			label:'重要程度'
		
	list_views:
		all:
			label: "所有"
			columns: ["challenge", "dangerous", "politics", "housemate","sleeping", "simple_complex"]
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
