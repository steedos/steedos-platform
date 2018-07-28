Creator.Objects.love_hobby =
	name: "love_hobby"
	label: "兴趣爱好"
	icon: "event"
	enable_search: true
	fields:
		sport:
			type:'text'
			label:"你最喜欢的运动？"
		star:
			type:'text'
			label:"你最喜欢的明星？"
		movie_type:
			type:'text'
			label:"你最喜欢的电影？"
		game:
			type:'text'
			label:"你最喜欢的游戏？"
		travel:
			type:'text'
			label:"你最想去旅行的城市？"
		book:
			type:'text'
			label:"你最推荐的书籍？"
		music:
			type:'text'
			label:"你最喜欢的一首歌？"
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

