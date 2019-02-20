Creator.Objects.project_tags =
	name: "project_tags"
	label: "标签"
	icon: "location"
	enable_search: false
	fields:
		name:
			label: '标题'
			type: 'text'
			is_wide: true
			required: true
			searchable: true
		color:
			label: '颜色'
			type: 'text'
		

	list_views:
		all:
			label: "所有"
			columns: ["name", "color"]
			filter_scope: "space"

	permission_set:
		user:
			allowCreate: false
			allowDelete: false
			allowEdit: false
			allowRead: false
			modifyAllRecords: false
			viewAllRecords: true
		admin:
			allowCreate: true
			allowDelete: true
			allowEdit: true
			allowRead: true
			modifyAllRecords: true
			viewAllRecords: true