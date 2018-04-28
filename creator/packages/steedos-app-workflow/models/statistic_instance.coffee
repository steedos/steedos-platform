Creator.Objects.instances_statistic = 
	name: "instances_statistic"
	icon: "metrics"
	label: "审批效率"
	enable_share: true
	fields:
		user:
			type: "master_detail"
			label:"用户"
			reference_to: "users"
			readonly: true
		year:
			type:"number"
			label:"年度"
			readonly: true			
		month:
			type:"number"
			label:"月度"
			readonly: true			
		month_finished_count:
			type:"number"
			label:"已处理总数"
			readonly: true			
		inbox_count:
			type:"number"
			label:"待处理总数"
			readonly: true			
		month_finished_time:
			type:"number"
			scale:2
			label:"已处理总耗时"
			readonly: true			
		inbox_time:
			type:"number"
			scale:2
			label:"待审核总耗时"
			readonly: true			
		month_finished_avg:
			type:"number"
			scale:2
			label:"已处理平均耗时"
			readonly: true
		inbox_avg:
			type:"number"
			scale:2
			label:"待处理平均耗时"
			readonly: true
		avg_time:
			type:"number"
			scale:2
			label:"总平均耗时"
			readonly: true
		owner_organization:
			label:"主部门"
			type: "lookup"
			reference_to: "organizations"
			readonly: true
		owner_organizations:
			label:"所属部门"
			type: "lookup"
			reference_to: "organizations"
			multiple: true
			defaultValue: []
			readonly: true
		
	list_views:
		all:
			label: "全部"
			filter_scope: "space"
			columns: ["user","year","month",
			"month_finished_count","inbox_count",
			"month_finished_time","inbox_time",
			"month_finished_avg","inbox_avg","avg_time",
			"owner_organization",
			"owner_organizations"]
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