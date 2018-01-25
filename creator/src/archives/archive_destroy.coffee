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
		destroy_reason:
			label:"销毁原因"
			type:"textarea"
			is_wide:true
		destroy_state:
			type:"text"
			label:"销毁状态"
			defaultValue:"未销毁"
			omit:true
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
		default:
			columns:["destroy_title","destroy_reason","destroy_state","destroy_time","destroyed_by"]
		all:
			label: "全部"
			filter_scope: "space"
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
		receive:
			label:"执行销毁"
			visible: true
			on:"record"
			todo:(object_name, record_id, fields)->
				state = Creator.Collections["archive_destroy"].findOne({_id:record_id}).destroy_state
				if state == "已销毁"					
					swal("已执行过销毁")
					return
				else
					space = Session.get("spaceId")
					Meteor.call("archive_destroy",record_id,space,
						(error,result) ->
							if !result[0]
								swal("请先添加档案至此销毁单")
								return
							else
								text = "共销毁"+result[0]+"条,"+"成功"+result[1]+"条"
								swal(text)
							if result[0] == result[1]
								Creator.Collections["archive_destroy"].update({_id:record_id},{$set:{destroy_state:"已销毁",destroy_time:new Date(),destroyed_by:Meteor.userId()}})	
						)
		print:
			label:"打印"
			visible: true
			on:"list"
			todo:()->


