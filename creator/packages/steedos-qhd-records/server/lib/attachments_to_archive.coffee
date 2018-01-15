fs = Npm.require('fs')

logger = new Logger 'Records_QHD -> AttachmentsToArchive'

object_name = 'archive_records'

# 正文附件上传
collection = cfs.files

AttachmentsToArchive = (space, ins_id, archive) ->
	@space = space
	@ins_id = ins_id
	@archive = archive
	return

getFileHistoryName = (fileName, historyName, stuff) ->
	regExp = /\.[^\.]+/
	fName = fileName.replace(regExp, "")
	extensionHistory = regExp.exec(historyName)
	if(extensionHistory)
		fName = fName + "_" + stuff + extensionHistory
	else
		fName = fName + "_" + stuff
	return fName

insertCMSFile = (fileObj,fileVersions)->
	fileCollection = Creator.getObject("cms_files").db

	# 名字需要重新取，根据档案规则
	fileName = fileObj?.original?.name

	newCMSFileObjId = fileCollection.direct.insert {
			name: fileName
			description: ''
			extention: fileObj?.original?.name.split('.').pop()
			size: fileObj?.original?.size
			versions: fileVersions
			parent: {
				o:object_name,
				ids:[fileObj?.metadata?.record_id]
			}
			owner: fileObj?.metadata?.owner
			space: fileObj?.metadata?.space
			created_by : fileObj?.metadata?.owner
			modified: fileObj?.uploadedAt
		}

	return newCMSFileObjId

insertFile = (f,space,archive)->
	newFile = new FS.File()
	newFile.name f.name()
	newFile.size f.size()
	newFile.metadata = {
				owner: f?.metadata?.owner
				owner_name : f?.metadata?.owner_name,
				space : space,
				record_id : archive._id,
				object_name : object_name,
				parent : '',
				current : f?.metadata?.current,
				main : f?.metadata?.main
			}

	newFile.attachData f.createReadStream('instances'), {type: f.original.type}, (err) ->
		if err
			throw new Meteor.Error(err.error, err.reason)

		fileObj = collection.insert newFile

		if fileObj
			return fileObj
		else
			return null
			logger.error "文件上传失败：#{f._id},#{f.name()}. error: "

syncMainFile = (f,space,archive)->
	try
		# 保存正文的历史版本ID
		fileVersions = []

		# 新增正文
		fileObj = insertFile f,space,archive

		if fileObj?
			fileVersions.push fileObj._id

		# 正文历史版本
		mainFileHistory = cfs.instances.find({
			'metadata.instance': f.metadata.instance,
			'metadata.current': {$ne: true},
			"metadata.main": true,
			"metadata.parent": f.metadata.parent
		}, {sort: {uploadedAt: -1}}).fetch()

		mainFileHistory.forEach (fh) ->
			# 新增正文每一个历史版本
			fileHistoryObj = insertFile fh,space,archive

			if fileHistoryObj?
				fileVersions.push fileHistoryObj._id

		# 新建cms_file表
		newCMSFileObjId = insertCMSFile fileObj,fileVersions

		# 正文表与cms_file表关联
		if newCMSFileObjId
			collection.update(
				{_id:{$in:fileVersions}},
				{$set: {'metadata.parent' : newCMSFileObjId}},
				{multi:true})
		else
			logger.error "更新cms_files表失败：#{f._id},#{f.name()}. error: "

	catch e
		logger.error "文件下载失败：#{f._id},#{f.name()}. error: " + e

AttachmentsToArchive::syncAttachments = ()->
	space = @space
	archive = @archive
	# 正文文件
	mainFile = cfs.instances.find({
		'metadata.instance': @ins_id,
		'metadata.current': true,
		"metadata.main": true
	})
	mainFile.forEach (f) ->
		# 同步每一个正文
		syncMainFile f,space,archive

	# 同步附件
	# 。。。待开发

