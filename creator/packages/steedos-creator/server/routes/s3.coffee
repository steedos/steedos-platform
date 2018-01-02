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
					parent = body['parent']
					metadata = {owner:owner, owner_name:owner_name, space:space, record_id:record_id, object_name: object_name}
					if parent
						metadata.parent = parent
					newFile.metadata = metadata
					fileObj = collection.insert newFile

				else
					fileObj = collection.insert newFile


				size = fileObj.original.size
				if !size
					size = 1024
				if parent
					fileCollection.update({_id:parent},{
						$push: {
							versions: {
								$each: [fileObj._id]
								$position: 0
							}
						}
					})
				else
					newFileObjId = fileCollection.direct.insert {
						name: filename
						description: ''
						extention: extention
						size: size
						versions: [fileObj._id]
						parent: {o:object_name,ids:[record_id]}
						owner: owner
						space: space
						created: (new Date())
						created_by: owner
						modified: (new Date())
						modified_by: owner
					}
					fileObj.update({$set: {'metadata.parent' : newFileObjId}})

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
