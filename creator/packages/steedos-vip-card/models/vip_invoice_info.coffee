Creator.Objects.vip_invoice_info =
	name: "vip_invoice_info"
	label: "开票信息"
	icon: "insights"
	fields:
		name:
			label:'单位名称'
			type:'text'
			required:true
		tax_no:
			label:'纳税人识别码'
			type:'text'
			required:true
		address:
			label:'注册地址'
			type:'text'
		phone:
			label:'注册电话'
			type:'text'
		bank:
			label:'开户银行'
			type:'text'
		bank_number:
			label:'银行账户'
			type:'text'
	list_views:
		all:
			label: "我的"
			columns: ["name", "tax_no", "address", "phone", "bank", "bank_number"]
			filter_scope: "space"
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
			modifyAllRecords: false
			viewAllRecords: false
		member:
			allowCreate: true
			allowDelete: true
			allowEdit: true
			allowRead: true
			modifyAllRecords: false
			viewAllRecords: false
		guest:
			allowCreate: true
			allowDelete: true
			allowEdit: true
			allowRead: true
			modifyAllRecords: false
			viewAllRecords: false

