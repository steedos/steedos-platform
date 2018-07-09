Creator.Objects.vip_share_gift =
	name: "vip_share_gift"
	label: "分享赠礼"
	icon: "reward"
	fields:
		name:
			label:'名称'
			type:'text'
			#礼物的名称
		vip_share:
			label:'分享人'
			type:'lookup'
			reference_to:'vip_share'
		product:
			label: "关联到"
			type: "lookup"
			reference_to: 'vip_product'
		# count:
		# 	label:'份数'
		# 	type:'number'
		# 	defaultValue:0
		#此表记录的owner和vip_share的owner一致
	list_views:
		all:
			label: "所有"
			columns: ["name", "owner","created"]
			filter_scope: "space"
	permission_set:
		user:
			allowCreate: true
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
			allowCreate: true
			allowDelete: false
			allowEdit: false
			allowRead: true
			modifyAllRecords: false
			viewAllRecords: false
		guest:
			allowCreate: true
			allowDelete: false
			allowEdit: false
			allowRead: true
			modifyAllRecords: false
			viewAllRecords: false

