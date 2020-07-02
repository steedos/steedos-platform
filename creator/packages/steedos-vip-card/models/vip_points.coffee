Creator.Objects.vip_points =
	name: "vip_points"
	label: "积分"
	icon: "reward"
	fields:
		card:
			label:'会员卡'
			type:'lookup'
			reference_to:'vip_card'
		points:
			label:'积分'
			type:'number'
		location:
			label:'位置'
			type:'location'
		store:
			label:'门店'
			type:'lookup'
			reference_to:'vip_store'
		order:
			label:'订单'
			type:'lookup'
			reference_to:'vip_order'
	list_views:
		all:
			label: "我的"
			columns: ["card", "points", "order","store"]
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