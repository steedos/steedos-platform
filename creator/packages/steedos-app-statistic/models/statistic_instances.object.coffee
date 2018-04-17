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
			label:"当月处理总数"
		inbox_count:
			type:"number"
			label:"待审核总数"
		month_finished_time:
			type:"number"
			scale:2
			label:"当月处理总耗时"
		inbox_time:
			type:"number"
			scale:2
			label:"待审核总耗时"
		avg_cost_time:
			type:"number"
			scale:2
			label:"平均耗时"
		
	list_views:
		default:
			columns: ["user","year","month",
			"month_finished_count","inbox_count",
			"month_finished_time","inbox_time",
			"avg_cost_time"]
		all:
			filter_scope: ""