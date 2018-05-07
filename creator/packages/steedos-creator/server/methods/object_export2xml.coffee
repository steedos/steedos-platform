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
	
	return filePath


# 整理Fields的json数据
_mixFieldsData = (obj,objName) ->
	# 初始化对象数据
	jsonObj = {}
	# 获取fields
	objFields = Creator?.getObject(objName)?.fields

	mixDefault = (field_name)->
		jsonObj[field_name] = obj[field_name] || ""

	mixDate = (field_name,type)->
		date = obj[field_name]
		if type == "date"
			format = "YYYY-MM-DD"
		else
			format = "YYYY-MM-DD HH:mm:ss"
		if date? and format?
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
	_.each objFields, (field, field_name)->
		switch field?.type
			when "date","datetime" then mixDate field_name,field.type
			when "boolean" then mixBool field_name
			else mixDefault field_name

	return jsonObj

# 获取子表整理数据
_mixRelatedData = (obj,objName) ->
	# 初始化对象数据
	related_objects = {}

	# 获取相关表
	relatedObjNames = Creator?.getAllRelatedObjects objName

	# 循环相关表
	relatedObjNames.forEach (relatedObjName) ->
		# 每个表定义一个对象数组
		relatedTableData = []

		# *设置关联搜索查询的字段
		# 附件的关联搜索字段是定死的
		if relatedObjName == "cms_files"
			related_field_name = "parent.ids"
		else
			# 获取fields
			fields = Creator?.Objects[relatedObjName]?.fields
			# 循环每个field,找出reference_to的关联字段
			related_field_name = ""
			_.each fields, (field, field_name)->
				if field?.reference_to == objName
					related_field_name = field_name

		# 根据找出的关联字段，查子表数据
		if related_field_name
			relatedCollection = Creator.Collections[relatedObjName]
			# 获取到所有的数据
			relatedRecordList = relatedCollection.find({"#{related_field_name}":obj._id}).fetch()
			# 循环每一条数据
			relatedRecordList.forEach (relatedObj)->
				# 整合fields数据
				fieldsData = _mixFieldsData relatedObj,relatedObjName
				# 把一条记录插入到对象数组中
				relatedTableData.push fieldsData

		# 把一个子表的所有数据插入到related_objects中，再循环下一个
		related_objects[relatedObjName] = relatedTableData

	return related_objects

# Creator.Export2xml()
Creator.Export2xml = (objName, recordList) ->
	logger.info "Run Creator.Export2xml"

	console.time "Creator.Export2xml"

	# 测试数据
	# objName = "archive_records"

	# 查找对象数据
	collection = Creator.Collections[objName]
	# 测试数据
	recordList = collection.find({}).fetch()

	recordList.forEach (recordObj)->
		jsonObj = {}
		jsonObj._id = recordObj._id

		# 整理主表的Fields数据
		fieldsData = _mixFieldsData recordObj,objName
		jsonObj[objName] = fieldsData

		# 整理相关表数据
		related_objects = _mixRelatedData recordObj,objName

		jsonObj["related_objects"] = related_objects

		# 转为xml保存文件
		filePath = _writeXmlFile jsonObj,objName

	console.timeEnd "Creator.Export2xml"
	return filePath