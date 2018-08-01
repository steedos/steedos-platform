Creator.Objects.love_recommend =
	name: "love_recommend"
	label: "每周推荐结果"
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

