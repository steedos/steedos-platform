fs = Npm.require 'fs'

logger = new Logger 'QUEUE_IMPORT'

converterString = (field_name, dataCell,jsonObj)->
	text_error = ""
	if dataCell
		jsonObj[field_name] = dataCell
	else
		text_error = "#{field_name}不能为空"
	return text_error
converterDate = (field_name, dataCell,jsonObj)->
	date_error = ""
	date = new Date(dataCell)
	console.log "date====",date
	if date.getFullYear() and Object.prototype.toString.call(date)== '[object Date]'
		jsonObj[field_name] = date
		console.log date
	else
		console.log "555"
		date_error = "#{dataCell}不是日期类型数据"
		console.log "date_error=====",date_error
	return date_error
converteInt = (field_name, dataCell,jsonObj)->
	number_error = ""
	number = parseInt(dataCell)
	if !isNaN(number)
		console.log "dataCell===",dataCell
		jsonObj[field_name] = number
	else
		number_error =  "#{dataCell}不是数值类型数据"
	return number_error
converterSelect = (objectName,field_name, dataCell,jsonObj)->
	select_error = ""
	fields = Creator.getObject(objectName).fields
	allowedValues = fields[field_name]?.allowedValues
	if allowedValues.indexOf(dataCell) >= 0
		jsonObj[field_name] = dataCell
	else
		select_error = "#{dataCell}不属于#{field_name}的可选范围"
	return select_error
converterLookup = (objectName,field_name, dataCell,jsonObj)->
	lookup_error = ""
	fields = Creator.getObject(objectName).fields
	reference_to_object = fields[field_name]?.reference_to
	console.log reference_to_object
	selectfield = Creator.getObject(reference_to_object).NAME_FIELD_KEY
	lookup = Creator.Collections[reference_to_object].findOne({"#{selectfield}":dataCell})
	if lookup
		console.log lookup._id
		jsonObj[field_name] =lookup._id
	else
		lookup_error = "#{dataCell}不是Lookup类型数据"
	return lookup_error
converterBool = (field_name, dataCell,jsonObj)->
	bool_error = ""
	flag = dataCell.toString().toLowerCase()
	console.log "flag=====",flag
	if flag== "是" || flag== "1" || flag == "yes" || flag == "true"
		jsonObj[field_name] = true
	else if	flag =="否" || flag=="0"|| flag=="no"|| flag=="false"
		jsonObj[field_name] = false
	else 
		bool_error = "#{dataCell}不是bool类型数据"
	return bool_error
insertRow = (dataRow,objectName,field_mapping)->
	jsonObj = {}
	insertInfo = {}
	errorInfo = ""
	# 对象的fields
	objFields = Creator?.getObject(objectName)?.fields

	# 转换方法
	

	# 每行数据根据分隔符再次分割,dataRow代表一行数据
	dataCellList = dataRow.split(",")
	# 读取每个单元格的数据
	dataCellList.forEach (dataCell,i) ->
		fieldLable = field_mapping[i]
		noField = true
		error = null
		# 找到需要插入的数据
		_.each objFields, (field,field_name)->
			if field.label == fieldLable
				noField = false
				switch field?.type
					when "date","datetime" then error = converterDate field_name,dataCell,jsonObj
					when "number" then error = converteInt field_name,dataCell,jsonObj
					when "boolean" then error = converterBool field_name,dataCell,jsonObj
					when "select" then error = converterSelect objectName,field_name,dataCell,jsonObj
					when "lookup" then error = converterLookup objectName,field_name,dataCell,jsonObj
					when "text" then error = converterString field_name,dataCell,jsonObj
		if noField
			error ="#{fieldLable}不是对象的属性"
		if error
			console.log "error=====",error
			errorInfo = errorInfo + "," + error
	insertInfo["insertState"] = true
	console.log "errorInfo===",errorInfo
	if jsonObj
		Creator.Collections[objectName].insert(jsonObj,(error,result)->
			if error
				insertInfo["insertState"] = false
				)
	else
		insertInfo["insertState"] = false
	insertInfo["errorInfo"] = errorInfo
	
	console.log  insertInfo
	return insertInfo

importObject = (importObj) ->
	# 错误的数据
	errorList = []

	# 需要导入的对象名
	objectName = importObj?.object_name

	field_mapping = importObj?.field_mapping

	# 读取文件
	filePath = filePath = path.join(__meteor_bootstrap__.serverDir, "../../../imports/")

	fileName = importObj?._id + "-no.csv"

	fileAddress = path.join filePath, fileName

	readStream = fs.readFileSync fileAddress, {encoding:'utf8'}

	# 将字符串根据换行符分割为数组
	dataTable = readStream.split("\r\n")

	console.log dataTable

	# 循环每一行，读取数据的每一列
	total_count = dataTable.length
	success_count = 0
	failure_count = 0
	dataTable.forEach (dataRow)->
		# 插入一行数据
		insertInfo = insertRow dataRow,objectName,field_mapping
		if insertInfo
			# 存到数据库 error字段
			errorList.push dataRow+insertInfo.errorInfo			
			if insertInfo.insertState
				success_count = success_count + 1
			else
				failure_count = failure_count + 1
	console.log total_count,success_count,failure_count
	Creator.Collections["queue_import"].direct.update({_id:importObj._id},{$set:{
		error:errorList
		total_count:total_count
		success_count:success_count
		failure_count:failure_count
		status:"finished"
		}})

Creator.selectImportJobs = () ->
	waittingimportjobs = Creator.Collections["queue_import"].find({status:"waiting"},{fields:{created:1}}).fetch()
	waittingimportjobs_created = _.pluck(waittingimportjobs,'created')
	selectImportJob = _min(waittingimportjobs_created)
	return selectImportJob


# 启动导入Jobs
# Creator.startImportJobs()
Creator.startImportJobs = () ->
	logger.info "Run Creator.startImportJobs"

	#console.time "Creator.startImportJobs"
	#开始导入时间
	
	collection = Creator.Collections["queue_import"]

	importList = collection.find({"status":"waitting"}).fetch()
	importList.forEach (importObj)->
		# 根据recordObj提供的对象名，逐个文件导入
		starttime = new Date()
		importObject importObj
		endtime = new Date()
		Creator.Collections["queue_import"].direct.update(importObj._id,{$set:{start_time:starttime,end_time:endtime}})



# Creator.readCSV()
Creator.readCSV = ()->
	# 读取文件流
	filePath = filePath = path.join(__meteor_bootstrap__.serverDir, "../../../imports/")

	fileName = "zSrsKtKh3aMmrS4ts-no.csv"

	fileAddress = path.join filePath, fileName

	readStream = fs.readFileSync fileAddress, {encoding:'utf8'}

	dataTable = readStream.split("\n")

	for dataRow in dataTable
		console.log "================"
		if dataRow
			console.log dataRow