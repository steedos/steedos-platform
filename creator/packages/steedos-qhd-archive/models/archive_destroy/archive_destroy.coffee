Creator.Objects.archive_destroy = 
	name: "archive_destroy"
	icon: "product_item"
	label: "销毁"
	enable_search: true
	fields:
		destroy_title:
			type:"text"
			label:"标题"
			is_name:true
			is_wide:true
			required:true
			searchable:true
			index:true

		destroy_category:
			type: "select"
			label:"档案门类"
			options: [
				{label: "文书档案", value: "archive_wenshu"},
				{label: "科技档案", value: "archive_keji"},
				{label: "科技底图", value: "archive_kejiditu"},
				{label: "会计档案", value: "archive_kuaiji"},
				{label: "荣誉档案", value: "archive_rongyu"},
				{label: "声像档案", value: "archive_shengxiang"},
				{label: "电子档案", value: "archive_dianzi"},
				{label: "审计档案", value: "archive_shenji"}
			]
			allowedValues:["archive_wenshu","destroy_category","archive_keji","archive_kejiditu","archive_kuaiji","archive_rongyu","archive_shengxiang","archive_dianzi","archive_shenji"]
			required: true

		destroy_state:
			type:"text"
			label:"销毁状态"
			defaultValue:"未销毁"
			omit:true

		destroy_reason:
			label:"销毁原因"
			type:"textarea"
			is_wide:true
		
		# state:
		# 	type:"select"
		# 	label:"审批状态"
		# 	options:[
		# 		{label:"草稿",value:"draft"},
		# 		{label:"审批中",value:"pending"},
		# 		{label:"已核准",value:"approved"},
		# 		{label:"已驳回",value:"rejected"}
		# 	]
		# 	defaultValue:"draft"
		
		destroy_time:
			type:"datetime"
			label:"销毁时间"
			omit:true
		destroyed_by:
			type: "lookup"
			label:"销毁人"
			reference_to: "users"
			omit: true
	list_views:	
		all:
			label: "全部"
			filter_scope: "space"
			columns:["destroy_title","destroy_reason","destroy_state","destroy_time","destroyed_by"]
			#filters: [["is_received", "$eq", true]] results: { $elemMatch: { $gte: 80, $lt: 85 } }
	triggers:
		"before.insert.server.default": 
			on: "server"
			when: "before.insert"
			todo: (userId, doc)->
				doc.destroy_state = "未销毁"
	permission_set:
		user:
			allowCreate: false
			allowDelete: false
			allowEdit: false
			allowRead: false
			modifyAllRecords: false
			viewAllRecords: false 
		admin:
			allowCreate: true
			allowDelete: true
			allowEdit: true
			allowRead: true
			modifyAllRecords: true
			viewAllRecords: true 
	actions: 
		destroy:
			label:"执行销毁"
			visible: true
			on:"record"
			todo:(object_name, record_id, fields)->
				space = Session.get("spaceId")
				Meteor.call("archive_destroy",record_id,space,
					(error,result) ->
						if result
							swal("销毁成功")
							return
						else
							swal("销毁失败")
							return
						if error
							swal(error)
							return
					)


