Creator.Objects.meetingroom =
	name: "meetingroom"
	label: "会议室"
	icon: "location"
	enable_search: true
	fields:
		name:
			label:'会议室'
			type:'text'
			is_wide:true
			sortable:true
		# number:
		#     label:'编号'
		# 	type:'text'
		capacity:
			label:'容纳人数'
			type:'number'
		region:
			label:'所属区域'
			type:'text'
		phone:
			label:'联系方式'
			type:'text'
		description:
			label:'备注'
			type:'textarea'
			is_wide:true
		features:
			label:'提供功能'
			type:'select'
			options:[
				{label:'上网',value:'surfing'},
				{label:'投影',value:'projection'},
				{label:'视频',value:'vedio'},
				{label:'会标',value:'monogram'}
				]
			multiple:true
		other_features:
			label:'其他功能'
			type:'text'
			multiple:true
		color:
			label:'颜色'
			type:'select'
			inlineHelpText: "日历上会议显示的颜色"
			options:[{label:'红色',value:"#ff2d55"},
					{label:'橙色',value:"#ff9500"}
					{label:'黄色',value:"#ffcc00"},
					{label:'绿色',value:"#65db39"},
					{label:'蓝色',value:"#34aadc"},
					{label:'紫色',value:"#cc73e1"},
					{label:'棕色',value:"#a2845e"}]
	list_views:
		all:
			label: "所有"
			columns: ["name", "capacity","region","features"]
			filter_scope: "space"
	permission_set:
		user:
			allowCreate: false
			allowDelete: false
			allowEdit: false
			allowRead: false
			modifyAllRecords: false
			viewAllRecords: true
		admin:
			allowCreate: true
			allowDelete: true
			allowEdit: true
			allowRead: true
			modifyAllRecords: true
			viewAllRecords: true
		member:
			allowCreate: false
			allowDelete: false
			allowEdit: false
			allowRead: false
			modifyAllRecords: false
			viewAllRecords: true
		guest:
			allowCreate: false
			allowDelete: false
			allowEdit: false
			allowRead: false
			modifyAllRecords: false
			viewAllRecords: true

	triggers:

		"before.insert.server.event":
			on: "server"
			when: "before.insert"
			todo: (userId, doc)->
				