Creator.Objects.meetingroom =
	name: "meetingroom"
	label: "会议室"
	icon: "contract"
	fields:
		name:
			label:'名称'
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
	list_views:
		all:
			label: "所有"
			columns: ["name", "capacity","region","features"]
			filter_scope: "space"
		region_one:
			label: "一号楼"
			columns: ["name", "capacity","region","features"]
			filter_scope: "space"
			filters: [["region", "=", "一号楼"]]
	permission_set:
		user:
			allowCreate: true
			allowDelete: true
			allowEdit: true
			allowRead: true
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
			allowCreate: true
			allowDelete: true
			allowEdit: true
			allowRead: true
			modifyAllRecords: false
			viewAllRecords: true
		guest:
			allowCreate: true
			allowDelete: true
			allowEdit: true
			allowRead: true
			modifyAllRecords: false
			viewAllRecords: true

	triggers:

		"before.insert.server.event":
			on: "server"
			when: "before.insert"
			todo: (userId, doc)->
				