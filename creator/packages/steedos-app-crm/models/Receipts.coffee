Creator.Objects.contract_receipts = 
	name: "contract_receipts"
	label: "收款"
	icon: "orders"
	fields:
		name: 
			label: "名称"
			type: "text"
			required: true
			searchable:true
		contract:
			label: "合同"
			type: "master_detail"
			reference_to: "contracts"
			required: true
		amount:
			label: "金额"
			type: "currency"
			required: true
		is_received:
			label: "已收款"
			type: "boolean"
		planned_date:
			label: "计划收款日期"
			type: "date"
		received_date:
			label: "实际收款日期"
			type: "date"
		billing_date:
			label: "开票日期"
			type: "date"
		billing_no:
			label: "发票号"
			type: "text"
		description: 
			label: "备注"
			type: "textarea"
			is_wide: true

	list_views:
		default:
			columns: ["name", "amount", "contract", "received_date", "planned_date"]

		recent:
			label: "最近查看"
			filter_scope: "space"
		all:
			label: "所有"
			filter_scope: "space"
			
	permission_set:
		user:
			allowCreate: true
			allowDelete: true
			allowEdit: true
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