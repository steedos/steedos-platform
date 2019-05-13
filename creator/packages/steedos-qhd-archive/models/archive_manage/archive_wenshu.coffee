# 设置保管期限
set_retention = (doc)->
	rules = Creator.Collections["archive_rules"].find({ fieldname: 'title'},{ fields:{ keywords: 1,retention:1 } } ).fetch()
	if rules
		rules_keywords = _.pluck rules, "keywords"
	else
		rules_keywords = []
	# 所有规则关键词
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
			retention_id = rules[i].retention
			break;
		i++

	# 保管期限表
	if retention_id
		retention = Creator.Collections["archive_retention"].findOne({_id:retention_id})
	else
		retention = Creator.Collections["archive_retention"].findOne({is_default:true})		
	# 设置保管期限和销毁日期
	if retention?.years
		# 没有文件日期默认为当前日期
		if !doc.document_date
			doc.document_date = new Date()
		
		duration = retention?.years
		year = doc.document_date?.getFullYear() + duration
		month = doc.document_date?.getMonth()
		day = doc.document_date?.getDate()
		destroy_date = new Date(year,month,day)
		destroy_date_timestamp = parseInt(destroy_date?.getTime())
		Creator.Collections["archive_wenshu"].direct.update(doc._id,
		{
			$set:{
				retention_peroid: retention._id,
				destroy_date: destroy_date,
				destroy_date_timestamp: destroy_date_timestamp
			}
		})

# 设置类别号
set_category_code = (doc)->
	# 根据归档部门确定类别号
	if doc?.archive_dept
		keyword = doc?.archive_dept
		classification = Creator.Collections["archive_classification"].findOne({keywords: keyword})
	if classification?._id
		Creator.Collections["archive_wenshu"].direct.update(doc._id,
		{
			$set:{
				category_code:classification?._id
			}
		})

# 设置初始条件
set_init = (record_id)->
	Creator.Collections["archive_wenshu"].direct.update(record_id,
	{
		$set:{
			is_received: false
			is_destroyed: false
			is_borrowed: false
		}
	})

# 设置电子文件号
set_electronic_record_code = (record_id)->
	record = Creator.Collections["archive_wenshu"].findOne(record_id,{fields:{fonds_name:1,year:1}})
	if record?.fonds_name and record?.year
		fonds_code = Creator.Collections["archive_fonds"].findOne(record.fonds_name,{fields:{code:1}})?.code
		count = Creator.Collections["archive_wenshu"].find({year:record?.year}).count()
		strcount = "0000000" + count
		count_code = strcount.substr(strcount.length-6)
		electronic_record_code = fonds_code + "WS" + record?.year + count_code
		Creator.Collections["archive_wenshu"].direct.update(record_id,
		{
			$set:{
				electronic_record_code: electronic_record_code
			}
		})

set_company = (record_id)->
	record = Creator.Collections["archive_wenshu"].findOne(record_id,{fields:{fonds_name:1,retention_peroid:1,organizational_structure:1,year:1,item_number:1}})
	if record?.fonds_name
		fonds_company = Creator.Collections["archive_fonds"].findOne(record.fonds_name,{fields:{company:1}})?.company
		if fonds_company
			Creator.Collections["archive_wenshu"].direct.update(record_id,
			{
				$set:{
					company: fonds_company
				}
			})
		
# 设置档号
set_archivecode = (record_id)->
	console.log "修改档号"
	record = Creator.Collections["archive_wenshu"].findOne(record_id,{fields:{fonds_name:1,retention_peroid:1,organizational_structure:1,year:1,item_number:1}})
	if record?.item_number and record?.fonds_name and record?.retention_peroid and record?.year and record?.organizational_structure
		fonds_code = Creator.Collections["archive_fonds"].findOne(record.fonds_name,{fields:{code:1}})?.code
		retention_peroid_code = Creator.Collections["archive_retention"].findOne(record.retention_peroid,{fields:{code:1}})?.code
		organizational_structure_code = Creator.Collections["archive_organization"].findOne(record.organizational_structure,{fields:{code:1}})?.code
		year = record.year
		item_number = (Array(6).join('0') + record.item_number).slice(-4)
		if fonds_code and year and retention_peroid_code and item_number
			if organizational_structure_code
				archive_code = fonds_code + "-WS" + "-" + year + "-"+ retention_peroid_code + "-" + organizational_structure_code + "-"+item_number
			else
				archive_code = fonds_code + "-WS" + "-" + year + "-"+ retention_peroid_code + "-" + item_number
			Creator.Collections["archive_wenshu"].direct.update(record_id,
			{
				$set:{
					archival_code:archive_code
				}
			})

set_destory = (doc)->
	if doc?.retention_peroid and doc?.document_date
		duration = Creator.Collections["archive_retention"].findOne({_id:doc.retention_peroid})?.years
		if duration
			year = doc.document_date.getFullYear()+duration
			month = doc.document_date.getMonth()
			day = doc.document_date.getDate()
			destroy_date = new Date(year,month,day)
			destroy_date_timestamp = parseInt(destroy_date?.getTime())
			Creator.Collections["archive_wenshu"].direct.update({_id:doc._id},
				{
					$set:{
						destroy_date:destroy_date,
						destroy_date_timestamp:destroy_date_timestamp
						}
				})

# 日志记录
set_audit = (record_id, space, userId)->
	doc = {
		business_status: "历史行为",
		business_activity: "修改文书档案",
		action_time: new Date(),
		action_user: userId,
		action_mandate: "",
		action_description: "",
		action_administrative_records_id: record_id,
		created_by: userId,
		created: new Date(),
		owner: userId,
		space: space
	}
	Creator.Collections["archive_audit"].insert(doc)

# 设置重新封装
set_hasXml = (record_id)->
	Creator.Collections["archive_wenshu"].direct.update({_id:record_id},
		{
			$set:{
				has_xml:false
				}
		})

Creator.Objects.archive_wenshu =
	name: "archive_wenshu"
	icon: "record"
	label: "文书简化"
	enable_search: true
	enable_files: true
	enable_api: true
	enable_tree: false
	filter_company: true
	fields:
		archival_category_code:
			type: "text"
			label:"档案门类代码"
			defaultValue: "WS"
			
		fonds_constituting_unit_name:
			type:"text"
			label:"立档单位名称"
			defaultValue: "河北港口集团有限公司"

		aggregation_level:
			type: "select"
			label:"聚合层次"
			defaultValue: "文件"
			options:[
				{label:"案卷",value:"案卷"},
				{label:"文件",value:"文件"}],
			allowedValues:["案卷","文件"]
			filterable:false
		
		electronic_record_code:
			type: "text"
			label:"电子文件号"
			omit:true
		
		archival_code:
			type:"text"
			label:"档号"
			is_wide:true
			omit:true
			group:"档号"
		
		fonds_name:
			type:"master_detail"
			label:"全宗名称"
			reference_to:"archive_fonds"
			group:"档号"

		year:
			type: "text"
			label:"年度"
			sortable:true
			searchable:true
			default_width: 80
			group:"档号"
		
		title:
			type:"text"
			label:"题名"
			is_wide:true
			is_name:true
			required:true
			searchable:true
			default_width: 400
			group:"内容描述"

		retention_peroid:
			type:"master_detail"
			label:"保管期限"
			reference_to:"archive_retention"
			sortable:true
			searchable:true
			default_width: 70
			group:"档号"
		
		organizational_structure:
			type:"master_detail"
			label:"机构"
			reference_to: "archive_organization"
			searchable:true
			default_width: 260
			group:"档号"
		
		category_code:
			type:"master_detail"
			label:"类别号"
			reference_to: "archive_classification"
			searchable:false
			group:"档号"
			filterable:false
		
		item_number:
			type: "number"
			label:"件号"
			sortable:true
			searchable:true
			default_width: 70
			group:"档号"
		
		document_sequence_number:
			type: "number"
			label:"文档序号"
			group:"档号"
		
		parallel_title:
			type: "text"
			label:"并列题名"
			searchable:true
			group:"内容描述"
		
		other_title_information:
			type:"text"
			label:"说明题名文字"
			searchable:true
			group:"内容描述"
		
		annex_title:
			type:"textarea"
			label:"附件题名"
			searchable:true
			group:"内容描述"
		
		main_dept:
			type:"text",
			label:"主办部室"
			searchable:true
			group:"内容描述"
		
		descriptor:
			type:"text"
			label:"主题词"
			is_wide:true
			group:"内容描述"
		
		keyword:
			type:"text"
			label:"关键词"
			omit:true
			group:"内容描述"
		
		abstract:
			type:"text"
			label:"摘要"
			searchable:true
			group:"内容描述"
		
		personal_name:
			type:"text"
			label:"人名"
			searchable:true
			group:"内容描述"
		
		document_number:
			type:"text"
			label:"文件编号"
			searchable:true
			default_width:260
			group:"内容描述"
		
		author:
			type:"text"
			label:"责任者"
			searchable:true
			default_width: 200
			group:"内容描述"
		
		document_date:
			type:"date"
			label:"文件日期"
			format:"YYYYMMDD"
			sortable:true
			searchable:true
			default_width: 120
			group:"内容描述"
		
		prinpipal_receiver:
			type:"text",
			label:"主送",
			searchable:true
			is_wide:true
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
			defaultValue:"公开"
			options: [
				{label: "公开", value: "公开"},
				{label: "限制", value: "限制"},
				{label: "秘密", value: "秘密"},
				{label: "机密", value: "机密"},
				{label: "绝密", value: "绝密"},
				{label: "非密", value: "非密"},
				{label: "普通", value: "普通"}
			]
			allowedValues:["公开","限制","秘密","机密","绝密","非密","普通"]
			searchable:true
			group:"内容描述"

		secrecy_period:
			type:"select"
			label:"保密期限"
			options: [
				{label: "10年", value: "10年"},
				{label: "20年", value: "20年"},
				{label: "30年", value: "30年"}
			],
			allowedValues:["10年","20年","30年"],			
			group:"内容描述"
		
		applicant_organization_name:
			type:"text"
			label:"拟稿单位"
			searchable:true
			group:"内容描述"
		
		applicant_name:
			type:"text"
			label:"拟稿人"
			searchable:true
			group:"内容描述"

		reference:
			type: "text"
			label:"参见"
			searchable:false
			group:"内容描述"
			filterable:false
		
		destroy_date:
			type:"date"
			label:"销毁期限"
			format:"YYYYMMDD"
			omit:true
			group:"内容描述"
		
		destroy_date_timestamp:
			type:"number"
			label:"销毁期限时间戳"
			hidden:true
			group:"内容描述"
		
		annotation:
			type:"textarea",
			label:"备注"
			is_wide:true
			group:"内容描述"

		document_aggregation:
			type:"select",
			label:"文件组合类型",
			defaultValue: "单件"
			options: [
				{label: "单件", value: "单件"},
				{label: "组合文件", value: "组合文件"}
			],
			allowedValues:["单件","组合文件"],			
			group:"形式特征"
			filterable:false
		
		total_number_of_pages:
			type:"number"
			label:"页数"
			group:"形式特征"

		language:
			type:"text"
			label:"语种"
			defaultValue: "汉语"
			group:"形式特征"
		
		document_type:
			type:"text"
			label:"文件类型"
			searchable:false
			group:"形式特征"
			filterable:false
		
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
			],
			allowedValues:["在档","暂存","移出","销毁","出借"],		
			group:"形式特征"
			filterable:false
		
		orignal_document_creation_way:
			type:"text"
			label:"电子档案生成方式"
			defaultValue: "原生"
			options: [
				{label: "数字化", value: "数字化"},
				{label: "原生", value: "原生"}
			],
			allowedValues:["数字化","原生"],		
			group:"形式特征"
		
		document_status:
			type:"select",
			label:"文件状态",
			defaultValue: "电子归档"
			options: [
				{label: "不归档", value: "不归档"},
				{label: "电子归档", value: "电子归档"},
				{label: "暂存", value: "暂存"},
				{label: "待归档", value: "待归档"},
				{label: "实物归档", value: "实物归档"}
			]
			allowedValues:["不归档","电子归档","待归档","暂存","实物归档"]
			group:"形式特征"
			filterable:false
				
		archive_dept:
			type:"text"
			label:"归档部门"
			default_width: 115
			group:"形式特征"   

		archive_date:
			type:"date"
			label:"归档日期"
			group:"形式特征"
		
		signature_rules:
			type:"text"
			label:"签名规则"
			omit:true
			group:"电子签名" 		

		signature_time:
			type:"date"
			label:"签名时间"
			omit:true
			group:"电子签名" 

		signer:
			type:"text"
			label:"签名人"
			omit:true
			group:"电子签名"
		
		signature_algorithmidentifier:
			type:"text"
			label:"签名算法标识"
			omit:true
			group:"电子签名"

		signature:
			type:"text"
			label:"签名结果"
			omit:true
			is_wide:true
			group:"电子签名"

		certificate:
			type:"text"
			label:"证书"
			omit:true
			is_wide:true
			group:"电子签名"

		certificate_reference:
			type:"text"
			label:"证书引证"
			omit:true
			group:"电子签名"
		
		physical_record_characteristics:
			type: "text"
			label:"数字化对象形态"
			defaultValue: "PDF"
			group:"数字化属性"

		scanning_resolution:
			type: "text"
			label:"扫描分辨率"
			defaultValue: "220dpi"
			group:"数字化属性"

		scanning_color_model:
			type: "text"
			label:"扫描色彩模式"
			defaultValue: "彩色"
			group:"数字化属性"

		image_compression_scheme:
			type: "text"
			label:"图像压缩方案"
			defaultValue: "无损压缩"
			group:"数字化属性"
		
		device_type:
			type: "text"
			label:"设备类型"
			defaultValue: ""
			group:"数字化设备信息"

		device_manufacturer:
			type: "text"
			label:"设备制造商"
			defaultValue: ""
			group:"数字化设备信息"

		device_model_number:
			type: "text"
			label:"设备型号"
			defaultValue: ""
			group:"数字化设备信息"

		device_model_serial_number:
			type: "text"
			label:"设备序列号"
			defaultValue: ""
			group:"数字化设备信息"

		software_type:
			type: "text"
			label:"软件类型"
			defaultValue: ""
			group:"数字化设备信息"

		software_name:
			type: "text"
			label:"软件名称"
			defaultValue: ""
			group:"数字化设备信息"
		
		current_location:
			type:"text"
			label:"当前位置"
			defaultValue:"\\\\192.168.0.151\\beta\\data\\oafile"
			is_wide:true
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
		
		control_identifier:
			type: "select"
			label:"控制标识"
			options: [
				{label: "开放", value: "开放"},
				{label: "控制", value: "控制"}
			],
			allowedValues:["开放","控制"],
			group:"权限管理"
			filterable:false

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
			],
			allowedValues:["公布","复制","浏览","解密"],
			group:"权限管理"
			filterable:false
		
		agent_type:
			type: "select"
			label:"机构人员类型"
			defaultValue:"部门"
			options: [
				{label: "单位", value: "单位"},
				{label: "部门", value: "部门"},
				{label: "个人", value: "个人"}
			],
			allowedValues:["单位","部门","个人"],		
			group:"机构人员"
			filterable:false

		agent_name:
			type: "text"
			label:"机构人员名称"
			group:"机构人员"

		organization_code:
			type: "text"
			label:"组织机构代码"
			group:"机构人员"

		agent_belongs_to:
			type: "text"
			label:"机构人员隶属"
			group:"机构人员"

		related_archives:
			label:'关联文件'
			type:'lookup'
			reference_to:'archive_wenshu'
			multiple:true
			is_wide:true
			group:"关联文件"
			filterable:false
		
		old_id:
			type:"text"
			label:"老系统ID"
			hidden: true
		
		external_id:
			type:"text"
			label:'表单ID'
			hidden: true
		
		# 是否接收，默认是未接收
		is_received:
			type:"boolean"
			label:"是否接收"
			defaultValue:false
			hidden: true
		received:
			type:"datetime"
			label:"接收时间"
			hidden: true
		received_by:
			type: "lookup"
			label:"接收人"
			reference_to: "users"
			hidden: true
		
		# 是否移交，默认是不存在，在“全部”视图下点击移交，进入“待移交”视图，此时is_transfer=false
		# 审核通过之后，is_transfer = true
		is_transfered:
			type:"boolean"
			label:"是否移交"
			hidden: true
		transfered:
			type:"datetime"
			label:"移交时间"
			hidden: true
		transfered_by:
			type: "lookup"
			label:"移交人"
			reference_to: "users"
			hidden: true
		archive_transfer_id:
			type:"master_detail"
			label:"移交单"
			reference_to:"archive_transfer"
			group:"移交"
			filterable:false
		
		# 是否销毁，默认是不存在，在“全部”视图下点击销毁，进入“待销毁”视图，此时is_destroy=false
		# 审核通过之后，is_transfer = true
		is_destroyed:
			type:"boolean"
			label:'是否销毁'
			hidden: true
		destroyed:
			type:"datetime"
			label:'实际销毁时间'
			hidden: true
		destroyed_by:
			type: "lookup"
			label:"销毁人"
			reference_to: "users"
			hidden: true
		archive_destroy_id:
			type:"master_detail"
			label:"销毁单"
			filters:[["destroy_state", "eq", "未销毁"]]
			depend_on:["destroy_state"]
			reference_to:"archive_destroy"
			group:"销毁"
			filterable:false
		
		# 是否借阅
		is_borrowed:
			type:"boolean"
			defaultValue:false
			label:'是否借阅'
			hidden: true
		borrowed:
			type:"datetime"
			label:"借阅时间"
			hidden: true
		borrowed_by:
			type: "lookup"
			label:"借阅人"
			reference_to: "users"
			hidden: true
		
		related_modified:
			type:"datetime"
			label:"附属更新时间"
			hidden: true
		
		has_xml:
			type:"boolean"
			label:"是否封装xml"
			hidden: true
		
		company: 
			type: "master_detail"
			label: '所属公司'
			reference_to: "organizations"
			hidden: true		

	list_views:
		# recent:
		# 	label: "最近查看"
		# 	filter_scope: "space"
		all:
			label: "已归档"
			filter_scope: "space"
			filters: [["is_received", "=", true],["is_destroyed", "=", false]]
			columns:[
				"year","retention_peroid","item_number",
				"title","document_date",
				"archive_dept","author","document_number","organizational_structure"]
# 		borrow:
#             label:"查看"
#             filter_scope: "space"
#             filters: [["is_received", "=", true]]
#             columns:['document_sequence_number',"author","title","document_date","total_number_of_pages","annotation"]
		receive:
			label:"待接收"
			filter_scope: "space"
			filters: [["is_received", "=", false]]
			columns:[
				"year","retention_peroid","item_number",
				"title","document_date",
				"archive_dept","author","document_number","organizational_structure"]
		# 已移交功能去掉===============
		# transfered:
		# 	label:"已移交"
		# 	filter_scope: "space"
		# 	filters: [["is_transfered", "=", true]]
		# 	columns:["title","fonds_name","archive_transfer_id","transfered","transfered_by"]
		destroy:
			label:"待销毁"
			filter_scope: "space"
			filters: [["is_received", "=", true],["destroy_date_timestamp", "<=", new Date().getTime()],["is_destroyed", "=", false]]
			columns:["year","title","document_date","destroy_date","archive_destroy_id"]
		
	permission_set:
		user:
			allowCreate: false
			allowDelete: false
			allowEdit: false
			allowRead: true
			modifyAllRecords: false
			viewAllRecords: true
			list_views:["default","recent","all","borrow"]
			actions:["borrow"]
		admin:
			allowCreate: true
			allowDelete: true
			allowEdit: true
			allowRead: true
			modifyAllRecords: true
			viewAllRecords: true
			list_views:["default","recent","all","borrow"]
			actions:["borrow"]
	triggers:
		"after.insert.server.default":
			on: "server"
			when: "after.insert"
			todo: (userId, doc)->
				# 保存初始条件
				set_init(doc._id)
				# 设置电子文件号
				set_electronic_record_code(doc._id)
				# 设置公司
				set_company(doc._id)
				# 设置保管期限
				set_retention(doc)
				# 设置分类号
				set_category_code(doc)
				# 设置销毁期限
				set_destory(doc)
				# 设置重新封装
				set_hasXml(doc._id)
				return true

		"after.update.server.default":
			on: "server"
			when: "after.update"
			todo: (userId, doc, fieldNames, modifier, options)->
				if modifier['$set']?.fonds_name
					set_company(doc._id)
				if modifier['$set']?.item_number or modifier['$set']?.organizational_structure or modifier['$set']?.retention_peroid or modifier['$set']?.fonds_name or modifier['$set']?.year
					set_archivecode(doc._id)
				if modifier['$set']?.retention_peroid || modifier['$set']?.document_date
					set_destory(doc)
				if modifier['$set']?.archive_dept # 设置分类号
					set_category_code(doc)
				
				# 设置重新封装
				set_hasXml(doc._id)
				# 日志记录
				set_audit(doc?._id, doc?.space, userId)

	actions:
		# standard_new:
		# 	visible: ()->
		# 		if db.space_users.findOne({_id: Meteor.userId})?.company != Session.get("listTreeCompany") && !Steedos.isSpaceAdmin()
		# 			return ;
		# 		permissions = Creator.getPermissions()
		# 		if permissions
		# 			return permissions["allowCreate"]

		# standard_edit:
		# 	visible: (object_name, record_id, record_permissions)->
		# 		if db.space_users.findOne({_id: Meteor.userId})?.company != Session.get("listTreeCompany") && !Steedos.isSpaceAdmin()
		# 			return ;
		# 		if record_permissions
		# 			return record_permissions["allowEdit"]
		# 		else
		# 			record = Creator.Collections[object_name].findOne record_id
		# 			record_permissions = Creator.getRecordPermissions object_name, record, Meteor.userId()
		# 			if record_permissions
		# 				return record_permissions["allowEdit"]

		# standard_delete:
		# 	visible: (object_name, record_id, record_permissions)->
		# 		if db.space_users.findOne({_id: Meteor.userId})?.company != Session.get("listTreeCompany") && !Steedos.isSpaceAdmin()
		# 			return ;
		# 		if record_permissions
		# 			return record_permissions["allowDelete"]
		# 		else
		# 			record = Creator.Collections[object_name].findOne record_id
		# 			record_permissions = Creator.getRecordPermissions object_name, record, Meteor.userId()
		# 			if record_permissions
		# 				return record_permissions["allowDelete"]

		number_adjuct:
			label:'编号调整'
			# visible:true
			visible: ()->
				permissions = Creator.getPermissions()
				if permissions
					return permissions["allowCreate"]
			on:'list'
			todo:(object_name)->
				if Creator.TabularSelectedIds?[object_name].length == 0
					swal("请先选择要接收的档案")
					return
				init_num = prompt("输入初始件号值")
				if init_num
					Meteor.call("archive_item_number",object_name,Creator.TabularSelectedIds?[object_name],init_num,
						(error, result)->
							if result							
								dxDataGridInstance = $(".gridContainer").dxDataGrid().dxDataGrid('instance')
								Template.creator_grid.refresh(dxDataGridInstance)
								# text = "编号已更新到" + result + "号"
								text = "编号已更新"
								swal(text)
							)

		
		receive:
			label: "接收"
			# visible: true
			visible: ()->
				permissions = Creator.getPermissions()
				if permissions
					return permissions["allowCreate"]
			on: "list"
			todo:(object_name)->
				if Session.get("list_view_id")== "receive"
					if Creator.TabularSelectedIds?[object_name].length == 0
						swal("请先选择要接收的档案")
						return
					space = Session.get("spaceId")
					Meteor.call("archive_receive",object_name,Creator.TabularSelectedIds?[object_name],space,
						(error,result) ->
							if result
								text = "共接收"+result[0]+"条,"+"成功"+result[1]+"条"
								swal(text)
							)
							
		export2xml:
			label:"导出XML"
			visible:false
			on: "list"
			todo:(object_name, record_id)->
				# 转为XML文件
				Meteor.call("archive_export",object_name,
						(error,result) ->
							if result
								text = "记录导出路径："
								swal(text + result)
							)

		borrow:
			label:"借阅"
			visible:true					
			visible: ()->
				permissions = Creator.getPermissions()
				if permissions
					return !permissions["allowCreate"]
			on: "record"
			todo:(object_name, record_id, fields)->
				borrower = Creator.Collections[object_name].findOne({_id:record_id})?.borrowed_by
				if borrower == Meteor.userId()
					swal("您已借阅了此档案，归还之前无需重复借阅")
					return
				doc = Archive.createBorrowObject(object_name, record_id)
				Creator.createObject("archive_borrow",doc)
		
		viewxml:
			label:"查看XML"
			# visible:true			
			visible: ()->
				permissions = Creator.getPermissions()
				if permissions
					return permissions["allowCreate"]
			on: "record"
			todo:(object_name, record_id, fields)->
				has_xml = Creator.Collections[object_name].findOne({_id:record_id})?.has_xml
				if has_xml
					window.location = Steedos.absoluteUrl "/view/encapsulation/xml?filename=#{record_id}.xml"
				else
					swal("该档案暂无XML封装文件")