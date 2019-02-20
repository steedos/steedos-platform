Creator.Objects.contract_company_type = 
	name: "contract_company_type"
	icon: "product_item"
	label: "承办公司类别"
	fields:
		no:
			type: "number"
			label: "编号"
		name:
			type: "text"
			label: "名称"
		state:
			type: "select"
			label:"状态"
			defaultValue: "停用"
			options:[
				{label:"启用",value:"启用"},
				{label:"停用",value:"停用"}],
			allowedValues:["启用","停用"]
	
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
			label: "全部"
			filter_scope: "space"
			columns:["no","name","state"]