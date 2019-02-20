Creator.Objects.instances_statistic =
	name: "instances_statistic"
	icon: "metrics"
	label: "审批效率"
	fields:
		user:
			type: "master_detail"
			label:"用户"
			reference_to: "users"
		year:
			type:"number"
			label:"年度"
		month:
			type:"number"
			label:"月度"
		month_finished_count:
			type:"number"
			label:"已处理总数"
		inbox_count:
			type:"number"
			label:"待处理总数"
		month_finished_time:
			type:"number"
			scale:2
			label:"已处理总耗时"
		inbox_time:
			type:"number"
			scale:2
			label:"待审核总耗时"
		month_finished_avg:
			type:"number"
			scale:2
			label:"已处理平均耗时"
		inbox_avg:
			type:"number"
			scale:2
			label:"待处理平均耗时"
		avg_time:
			type:"number"
			scale:2
			label:"总平均耗时"
		owner_organization:
			label:"主部门"
			type: "lookup"
			reference_to: "organizations"
		owner_organizations:
			label:"所属部门"
			type: "lookup"
			reference_to: "organizations"
			multiple: true
			defaultValue: []
		company_id:
			required: Meteor.settings?.public?.is_group_company
			omit: false
			hidden: false

	list_views:
		all:
			label: "所有"
			filter_scope: "space"
			columns: ["user","year","month",
			"month_finished_count","inbox_count",
			"month_finished_time","inbox_time",
			"month_finished_avg","inbox_avg","avg_time",
			"owner_organization",
			"owner_organizations","company_id"]

	permission_set:
		user:
			allowCreate: false
			allowDelete: false
			allowEdit: false
			allowRead: true
			modifyAllRecords: false
			viewAllRecords: false
		admin:
			allowCreate: false
			allowDelete: false
			allowEdit: false
			allowRead: false
			modifyAllRecords: false
			viewAllRecords: true
		workflow_admin:
			allowCreate: false
			allowDelete: false
			allowEdit: false
			allowRead: false
			modifyAllRecords: false
			viewAllRecords: false
			modifyCompanyRecords: true
			viewCompanyRecords: true
			disabled_list_views: []
			disabled_actions: []
			unreadable_fields: []
			uneditable_fields: []
			unrelated_objects: []