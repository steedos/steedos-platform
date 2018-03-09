Creator.Objects.contract_receipts = 
	name: "contract_receipts"
	label: "收款"
	icon: "contract"
	fields:
		contract:
			label: "合同"
			type: "master_detail"
			reference_to: "contracts"
			required: true
		name: 
			label: "名称"
			type: "text"
			required: true
			searchable:true
		amount:
			label: "金额"
			type: "currency"
			required: true
		planned_date:
			label: "计划收款日期"
			type: "currency"
		received_date:
			label: "实际收款日期"
			type: "currency"
		is_received:
			label: "已收款"
			type: "boolean"
		billing_date:
			label: "开票日期"
			type: "date"
		billing_no:
			label: "发票号"
			type: "text"
		description: 
			label: "描述"
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