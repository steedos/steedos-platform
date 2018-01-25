Creator.Objects.settings = 
	name: "settings"
	label: "设置"
	icon: "custom"
	fields: 
		type: 
			allowedValues: ["user", "space", "cloud"]
		object_name: 
			type: "text"
			index: true
		record_id:
			type: "text"
			index: true
		settings:
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
