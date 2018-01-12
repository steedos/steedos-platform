getCollection = undefined
getDocument = undefined
AutoForm.addInputType 'fileUpload',
	template: 'afFileUpload'
	valueOut: ->
		@val()

getCollection = (context) ->
	if typeof context.atts.collection == 'string'
		return FS._collections[context.atts.collection] or window[context.atts.collection]
	return

getDocument = (context) ->
	collection = undefined
	id = undefined
	ref = undefined
	ref1 = undefined
	collection = getCollection(context)
	id = if (ref = Template.instance()) != null then (if (ref1 = ref.value) != null then (if typeof ref1.get == 'function' then ref1.get() else undefined) else undefined) else undefined
	if collection != null then collection.findOne(id) else undefined

Template.afFileUpload.onCreated ->
	self = undefined
	self = this
	@value = new ReactiveVar(@data.value)
	@_stopInterceptValue = false
	@_interceptValue = ((_this) ->
		(ctx) ->
			ref = undefined
			t = undefined
			if !_this._stopInterceptValue
				t = Template.instance()
				if t.value.get() != false and t.value.get() != ctx.value and (if (ref = ctx.value) != null then ref.length else undefined) > 0
					t.value.set ctx.value
					return _this._stopInterceptValue = true
			return)(this)

	@_insert = (file) ->
		FS.debug and console.log('@_insert')
		`var file`
		collection = undefined
		ref = undefined
		collection = getCollection(self.data)
		if Meteor.userId
			file.owner = Meteor.userId()
		file = self.data.atts.triggers?.onBeforeInsert?(file) or file
		file = new (FS.File)(file)
		file.uploadedFrom = Meteor.userId()
		# maxChunk = 2097152
		# FS.config.uploadChunkSize = if file.original.size < 10 * maxChunk then file.original.size / 10 else maxChunk
		FS.config.uploadChunkSize = 1024 * 1024 * 1024
		FS.debug and console.log(file)
		collection.insert file, (err, fileObj) ->
			FS.debug and console.log('@_insert callback')
			FS.debug and console.log(fileObj)
			ref1 = undefined
			self.data.atts.triggers?.onAfterInsert?(err, fileObj)
			fileObj.update $set:
				"metadata.owner": Meteor.userId()
			if err
				return console.log(err)
			self.value.set fileObj._id

	@autorun ->
		_id = undefined
		_id = self.value.get()
		_id and Meteor.subscribe('autoformFileDoc', self.data.atts.collection, _id)
Template.afFileUpload.onRendered ->
	self = undefined
	self = this
	$(self.firstNode).closest('form').on 'reset', ->
		self.value.set false
Template.afFileUpload.helpers
	label: ->
		@atts.label or TAPi18n.__ 'meteor_autoform_choose_file'
	removeLabel: ->
		@atts.removeLabel or TAPi18n.__ 'meteor_autoform_remove'
	value: ->
		doc = undefined
		doc = getDocument(this)
		(if doc then doc.isUploaded() else undefined) and doc._id
	schemaKey: ->
		@atts['data-schema-key']
	previewTemplate: ->
		ref = undefined
		ref1 = undefined
		(if (ref = @atts) != null then ref.previewTemplate else undefined) or (if (if (ref1 = getDocument(this)) != null then ref1.isImage() else undefined) then 'afFileUploadThumbImg' else 'afFileUploadThumbIcon')
	previewTemplateData: ->
		{
			file: getDocument(this)
			atts: @atts
		}
	file: ->
		Template.instance()._interceptValue this
		getDocument this
	removeFileBtnTemplate: ->
		ref = undefined
		(if (ref = @atts) != null then ref.removeFileBtnTemplate else undefined) or 'afFileRemoveFileBtnTemplate'
	selectFileBtnTemplate: ->
		ref = undefined
		(if (ref = @atts) != null then ref.selectFileBtnTemplate else undefined) or 'afFileSelectFileBtnTemplate'
	selectFileBtnData: ->
		{
			label: @atts.label or 'meteor_autoform_choose_file'
			accepts: @atts.accepts
		}
	uploadProgressTemplate: ->
		ref = undefined
		(if (ref = @atts) != null then ref.uploadProgressTemplate else undefined) or 'afFileUploadProgress'
Template.afFileUpload.events
	'dragover .js-af-select-file': (e) ->
		e.stopPropagation()
		e.preventDefault()
	'dragenter .js-af-select-file': (e) ->
		e.stopPropagation()
		e.preventDefault()
	'drop .js-af-select-file': (e, t) ->
		e.stopPropagation()
		e.preventDefault()
		t._insert new (FS.File)(e.originalEvent.dataTransfer.files[0])
	'click .js-af-remove-file': (e, t) ->
		e.preventDefault()
		collection = getCollection(t.data)
		doc = collection.findOne(t.value.get())
		if doc
			doc.remove()
		t.value.set false
	'fileuploadchange .js-file': (e, t, data) ->
		FS.debug and console.log(data.files[0])
		file = data.files[0]
		if file.size < 1
			toastr.error(TAPi18n.__("upload_empty_file_error"))
			return;
		fileName = file.name
		if [
			'image.jpg'
			'image.gif'
			'image.jpeg'
			'image.png'
		].includes(fileName.toLowerCase())
			fileName = 'image-' + moment(new Date).format('YYYYMMDDHHmmss') + '.' + fileName.split('.').pop()

		f = new (FS.File)(file)
		f.name(fileName)
		t._insert f
Template.afFileUploadThumbImg.helpers url: ->
	@file.url store: @atts.store
Template.afFileUploadThumbIcon.helpers
	url: ->
		@file.url store: @atts.store
	icon: ->
		switch @file.extension()
			when 'pdf'
				return 'file-pdf-o'
			when 'doc', 'docx'
				return 'file-word-o'
			when 'ppt', 'avi', 'mov', 'mp4'
				return 'file-powerpoint-o'
			else
				return 'file-o'
		return
Template.afFileSelectFileBtnTemplate.onRendered ->
	@$('.js-file').fileupload()
