Creator.Objects.love_answer =
	name: "love_answer"
	label: "玫瑰卷"
	icon: "social"
	enable_search: true
	fields:
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

		body_type:
			type:'select'
			label:"你的体型？"
			options: "骨感,偏瘦,标准,偏胖,胖"
		body_type_o:
			type:'select'
			label:"体型"
			multiple:true
		body_type_i:
			type:'number'
			label:'重要程度'

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

		hurt_happened:
			type:'select'
			label:"有没有一些事情，虽然过了很久，你还是感觉很受伤?"
			options:'有,没有'
		hurt_happened_o:
			type:'select'
			label:"为曾经发生的过某事而伤心"
			multiple:true
		hurt_happened_i:
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

		parter_to_be:
			type:'select'
			label:"你希望对方是一个什么样的人？"
			options:'主导型,顺从型,平衡型'
		parter_to_be_o:
			type:'select'
			label:"对方是一个什么样的人"
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
			label:"你愿意与一个爱打游戏的人交往吗？"
			options:'愿意，我会一起玩,愿意，有时我会一起玩,愿意，但是我不玩游戏,不愿意'
		video_game_o:
			type:'select'
			label:"爱打游戏的人"
			multiple:true
		video_game_i:
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
