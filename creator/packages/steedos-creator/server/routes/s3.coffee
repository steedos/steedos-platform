Busboy = Npm.require('busboy');
Fiber = Npm.require('fibers');

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

JsonRoutes.add "post", "/s3/",  (req, res, next) ->

	JsonRoutes.parseFiles req, res, ()->
		collection = cfs.files
		fileCollection = Creator.getObject("cms_files").db

		if req.files and req.files[0]

			newFile = new FS.File();
			newFile.attachData req.files[0].data, {type: req.files[0].mimeType}, (err) ->
				filename = req.files[0].filename
				extention = filename.split('.').pop()
				if ["image.jpg", "image.gif", "image.jpeg", "image.png"].includes(filename.toLowerCase())
					filename = "image-" + moment(new Date()).format('YYYYMMDDHHmmss') + "." + extention

				body = req.body
				try
					if body && (body['upload_from'] is "IE" or body['upload_from'] is "node")
						filename = decodeURIComponent(filename)
				catch e
					console.error(filename)
					console.error e
					filename = filename.replace(/%/g, "-")

				newFile.name(filename)

				if body && body['owner'] && body['owner_name'] && body['space'] && body['record_id']  && body['object_name']
					parent = body['parent']
					owner = body['owner']
					owner_name = body['owner_name']
					space = body['space']
					record_id = body['record_id']
					object_name = body['object_name']
					metadata = {owner:owner, owner_name:owner_name, space:space, record_id:record_id, object_name: object_name}

					# if body["is_private"] && body["is_private"].toLocaleLowerCase() == "true"
					# 	metadata.is_private = true
					# else
					# 	metadata.is_private = false

					# if body['main'] == "true"
					# 	metadata.main = true

					# if body['isAddVersion'] && body['parent']
					# 	parent = body['parent']
					# # else
					# #   collection.find({'metadata.instance': body['instance'], 'metadata.current' : true}).forEach (c) ->
					# #     if c.name() == filename
					# #       parent = c.metadata.parent

					# if parent
					# 	r = collection.update({'metadata.parent': parent, 'metadata.current' : true}, {$unset : {'metadata.current' : ''}})
					# 	if r
					# 		metadata.parent = parent
					# 		if body['locked_by'] && body['locked_by_name']
					# 			metadata.locked_by = body['locked_by']
					# 			metadata.locked_by_name = body['locked_by_name']

					# 		newFile.metadata = metadata
					# 		fileObj = collection.insert newFile

					# 		# 删除同一个申请单同一个步骤同一个人上传的重复的文件
					# 		if body["overwrite"] && body["overwrite"].toLocaleLowerCase() == "true"
					# 			collection.remove({'metadata.instance': body['instance'], 'metadata.parent': parent, 'metadata.owner': body['owner'], 'metadata.approve': body['approve'], 'metadata.current': {$ne: true}})
					# else
					# 	newFile.metadata = metadata
					# 	fileObj = collection.insert newFile
					# 	fileObj.update({$set: {'metadata.parent' : fileObj._id}})

					newFile.metadata = metadata
					fileObj = collection.insert newFile

				# 兼容老版本
				else
					fileObj = collection.insert newFile


				size = fileObj.original.size
				if !size
					size = 1024

				fileCollection.direct.insert {
					name: filename, 
					description: '', 
					extention: extention, 
					size: size, 
					versions:[fileObj._id], 
					parent: {o:object_name,ids:[record_id]}, 
					owner:owner, 
					created: (new Date())
					created_by:owner, 
					modified: (new Date())
					modified_by:owner
				}

				resp =
					version_id: fileObj._id,
					size: size

				res.setHeader("x-amz-version-id",fileObj._id);
				res.end(JSON.stringify(resp));
				return
		else
			res.statusCode = 500;
			res.end();


JsonRoutes.add "delete", "/s3/",  (req, res, next) ->

	collection = cfs.instances

	id = req.query.version_id;
	if id
		file = collection.findOne({ _id: id })
		if file
			file.remove()
			resp = {
				status: "OK"
			}
			res.end(JSON.stringify(resp));
			return

	res.statusCode = 404;
	res.end();


JsonRoutes.add "get", "/s3/",  (req, res, next) ->

	id = req.query.version_id;

	res.statusCode = 302;
	res.setHeader "Location", Steedos.absoluteUrl("api/files/instances/") + id + "?download=1"
	res.end();
