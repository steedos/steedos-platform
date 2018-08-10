Creator.Objects.love_friends =
	name: "love_friends"
	label: "好友"
	icon: "event"
	enable_search: true
	fields:

		user_b:
			label:"第二个用户ID"
			type: "lookup"
			reference_to: "users"
			index: true

		a_to_b:
			label:"我喜欢的"
			type: "number"
			scale: 2

		b_to_a:
			label:"适合我的"
			type: "number"
			scale: 2

		match:
			label:"互相匹配度"
			type: "number"
			scale: 2

		open_group_id:
			label: "群"
			type: "text"

		owner:
			label:"第一个用户ID"
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

