Creator.Objects.vip_share_response =
	name: "vip_share_response"
	label: "响应分享"
	icon: "partners"
	fields:
		name:
			label:'响应人'
			type:'text'
			#owner.name
		share:
			label:'分享人'
			type:'lookup'
			reference_to:'vip_share'
		# related_to:
		# 	label: "关联到"
		# 	type: "lookup"
		# 	reference_to: 'vip_product'
	list_views:
		all:
			label: "所有"
			columns: ["name","share","created"]
			filter_scope: "space"
	permission_set:
		user:
			allowCreate: true
			allowDelete: false
			allowEdit: true
			allowRead: true
			modifyAllRecords: false
			viewAllRecords: true
		admin:
			allowCreate: true
			allowDelete: false
			allowEdit: true
			allowRead: true
			modifyAllRecords: false
			viewAllRecords: true
		member:
			allowCreate: true
			allowDelete: false
			allowEdit: true
			allowRead: true
			modifyAllRecords: false
			viewAllRecords: true
		guest:
			allowCreate: true
			allowDelete: false
			allowEdit: true
			allowRead: true
			modifyAllRecords: false
			viewAllRecords: true
