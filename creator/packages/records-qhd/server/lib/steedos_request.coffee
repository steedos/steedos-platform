request = Npm.require('request')

#DelayedStream = Npm.require('delayed-stream');
#
#FormData = Npm.require('form-data')
#
#CombinedStream = Npm.require('combined-stream');
#
#Stream = Npm.require('stream').Stream;
#
#asynckit = Npm.require('asynckit');
#
#request.Request.prototype.form = (form)->
#	self = this
#	if form
#		if !/^application\/x-www-form-urlencoded\b/.test(self.getHeader('content-type'))
#			self.setHeader 'content-type', 'application/x-www-form-urlencoded'
#		self.body = if typeof form == 'string' then self._qs.rfc3986(form.toString('utf8')) else self._qs.stringify(form).toString('utf8')
#		return self
#	# create form-data object
#	self._form = new FormData({maxDataSize: Infinity})
#	self._form.on 'error', (err) ->
#		err.message = 'form-data: ' + err.message
#		self.emit 'error', err
#		self.abort()
#		return
#	return self._form
#
#FormData::getLength = (cb) ->
#	console.log("FormData.getLength...");
##	cb null, 1024 * 1024 * 512
#
#	knownLength = @_overheadLength + @_valueLength
#
#	console.log("knownLength 33", knownLength)
#
#	if @_streams.length
#		knownLength += @_lastBoundary().length
#	if !@_valuesToMeasure.length
#		console.log("knownLength 38", knownLength)
#		process.nextTick cb.bind(this, null, knownLength)
#		return
#	console.log("knownLength 43", knownLength)
#	asynckit.parallel @_valuesToMeasure, @_lengthRetriever, (err, values) ->
#		console.log("knownLength 45", knownLength)
#		if err
#			cb err
#			return
#		values.forEach (length) ->
#			knownLength += length
#			return
#		cb null, knownLength
#		return
#	return
#
#FormData::_lengthRetriever = (value, callback) ->
#
#	console.log("_lengthRetriever", value.path, value.hasOwnProperty('httpModule'))
#
#	console.log("_lengthRetriever 58 ...")
#
#	if value.hasOwnProperty('fd')
#		console.log("_lengthRetriever 63 ...")
#		if value.end != undefined and value.end != Infinity and value.start != undefined
#			console.log("_lengthRetriever 65 ...")
#			callback null, value.end + 1 - (if value.start then value.start else 0)
#		else
#			console.log("_lengthRetriever 68 ...")
#			fs.stat value.path, (err, stat) ->
#				console.log("_lengthRetriever 70 ...")
#				fileSize = undefined
#				if err
#					callback err
#					return
#				fileSize = stat.size - (if value.start then value.start else 0)
#				callback null, fileSize
#				return
#	else if value.hasOwnProperty('httpVersion')
#		console.log("_lengthRetriever 79 ...")
#		callback null, +value.headers['content-length']
#	else if value.hasOwnProperty('httpModule')
#		console.log("_lengthRetriever 82 ...")
#		value.on 'response', (response) ->
#			console.log("_lengthRetriever 84 ...", value.path)
#			value.pause()
#			callback null, +response.headers['content-length']
#			return
#
#		value.on 'data', (data)->
#			console.log("_lengthRetriever data" , value.path)
#
#		value.on 'error', (error) ->
#			console.log("_lengthRetriever 89", error)
#		value.resume()
#	else
#		console.log("_lengthRetriever 90 ...")
#		callback 'Unknown stream'
#	return

#CombinedStream::_checkDataSize = ()->
#
#	console.log("_checkDataSize...", this._released)
#
#	this._updateDataSize();
#
##	console.log("this._streams", this._streams)
#
#	console.log(this.dataSize)
#
#	console.log("this.maxDataSize1", this.maxDataSize)
#
##	this.maxDataSize = 512 * 1024 *1024
#
#	console.log("this.maxDataSize2", this.maxDataSize)
#
#	if this.dataSize <= this.maxDataSize
#		return;
#
#	message = 'DelayedStream#maxDataSize of ' + this.maxDataSize + ' bytes exceeded 33333333333333333333333.';
#
#	console.log("ERROR message", message)
#
#	this._emitError(new Error(message));

#CombinedStream::append = (stream) ->
#
##	this.pauseStreams = false
#
#	isStreamLike = CombinedStream.isStreamLike(stream)
#
##	console.log "isStreamLike", isStreamLike
#
#	if isStreamLike
#		if !(stream instanceof DelayedStream)
#			newStream = DelayedStream.create(stream,
#				maxDataSize: Infinity
#				pauseStream: @pauseStreams)
#			console.log("bind data...")
#			stream.on 'data', @_checkDataSize.bind(this)
#			console.log("bind data2...")
#			stream = newStream
#		@_handleErrors stream
#		if @pauseStreams
#			stream.pause()
#	@_streams.push stream
#	this

#CombinedStream::pipe = (dest, options) ->
#	debugger;
#	console.log("CombinedStream::pipe...")
#	console.log("CombinedStream::pipe...dest", dest)
#	console.log("CombinedStream::pipe...options", options)
#	console.log 'Function.caller', Function.caller
#
#	Stream::pipe.call this, dest, options
#	@resume()
#	dest
#
#console.log 'CombinedStream2', CombinedStream.prototype._checkDataSize

steedosRequest = {}

# 以POST 方式提交formData数据值url
steedosRequest.postFormData = (url, formData, cb) ->
	request.post {
		url: url + "&r=" + Random.id()
		headers: {
			'User-Agent': 'Mozilla/5.0'
		}
		formData: formData
	}, (err, httpResponse, body) ->
		cb err, httpResponse, body

		if err
			console.error('upload failed:', err)
			return
		if httpResponse.statusCode == 200
#			console.info("success, name is #{formData.TITLE_PROPER}, id is #{formData.fileID}")
			return

steedosRequest.postFormDataAsync = Meteor.wrapAsync(steedosRequest.postFormData);