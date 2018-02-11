Creator.Objects.archive_records =
	name: "archive_records"
	icon: "record"
	label: "档案"
	enable_search: true
	enable_files: true
	enable_api: true
	fields:
		archives_name:
			type:"text"
			label:"档案馆名称"
			# omit:true
			group:"来源"
		archives_identifier:
			type:"text"
			label:"档案馆代码"
			# omit:true
			group:"来源"
		fonds_name:
			type:"master_detail"
			label:"全宗名称"
			reference_to:"archive_fonds"
			# omit:true
			group:"来源"
		archival_category_code:
			type: "text"
			label:"档案门类代码"
			defaultValue: "WS"
			group:"内容描述"
			# omit:true

		fonds_constituting_unit_name:
			type: "text"
			label:"立档单位名称"
			defaultValue: ""
			# omit:true
			group:"来源"

		aggregation_level:
			type: "select"
			label:"聚合层次"
			defaultValue: "文件"
			options:[
				{label:"案卷",value:"案卷"},
				{label:"文件",value:"文件"}]
			# omit:true
			group:"内容描述"

		electronic_record_code:
			type: "text"
			label:"电子文件号"
			defaultValue: ""
			group:"电子文件号"
			# omit:true

		archival_code:
			type:"text"
			label:"档号"
			group:"档号"
			# omit:true

		fonds_identifier:
			type:"master_detail"
			label:"全宗号"
			reference_to:"archive_fonds"
			group:"档号"
			omit:true
		year:
			type: "text"
			label:"年度"
			defaultValue: "2018"
			required:true
			sortable:true
			group:"档号"

		retention_peroid:
			type:"master_detail"
			label:"保管期限"
			reference_to:"archive_retention"
			#required:true
			sortable:true
			group:"档号"

		category_code:
			type:"master_detail"
			label:"类别号"
			defaultValue: ""
			reference_to: "archive_classification"
			#required:true
			group:"档号"

		organizational_structure:
			type:"text"
			label:"机构"
			group:"档号"

		file_number:
			type:"text"
			label:"保管卷号"
			group:"档号"
			# omit:true

		classification_number:
			type:"text"
			label:"分类卷号"
			group:"档号"
			# omit:true

		item_number:
			type: "number"
			label:"件号"
			group:"档号"
			sortable:true
			# omit:true

		document_sequence_number:
			type: "number"
			label:"文档序号"
			group:"档号"

		page_number:
			type: "number"
			label:"页号"
			group:"档号"

		title:
			type:"textarea"
			label:"题名"
			is_wide:true
			is_name:true
			required:true
			sortable:true
			searchable:true
			group:"内容描述"

		parallel_title:
			type: "text"
			label:"并列题名"
			group:"内容描述"

		other_title_information:
			type:"text"
			label:"说明题名文字"
			group:"内容描述"
		annex_title:
			type:"textarea"
			label:"附件题名"
			is_wide:true
			group:"内容描述"
		descriptor:
			type:"text"
			label:"主题词"
			# omit:true
			group:"内容描述"
		keyword:
			type:"text"
			label:"关键词"
			# omit:true
			group:"内容描述"
		personal_name:
			type:"text"
			label:"人名"
			group:"内容描述"
		abstract:
			type:"text"
			label:"摘要"
			# omit:true
			group:"内容描述"
		document_number:
			type:"text"
			label:"文件编号"
			group:"内容描述"
			sortable:true
		author:
			type:"text"
			label:"责任者"
			required:true
			group:"内容描述"
		document_date:
			type:"date"
			label:"文件日期"
			format:"YYYYMMDD"
			required:true
			group:"内容描述"
			sortable:true

		start_date:
			type:"date"
			label:"起始日期"
			format:"YYYYMMDD"
			group:"内容描述"
			# omit:true

		closing_date:
			type:"date"
			label:"截止日期"
			format:"YYYYMMDD"
			group:"内容描述"
			# omit:true
		destroy_date:
			type:"date"
			label:"销毁日期"
			format:"YYYYMMDD"
			group:"内容描述"
			omit:true
		precedence:
			type:"text"
			label:"紧急程度"
			# omit:true
			group:"内容描述"
		prinpipal_receiver:
			type:"text",
			label:"主送",
			group:"内容描述"

		other_receivers:
			type:"text",
			label:"抄送",
			group:"内容描述"

		report:
			type:"text",
			label:"抄报",
			group:"内容描述"

		security_classification:
			type:"select"
			label:"密级"
			defaultValue: "公开"
			options: [
				{label: "公开", value: "公开"},
				{label: "限制", value: "限制"},
				{label: "秘密", value: "秘密"},
				{label: "机密", value: "机密"},
				{label: "绝密", value: "绝密"}

			]
			required:true
			sortable:true
			group:"内容描述"

		applicant_name:
			type:"text"
			label:"拟稿人"
			group:"内容描述"
			# omit:true

		applicant_organization_name:
			type:"text"
			label:"拟稿单位"
			group:"内容描述"
			# omit:true

		secrecy_period:
			type:"select"
			label:"保密期限"
			options: [
				{label: "10年", value: "10年"},
				{label: "20年", value: "20年"},
				{label: "30年", value: "30年"}
			]
			group:"内容描述"

		document_aggregation:
			type:"select",
			label:"文件组合类型",
			defaultValue: "单件"
			options: [
				{label: "单件", value: "单件"},
				{label: "组合文件", value: "组合文件"}
			]
			group:"形式特征"

		total_number_of_items:
			type: "text"
			label:"卷内文件数"
			group:"形式特征"
			# omit:true

		total_number_of_pages:
			type:"number"
			label:"页数"
			group:"形式特征"

		document_type:
			type:"text"
			label:"文件类型"
			group:"形式特征"
			# omit:true

		document_status:
			type:"select",
			label:"文件状态",
			defaultValue: "不归档"
			options: [
				{label: "不归档", value: "不归档"},
				{label: "电子归档", value: "电子归档"},
				{label: "暂存", value: "暂存"},
				{label: "待归档", value: "待归档"},
				{label: "实物归档", value: "实物归档"}
			]
			group:"形式特征"

		language:
			type:"text"
			label:"语种"
			defaultValue: "汉语"
			group:"形式特征"

		orignal_document_creation_way:
			type:"text"
			label:"电子档案生成方式"
			defaultValue: "原生"
			options: [
				{label: "数字化", value: "数字化"},
				{label: "原生", value: "原生"}
			]
			group:"形式特征"
			# omit:true

		format_name:
			type:"text"
			label:"格式名称"
			# omit:true
			group:"电子属性"
		format_version:
			type:"text"
			label:"格式版本"
			# omit:true
			group:"电子属性"
		computer_file_name:
			type:"text"
			label:"计算机文件名"
			# omit:true
			group:"电子属性"
		document_size:
			type:"text"
			label:"计算机文件大小"
			# omit:true
			group:"电子属性"
		physical_record_characteristics:
			type:"text"
			label:"数字化对象形态"
			# omit:true
			group:"数字化属性"
		scanning_resolution:
			type:"text"
			label:"扫描分辨率"
			# omit:true
			group:"数字化属性"
		scanning_color_model:
			type:"text"
			label:"扫描色彩模式"
			# omit:true
			group:"数字化属性"
		image_compression_scheme:
			type:"text"
			label:"图像压缩方案"
			# omit:true
			group:"数字化属性"
		device_type:
			type:"text"
			label:"设备类型"
			# omit:true
			group:"数字化设备信息"
		device_manufacturer:
			type:"text"
			label:"设备制造商"
			# omit:true
			group:"数字化设备信息"
		device_model_number:
			type:"text"
			label:"设备型号"
			# omit:true
			group:"数字化设备信息"
		device_model_serial_number:
			type:"text"
			label:"设备序列号"
			# omit:true
			group:"数字化设备信息"
		software_type:
			type:"text"
			label:"软件类型"
			# omit:true
			group:"数字化设备信息"
		software_name:
			type:"text"
			label:"软件名称"
			# omit:true
			group:"数字化设备信息"
		signature_rules:
			type:"text"
			label:"签名规则"
			# omit:true
			group:"电子签名"
		signature_time:
			type:"datetime"
			label:"签名时间"
			# omit:true
			group:"电子签名"
		signer:
			type:"text"
			label:"签名人"
			# omit:true
			group:"电子签名"
		signature:
			type:"text"
			label:"签名结果"
			# omit:true
			group:"电子签名"
		certificate:
			type:"text"
			label:"证书"
			# omit:true
			group:"电子签名"
		certificate_reference:
			type:"text"
			label:"证书引证"
			# omit:true
			group:"电子签名"
		signature_algorithm_identifier:
			type:"text"
			label:"签名算法标识"
			# omit:true
			group:"电子签名"
		current_location:
			type:"text"
			label:"当前位置"
			# omit:true
			group:"存储位置"
		offline_medium_identifier:
			type:"text"
			label:"脱机载体编号"
			group:"存储位置"
		offline_medium_storage_location:
			type:"text"
			label:"脱机载体存址"
			group:"存储位置"
		intelligent_property_statement:
			type: "text"
			label:"知识产权说明"
			group:"权限管理"
		authorized_agent:
			type: "text"
			label:"授权对象"
			group:"权限管理"
		permission_assignment:
			type: "select"
			label:"授权行为"
			options: [
				{label: "公布", value: "公布"},
				{label: "复制", value: "复制"},
				{label: "浏览", value: "浏览"},
				{label: "解密", value: "解密"}

			]
			# omit:true
			group:"权限管理"
		control_identifier:
			type: "select"
			label:"控制标识"
			options: [
				{label: "开放", value: "开放"},
				{label: "控制", value: "控制"}
			]
			# omit:true
			group:"权限管理"
		agent_type:
			type: "select"
			label:"机构人员类型"
			defaultValue:"部门"
			options: [
				{label: "单位", value: "单位"},
				{label: "部门", value: "部门"},
				{label: "个人", value: "个人"}
			]
			group:"机构人员"
			# omit:true
		agent_name:
			type: "text"
			label:"机构人员名称"
			group:"机构人员"
			# omit:true
		organization_code:
			type: "text"
			label:"组织机构代码"
			group:"机构人员"
			# omit:true
		agent_belongs_to:
			type: "text"
			label:"机构人员隶属"
			group:"机构人员"
			# omit:true

		archive_date:
			type:"date"
			label:"归档日期"
			group:"内容描述"
			# omit:true

		archive_dept:
			type:"text"
			label:"归档部门"
			defaultValue: ""
			group:"内容描述"

		produce_flag:
			type:"select",
			label:"处理标志",
			defaultValue: "在档"
			options: [
				{label: "在档", value: "在档"},
				{label: "暂存", value: "暂存"},
				{label: "移出", value: "移出"},
				{label: "销毁", value: "销毁"},
				{label: "出借", value: "出借"}
			]
			group:"内容描述"
			# omit:true

		main_dept:
			type:"text",
			label:"主办部室",
			is_wide:true
			defaultValue: ""
			group:"内容描述"

		annotation:
			type:"textarea",
			label:"备注",
			is_wide:true
			group:"内容描述"

		storage_location:
			type:"text"
			label:"存放位置"
			group:"内容描述"
			# omit:true

		reference:
			type: "text"
			label:"参见"
			group:"内容描述"
			# omit:true
		#是否接收，默认是未接收
		is_received:
			type:"boolean"
			label:"是否接收"
			defaultValue:false
			omit:true

		received:
			type:"datetime"
			label:"接收时间"
			omit:true

		received_by:
			type: "lookup"
			label:"接收人"
			reference_to: "users"
			omit: true
		#是否移交，默认是不存在，在“全部”视图下点击移交，进入“待移交”视图，此时is_transfer=false
		#审核通过之后，is_transfer = true
		is_transfered:
			type:"boolean"
			omit:true
			label:"是否移交"
		transfered:
			type:"datetime"
			label:"移交时间"
			omit:true
		transfered_by:
			type: "lookup"
			label:"移交人"
			reference_to: "users"
			omit: true

		#是否销毁，默认是不存在，在“全部”视图下点击销毁，进入“待销毁”视图，此时is_destroy=false
		#审核通过之后，is_transfer = true
		is_destroyed:
			type:"boolean"
			label:'是否销毁'
			omit:true
			group:"销毁"
		destroyed:
			type:"datetime"
			label:'实际销毁时间'
			omit:true
			group:"销毁"
		destroyed_by:
			type: "lookup"
			label:"销毁人"
			reference_to: "users"
			omit: true
			group:"销毁"
		is_borrowed:
			type:"boolean"
			defaultValue:false
			label:'是否借阅'
			omit:true
		borrowed:
			type:"datetime"
			label:"借阅时间"
			omit:true
		borrowed_by:
			type: "lookup"
			label:"借阅人"
			reference_to: "users"
			omit: true
		#如果是从OA归档过来的档案，则值为表单Id,否则不存在改字段
		external_id:
			type:"text"
			label:'表单Id'
			omit:true
			group:"内容描述"
		archive_destroy_id:
			type:"master_detail"
			label:"销毁单"
			filters:[["destroy_state", "$eq", "未销毁"]]
			depend_on:["destroy_state"]
			reference_to:"archive_destroy"
			group:"销毁"
		related_modified:
			type:"datetime"
			label:"附属更新时间"
			omit:true
	list_views:
		default:
			# columns: [
			# 	"year", "item_number","retention_peroid",
			# 	"title","document_number", "document_date", "author",
			# 	"archive_dept", "security_classification","destroyed"
			# 	]
			# columns: ["year","item_number","retention_peroid","title","document_number","document_date","author",
			# 			"archive_dept","security_classification","destroyed"]
			#columns:['retention_peroid','document_date']
			columns: ["year","item_number","title","retention_peroid","document_number","document_date","author",
						"archive_dept","security_classification","destroyed"]
		recent:
			label: "最近查看"
			filter_scope: "space"
		all:
			label: "全部"
			filter_scope: "space"
			filters: [["is_received", "=", true]]
		receive:
			label:"待接收"
			filter_scope: "space"
			filters: [["is_received", "=", false]]
		received:
			label:"已接收"
			filter_scope:"space"
			filters:[["is_received", "=", true]]
			columns:["year","title","received","received_by","borrowed_by"]
		transfer:
			label:"待移交"
			filter_scope: "space"
			filters: [["is_transfered", "", false]]
		destroy:
			label:"待销毁"
			filter_scope: "space"
			filters: [["is_received", "=", true],["destroy_date","<=",new Date()],["is_destroyed", "=", false]]
			columns:["year","title","document_date","destroy_date","archive_destroy_id"]
		transfered:
			label:"已移交"
			filter_scope: "space"
			filters: [["is_transfered", "=", true]]
		destroyed:
			label:"已销毁"
			filter_scope: "space"
			filters: [["is_destroyed", "=", true]]
			columns:["year","title","document_date","destroy_date","destroyed","archive_destroy_id"]
		borrow:
			label:"已借阅"
			filter_scope: "space"
			filters:[["is_borrowed","=",true],["is_received","=",true]]
			columns:["title","borrowed","borrowed_by"]
	permission_set:
		user:
			allowCreate: false
			allowDelete: false
			allowEdit: false
			allowRead: true
			modifyAllRecords: false
			viewAllRecords: true
			list_views:["default","recent","all","borrow"]
		admin:
			allowCreate: false
			allowDelete: false
			allowEdit: false
			allowRead: true
			modifyAllRecords: false
			viewAllRecords: true
			list_views:["default","recent","all","borrow"]
	triggers:
		"before.insert.server.default":
			on: "server"
			when: "before.insert"
			todo: (userId, doc)->
				doc.is_received = false
				doc.is_destroyed = false
				doc.is_borrowed = false
				doc.created = new Date()
				doc.created_by = userId
				doc.owner = userId
				rules = Creator.Collections["archive_rules"].find({fieldname:'title'},{fields:{keywords:1}}).fetch()
				rules_keywords = _.pluck rules, "keywords"
				i = 0
				while i < rules_keywords.length
					is_matched = true
					j = 0
					arrs = rules_keywords[i]
					while j < arrs.length
						if doc.title.indexOf(arrs[j])<0
							is_matched = false
							break;
						j++
					if is_matched
						match_rule = rules_keywords[i]
						rule_id = rules[i]._id
						break;
					i++
				console.log rule_id
				if rule_id
					category_retention = Creator.Collections["archive_rules"].findOne({_id:rule_id},{fields:{classification:1,retention:1}})
					doc.category_code = category_retention.classification
					doc.retention_peroid = category_retention.retention
					duration = Creator.Collections["archive_retention"].findOne({_id:doc.retention_peroid}).years
					year = doc.document_date.getFullYear()+duration
					month = doc.document_date.getMonth()
					day = doc.document_date.getDate()
					doc.destroy_date = new Date(year,month,day)
				return true
		"after.update.server.default":
			on: "server"
			when: "after.update"
			todo: (userId, doc)->
				duration = Creator.Collections["archive_retention"].findOne({_id:doc.retention_peroid}).years
				year = doc.document_date.getFullYear()+duration
				month = doc.document_date.getMonth()
				day = doc.document_date.getDate()
				destroy_date = new Date(year,month,day)
				# if doc.archive_destroy_id
				# 	state = Creator.Collections["archive_destroy"].findOne({_id:doc.archive_destroy_id}).destroy_state
				# 	if state=="已销毁"
				# 		Creator.Collections["archive_destroy"].update({_id:doc.archive_destroy_id},{$set:{destroy_state:"未销毁"}})
				#console.log doc.archive_destroy_id
				Creator.Collections["archive_records"].direct.update({_id:doc._id},{$set:{destroy_date:destroy_date}})
				# destroy_records = Creator.Collections["archive_destroy"].findOne({_id:doc.archive_destroy_id}).
				# Creator.Collections["archive_destroy"].update ({_id:doc.archive_destroy_id},{$set:{modified:new Date,modified_by:Meteor.userId(),destroy_records:}})
	actions:
		receive:
			label: "接收"
			visible: true
			on: "list"
			todo:()->
				if Creator.TabularSelectedIds?["archive_records"].length == 0
					swal("请先选择要接收的档案")
					return
				if Session.get("list_view_id")!= "receive"
					swal("请在待接收视图下操作")
					return
				else
					space = Session.get("spaceId")
					Meteor.call("archive_receive",Creator.TabularSelectedIds?["archive_records"],space,
						(error,result) ->
							text = "共接收"+result[0]+"条,"+"成功"+result[1]+"条"
							swal(text)
							)
		transfer:
			label:"移交"
			visible:true
			on: "list"
			todo:()->
				if Creator.TabularSelectedIds?["archive_records"].length == 0
					 swal("请先移交要移交的档案")
					 return
				if Session.get("list_view_id")!= "all"
					swal("请在全部视图下操作")
					return
				Meteor.call("archive_transfer",Creator.TabularSelectedIds?["archive_records"],
					(error,result) ->
							console.log error
							space = Session.get("spaceId")
							if !error
								toastr.success("移交成功，等待审核")
								Meteor.call("archive_new_audit",Creator.TabularSelectedIds?["archive_records"],"移交档案","成功",space)

							else
								toastr.error("移交失败，请再次操作")
								Meteor.call("archive_new_audit",Creator.TabularSelectedIds?["archive_records"],"移交档案","失败",space)

							)
		# destroy:
		# 	label:"销毁"
		# 	visible:true
		# 	on: "list"
		# 	todo:()->
		# 		if Creator.TabularSelectedIds?["archive_records"].length == 0
		# 			 swal("请先选择要销毁的档案")
		# 			 return
		# 		if Session.get("list_view_id")!= "destroy"
		# 			swal("请在待销毁视图下操作")
		# 			return
		# 		else
		# 			space = Session.get("spaceId")
		# 			Meteor.call("archive_destroy",Creator.TabularSelectedIds?["archive_records"],space,
		# 				(error,result) ->
		# 					text = "共销毁"+Creator.TabularSelectedIds?["archive_records"].length+"条,"+"成功"+result+"条"
		# 					swal(text)

		# 				)
		borrow:
			label:"借阅"
			visible:true
			on: "record"
			todo:(object_name, record_id, fields)->
				borrower = Creator.Collections["archive_records"].findOne({_id:record_id}).borrowed_by
				if borrower == Meteor.userId()
					swal("您已借阅了此档案，归还之前无需重复借阅")
					return
				if Session.get("list_view_id") == "all" || Session.get("list_view_id")== "received"
					space = Session.get("spaceId")
					doc = {}
					now = new Date()
					#collection_record = Creator.Collections["archive_records"]
					#console.log collection_record.find({},{field:{year: 1}}).sort({year:-1}).limit(1)
					doc.year = now.getFullYear().toString()
					doc.unit_info = Creator.Collections["space_users"].findOne({user:Meteor.userId(),space:space},{fields:{company:1}}).company
					doc.start_date = now
					doc.end_date =new Date(now.getTime()+7*24*3600*1000)
					doc.use_with = "工作查考"
					doc.use_fashion = "实体借阅"
					doc.file_type = "立卷方式(文件级)"
					doc.space = space
					doc.is_approved = false
					doc.relate_record = record_id
					# Creator.TabularSelectedIds?["archive_records"].forEach (selectedId)->
					# 	doc.relate_documentIds.push collection_record.findOne({_id:selectedId})._id
					Creator.createObject("archive_borrow",doc)
				else
					swal("请在全部或已接收视图下执行操作")
					return
