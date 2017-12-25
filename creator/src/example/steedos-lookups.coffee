if Meteor.isDevelopment
	Creator.Objects.steedosLookups =
		name: "steedosLookups"
		label: "steedosLookups"
		icon: "forecasts"
		fields:
			name:
				label: "名称"
				type: "text"
				defaultValue: ""
				description: ""
				inlineHelpText: ""
				required: true
			description:
				label: "描述"
				type: "textarea"
			company_signed_id:
				type: "lookup"
				reference_to: "users"
			company_signed_date:
				type: "date"
			customer_id:
				label: "客户(单选)"
				type: "master_detail"
				reference_to: "crm_customers"
			customer_ids:
				label: "客户(多选)"
				type: "master_detail"
				reference_to: "crm_customers"
				multiple: true
			object_switche_id:
				label: "客户/用户(单选)"
				type: "master_detail"
				reference_to: ["crm_customers", "users"]
			object_switche_ids:
				label: "客户/用户(多选)"
				type: "master_detail"
				reference_to: ["crm_customers", "users"]
				multiple: true
			customer_signed_date:
				type: "date"

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

		related_list:
			crm_contacts:
				columns: ["name", "email", "phone"]