Busboy = require('busboy');
Fiber = require('fibers');

JsonRoutes.parseFiles = (req, res, next) ->
	files = []; # Store files in an array and then pass them to request.

	if (req.method == "POST")
		busboy = new Busboy({ headers: req.headers });
		busboy.on "file",  (fieldname, file, filename, encoding, mimetype) ->
			image = {}; # crate an image object
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


#JsonRoutes.Middleware.use(JsonRoutes.parseFiles);