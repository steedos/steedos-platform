fs = Npm.require 'fs'
path = Npm.require('path')
xls = Npm.require('node-xlsx')
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
	if date.getFullYear() and Object.prototype.toString.call(date)== '[object Date]'
		jsonObj[field_name] = date
	else
		date_error = "#{dataCell}不是日期类型数据"
	return date_error
converteInt = (field_name, dataCell,jsonObj)->
	number_error = ""
	number = parseInt(dataCell)
	if !isNaN(number)
		jsonObj[field_name] = number
	else
		number_error =  "#{dataCell}不是数值类型数据"
	return number_error
converterSelect = (objectName,field_name, dataCell,jsonObj)->
	select_error = ""
	fields = Creator.getObject(objectName).fields
	allowedValues = fields[field_name]?.allowedValues || []
	if allowedValues.indexOf(dataCell) >= 0
		jsonObj[field_name] = dataCell
	else
		select_error = "#{dataCell}不属于#{field_name}的可选范围"
	return select_error
converterLookup = (objectName,field_name, dataCell,jsonObj)->
	lookup_error = ""
	fields = Creator.getObject(objectName).fields
	reference_to_object = fields[field_name]?.reference_to
	selectfield = Creator.getObject(reference_to_object).NAME_FIELD_KEY
	lookup = Creator.Collections[reference_to_object].findOne({"#{selectfield}":dataCell})
	if lookup
		jsonObj[field_name] =lookup._id
	else
		lookup_error = "#{dataCell}不是Lookup类型数据"
	return lookup_error
converterBool = (field_name, dataCell,jsonObj)->
	bool_error = ""
	flag = dataCell.toString().toLowerCase()
	if flag== "是" || flag== "1" || flag == "yes" || flag == "true"
		jsonObj[field_name] = true
	else if	flag =="否" || flag=="0"|| flag=="no"|| flag=="false"
		jsonObj[field_name] = false
	else 
		bool_error = "#{dataCell}不是bool类型数据"
	return bool_error

insertRow = (dataRow,objectName,field_mapping,space)->
	jsonObj = {}
	insertInfo = {}
	errorInfo = ""
	# 对象的fields
	objFields = Creator?.getObject(objectName)?.fields
	dataRow.forEach (dataCell,i) ->
		field_mapping_name = field_mapping[i]
		if !field_mapping[i]
			return
		noField = true
		error = null
		# 找到需要插入的数据
		_.each objFields, (field,field_name)->
			if field_name == field_mapping_name
				noField = false
				switch field?.type
					when "date","datetime" then error = converterDate field_name,dataCell,jsonObj
					when "number" then error = converteInt field_name,dataCell,jsonObj
					when "boolean" then error = converterBool field_name,dataCell,jsonObj
					when "select" then error = converterSelect objectName,field_name,dataCell,jsonObj
					when "lookup" then error = converterLookup objectName,field_name,dataCell,jsonObj
					when "text"  then error = converterString field_name,dataCell,jsonObj
					when  "textarea" then error = converterString field_name,dataCell,jsonObj
					when "master_detail" then error = converterLookup objectName,field_name,dataCell,jsonObj			
		if noField
			error ="#{field_mapping_name}不是对象的属性"
		if error
			errorInfo = errorInfo + "," + error
	insertInfo["insertState"] = true
	if jsonObj
		jsonObj.space = space
		Creator.Collections[objectName].insert(jsonObj,(error,result)->
			if error
				insertInfo["insertState"] = false
				)
	else
		insertInfo["insertState"] = false
	insertInfo["errorInfo"] = errorInfo
	return insertInfo

importObject = (importObj,space) ->
	# 错误的数据
	errorList = []
	#cms_files = Creator.Collections['cms.files'].find({'parent.ids':importObj._id}).fetch()

	#file = Creator.Collections['cms.files'].findOne('parent.ids':record_id)
	files = Creator.Collections['cfs.files.filerecord'].find({'metadata.record_id':importObj._id},{sort: {created: -1}}).fetch()
	file = files[0]
	console.log file
	if file
		stream = file.createReadStream('files')
		chunks = []
		objectName = importObj?.object_name
		field_mapping = importObj?.field_mapping
		stream.on 'data', (chunk) ->
			chunks.push chunk 

		stream.on 'end', Meteor.bindEnvironment(() ->
			workbook = xls.parse(Buffer.concat(chunks))
			workbook.forEach (sheet)->
				data = sheet.data
				total_count = data.length
				success_count = 0
				failure_count = 0
				data.forEach (dataRow)->
					insertInfo = insertRow dataRow,objectName,field_mapping,space
					# 	# 插入一行数据	
					if insertInfo
						# 存到数据库 error字段
						if insertInfo?.errorInfo
							errorList.push dataRow+insertInfo.errorInfo			
						if insertInfo?.insertState
							success_count = success_count + 1
						else
							failure_count = failure_count + 1
					Creator.Collections["queue_import"].direct.update({_id:importObj._id},{$set:{
						error:errorList
						total_count:total_count
						success_count:success_count
						failure_count:failure_count
						state:"finished"
						}})
			)	
		
# 启动导入Jobs
# Creator.startImportJobs()
Meteor.methods
	startImportJobs:(record_id,space) ->
		# collection = Creator.Collections["queue_import"]
		# importList = collection.find({"status":"waitting"}).fetch()
		# importList.forEach (importObj)->
		# 	# 根据recordObj提供的对象名，逐个文件导入
		starttime = new Date()
		importObj = Creator.Collections["queue_import"].findOne({_id:record_id})
		importObject importObj,space
		endtime = new Date()
		Creator.Collections["queue_import"].direct.update(importObj._id,{$set:{start_time:starttime,end_time:endtime}})
	getValueLable:(reference_to_object,name_field,value)->
		ids = []
		if value.constructor == Array
			ids = value
		else
			ids.push value
		fields = {_id: 1}
		fields[name_field] = 1
		results =  Creator.Collections[reference_to_object].find({_id:{$in:value}},{fields: fields}).fetch()
		data = []
		_.each results ,(result)->
			data.push result[name_field]
		return data	