Creator.Objects.contracts = 
	name: "contracts"
	label: "合同"
	icon: "contract"
	enable_files: true
	enable_search: true
	enable_tasks: true
	enable_api: true
	fields:
		name: 
			label: "名称"
			type: "text"
			required: true
			searchable: true
			index: true
			is_wide: true
		owner:
			label: "责任人"
			omit: false
			disabled: true
		amount:
			label: "金额"
			type: "currency"
			required: true
		customer_id:
			label: "客户"
			type: "master_detail"
			reference_to: "accounts"
		signed_date:
			label: "签订日期" 
			type: "date"
		company_signed_id:
			label: "公司签约人"
			type: "lookup"
			reference_to: "users"
		start_date:
			label: "开始日期"
			type: "date"
		end_date: 
			label: "结束日期"
			type: "date"
		description: 
			label: "描述"
			type: "textarea"
			is_wide: true


	list_views:
		default:
			columns: ["name", "customer_id", "amount", "signed_date", "company_signed_id"]
		recent:
			filter_scope: "space"
		all:
			filter_scope: "space"
			columns: ["name", "description", "modified", "owner"]
		mine:
			filter_scope: "mine"
