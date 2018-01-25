xml2js = Npm.require 'xml2js'
fs = Npm.require 'fs'
path = Npm.require 'path'
mkdirp = Npm.require 'mkdirp'

logger = new Logger 'Export_TO_XML'

_writeXmlFile = (jsonObj,objName) ->
	# 转xml
	builder = new xml2js.Builder()
	xml = builder.buildObject jsonObj

	# 转为buffer
	stream = new Buffer xml

	# 根据当天时间的年月日作为存储路径
	now = new Date
	year = now.getFullYear()
	month = now.getMonth() + 1
	day = now.getDate()

	# 文件路径
	filePath = path.join(__meteor_bootstrap__.serverDir,'../../../export/' + year + '/' + month + '/' + day + '/' + objName )
	fileName = jsonObj?._id + ".xml"
	fileAddress = path.join filePath, fileName

	if !fs.existsSync filePath
		mkdirp.sync filePath

	# 写入文件
	fs.writeFile fileAddress, stream, (err) ->
		if err
			logger.error "#{jsonObj._id}写入xml文件失败",err


# 整理Fields的json数据
_mixFieldsData = (obj,objName) ->
	# 初始化对象数据
	jsonObj = {}
	# 获取fields
	objSchema = Creator?.getSchema(objName)?._schema

	mixStr = (field_name)->
		jsonObj[field_name] = obj[field_name] || ""

	mixArr = (field_name)->
		jsonObj[field_name] = obj[field_name] || ""

	mixDate = (field_name,format)->
		date = obj[field_name]
		if date
			dateStr = moment(date).format(format)
		jsonObj[field_name] = dateStr || ""

	mixBool = (field_name)->
		if obj[field_name] == true
			jsonObj[field_name] = "是"
		else if obj[field_name] == false
			jsonObj[field_name] = "否"
		else
			jsonObj[field_name] = ""

	# 循环每个fields,并判断取值
	_.each objSchema, (field, field_name)->
		switch field?.type?.name
			when "String","Number" then mixStr field_name
			when "Array" then mixArr field_name
			when "Date" then mixDate field_name, field?.autoform?.dateTimePickerOptions?.format
			when "Boolean" then mixBool field_name
			else mixStr field_name
	return jsonObj

# 获取子表整理数据
_mixRelatedData = (obj,objName) ->
	# 初始化对象数据
	related_tables = {}

	# 获取相关表
	relatedObjNames = Creator?.getAllRelatedObjects objName
	# relatedObjNames = ["archive_audit","archive_entity_relation"]

	# 循环相关表
	relatedObjNames.forEach (relatedObjName) ->
		# 获取fields
		fields = Creator?.Objects[relatedObjName]?.fields

		# 循环每个field,找出reference_to的关联字段
		related_field_name = ""
		_.each fields, (field, field_name)->
			if field?.reference_to == objName
				related_field_name = field_name

		# 根据找出的reference_to关联字段，查子表数据
		if related_field_name
			related_tables[relatedObjName] = []
			# 获取到所有的数据
			relatedCollection = Creator.Collections[relatedObjName]

			relatedRecordObjs  = relatedCollection.find({"#{related_field_name}":obj._id}).fetch()

			related_tables[relatedObjName] = relatedRecordObjs

	return related_tables


# Creator.Export2xml()
Creator.Export2xml = (objName) ->
	logger.info "Run Creator.Export2xml"

	console.time "Creator.Export2xml"

# 测试数据
	objName = "archive_records"
	# 查找对象数据
	collection = Creator.Collections[objName]
# 测试数据
	recordList = collection.find({_id:"54pvEyFaANHHYb6Tc"}).fetch()

	recordList.forEach (recordObj)->
		jsonObj = {}
		jsonObj._id = recordObj._id

		# 整理主表的Fields数据
		fieldsData = _mixFieldsData recordObj,objName
		jsonObj[objName] = fieldsData

		# 整理相关表数据
		related_tables = _mixRelatedData recordObj,objName

		jsonObj["related_tables"] = related_tables

		# 转为xml保存文件
		_writeXmlFile jsonObj,objName

	console.timeEnd "Creator.Export2xml"