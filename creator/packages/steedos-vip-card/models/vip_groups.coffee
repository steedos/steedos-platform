Creator.Objects.vip_groups =
	name: "vip_groups"
	label: "微信群"
	icon: "event"
	enable_search: true
	fields:
		name:
			label: '名称'
			type: 'text'

		users:
			label:"用户ID"
			type: "[text]"
			index: true

		open_group_id:
			label: "群"
			type: "text"
			index: true

		mini_app_id:
			label: "小程序id"
			type: "text"
			index: true

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
			viewAllRecords: true

