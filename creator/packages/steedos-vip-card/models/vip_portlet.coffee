Creator.Objects.vip_portlet =
	name: "vip_portlet"
	label: "主页模块"
	icon: "lead_list"
	enable_files:true
	fields:
		name:
			label:'标题'
			type:'text'
			required:true
			group:'-'
		# avatar:
		# 	label:'图标图片'
		# 	type:'image'
		# 	required:true

		related_to:
			label: "关联到"
			type: "lookup"
			reference_to: ['post_category','vip_product_category']
			# options:[
			# 	{label:'动态',value:'post'},
			# 	{label:'栏目',value:'post_category'},
			# 	{label:'商品',value:'vip_product'},
			# 	{label:'商品分类',value:'vip_product_category'},
			# 	{label:'活动',value:c},
			# ]
			required:true
			group:'-'

		sort_no:
			label:'排序号'
			type:'number'
			group:'-'
		enabled:
			label:'是否启用'
			type:'boolean'
	list_views:
		all:
			label: "所有"
			columns: ["name", "sort_no", "enabled", "related_to"]
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
		member:
			allowCreate: false
			allowDelete: false
			allowEdit: false
			allowRead: false
			modifyAllRecords: false
			viewAllRecords: true
		guest:
			allowCreate: false
			allowDelete: false
			allowEdit: false
			allowRead: false
			modifyAllRecords: false
			viewAllRecords: true
		 
