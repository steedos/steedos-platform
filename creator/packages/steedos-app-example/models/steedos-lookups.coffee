if Meteor.isDevelopment
	Creator.Objects.steedosLookups =
		name: "steedosLookups"
		label: "steedosLookups"
		icon: "forecasts"
		enable_files: true
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
				reference_to: "companies"
			customer_ids:
				label: "客户(多选)"
				type: "lookup"
				reference_to: "companies"
				multiple: true
			object_switche_id:
				label: "客户/用户(单选)"
				type: "lookup"
				reference_to: ["companies", "users"]
				group: "可选择对象测试区"
			object_switche_ids:
				label: "客户/用户(多选)"
				type: "lookup"
				reference_to: ["companies", "users"]
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
				reference_to: "archive_records"
				group: "is_name测试区"
				is_wide: true
			boolean:
				label: 'boolean值测试'
				type: "boolean"
			company:
				type: "text",
				label:"报送公司"
				defaultValue: "{user.organization.name}"
				required: true
				is_wide:true
				group: "默认值为公式：当前用户主部门"
			CObject:
				type: "lookup"
				optionsFunction: ()->
					_options = []
					_.forEach Creator.Objects, (o, k)->
						_options.push {label: o.label, value: k, icon: o.icon}
					return _options
				group: "options function test"
				defaultIcon: "entity"
			options_fun:
				type: "lookup"
				multiple: true
				depend_on: ["CObject"]
				defaultIcon: "service_contract"
				optionsFunction: (values)->
					_options = []
					_object = Creator.getObject(values.CObject)
					fields = _object.fields
					icon = _object.icon

					_.forEach fields, (f, k)->
						_options.push {label: f.label || k, value: k, icon: icon}

					return _options
				group: "options function test"

		list_views:
			default:
				columns: ["name", "customer_id", "customer_ids", "object_switche_ids", "boolean", "CObject", "options_fun"]
			recent:
				filter_scope: "space"
			all:
				filter_scope: "space"
				columns: ["name", "description", "modified", "owner"]
			mine:
				filter_scope: "mine"
