Busboy = Npm.require('busboy');
Fiber = Npm.require('fibers');
ALY = Npm.require('aliyun-sdk')

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

				if body && body['owner'] && body['space'] && body['record_id']  && body['object_name']
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
						$set:
							extention: extention
							size: size
							modified: (new Date())
							modified_by: owner
						$push:
							versions:
								$each: [ fileObj._id ]
								$position: 0
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

JsonRoutes.add "post", "/s3/:collection",  (req, res, next) ->
	try
		userId = Steedos.getUserIdFromAuthToken(req, res)
		if !userId
			throw new Meteor.Error(500, "No permission")

		collectionName = req.params.collection

		JsonRoutes.parseFiles req, res, ()->
			collection = cfs[collectionName]

			if not collection
				throw new Meteor.Error(500, "No Collection")

			if req.files and req.files[0]

				newFile = new FS.File()
				newFile.name(req.files[0].filename)

				if req.body
					newFile.metadata = req.body

				newFile.owner = userId
				newFile.metadata.owner = userId

				newFile.attachData req.files[0].data, {type: req.files[0].mimeType}

				collection.insert newFile

				resultData = collection.files.findOne(newFile._id)
				JsonRoutes.sendResult res,
					code: 200
					data: resultData
				return
			else
				throw new Meteor.Error(500, "No File")

		return
	catch e
		console.error e.stack
		JsonRoutes.sendResult res, {
			code: e.error || 500
			data: {errors: e.reason || e.message}
		}

JsonRoutes.add "post", "/s3/vod/upload",  (req, res, next) ->
	try
		userId = Steedos.getUserIdFromAuthToken(req, res)
		if !userId
			throw new Meteor.Error(500, "No permission")

		collectionName = "videos"

		JsonRoutes.parseFiles req, res, ()->
			collection = cfs[collectionName]

			if not collection
				throw new Meteor.Error(500, "No Collection")

			if req.files and req.files[0]

				if collectionName is 'videos' and Meteor.settings.public.cfs?.store is "OSS"
					accessKeyId = Meteor.settings.cfs.aliyun?.accessKeyId
					secretAccessKey = Meteor.settings.cfs.aliyun?.secretAccessKey

					date = ALY.util.date.getDate()

					query = {
						Action: "CreateUploadVideo"
						Title: req.files[0].filename
						FileName: req.files[0].filename
					}

					url = "http://vod.cn-shanghai.aliyuncs.com/?" + uuflowManager.getQueryString(accessKeyId, secretAccessKey, query, 'GET')

					r = HTTP.call 'GET', url

					console.log r

					if r.data?.VideoId
						videoId = r.data.VideoId
						uploadAddress = JSON.parse(new Buffer(r.data.UploadAddress, 'base64').toString())
						console.log uploadAddress
						uploadAuth = JSON.parse(new Buffer(r.data.UploadAuth, 'base64').toString())
						console.log uploadAuth

						oss = new ALY.OSS({
							"accessKeyId": uploadAuth.AccessKeyId,
							"secretAccessKey": uploadAuth.AccessKeySecret,
							"endpoint": uploadAddress.Endpoint,
							"apiVersion": '2013-10-15',
							"securityToken": uploadAuth.SecurityToken
						})

						oss.putObject {
							Bucket: uploadAddress.Bucket,
							Key: uploadAddress.FileName,
							Body: req.files[0].data,
							AccessControlAllowOrigin: '',
							ContentType: req.files[0].mimeType,
							CacheControl: 'no-cache',
							ContentDisposition: '',
							ContentEncoding: 'utf-8',
							ServerSideEncryption: 'AES256',
							Expires: null
						}, Meteor.bindEnvironment (err, data) ->

							if err
								console.log('error:', err)
								throw new Meteor.Error(500, err.message)

							console.log('success:', data)

							newDate = ALY.util.date.getDate()

							getPlayInfoQuery = {
								Action: 'GetPlayInfo'
								VideoId: videoId
							}

							getPlayInfoUrl = "http://vod.cn-shanghai.aliyuncs.com/?" + uuflowManager.getQueryString(accessKeyId, secretAccessKey, getPlayInfoQuery, 'GET')

							getPlayInfoResult = HTTP.call 'GET', getPlayInfoUrl

							JsonRoutes.sendResult res,
								code: 200
								data: getPlayInfoResult

			else
				throw new Meteor.Error(500, "No File")

		return
	catch e
		console.error e.stack
		JsonRoutes.sendResult res, {
			code: e.error || 500
			data: {errors: e.reason || e.message}
		}