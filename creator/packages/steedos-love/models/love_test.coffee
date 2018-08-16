Creator.Objects.love_test =
	name: "love_test"
	label: "缘分卷"
	icon: "social"
	enable_search: true
	fields:
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

		first_date_say:
			type:'select'
			label:"你和刚认识的某人第一次约会，临别时对方说爱上你了，你会觉得？"
			options:'甜蜜,可怕'
		first_date_say_o:
			type:'select'
			label:"第一次约会之后，Ta说喜欢你"
			multiple:true
		first_date_say_i:
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

	list_views:
		all:
			label: "所有"
			columns: ["scary_movie", "spelling_mistake", "communicate", "pet", "hurt_happened", "first_date_say", "before_meeting", "previous_picture",
			 "challenge", "dinner"]
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
