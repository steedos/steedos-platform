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
			company_signed_id:
				type: "lookup"
				reference_to: "users"
			customer_id:
				label: "客户(单选)"
				type: "lookup"
				reference_to: "crm_customers"
			customer_ids:
				label: "客户(多选)"
				type: "lookup"
				reference_to: "crm_customers"
				multiple: true
			object_switche_id:
				label: "客户/用户(单选)"
				type: "lookup"
				reference_to: ["crm_customers", "users"]
				group: "可选择对象测试区"
			object_switche_ids:
				label: "客户/用户(多选)"
				type: "lookup"
				reference_to: ["crm_customers", "users"]
				multiple: true
				group: "可选择对象测试区"
			site:
				type: "lookup"
				reference_to: "cms_sites"
				group: "filters测试区"
			category:
				type: "lookup"
				reference_to: "cms_categories"
				filters: [["site", "$eq", "{site}"]]  # {site} 必须要在depend_on数组中
				depend_on: ["site"]
				group: "filters测试区",
			archives_files_clerical:
				type: "lookup"
				reference_to: "archives_files_clerical"
				group: "is_name测试区"
				is_wide: true

		list_views:
			default:
				columns: ["name", "customer_id", "customer_ids", "object_switche_ids"]
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