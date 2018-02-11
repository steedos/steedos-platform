Creator.Objects.archive_borrow = 
	name: "archive_borrow"
	icon: "file"
	label: "借阅"
	enable_search: false
	fields:
		borrow_name:
			type:"text"
			label:"标题"
			sortable:true
			is_name:true
			required:true
			searchable:true
			#defaultValue:当前年度的借阅单总数+1
		file_type:
			type:"text"
			label:"类别"
			defaultValue:"立卷方式(文件级)"
			omit:true
		unit_info:
			type:"text"
			label:"单位"
			defaultValue:()->
				return  Creator.Collections["space_users"].findOne({user:Meteor.userId(),space:Session.get("spaceId")},{fields:{company:1}}).company
			#字段生成，不可修改
		deparment_info:
			type:"text"
			label:"部门"
			required:true
		phone_number:
			type:"text"
			label:"联系方式"
			required:true
		start_date:
			type:"date"
			label:"借阅日期"
			defaultValue:()->
				return new Date()
			sortable:true
		end_date:
			type:"date"
			label:"归还日期"
			sortable:true
			defaultValue:()->
				now = new Date()
				return new Date(now.getTime()+7*24*3600*1000)
		#	defaultValue:new Date() #应该是当前日期加7天
			required:true
		use_with:
			type:"select"
			label:"利用目的"
			defaultValue:"工作查考"
			options:[
				{label: "工作查考", value: "工作查考"},
				{label: "遍史修志", value: "遍史修志"},
				{label: "学术研究", value: "学术研究"},
				{label: "经济建设", value: "经济建设"},
				{label: "宣传教育", value: "宣传教育"},
				{label: "其他", value: "其他"},
			]
			sortable:true
		use_fashion:
			type:"select"
			label:"利用方式"
			defaultValue:"实体借阅"
			options:[
				{label: "实体借阅", value: "实体借阅"},
				{label: "实体外借", value: "实体外借"},
			]
			sortable:true
		approve:
			type:"textarea"
			label:"单位审批"
			is_wide:true
			readonly:true
		description:
			type:"textarea"
			label:"备注"
			is_wide:true
		# status:
		# 	type:"select"
		# 	label:"状态"
		# 	options: [
		# 		{label: "未审批", value: "未审批"},
		# 		{label: "已审批", value: "已审批"},
		# 		{label: "续借审批中", value: "续借审批中"},
		# 		{label: "续借已审批", value: "续借已审批"},
		# 		{label: "已移交审批", value: "已移交审批"},
		# 		{label: "移交审批完成", value: "移交审批完成"},
		# 		{label: "已结单", value: "已结单"}
		# 		]
		# 	defaultValue:"未审批"
		# 	sortable:true
		# 	omit:true
		relate_record:
			type:"lookup"
			label:"题名"
			is_wide:true
			reference_to:"archive_records"
		year:
			type:"text"
			label:"年度"
			omit:true
		detail_status:
			type:"select"
			label:"明细状态"
			omit:true
			options:[
				{label:"申请中",value:"申请中"},
				{label:"不予批准",value:"不予批准"},
				{label:"已批准",value:"已批准"},
				{label:"审批中",value:"审批中"},
				{label:"续借审批中",value:"续借审批中"},
				{label:"续借已审批",value:"续借已审批"},
				{label:"已归还",value:"已归还"},
				{label:"逾期",value:"逾期"}
				]
			sortable:true
		state:
			type:"select"
			label:"状态"
			options:[
				{label:"草稿",value:"draft"},
				{label:"审批中",value:"pending"},
				{label:"已核准",value:"approved"},
				{label:"已驳回",value:"rejected"}
			]
			defaultValue:"draft"
			omit:true
		#我的借阅记录是可以被删除的，不过是假删除
		is_deleted:
			type:"boolean"
			defaultValue:false
			omit:true 
	list_views:
		default:
			columns:["borrow_name","created","end_date","created_by","unit_info
			","deparment_info","phone_number","relate_record","year"]
		all:
			label:"所有借阅记录"
			filter_scope: "space"
		mine:
			label:"我的借阅记录"
			filter_scope: "mine"
			filters: [["state", "=", "approved"],["is_deleted", "=", false]]
			columns:["borrow_name","relate_record","state","end_date"]
		draft:
			label:"草稿"
			filter_scope: "mine"
			filters: [["state", "=", "draft"]]
			columns:["borrow_name","created","end_date","created_by"]
		pending:
			label:"审批中"
			filters: [["state","=","pending"]]
			columns:["borrow_name","relate_record","created","end_date","created_by"]
	triggers:
		"before.insert.server.default": 
			on: "server"
			when: "before.insert"
			todo: (userId, doc)->
				now = new Date()
				doc.created_by = userId;
				doc.created = now
				doc.owner = userId
				doc.is_deleted = false
				doc.state = "draft"
				doc.year = now.getFullYear().toString()
				return true
		"after.insert.server.default": 
			on: "server"
			when: "after.insert"
			todo: (userId, doc)->
				Creator.Collections["archive_records"].direct.update({_id:doc.relate_record},{$set:{is_borrowed:true,borrowed:new Date(),borrowed_by:userId}})
				Meteor.call("archive_new_audit",doc.relate_record,"借阅档案","成功",doc.space)
				return true
		"after.insert.client.default": 
			on: "client"
			when: "after.insert"
			todo: (userId, doc)->
				swal("借阅成功")
	permission_set:
		user:
			allowCreate: true
			allowDelete: true
			allowEdit: false
			allowRead: true
			modifyAllRecords: false
			viewAllRecords: false
		admin:
			allowCreate: true
			allowDelete: true
			allowEdit: false
			allowRead: true
			modifyAllRecords: true
			viewAllRecords: false 
	actions: 
		restore:
			label: "归还"
			visible: true
			on: "record"
			todo:(object_name, record_id, fields)->
				if Session.get("list_view_id") =="mine"
					Meteor.call('restore',record_id,Session.get("spaceId"),
						(error,result)->
							if !error
								swal("归还成功")
							else
								swal("归还失败")
							)
				else
					swal("请在我的借阅视图下执行操作")


		renew:
			label:"续借"
			visible:true
			on: "record"
			todo:(object_name, record_id, fields)->
				if Session.get("list_view_id") =="mine"
					Meteor.call('renew',record_id,Session.get("spaceId"),
						(error,result)->
							if !error
								swal("续借成功")
							else
								swal("续借失败")
							)
				else
					swal("请在我的借阅视图下执行操作")
		view:
			label:"查看原文"
			visible:true
			on: "record"
			todo:(object_name, record_id, fields)->
				if Session.get("list_view_id") =="mine"
					now = new Date()
					object_borrow = Creator.Collections["archive_borrow"].findOne({_id:record_id},{fields:{state:1,end_date:1,relate_record:1}})
					if object_borrow.state == "approved"
						if (object_borrow.end_date - now) >0
							Meteor.call("view_main_doc",object_borrow.relate_record,
								(error,result) ->
									if result
										window.location = "/api/files/files/#{result}?download=true"
									else
										swal("未找到原文")
							)
						else
							swal("已到归还日期，不能查看原文")
					else
						swal("审核通过之后才可查看原文")
				else
					swal("请在我的借阅视图下执行操作")
		submit:
			label:"提交审批"
			visible:true
			on:"record"
			todo:(object_name, record_id, fields)->
				Meteor.call('submit_borrow',record_id,(error,result)->
					if !error
						swal("提交成功，等待审核")
					else
						swal("提交失败，请再次提交")
				)

