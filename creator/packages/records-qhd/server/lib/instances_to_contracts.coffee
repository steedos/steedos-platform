request = Npm.require('request')

path = Npm.require('path');

pathname = path.join(Creator.steedosStorageDir, '/files/instances');

absolutePath = path.resolve(pathname);

logger = new Logger 'Records_QHD -> InstancesToContracts'

_fieldMap = """
	{
		projectName: values["计划编号"],
		contractType: values["合同类型"],
		chengBanDanWei: values["承办单位"],
		chengBanRen: values["承办人员"],
		otherUnit: values["对方单位"],
		registeredCapital: values["对方注册资金"] * 10000,
		contractAmount: values["价款酬金"],
		signedDate: values["签订日期"],
		startDate: values["开始日期"],
		overDate: values["终止日期"],
		remarks: values["备注"],
		boP: values["收支类别"],
		isConnectedTransaction: values["是否关联交易"],
		contractId: values["合同编号"],
		contractName: values["合同名称"]
	}
"""

InstancesToContracts = (spaces, contracts_server, contract_flows, submit_date_start, submit_date_end) ->
	@spaces = spaces
	@contracts_server = contracts_server
	@contract_flows = contract_flows
	@submit_date_start = submit_date_start
	@submit_date_end = submit_date_end
	return

InstancesToContracts.success = (instance)->
	console.info("success, name is #{instance.name}, id is #{instance._id}")
	db.instances.direct.update({_id: instance._id}, {$set: {is_contract_archived: true}})

InstancesToContracts.failed = (instance, error)->
	console.error("failed, name is #{instance.name}, id is #{instance._id}. error: ")
	console.error error

InstancesToContracts::getContractInstances = ()->
	query = {
		space: {$in: @spaces},
		flow: {$in: @contract_flows},
		is_deleted: false,
		state: "completed",
		"values.币种": "人民币",
#		$or: [{final_decision: "approved"}, {final_decision: {$exists: false}}, {final_decision: ""}]
	}

	if @submit_date_start && @submit_date_end
		query.submit_date = {$gte: @submit_date_start, $lte: @submit_date_end}
	else
		query.is_contract_archived = {$ne: true}

	return db.instances.find(query, {fields: {_id: 1}}).fetch()

_minxiInstanceData = (formData, instance) ->

	console.log("_minxiInstanceData", instance._id)

	fs = Npm.require('fs');

	if !formData || !instance
		return

	format = "YYYY-MM-DD HH:mm:ss"

	formData.fileID = instance._id

	field_values = InstanceManager.handlerInstanceByFieldMap(instance, _fieldMap);

	formData = _.extend formData, field_values

	fieldNames = _.keys(formData)

	fieldNames.forEach (key)->
		fieldValue = formData[key]

		if _.isDate(fieldValue)
			fieldValue = moment(fieldValue).format(format)

		if _.isObject(fieldValue)
			fieldValue = fieldValue?.name

		if _.isArray(fieldValue) && fieldValue.length > 0 && _.isObject(fieldValue)
			fieldValue = fieldValue?.getProperty("name")?.join(",")

		if _.isArray(fieldValue)
			fieldValue = fieldValue?.join(",")

		if !fieldValue
			fieldValue = ''

		formData[key] = encodeURI(fieldValue)

	formData.attach = new Array()

	formData.originalAttach = new Array();

	#	提交人信息
	user_info = db.users.findOne({_id: instance.applicant})

	fileHandle = (f)->
		try
			filepath = path.join(absolutePath, f.copies.instances.key);

			if(fs.existsSync(filepath))
				formData.attach.push {
					value: fs.createReadStream(filepath),
					options: {filename: f.name()}
				}
			else
				console.error "附件不存在：#{filepath}"
		catch e
			console.error "附件下载失败：#{f._id},#{f.name()}. error: " + e


	#	正文附件
	mainFile = cfs.instances.find({
		'metadata.instance': instance._id,
		'metadata.current': true,
		"metadata.main": true
	}).fetch()

	mainFile.forEach fileHandle

	#	非正文附件
	nonMainFile = cfs.instances.find({
		'metadata.instance': instance._id,
		'metadata.current': true,
		"metadata.main": {$ne: true}
	}).fetch()

	nonMainFile.forEach fileHandle

	#分发
	if instance.distribute_from_instance
#	正文附件
		mainFile = cfs.instances.find({
			'metadata.instance': instance.distribute_from_instance,
			'metadata.current': true,
			"metadata.main": true,
			"metadata.is_private": {
				$ne: true
			}
		}).fetch()

		mainFile.forEach fileHandle

		#	非正文附件
		nonMainFile = cfs.instances.find({
			'metadata.instance': instance.distribute_from_instance,
			'metadata.current': true,
			"metadata.main": {$ne: true},
			"metadata.is_private": {
				$ne: true
			}
		}).fetch()

		nonMainFile.forEach fileHandle

	#	原文
	form = db.forms.findOne({_id: instance.form})
	attachInfoName = "F_#{form?.name}_#{instance._id}_1.html";

	space = db.spaces.findOne({_id: instance.space});

	user = db.users.findOne({_id: space.owner})

	options = {showTrace: true, showAttachments: true, absolute: true}

	html = InstanceReadOnlyTemplate.getInstanceHtml(user, space, instance, options)

	dataBuf = new Buffer(html);

	try
		formData.originalAttach.push {
			value: dataBuf,
			options: {filename: attachInfoName}
		}
	catch e
		console.error "原文读取失败#{instance._id}. error: " + e

	console.log("_minxiInstanceData end", instance._id)

	return formData;


InstancesToContracts::sendContractInstances = (api, callback)->
	ret = {count: 0, successCount: 0, instances: []}

	that = @

	instances = @getContractInstances()

	successCount = 0

	console.log("InstancesToContracts.sendContractInstances", instances.length)

	instances.forEach (mini_ins)->

		instance = db.instances.findOne({_id: mini_ins._id})

		if instance
			url = that.contracts_server + api + '?externalId=' + instance._id

			console.log("InstancesToContracts.sendContractInstances url", url)

			success = InstancesToContracts.sendContractInstance url, instance

			r = {
				_id: instance._id,
				name: instance.name,
				applicant_name: instance.applicant_name,
				submit_date: instance.submit_date,
				is_contract_archived: true
			}

			if success
				successCount++
			else
				r.is_contract_archived = false

			ret.instances.push r

	ret.count = instances.length

	ret.successCount = successCount

	return ret



InstancesToContracts.sendContractInstance = (url, instance, callback) ->
	formData = {}

	formData.attach = new Array()

	flow = db.flows.findOne({_id: instance.flow});

	if flow
		formData.flowName = encodeURI(flow.name)

	_minxiInstanceData(formData, instance)

	httpResponse = steedosRequest.postFormDataAsync url, formData, callback

	if httpResponse.statusCode == 200
		InstancesToContracts.success instance
		return true
	else
		InstancesToContracts.failed instance, httpResponse?.body
		return false