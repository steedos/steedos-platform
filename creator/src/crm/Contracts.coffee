Creator.Objects.contracts = 
	name: "contracts"
	label: "合同"
	icon: "contract"
	enable_files: true
	enable_search: true
	enable_tasks: true
	fields:
		name: 
			label: "名称"
			type: "text"
			defaultValue: ""
			description: ""
			inlineHelpText: ""
			required: true
		amount:
			label: "金额"
			type: "currency"
		start_date:
			label: "开始日期"
			type: "date"
		end_date: 
			label: "结束日期"
			type: "date"
		company_signed_id:
			label: "公司签约人"
			type: "lookup"
			reference_to: "users"
		company_signed_date: 
			label: "公司签字日期"
			type: "date"
		customer_id:
			label: "客户"
			type: "master_detail"
			reference_to: "companies"
		customer_signed_date:
			label: "客户签字日期" 
			type: "date"
		description: 
			label: "描述"
			type: "textarea"
			is_wide: true


	list_views:
		default:
			columns: ["name", "customer_id", "amount", "company_signed_date", "company_signed_id"]
		recent:
			filter_scope: "space"
		all:
			filter_scope: "space"
			columns: ["name", "description", "modified", "owner"]
		mine:
			filter_scope: "mine"
