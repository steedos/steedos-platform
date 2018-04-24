Creator.Objects.categories =
	name: "categories"
	icon: "metrics"
	label: "分类"
	fields:
		name:
			type: "text"
			label: "名称"

	list_views:
		all:
			filter_scope: ""
			columns: ["name"]

	permission_set:
		user:
			allowCreate: false
			allowDelete: false
			allowEdit: false
			allowRead: true
			modifyAllRecords: false
			viewAllRecords: true
		admin:
			allowCreate: false
			allowDelete: false
			allowEdit: true
			allowRead: true
			modifyAllRecords: false
			viewAllRecords: true