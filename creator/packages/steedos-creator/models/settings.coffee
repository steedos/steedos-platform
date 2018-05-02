Creator.Objects.settings = 
	name: "settings"
	label: "设置"
	icon: "custom"
	fields: 
		type: 
			label: "类型"
			allowedValues: ["user", "space", "cloud"]
		object_name: 
			label: "对象名"
			type: "text"
			index: true
		record_id:
			label: "记录ID"
			type: "text"
			index: true
		settings:
			label: "设置"
			type: Object
			blackbox: true

	permission_set:
		user:
			allowCreate: true
			allowDelete: true
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
