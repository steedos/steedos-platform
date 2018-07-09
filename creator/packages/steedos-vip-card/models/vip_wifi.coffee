Creator.Objects.vip_wifi =
	name: "vip_wifi"
	label: "Wi-Fi"
	icon: "topic"
	fields:
		name:
			type:'text'
			label:'Wi-Fi名称'
			is_name:true
			required:true
		password:
			type:'text'
			label:'Wi-Fi密码'
		
	list_views:
		all:
			label: "所有"
			columns: ["name", "password", "store"]
			filter_scope: "space"
	permission_set:
		user:
			allowCreate: false
			allowDelete: false
			allowEdit: false
			allowRead: true
			modifyAllRecords: false
			viewAllRecords: true
		admin:
			allowCreate: true
			allowDelete: true
			allowEdit: true
			allowRead: true
			modifyAllRecords: true
			viewAllRecords: true
		guest:
			allowCreate: false
			allowDelete: false
			allowEdit: false
			allowRead: true
			modifyAllRecords: false
			viewAllRecords: true
		member:
			allowCreate: false
			allowDelete: false
			allowEdit: false
			allowRead: true
			modifyAllRecords: false
			viewAllRecords: true