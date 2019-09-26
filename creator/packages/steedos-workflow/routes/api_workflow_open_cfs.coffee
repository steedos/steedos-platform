###
Content-Type：application/json
form-data 格式:
fd = new FormData;
fd.append("file", file);

fd.append("is_private", false);

if (isAddVersion) {
	fd.append("isAddVersion", isAddVersion);
	fd.append("parent", attach_parent_id);
}

if (isMainAttach) {
	fd.append("main", true);
}
###

Busboy = require('busboy');
Fiber = require('fibers');

JsonRoutes.parseFiles = (req, res, next) ->
	files = []; # Store files in an array and then pass them to request.
	image = {}; # crate an image object

	if (req.method == "POST")
		busboy = new Busboy({ headers: req.headers });
		busboy.on "file",  (fieldname, file, filename, encoding, mimetype) ->
			image.mimeType = mimetype;
			image.encoding = encoding;
			image.filename = filename;

			# buffer the read chunks
			buffers = [];

			file.on 'data', (data) ->
				buffers.push(data);

			file.on 'end', () ->
				# concat the chunks
				image.data = Buffer.concat(buffers);
				# push the image object to the file array
				files.push(image);


		busboy.on "field", (fieldname, value) ->
			req.body[fieldname] = value;

		busboy.on "finish",  () ->
			# Pass the file array together with the request
			req.files = files;

			Fiber ()->
				next();
			.run();

		# Pass request to busboy
		req.pipe(busboy);

	else
		next();

JsonRoutes.add 'post', '/api/workflow/open/cfs/:ins_id', (req, res, next) ->
	try
		ins_id = req.params.ins_id

		if !Steedos.APIAuthenticationCheck(req, res)
			return ;

		current_user = req.userId

		space_id = req.headers['x-space-id']

		if not space_id
			throw new Meteor.Error('error', 'need header X_Space_Id')

		current_user_info = db.users.findOne(current_user)

		if not current_user_info
			throw new Meteor.Error('error', 'can not find user')

		instance = uuflowManager.getInstance(ins_id)

		if instance.state isnt "draft"
			throw new Meteor.Error('error', '申请单草稿状态时才能上传')

		approve_id = instance.traces[0].approves[0]._id

		# 校验space是否存在
		uuflowManager.getSpace(space_id)
		# 校验当前登录用户是否是space的管理员
		uuflowManager.isSpaceAdmin(space_id, current_user)

		JsonRoutes.parseFiles req, res, ()->
			collection = cfs.instances

			if req.files and req.files[0]
				# 附件上传接口，限制附件大小，最大为100M
				if req.files[0].data.length > (100*1024*1024)
					JsonRoutes.sendResult res,
						code: 200
						data: { errors: [{errorMessage: "超过上传附件大小限制(100M)"}]}
					return

				newFile = new FS.File();
				newFile.attachData req.files[0].data, {type: req.files[0].mimeType}, (err) ->
					filename = req.files[0].filename

					if ["image.jpg", "image.gif", "image.jpeg", "image.png"].includes(filename.toLowerCase())
						filename = "image-" + moment(new Date()).format('YYYYMMDDHHmmss') + "." + filename.split('.').pop()

					body = req.body

					body['owner'] = instance.submitter
					body['owner_name'] = instance.submitter_name
					body['space'] = space_id
					body['instance'] = ins_id
					body['approve'] = approve_id

					try
						if body && (body['upload_from'] is "IE" or body['upload_from'] is "node")
							filename = decodeURIComponent(filename)
					catch e
						console.error(filename)
						console.error e
						filename = filename.replace(/%/g, "-")

					newFile.name(filename)
					
					if body && body['owner'] && body['owner_name'] && body['space'] && body['instance']  && body['approve']
						parent = ''
						metadata = {owner:body['owner'], owner_name:body['owner_name'], space:body['space'], instance:body['instance'], approve: body['approve'], current: true}

						if body["is_private"] && body["is_private"].toLocaleLowerCase() == "true"
							metadata.is_private = true
						else
							metadata.is_private = false

						if body['main'] == "true"
							metadata.main = true

						if body['isAddVersion'] && body['parent']
							parent = body['parent']
						# else
						#   collection.find({'metadata.instance': body['instance'], 'metadata.current' : true}).forEach (c) ->
						#     if c.name() == filename
						#       parent = c.metadata.parent

						if parent
							r = collection.update({'metadata.parent': parent, 'metadata.current' : true}, {$unset : {'metadata.current' : ''}})
							if r
								metadata.parent = parent
								if body['locked_by'] && body['locked_by_name']
									metadata.locked_by = body['locked_by']
									metadata.locked_by_name = body['locked_by_name']

								newFile.metadata = metadata
								fileObj = collection.insert newFile

								# 删除同一个申请单同一个步骤同一个人上传的重复的文件
								if body["overwrite"] && body["overwrite"].toLocaleLowerCase() == "true"
									collection.remove({'metadata.instance': body['instance'], 'metadata.parent': parent, 'metadata.owner': body['owner'], 'metadata.approve': body['approve'], 'metadata.current': {$ne: true}})
						else
							newFile.metadata = metadata
							fileObj = collection.insert newFile
							fileObj.update({$set: {'metadata.parent' : fileObj._id}})

					# 兼容老版本
					else
						fileObj = collection.insert newFile

					size = fileObj.original.size
					if !size
						size = 1024

					result = new Object
					result =
						attach_id: fileObj._id,
						size: size

					res.setHeader("x-amz-version-id",fileObj._id);

					JsonRoutes.sendResult res,
						code: 200
						data: { status: "success", data: result}
			else
				JsonRoutes.sendResult res,
					code: 200
					data: { errors: [{errorMessage: "need file"}]}
				return

	catch e
		console.error e.stack
		JsonRoutes.sendResult res,
			code: 200
			data: { errors: [{errorMessage: e.message}]}

JsonRoutes.add "delete", "/api/workflow/open/cfs/:ins_id",  (req, res, next) ->
	try
		ins_id = req.params.ins_id

		if !Steedos.APIAuthenticationCheck(req, res)
			return ;

		current_user = req.userId

		space_id = req.headers['x-space-id']

		if not space_id
			throw new Meteor.Error('error', 'need header X_Space_Id')

		current_user_info = db.users.findOne(current_user)

		if not current_user_info
			throw new Meteor.Error('error', 'can not find user')

		instance = uuflowManager.getInstance(ins_id)

		if instance.state isnt "draft"
			throw new Meteor.Error('error', '申请单草稿状态时才能删除附件')

		# 校验space是否存在
		uuflowManager.getSpace(space_id)
		# 校验当前登录用户是否是space的管理员
		uuflowManager.isSpaceAdmin(space_id, current_user)

		hashData = req.body || {}
		attach_id = hashData["attach_id"]

		if not attach_id
			throw new Meteor.Error('error', 'can not find attach_id')

		collection = cfs.instances

		file = collection.findOne({ _id: attach_id, 'metadata.instance': ins_id})
		if file
			file.remove()
		else
			throw new Meteor.Error('error', '此附件不属于此申请单，或已被删除')

		result = new Object
		JsonRoutes.sendResult res,
			code: 200
			data: { status: "success", data: result}
	catch e
		console.error e.stack
		JsonRoutes.sendResult res,
			code: 200
			data: { errors: [{errorMessage: e.message}]}

JsonRoutes.add "get", "/api/workflow/open/cfs/:attach_id",  (req, res, next) ->
	try
		attach_id = req.params.attach_id

		if !Steedos.APIAuthenticationCheck(req, res)
			return ;

		current_user = req.userId

		space_id = req.headers['x-space-id']

		if not space_id
			throw new Meteor.Error('error', 'need header X_Space_Id')

		current_user_info = db.users.findOne(current_user)

		if not current_user_info
			throw new Meteor.Error('error', 'can not find user')

		# 校验space是否存在
		uuflowManager.getSpace(space_id)
		# 校验当前登录用户是否是space的管理员
		uuflowManager.isSpaceAdmin(space_id, current_user)

		res.statusCode = 302
		res.setHeader "Location", Steedos.absoluteUrl("api/files/instances/") + attach_id + "?download=true"
		res.end()
	catch e
		console.error e.stack
		JsonRoutes.sendResult res,
			code: 200
			data: { errors: [{errorMessage: e.message}]}
