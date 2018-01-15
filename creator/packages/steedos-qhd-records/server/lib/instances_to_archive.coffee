logger = new Logger 'Records_QHD -> InstancesToArchive'

# spaces: Array 工作区ID
# contract_flows： Array 合同类流程
InstancesToArchive = (spaces, contract_flows, ins_ids) ->
	@spaces = spaces
	@contract_flows = contract_flows
	@ins_ids = ins_ids
	return

InstancesToArchive.success = (instance)->
	console.log("success, name is #{instance.name}, id is #{instance._id}")
	# db.instances.update({_id: instance._id}, {$set: {is_recorded: true}})

InstancesToArchive.failed = (instance, error)->
	console.log("failed, name is #{instance.name}, id is #{instance._id}. error: ")
	console.log error

#	获取非合同类的申请单：正常结束的(不包括取消申请、被驳回的申请单)
InstancesToArchive::getNonContractInstances = ()->
	query = {
		space: {$in: @spaces},
		flow: {$in: ["1ff12bc17e235503aff2c4c9"]},
		$or: [{is_recorded: false},{is_recorded: {$exists: false}}],
		is_deleted: false,
		state: "completed",
		"values.record_need": "true",
		$or: [{final_decision: "approved"}, {final_decision: {$exists: false}}, {final_decision: ""}]
	}
	if @ins_ids
		query._id = {$in: @ins_ids}
	return db.instances.find(query, {fields: {_id: 1}}).fetch()

#	校验必填
_checkParameter = (formData) ->
	if !formData.fonds_name
		return false
	return true

# 按年度计算件数,生成电子文件号的最后组成
buildElectronicRecordCode = (formData) ->
	num = db.archive_records.find({'year':formData?.year}).count() + 1
	strCount = (Array(6).join('0') + num).slice(-6)
	strElectronicRecordCode = formData?.fonds_identifier +
								formData?.archival_category_code +
								formData?.year + strCount
	return strElectronicRecordCode
# 获取格式名称
getFormatName = (fileName) ->
	if fileName?
		pos=fileName.lastIndexOf(".")+1
		extension = fileName.substring(pos) || ""
		return extension
# 获取格式版本
getFormatVersion = (fileType) ->
	if fileType?
		return fileType
# 生成计算机文件名
getComputerFileName = (formData) ->
	computer_file_name = formData?.fonds_identifier + ' - ' +
						 formData?.archival_category_code + ' · ' +
						 formData?.year + ' - ' +
						 formData?.organizational_structure + ' - ' +
						 formData?.retention_peroid + ' - ' +
						 formData?.item_number + ' - ' + 'D' +
						 formData?.fileCount

# 整理档案表数据
_minxiInstanceData = (formData, instance) ->
	if !instance
		return
	dateFormat = "YYYY-MM-DD HH:mm:ss"

	formData._id = db.archive_records._makeNewID()

	formData.space = instance.space

	# 字段映射
	field_values = InstanceManager.handlerInstanceByFieldMap(instance)
	formData = _.extend formData, field_values

	# 根据FONDSID查找全宗号
	fond = db.archive_fonds.findOne({'name':formData?.fonds_name})
	formData.fonds_identifier = fond?.code
	# 根据机构查找对应的类别号
	classification = db.archive_classification.findOne({'dept':/{formData?.organizational_structure}/})
	# formData.fonds_identifier = classification?._id
	formData.category_code = "Fy9xCJxhCzBTggAbG"
	# 保管期限代码查找
	retention = db.archive_retention.findOne({'code':formData?.archive_retention_code})
	formData.retention_peroid = retention?._id
	# 根据保管期限,处理标志
	if retention?.years >= 10
		formData.produce_flag = "在档"
	else
		formData.produce_flag = "暂存"

	# 电子文件号
	formData.electronic_record_code = buildElectronicRecordCode formData
	# 归档日期
	formData.archive_date = moment(new Date()).format(dateFormat)

	formData.external_id = instance._id

	formData.is_received = false

	fieldNames = _.keys(formData)

	fieldNames.forEach (key)->
		fieldValue = formData[key]
		if _.isDate(fieldValue)
			fieldValue = moment(fieldValue).format(dateFormat)

		if _.isObject(fieldValue)
			fieldValue = fieldValue?.name

		if _.isArray(fieldValue) && fieldValue.length > 0 && _.isObject(fieldValue)
			fieldValue = fieldValue?.getProperty("name")?.join(",")

		if _.isArray(fieldValue)
			fieldValue = fieldValue?.join(",")

		if !fieldValue
			fieldValue = ''

	attachmentsToArchive = new AttachmentsToArchive(instance.space,instance._id,formData)

	attachmentsToArchive.syncAttachments()

	console.log("_minxiInstanceData end", instance._id)

	return formData

InstancesToArchive.syncNonContractInstance = (instance, callback) ->
	#	表单数据
	formData = {}

	_minxiInstanceData(formData, instance)

	if _checkParameter(formData)
		logger.debug("_sendContractInstance: #{instance._id}")
		# 添加到相应的档案表
		db.archive_records.direct.insert(formData)
		InstancesToArchive.success instance
	else
		InstancesToArchive.failed instance, "立档单位 不能为空"

InstancesToArchive::syncNonContractInstances = () ->
	instance = db.instances.findOne({_id: 'DBrLPoHhLz4EoivXs'})
	if instance
		InstancesToArchive.syncNonContractInstance instance




	# console.time("syncNonContractInstances")
	# instances = @getNonContractInstances()
	# that = @
	# console.log "instances.length is #{instances.length}"
	# instances.forEach (mini_ins)->
	# 	instance = db.instances.findOne({_id: mini_ins._id})
	# 	if instance
	# 		InstancesToArchive.syncNonContractInstance instance
	# console.timeEnd("syncNonContractInstances")