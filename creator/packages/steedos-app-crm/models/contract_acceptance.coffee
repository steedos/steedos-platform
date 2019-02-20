Creator.Objects.contract_acceptances =
	name: "contract_acceptances"
	label: "验收"
	icon: "orders"
	enable_files: true
	enable_instances: true
	fields:
		name:
			label: "名称"
			type: "text"
			required: true
			searchable:true
			is_wide: true
		contract:
			label: "合同"
			type: "master_detail"
			reference_to: "contracts"
			required: true
			sortable: true
		account:
			label: "单位"
			type: "master_detail"
			reference_to: "accounts"
			sortable: true
		
		due_date:
			label: "计划验收日期"
			type: "date"
			sortable: true
		
		accept_date:
			label: "实际验收日期"
			type: "date"
			sortable: true
		
		description:
			label: "验收意见"
			type: "textarea"
			is_wide: true

		company_id:
			required: true
			omit: false
			hidden: false

	list_views:
		recent:
			label: "最近查看"
			filter_scope: "space"
		all:
			label: "所有"
			columns: ["name", "contract","account", "due_date", "accept_date"]
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
			modifyAllRecords: true
			viewAllRecords: true