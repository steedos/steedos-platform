loadRecordFromOdata = (template, object_name, record_id, force)->
	if !force && template.record.get()?._id == record_id
		return
	object = Creator.getObject(object_name)
	selectFields = Creator.objectOdataSelectFields(object)
	expand = Creator.objectOdataExpandFields(object)
	record = Creator.odata.get(object_name, record_id, selectFields, expand)
	template.record.set(record)

getObjectRecord = ()->
	return Template.instance().record.get()

Template.user.onCreated ->
	this.record = new ReactiveVar()
	template = Template.instance()
	this.onEditSuccess = onEditSuccess = (formType,result)->
		spaceId = Session.get "spaceId"
		userId = Session.get "record_id"
		space_record = Creator.getCollection("space_users").findOne({space: spaceId, user: userId})
		loadRecordFromOdata(template, "space_users", space_record._id, true)
		$('#afModal').modal('hide')
	AutoForm.hooks editSpaceUser:
		onSuccess: onEditSuccess
	,false

Template.user.onRendered ->
	this.autorun ->
		spaceId = Session.get "spaceId"
		userId = Session.get "record_id"
		Creator.subs["Creator"].subscribe "space_user_info", spaceId, userId

	this.autorun ->
		spaceId = Session.get "spaceId"
		userId = Session.get "record_id"
		space_record = Creator.getCollection("space_users").findOne({space: spaceId, user: userId})
		if space_record?._id
			loadRecordFromOdata(Template.instance(), "space_users", space_record._id)

Template.user.helpers 
	doc: ()->
		return getObjectRecord()

	fields: ()->
		schema = Creator.getSchema("space_users")._schema
		fields = Creator.getSchema("space_users")._firstLevelSchemaKeys
		fields.splice(_.indexOf(fields, "instances"), 1)
		fields.splice(_.indexOf(fields, "sharing"), 1)
		obj_fields = Creator.getObject("space_users").fields
		fields = fields.filter (n)->
			return !obj_fields[n]?.hidden
		fields = Creator.getFieldsForReorder(schema, fields)
		return fields

	keyValue: (key)->
		record = Template.instance()?.record?.get()
#		return record[key]
		key.split('.').reduce (o, x) ->
				o?[x]
		, record
	
	showEditBtn: ()->
		return Session.get("record_id") == Meteor.userId()

	keyField: (key) ->
		fields = Creator.getObject("space_users").fields
		return fields[key]

	label: (key) ->
		return AutoForm.getLabelForField(key)

	avatarUrl: ()->
		userId = Session.get "record_id"
		avatar = Creator.getCollection("users").findOne({_id: userId})?.avatar
		if avatar
			return Steedos.absoluteUrl("avatar/#{Meteor.userId()}?w=220&h=200&fs=160&avatar=#{avatar}")
		else
			return Creator.getRelativeUrl("/packages/steedos_lightning-design-system/client/images/themes/oneSalesforce/lightning_lite_profile_avatar_96.png")


Template.user.events 
	'click .profile-pic': (event, template)->
		if Session.get("record_id") == Meteor.userId()
			$("#avator-upload").click()

	'change #avator-upload': (event, template)->
		if Session.get("record_id") == Meteor.userId()
			file = event.target.files[0];
			unless file
				return
			$("body").addClass("loading");
			db.avatars.insert file, (error, fileDoc)->
				if error
					console.error error
					toastr.error t(error.reason)
					$(document.body).removeClass('loading')
				else
					# Inserted new doc with ID fileDoc._id, and kicked off the data upload using HTTP
					# 理论上这里不需要加setTimeout，但是当上传图片很快成功的话，定阅到Avatar变化时可能请求不到上传成功的图片
					setTimeout(()->
						Meteor.call "updateUserAvatar", fileDoc._id, (error, result)->
							if result?.error
								$(document.body).removeClass('loading')
								toastr.error t(result.message)
							else
								$(document.body).removeClass('loading')
					, 3000)

	'click .edit-space-user': (event, template)->
		template.$(".btn-edit-space-user").click()

	'click .change-pwd': (event, template)->
		Modal.show("reset_password_modal")
	
		 
