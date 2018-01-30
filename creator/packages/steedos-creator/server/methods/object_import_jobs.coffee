fs = Npm.require 'fs'

logger = new Logger 'QUEUE_IMPORT'



insertRow = (dataRow,objectName)->
	jsonObj = {}
	errorInfo = ""
	
	# 对象的fields
	objFields = Creator?.getObject(objectName)?.fields

	# 转换方法
	converterString = (field_name, dataCell)->
	jsonObj[field_name] = dataCell

	converterDate = (field_name, dataCell)->
		date = new Date(dataCell)
		if date != "Invalid Date"
			jsonObj[field_name] = date
		else
			errorInfo = errorInfo + ",#{field_name}不是日期类型数据"

	converteInt = (field_name, dataCell)->
		number = parseInt dataCell
		if number != "NaN"
			jsonObj[field_name] = number
		else
			errorInfo = errorInfo + ",#{field_name}不是数值类型数据"

	converterSelect = (field_name, dataCell)->


	converterBool = (field_name, dataCell)->
		flag = dataCell.toString.toLowerCase
		switch flag
			when "是","1","true","yes" then jsonObj[field_name] = true
			when "否","0","false","no" then jsonObj[field_name] = false
			else errorInfo = errorInfo + ",#{field_name}不是bool类型数据"

	# 每行数据根据分隔符再次分割
	dataCellList = dataRow.split(",")
	# 读取每个单元格的数据
	dataCellList.forEach(dataCell,i) ->
		noField = false
		# 找到需要插入的数据
		_.each objFields, (field, field_name)->
			if field?.label == fieldLable
				noField = true
				switch field?.type
					when "date","datetime" then converterDate field_name,dataCell
					when "number" then converteInt field_name,dataCell
					when "boolean" then converterBool field_name,dataCell
					when "select" then converterSelect field_name,dataCell
					else converterString field_name,dataCell

	return errorInfo


importObject = (importObj) ->
	# 错误的数据
	errorList = []

	# 需要导入的对象名
	objectName = importObj?.object_name

	field_mapping = importObj?.field_mapping
	dataStr = importObj?.import_file

	# fieldMapping = [ "单位名称", "全宗号" ]
	# dataStream = "单位名称A,全宗号A\n单位名称B,全宗号B\n单位名称C,全宗号C"

	# 将字符串根据换行符分割为数组
	dataTable = dataStream.split("\n")

	# 循环每一行，读取数据每个数据
	dataTable.forEach(dataRow) ->
		# 插入一行数据
		errorInfo = insertRow dataRow,objectName
		if errorInfo
			# 存到数据库 error字段
			errorList.push dataRow+errorInfo


			


# 启动导入Jobs
# Creator.startImportJobs()
Creator.startImportJobs = () ->
	logger.info "Run Creator.startImportJobs"

	console.time "Creator.startImportJobs"

	collection = Creator.Collections["queue_import"]

	importList = collection.find({"status":"waiting"}).fetch()

	importList.forEach (importObj)->
		# 根据recordObj提供的对象名，逐个文件导入
		importObject importObj

	console.timeEnd "Creator.startImportJobs"