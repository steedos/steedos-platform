@Creator = {}

Creator.Apps = {}
Creator.Objects = {}
Creator.Collections = {}
Creator.subs = {}


Meteor.startup ->
	_.each Creator.Objects, (obj, object_name)->
		
		new Creator.Object(obj);
		
		Creator.initTriggers(object_name)	
		Creator.initListViews(object_name)

		if Meteor.isServer
			# 危险
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
		return Creator.objectsByName[object_name]

Creator.getTable = (object_name)->
	return Tabular.tablesByName["creator_" + object_name]

Creator.getSchema = (object_name)->
	return Creator.getObject(object_name)?.schema

Creator.getObjectSchema = (obj) ->

	schema = {}
	_.each obj.fields, (field, field_name)->

		fs = {}
		fs.autoform = {}
		fs.autoform.multiple = field.multiple
		if field.type == "text"
			fs.type = String
		else if field.type == "[text]"
			fs.type = [String]
		else if field.type == "textarea"
			fs.type = String
			fs.autoform.type = "textarea"
			fs.autoform.rows = 3
		else if field.type == "date"
			fs.type = Date
			fs.autoform.type = "bootstrap-datetimepicker"
			fs.autoform.dateTimePickerOptions = 
				format: "YYYY-MM-DD"
		else if field.type == "datetime"
			fs.type = Date
			fs.autoform.type = "bootstrap-datetimepicker"
			fs.autoform.dateTimePickerOptions = 
				format: "YYYY-MM-DD HH:mm"
		else if field.type == "lookup" or field.type == "master_detail"
			fs.type = String

			if field.multiple
				fs.type = [String]

			if _.isArray(field.reference_to)
				fs.type = Object
				fs.blackbox = true

			if Meteor.isClient
				if field.reference_to == "users"
					fs.autoform.type = "selectuser"
				else if field.reference_to == "organizations"
					fs.autoform.type = "selectorg"
				else
					fs.autoform.type = "steedosLookups"
					fs.autoform.optionsMethod = "creator.object_options"

					fs.autoform.optionsMethodParams = ()->
						return {space: Session.get("spaceId")}

					if _.isArray(field.reference_to)

						fs.autoform.objectSwitche = true

						schema[field_name + ".o"] = {
							type: String
						}

						schema[field_name + ".ids"] = {
							type: [String]
						}

						_reference_to = field.reference_to
					else
						_reference_to = [field.reference_to]

					fs.autoform.references = []

					_reference_to.forEach (_reference)->
						_object = Creator.Objects[_reference]
						fs.autoform.references.push {
							object: _reference
							label: _object?.label
							icon: _object?.icon
							link: ()->
								return "/app/#{Session.get('app_id')}/#{_reference}/view/"
						}
		else if field.type == "select"
			fs.type = String
			if field.multiple
				fs.type = [String]
			fs.autoform.type = "select"
			fs.autoform.options = field.options
			fs.autoform.firstOption = ""
		else if field.type == "currency"
			fs.type = Number
		else if field.type == "number"
			fs.type = Number
		else if field.type == "boolean"
			fs.type = Boolean
			fs.autoform.type = "boolean-checkbox"
		else if field.type = "reference"
			fs.type = String
		else
			fs.type = field.type

		if field.label
			fs.label = field.label

		if field.allowedValues
			fs.allowedValues = field.allowedValues
						
		if !field.required
			fs.optional = true

		if field.omit
			fs.autoform.omit = true

		if field.group
			fs.autoform.group = field.group

		if field.is_wide
			fs.autoform.is_wide = true
			
		schema[field_name] = fs


	return schema


Creator.getObjectUrl = (object_name, record_id, app_id) ->
	if !app_id
		app_id = Session.get("app_id")
	if record_id
		return Steedos.absoluteUrl("/app/" + app_id + "/" + object_name + "/view/" + record_id)
	else 
		return Steedos.absoluteUrl("/app/" + app_id + "/" + object_name + "/list")

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
	if !object_name and Meteor.isClient
		object_name = Session.get("object_name")

	obj = Creator.getObject(object_name)
	if !obj
		permissions = 
			allowCreate: false
			allowDelete: false
			allowEdit: false
			allowRead: false
			modifyAllRecords: false
			viewAllRecords: false 
	else	
		permissions = obj.getPermissions()

	return permissions

Creator.getRecordPermissions = (object_name, record, userId)->
	if !object_name and Meteor.isClient
		object_name = Session.get("object_name")

	permissions = _.clone(Creator.getPermissions(object_name))

	if permissions.modifyAllRecords and record?.owner? != Meteor.userId()
		permissions.allowEdit = false
		permissions.allowDelete = false

	if permissions.viewAllRecords and record?.owner? != Meteor.userId()
		permissions.allowRead = false
		
	return permissions


Creator.getApp = (app_id)->
	if !app_id
		app_id = Session.get("app_id")
	app = Creator.Apps[app_id]
	return app

Creator.isSpaceAdmin = (spaceId)->
	if !spaceId and Meteor.isClient
		spaceId = Session.get("spaceId")
	if Meteor.userId()
		space = Creator.getObject("spaces")?.db?.findOne(spaceId)
		if space?.admins
			return space.admins.indexOf(Meteor.userId())>=0