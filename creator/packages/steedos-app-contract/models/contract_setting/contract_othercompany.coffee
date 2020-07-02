Creator.Objects.contract_othercompany = 
	name: "contract_othercompany"
	icon: "flow"
	label: "对方单位"
	enable_search: false
	fields:
		number:
			type: "number"
			label: "排序号"
		idcode:
			type: "text"
			label: "单位代码"
			required:true
		name:
			type: "text"
			label: "单位名称"
			required:true
		zhucezijin:
			type: "number"
			label: "注册资金"
			required:true
		isConnectedTransaction:
			type:"boolean"
			label:"是否关联交易"
			required:true
			defaultValue: false
		remarks:
			type: "text"
			label: "备注"
		created:
			type: "datetime"
			label: "创建时间"
		created_by:
			type: "text"
			label: "创建人"
			hidden: true
		modified:
			type: "datetime"
			label: "修改时间"
		modified_by:
			type: "text"
			label: "修改人"
			hidden: true
		
	permission_set:
		user:
			allowCreate: false
			allowDelete: false
			allowEdit: false
			allowRead: false
			modifyAllRecords: false
			viewAllRecords: false 
		admin:
			allowCreate: true
			allowDelete: true
			allowEdit: true
			allowRead: true
			modifyAllRecords: true
			viewAllRecords: true 
	
	list_views:
		all:
			columns:["name","name","number","isConnectedTransaction"]
			filter_scope: "space"
			label:"全部"