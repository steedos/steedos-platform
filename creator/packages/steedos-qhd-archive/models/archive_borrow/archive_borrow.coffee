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
			is_wide:true
			required:true
			searchable:true
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
			# required:true
		phone_number:
			type:"text"
			label:"联系方式"
			# required:true
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
			allowedValues:["工作查考","遍史修志","学术研究","经济建设","宣传教育"]
			sortable:true

		use_fashion:
			type:"select"
			label:"利用方式"
			defaultValue:"实体借阅"
			options:[
				{label: "实体借阅", value: "实体借阅"},
				{label: "实体外借", value: "实体外借"},
			]
			allowedValues:["实体借阅","实体外借"]
			sortable:true

		description:
			type:"textarea"
			label:"备注"
			is_wide:true

		relate_record:
			type:"lookup"
			label:"题名"
			is_wide:true
			reference_to: ["archive_wenshu"]

		year:
			type:"text"
			label:"年度"
			omit:true

		state:
			type:"select"
			label:"状态"
			options:[
				{label:"审批中",value:"pending"},
				{label:"已核准",value:"approved"},
				{label:"已驳回",value:"rejected"}
			]
			defaultValue:"pending"
			omit:true
		
		#我的借阅记录是可以被删除的，不过是假删除
		is_deleted:
			type:"boolean"
			label:"已删除"
			defaultValue:false
			omit:true

	list_views:
		all:
			label:"全部"
			filter_scope: "space"
			filters: [["is_deleted", "=", false]]
			columns:["borrow_name","relate_record","state","created","end_date","created_by"]

		approved:
			label:"已核准"
			filter_scope: "mine"
			filters: [["state", "=", "approved"],["is_deleted", "=", false]]
			columns:["borrow_name","relate_record","created","end_date","created_by"]
		
		rejected:
			label:"已驳回"
			filter_scope: "mine"
			filters: [["state","=","rejected"],["is_deleted", "=", false]]
			columns:["borrow_name","relate_record","created","end_date","created_by"]
		
	triggers:
		"before.insert.server.borrow": 
			on: "server"
			when: "before.insert"
			todo: (userId, doc)->
				now = new Date()
				# doc.created_by = userId;
				# doc.created = now
				# doc.owner = userId
				doc.is_deleted = false
				doc.state = "pending"
				doc.year = now.getFullYear().toString()
				return true
		"before.insert.client.default": 
			on: "client"
			when: "before.insert"
			todo: (userId, doc)->
				doc.space = Session.get("spaceId")
		"after.insert.server.default": 
			on: "server"
			when: "after.insert"
			todo: (userId, doc)->
				if doc.relate_record?.o
					Creator.Collections[doc.relate_record?.o].direct.update({_id:doc.relate_record?.ids},{$set:{is_borrowed:true,borrowed:new Date(),borrowed_by:userId}})
					borrow_entity = Creator.Collections["archive_borrow"].findOne doc._id
					if borrow_entity
						Meteor.call("archive_new_audit",doc.relate_record.ids[0],"借阅档案","成功",doc.space)
					else
						Meteor.call("archive_new_audit",doc.relate_record.ids[0],"借阅档案","失败",doc.space)
					return true
				else
					return
		"after.insert.client.default": 
			on: "client"
			when: "after.insert"
			todo: (userId, doc)->
				swal("借阅单已生成")
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
			allowEdit: true
			allowRead: true
			modifyAllRecords: true
			viewAllRecords: true 
	actions: 
		restore:
			label: "归还"
			visible: true
			on: "record"
			todo:(object_name, record_id, fields)->
				Meteor.call('restore',object_name,record_id,Session.get("spaceId"),
					(error,result)->
						if !error
							swal("归还成功")
						else
							swal("归还失败")
						)


		renew:
			label:"续借"
			visible:true
			on: "record"
			todo:(object_name, record_id, fields)->
				Meteor.call('renew',object_name,record_id,Session.get("spaceId"),
					(error,result)->
						if !error
							swal("续借成功，请再次发起审批")
						else
							swal("续借失败")
						)
		view:
			label:"查看原文"
			visible:true
			on: "record"
			todo:(object_name, record_id, fields)->
				Meteor.call("view_main_doc",object_name,record_id,
					(error,result) ->
						if result.state
							swal("审核通过之后才可查看原文")
						else if result.end_date
							swal("已到归还日期，不能查看原文")								
						else if result.fileId
							window.location = "/api/files/files/#{result.fileId}?download=true"
						else
							swal("未找到原文")
				)
				
					
		
