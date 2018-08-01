Creator.Objects.love_recommend_history =
	name: "love_recommend_history"
	label: "每周推荐历史"
	icon: "event"
	enable_search: true
	fields:
		user_a:
			label:"第一个用户ID"
			type: "lookup"
			reference_to: "users"
			index: true

		user_b:
			label:"第二个用户ID"
			type: "lookup"
			reference_to: "users"
			index: true

		recommend_date:
			label:"推荐时间"
			type: "datetime"

	list_views:
		all:
			label: "所有"
			columns: ["name"]
			filter_scope: "space"

	permission_set:
		user:
			allowCreate: false
			allowDelete: false
			allowEdit: false
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
			allowCreate: false
			allowDelete: false
			allowEdit: false
			allowRead: true
			modifyAllRecords: false
			viewAllRecords: false
		guest:
			allowCreate: false
			allowDelete: false
			allowEdit: false
			allowRead: true
			modifyAllRecords: false
			viewAllRecords: false

