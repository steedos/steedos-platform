workflowTemplate = {}

#可用此脚本从模板工作区做批量导出：
#使用管理员账户登录后，进入FlowModules，在控制台执行以下脚本即可
#db.forms.find({state:"enabled"}).forEach(function(form){window.open(Meteor.absoluteUrl("api/workflow/export/form?form="+form._id))})
workflowTemplate["en"] =[]

#可用此脚本从模板工作区做批量导出：
#使用管理员账户登录后，进入模板专区，在控制台执行以下脚本即可
#db.forms.find({state:"enabled"}).forEach(function(form){window.open(Meteor.absoluteUrl("api/workflow/export/form?form="+form._id))})
workflowTemplate["zh-CN"] =[]

Meteor.startup ()->
	fs = require('fs')
	path = require('path')
	mime = require('mime')
	readFileList = (pathDir, filesList)->
		files = fs.readdirSync(pathDir)
		files.forEach (name, index)->
			stat = fs.statSync(path.join(pathDir, name))
			if stat.isDirectory()
				# 递归读取文件
				readFileList(path.join(pathDir, name), filesList)
			else
				obj = {}
				obj.path = pathDir
				obj.name = name
				filesList.push(obj)

	#获取zh-cn文件夹下的所有文件
	filesList_cn = []
	path_cn = Meteor.settings.workflowTemplates?.path_cn
	if path_cn
		absolute_path_cn = path.resolve(path_cn)
		console.log "absolute_path_cn", absolute_path_cn
		if fs.existsSync(absolute_path_cn)
			readFileList(absolute_path_cn, filesList_cn)
			filesList_cn.forEach (file)->
				try
					if mime.getType(file.name) is "application/json"
						data = fs.readFileSync(path.join(file.path, file.name), 'utf8')
						workflowTemplate["zh-CN"].push(JSON.parse(data))
				catch e
					console.error "获取zh-cn文件夹下的所有文件", path.join(file.path, file.name)
					console.error e.stack

	#获取en-us文件夹下的所有文件
	filesList_us = []
	path_us = Meteor.settings.workflowTemplates?.path_us
	if path_us
		absolute_path_us = path.resolve(path_us)
		console.log "absolute_path_us", absolute_path_us
		if fs.existsSync(absolute_path_us)
			readFileList(absolute_path_us, filesList_us)
			filesList_us.forEach (file)->
				try
					if mime.getType(file.name) is "application/json"
						data = fs.readFileSync(path.join(file.path, file.name), 'utf8')
						workflowTemplate["en"].push(JSON.parse(data))
				catch e
					console.error "获取en-us文件夹下的所有文件", path.join(file.path, file.name)
					console.error e.stack
				
					


