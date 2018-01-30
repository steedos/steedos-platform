fs = Npm.require 'fs'

logger = new Logger 'QUEUE_IMPORT'


_importObject = (importObj) ->
	# 导入的数据
	jsonObj = {}

	# 错误的数据
	errorList = {}

	# 需要导入的对象名
	objectName = importObj?.object_name

	# 对象的fields
	importObjFields = Creator?.getObject(objectName)?.fields

	# field_mapping = importObj?.field_mapping
	fieldMapping = [ "单位名称", "全宗号" ]

	# dataStr = importObj?.import_file
	dataStream = "单位名称A,全宗号A\n单位名称B,全宗号B\n单位名称C,全宗号C"




	mixDefault = (field_name, dataCell)->
		jsonObj[field_name] = dataCell

	mixDate = (field_name, dataCell)->
		date = new Date(dataCell)
		if date != "Invalid Date"
			jsonObj[field_name] = date
		else
			errorInfo = "#{field_name}不是日期类型数据"



	insertRow = (dataRow)->
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
						when "date","datetime" then mixDate field_name,dataCell
						when "boolean" then mixBool field_name,dataCell
						else mixDefault field_name,dataCell

	# 将字符串根据换行符分割为数组
	dataTable = dataStream.split("\n")

	# 循环每一行，读取数据每个数据
	dataTable.forEach(dataRow) ->
		# 插入一行数据
		insertRow dataRow
		


# 启动导入Jobs
Creator.startImportJobs = () ->
	logger.info "Run Creator.startImportJobs"

	console.time "Creator.startImportJobs"

	collection = Creator.Collections["queue_import"]

	importList = collection.find({"status":"waiting"}).fetch()

	importList.forEach (importObj)->
		# 根据recordObj提供的对象名，逐个文件导入
		_importObject importObj

	console.timeEnd "Creator.startImportJobs"