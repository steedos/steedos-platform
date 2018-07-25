Creator.Objects.love_hobby =
	name: "love_hobby"
	label: "兴趣爱好"
	icon: "event"
	enable_search: true
	fields:
		sport:
			type:'text'
			label:"运动"
		star:
			type:'text'
			label:"明星"
		movie_type:
			type:'text'
			label:"影视类型"
		game:
			type:'text'
			label:"游戏"
		travel:
			type:'text'
			label:"旅游目的地"
		book:
			type:'text'
			label:"我最推荐的书籍"
		music:
			type:'text'
			label:"我喜欢的音乐"
	list_views:
		all:
			label: "所有"
			columns: ["sport", "star", "movie_type", "game","travel", "book", "music"]
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

