@Creator = {}

Creator.Apps = {}
Creator.Objects = {}
Creator.Collections = {}


Meteor.startup ->
	_.each Creator.Objects, (obj, object_name)->
		
		if db[object_name]
			Creator.Collections[object_name] = db[object_name]
		else if !Creator.Collections[object_name]
			Creator.Collections[object_name] = new Meteor.Collection(object_name)
		
		schema = Creator.getObjectSchema(obj)
		obj.schema = new SimpleSchema(schema)
		if object_name != "users"
			Creator.Collections[object_name].attachSchema(obj.schema)
		
		Creator.initTriggers(object_name)	
		Creator.initListViews(object_name)

		if Meteor.isServer
			Creator.Collections[object_name].allow
				insert: (userId, doc) ->
					return true
				update: (userId, doc) ->
					return true
				remove: (userId, doc) ->
					return true


	Creator.initApps()
	

Creator.initApps = ()->
	if Meteor.isServer
		_.each Creator.Apps, (app, app_id)->
			db_app = db.apps.findOne(app_id) 
			if !db_app
				app._id = app_id
				db.apps.insert(app)
			# else
			# 	app._id = app_id
			# 	db.apps.update({_id: app_id}, app)

Creator.getObject = (object_name)->
	if !object_name
		object_name = Session.get("object_name")
	if object_name
		return Creator.Objects[object_name]

Creator.getTable = (object_name)->
	return Tabular.tablesByName["creator_" + object_name]

Creator.getSchema = (object_name)->
	return Creator.getObject(object_name)?.schema

Creator.getObjectSchema = (obj) ->

	_.extend(obj.fields, Creator.baseObject.fields)

	schema = {}
	_.each obj.fields, (field, field_name)->

		fs = {}
		fs.autoform = {}
		if field.type == "text"
			fs.type = "String"
		else if field.type == "[text]"
			fs.type = "[String]"
		else if field.type == "textarea"
			fs.type = "String"
			fs.autoform.type = "textarea"
			fs.autoform.rows = 3
		else if field.type == "date"
			fs.type = "Date"
			fs.autoform.type = "bootstrap-datetimepicker"
			fs.autoform.dateTimePickerOptions = 
				format: "YYYY-MM-DD"
		else if field.type == "datetime"
			fs.type = "Date"
			fs.autoform.type = "bootstrap-datetimepicker"
			fs.autoform.dateTimePickerOptions = 
				format: "YYYY-MM-DD HH:mm"
		else if field.type == "lookup" or field.type == "master_detail"
			fs.type = "String"
			if Meteor.isClient
				if field.reference_to == "users"
					fs.autoform.type = "selectuser"
				else if field.reference_to == "organizations"
					fs.autoform.type = "selectorg"
				else
					if field.reference_to
						_link = "/app/#{Session.get('app_id')}/#{field.reference_to}/view/"
					fs.autoform.type="steedos-lookup"
					fs.autoform.optionsMethod="creator.object_options"
					fs.autoform.optionsMethodParams=
						reference_to: field.reference_to
						space: Session.get("spaceId")
						link: _link
		else if field.type == "select"
			fs.type = "String"
			fs.autoform.type = "select"
			fs.autoform.options = field.options
			fs.autoform.firstOption = ""
		else if field.type == "currency"
			fs.type = "number"
		else if field.type == "number"
			fs.type = "number"
		else if field.type == "boolean"
			fs.type = "boolean"
			fs.autoform.type = "boolean-checkbox"
		else if field.type = "reference"
			fs.type = "String"
		else
			fs.type = "String"

		if field.label
			fs.label = field.label
			
		if !field.required
			fs.optional = true

		if field.omit
			fs.autoform.omit = true

		schema[field_name] = fs


	return schema


Creator.getObjectUrl = (object_name, record_id, app_id) ->
	if !app_id
		app_id = Session.get("app_id")
	if record_id
		return Steedos.absoluteUrl("/app/" + app_id + "/" + object_name + "/view/" + record_id)
	else 
		return Steedos.absoluteUrl("/app/" + app_id + "/" + object_name + "/list")


Creator.getObjectField = (object_name, field_name)->
	obj = Creator.Objects[object_name]
	if obj.fields[field_name]
		return obj.fields[field_name]
	else 
		return Creator.baseObject.fields[field_name]	


Creator.getCollection = (object_name)->
	if !object_name
		object_name = Session.get("object_name")
	if object_name
		return Creator.Collections[object_name]

Creator.getObjectRecord = (object_name, record_id)->
	if !record_id
		record_id = Session.get("record_id")
	collection = Creator.getCollection(object_name)
	if collection
		return collection.findOne(record_id)


Creator.getPermissions = (object_name)->
	if !object_name 
		object_name = Session.get("object_name")

	if !object_name
		permissions = 
			allowCreate: false
			allowDelete: false
			allowEdit: false
			allowRead: false
			modifyAllRecords: false
			viewAllRecords: false 
	else	
		if Steedos.isSpaceAdmin()
			permissions = Creator.Objects[Session.get("object_name")]?.permissions?.admin
			if !permissions
				permissions = Creator.baseObject.permissions.admin
		else
			permissions = Creator.Objects[Session.get("object_name")]?.permissions?.user
			if !permissions
				permissions = Creator.baseObject.permissions.user

	return permissions

Creator.getRecordPermissions = (object_name, record, userId)->
	if !object_name 
		object_name = Session.get("object_name")

	permissions = Creator.getPermissions(object_name)

	if permissions.modifyAllRecords and record?.owner? != Meteor.userId()
		permissions.allowEdit = false

	if permissions.viewAllRecords and record?.owner? != Meteor.userId()
		permissions.allowRead = false
		
	return permissions


Creator.getApp = (app_id)->
	if !app_id
		app_id = Session.get("app_id")
	app = Creator.Apps[app_id]
	return app

