xml2js = Npm.require 'xml2js'
fs = Npm.require 'fs'
path = Npm.require 'path'
mkdirp = Npm.require 'mkdirp'
NodeRSA = Npm.require 'node-rsa'

logger = new Logger 'QHD_Export_TO_XML'

# =============================================
# spaces: Array 工作区ID
# contract_flows： Array 合同类流程
ExportToXML = (spaces, record_ids) ->
	@spaces = spaces
	@record_ids = record_ids
	return

# 存储为编码数据，base64字符串
converterBase64 = (file_obj, callback)->
	try 
		bmsj = ""
		stream = file_obj.createReadStream('files')
		# buffer the read chunks
		chunks = []
		stream.on 'data', (chunk) ->
			chunks.push chunk
		stream.on 'end', () ->
			file_data = Buffer.concat(chunks)
			bmsj = file_data.toString('base64')
			callback("", bmsj)
			return
	catch e
		console.log "e",e

async_converterBase64 = Meteor.wrapAsync(converterBase64)

# 读取文件信息
readFileInfo = (cms_file) ->
	file_objs = Creator.Collections['cfs.files.filerecord'].find({_id:{$in:cms_file.versions}},{sort: {created: -1}})
	WDSJ = []
	file_objs.forEach (file_obj)->
		DZSX = {
			"格式信息": file_obj?.original?.type,
			"计算机文件名": file_obj?.original?.name,
			"计算机文件大小": file_obj?.original?.size,
			"文档创建程序": ""
		}
		SZHSX = {
			"数字化对象形态":"",
			"扫描分辨率":"",
			"扫描色彩模式":"",
			"图像压缩方案":"",
		}

		bmms = "本封装包中“编码数据”元素存储的是计算机文件二进制流的Base64编码，有关Base64编码规则参见IETF RFC 2045多用途邮件扩展（MIME）第一部分：互联网信息体格式。当提取和显现封装在编码数据元素中的计算机文件时，应对Base64编码进行反编码，并依据封装包中“反编码关键字”元素中记录的值还原计算机文件的扩展名"

		fbmms = "base64-" + file_obj?.getExtension()
		
		# 读取文件内容
		# bmsj = async_converterBase64(file_obj)
		# 读取数据库内容-'base64'编码
		str_file = JSON.stringify(file_obj)
		bmsj = new Buffer(str_file).toString('base64')
		
		BM = {
			"编码ID": file_obj?._id,
			"电子属性": DZSX,
			"数字化属性": SZHSX,
			"编码描述": bmms,
			"反编码关键字": fbmms,
			"编码数据": bmsj
		}
		WDSJ.push BM
	return WDSJ

# 封装被签名对象
encapsulation = (record_obj) ->
	# 全宗
	fonds_obj = Creator.Collections["archive_fonds"].findOne({'_id':record_obj?.fonds_name})
	# 保管期限
	retention_obj = Creator.Collections["archive_retention"].findOne({'_id':record_obj?.retention_peroid})
	# 类别
	category_obj = Creator.Collections["archive_classification"].findOne({'_id':record_obj?.category_code})
	# 读取所有的文件
	cms_files = Creator.Collections["cms_files"].find({'parent.ids':record_obj?._id},{sort: {created: -1}})
	# 审计
	audit_list = Creator.Collections["archive_audit"].find({'action_administrative_records_id':record_obj?._id}).fetch()

	# === 电子文件封装包 - 被签名对象 - 封装内容
	# 来源
	LY = {
		"档案馆名称": record_obj?.archives_name || "",
		"档案馆代码": record_obj?.archives_identifier || "",
		"全宗名称": fonds_obj?.name || "",
		"立档单位名称": record_obj?.fonds_constituting_unit_name || ""
	}
	# 档号
	DH = {
		"全宗号": fonds_obj?.code || "",
		"年度": record_obj?.year || "",
		"保管期限": retention_obj?.name || "",
		"机构": record_obj?.organizational_structure || "",
		"类别号": category_obj?.name || "",
		"页号": record_obj?.page_number || "",
		"保管卷号": record_obj?.file_number || "",
		"分类卷号": record_obj?.classification_number || "",
		"件号": record_obj?.item_number || ""
	}
	# 内容描述
	NRMS = {
		"题名": record_obj?.title || "",
		"并列题名": record_obj?.parallel_title || "",
		"说明题名文字": record_obj?.other_title_information || "",
		"附件题名": record_obj?.annex_title || "",
		"主题词": record_obj?.descriptor || "",
		"关键词": record_obj?.keyword || "",
		"人名": record_obj?.personal_name || "",
		"摘要": record_obj?.abstract || "",
		"文件编号": record_obj?.document_number || "",
		"责任者": record_obj?.author || "",
		"文件日期": record_obj?.document_date?.toISOString() || "",
		"起始日期": record_obj?.start_date?.toISOString() || "",
		"截止日期": record_obj?.closing_date?.toISOString() || "",
		"销毁日期": record_obj?.destroy_date?.toISOString() || "",
		"紧急程度": record_obj?.precedence || "",
		"主送": record_obj?.prinpipal_receiver || "",
		"抄送": record_obj?.other_receivers || "",
		"抄报": record_obj?.report || "",
		"密级": record_obj?.security_classification || "",
		"拟稿人": record_obj?.applicant_name || "",
		"拟稿单位": record_obj?.applicant_organization_name || "",
		"保密期限": record_obj?.secrecy_period || ""
	}
	# 形式特征
	XSTZ = {
		"文件组合类型": record_obj?.document_aggregation || "",
		"卷内文件数": record_obj?.total_number_of_items || "",
		"页数": record_obj?.total_number_of_pages || "",
		"文件类型": record_obj?.document_type || "",
		"文件状态": record_obj?.document_status || "",
		"语种": record_obj?.language || "",
		"电子档案生成方式": record_obj?.orignal_document_creation_way || "",
		"处理标志": record_obj?.produce_flag || "",
		"归档日期": record_obj?.archive_date?.toISOString() || "",
		"归档部门": record_obj?.archive_dept || ""
	}
	# 存储位置
	CCWZ = {
		"当前位置": record_obj?.current_location || "",
		"脱机载体编号": record_obj?.offline_medium_identifier || "",
		"脱机载体存址": record_obj?.offline_medium_storage_location || ""
	}
	# 权限管理
	QXGL = {
		"知识产权说明": record_obj?.intelligent_property_statement || "",
		"授权对象": record_obj?.authorized_agent || "",
		"授权行为": record_obj?.permission_assignment || "",
		"控制标识": record_obj?.control_identifier || ""
	}

	# 文件数据
	WJSJ = []
	# 读取文档
	cms_files.forEach (cms_file, index)->
		WDSJ = readFileInfo(cms_file)
		wdzcsm = "附属文档"
		if cms_file?.main
			wdzcsm = "主文档"
		WD = {
			"文档标识符": cms_file?._id,
			"文档序号": index,
			"文档主从声明": wdzcsm,
			"文档数据": WDSJ
		}
		WJSJ.push WD

	# 文件实体
	WJST = {
		"聚合层次": record_obj?.aggregation_level || "",
		"来源": LY,
		"电子文件号": record_obj?.electronic_record_code || "",
		"档号": DH,
		"内容描述": NRMS,
		"形式特征": XSTZ,
		"存储位置": CCWZ,
		"权限管理": QXGL,
		"文件数据": WJSJ
	}
	# 文件实体关系
	WJSTGX = {
		"实体标识符": record_obj?._id || "",
		"被关联实体标识符": record_obj?.related_archives || ""
	}

	# 文件实体块
	WJSTK = {
		"文件实体": WJST,
		"文件实体关系": WJSTGX
	}

	# 业务实体
	YWST = []
	
	# 人员表
	user_ids = []
	
	if audit_list?.length > 0
		audit_list.forEach (audit_obj)->
			ywobj = {
				"业务标识符": audit_obj?._id || "",
				"机构人员标识符": audit_obj?.action_user || "",
				"业务状态": audit_obj?.business_status || "",
				"业务行为": audit_obj?.business_activity || "",
				"行为时间": audit_obj?.action_time?.toISOString() || "",
				"行为依据": audit_obj?.action_mandate || "",
				"行为描述": audit_obj?.action_description || ""
			}
			YWST.push ywobj
			user_ids.push audit_obj?.action_user
	
	# 业务实体块
	YWSTK = {
		"业务实体":YWST
	}

	# 机构人员实体
	JGRYST = []
	space_user_list = Creator.Collections["space_users"].find({'user':{$in:user_ids}}).fetch()
	if space_user_list?.length > 0
		space_user_list.forEach (space_user_obj)->
			jgryobj = {
				"机构人员标识符": space_user_obj?.user || "",
				"机构人员类型": "内设机构",
				"机构人员名称": space_user_obj?.name || "",
				"组织机构代码": space_user_obj?.company || "",
				"个人职位": space_user_obj?.position || ""
			}
			JGRYST.push jgryobj

	# 机构人员实体块
	JGRYSTK = {
		"机构人员实体":JGRYST
	}

	# 封装内容
	FZNR = {
		"文件实体块": WJSTK,
		"业务实体块": YWSTK,
		"机构人员实体块": JGRYSTK,
	}

	# === 电子文件封装包 - 被签名对象
	# 封装包类型
	fzblx = "原始型"
	# 封装包类型描述
	fzblxms = "本封装包包含电子文件数据及其元数据，原始封装，未经修改"
	# if record_obj?.has_xml
	# 	fzblx = "修改型"
	# 	fzblxms = "本封装包包含电子文件数据及其元数据，系修改封装，在保留原封装包的基础上，添加了修改层"
	# 封装包创建时间
	fzbcjsj = new Date
	# 封装包创建单位
	fzbcjdw = "河北港口集团"
	# 被签名对象
	BQMDX = {
		"封装包类型": fzblx,
		"封装包类型描述": fzblxms,
		"封装包创建时间": fzbcjsj.toISOString(),
		"封装包创建单位": fzbcjdw,
		"封装内容":FZNR
	}

	return BQMDX

# 导出为xml文件
ExportToXML.export2xml = (record_obj, callback) ->
	# 封装被签名对象
	try
		bqmdx_json = encapsulation(record_obj)
	catch e
		console.log "e",e
		logger.error "#{record_obj._id}封装失败",e

	if bqmdx_json
		# 转xml
		builder = new xml2js.Builder()
		# 被签名对象
		bqmdx_xml = builder.buildObject bqmdx_json
		# 生成签名
		private_key_file = Meteor.settings?.records_xml?.archive?.private_key_file
		if private_key_file
			buffer_bqmdx = new Buffer bqmdx_xml
			# key
			try
				readStream = fs.readFileSync private_key_file,{encoding:'utf8'}
				key = new NodeRSA(readStream,'pkcs8');
			catch e
				console.log "未获取私钥文件",e

			# 签名
			# 参数1：需要签名的数据
			# 参数2：加密后返回的格式
			# 参数3：签名数据编码
			try
				signature = key.sign(buffer_bqmdx, 'base64', 'utf8');
			catch e
				console.log "签名错误",e

			# 电子签名
			qmbsf = "修改0-签名1"
			qmgz = "base64"
			qmsj = new Date
			qmr = Meteor.settings?.records_xml?.archive?.signaturer || ""
			qmsfbs = "sha1WithRSAEncryption"
			zsk = []
			public_key_file = Meteor.settings?.records_xml?.archive?.public_key_file
			if public_key_file
				zs = fs.readFileSync public_key_file,{encoding:'utf8'}
				zsyz = ""
				zs_obj = {
					"证书": zs,
					"证书引证": zsyz
				}
				zsk.push zs_obj
			dzqm_json = {
				"签名标识符": qmbsf,
				"签名规则": qmgz,
				"签名时间": qmsj.toISOString(),
				"签名人": qmr,
				"签名结果": signature,
				"证书块": zsk,
				"签名算法标识": qmsfbs
			}

			# 在数据库中保存
			Creator.Collections["archive_wenshu"].direct.update(record_obj._id,
				{
					$set:{
						signature_rules:qmgz,
						signature_time:qmsj,
						signer:qmr,
						signature:signature,
						certificate:zs,
						certificate_reference:zsyz,
						signature_algorithmidentifier:qmsfbs,
					}
				})
			
			DZWJFZB = {
				"封装包格式描述": "本EEP根据中华人民共和国档案行业标准DA/T HGWS《基于XML的电子文件封装规范》生成",
				"版本": "2018",
				"被签名对象": bqmdx_json,
				"电子签名": dzqm_json
			}

			xml = builder.buildObject DZWJFZB
			
			stream = new Buffer xml

			# # 验证
			# 参数1：被签名的内容
			# 参数2：签名结果
			# 参数3：被签名对象的编码格式
			# 参数4：签名的编码格式
			# result = key.verify(buffer_bqmdx, signature, 'utf8', 'base64')

			# 根据当天时间的年月日作为存储路径
			now = new Date
			year = now.getFullYear()
			month = now.getMonth() + 1
			day = now.getDate()

			# 文件路径
			xml_file_path = Meteor.settings?.records_xml?.xml_file_path
			if xml_file_path
				filePath = path.join(xml_file_path)
				fileName = record_obj?._id + ".xml"
				fileAddress = path.join filePath, fileName

				if !fs.existsSync filePath
					mkdirp.sync filePath

				# 写入文件Meteor.bindEnvironment(InstancesStat.run)
				fs.writeFile fileAddress, stream, Meteor.bindEnvironment(
					(err) ->
						if err
							console.log "#{record_obj._id}写入xml文件失败",err
							logger.error "#{record_obj._id}写入xml文件失败",err
					)


ExportToXML.success = (record_obj)->
	console.log "封装成功"
	Creator.Collections["archive_wenshu"].direct.update({_id: record_obj._id}, {$set: {has_xml: true}})

ExportToXML.failed = (record_obj, error)->
	logger.error "failed, name is #{record_obj.title}, id is #{record_obj._id}. error: " + error

#获取所有未导出为xml的文书records
ExportToXML::getNonExportedRecords = ()->
	query = {}
	if @record_ids and @record_ids?.length>0
		query = {
			space: {$in: @spaces},
			_id: {$in: @record_ids}
			}
	else
		query = {
			space: {$in: @spaces},
			# has_xml是否导出为xml
			$or: [
				{has_xml: false},
				{has_xml: {$exists: false}}
			]
		}
	return Creator.Collections["archive_wenshu"].find(query, {fields: {_id: 1}}).fetch()

ExportToXML::DoExport = () ->
	console.time("syncRecords")
	records = @getNonExportedRecords()
	that = @
	records.forEach (record)->
		console.log "DoExport - ",record?._id
		# 档案记录
		record_obj = Creator.Collections["archive_wenshu"].findOne({'_id':record?._id})
		if record_obj
			try
				ExportToXML.export2xml record_obj
				ExportToXML.success record_obj
			catch e
				ExportToXML.failed record_obj,e
				return
	console.timeEnd("syncRecords")
