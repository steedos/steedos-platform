@Creator = {}

Creator.Apps = {}
Creator.Objects = {}
Creator.Collections = {}
Creator.TabularTables = {}



Meteor.startup ->
	_.each Creator.Objects, (obj, object_name)->
		if db[object_name]
			Creator.Collections[object_name] = db[object_name]
		else if !Creator.Collections[object_name]
			schema = Creator.getObjectSchema(obj)
			_simpleSchema = new SimpleSchema(schema)
			Creator.Collections[object_name] = new Meteor.Collection(object_name)
			Creator.Collections[object_name].attachSchema(_simpleSchema)
				
			if Meteor.isServer
				Creator.Collections[object_name].allow
					insert: (userId, doc) ->
						return true
					update: (userId, doc) ->
						return true
					remove: (userId, doc) ->
						return true

				Creator.Collections[object_name].before.insert (userId, doc)->
					doc.owner = userId
					doc.created_by = userId;
					doc.created = new Date();
					doc.modified_by = userId;
					doc.modified = new Date();

				Creator.Collections[object_name].after.insert (userId, doc)->
					Meteor.call "object_recent_viewed", object_name, doc._id

				Creator.Collections[object_name].before.update (userId, doc, fieldNames, modifier, options)->
					modifier.$set = modifier.$set || {};
					modifier.$set.modified_by = userId
					modifier.$set.modified = new Date();


		if Meteor.isClient
				Creator.Collections[object_name].before.insert (userId, doc)->
					doc.space = Session.get("spaceId")


		if obj.list_views?.default?.columns
			Creator.TabularTables[object_name] = new Tabular.Table
				name: "creator_" + object_name,
				collection: Creator.Collections[object_name],
				pub: "steedos_object_tabular",
				columns: Creator.getTabularColumns(object_name, obj.list_views.default.columns)
				dom: "tp"
				extraFields: ["_id"]
				lengthChange: false
				ordering: false
				pageLength: 20
				info: false
				searching: true
				autoWidth: true
				changeSelector: Creator.tabularChangeSelector
		


	Creator.initApps()
	Creator.initObjects()
	

	# 初始化子表
	_.each Creator.Objects, (obj, object_name)->

		_.each obj.fields, (field, field_name)->
			if field.reference_to
				tabular_name = field.reference_to + "_related_" + object_name
				list_view = Creator.getListView object_name, "all"
				columns = list_view.columns
				columns = _.without(columns, field_name)

				Creator.TabularTables[tabular_name] = new Tabular.Table
					name: tabular_name,
					collection: Creator.Collections[object_name],
					pub: "steedos_object_tabular",
					columns: Creator.getTabularColumns(object_name, columns)
					dom: "tp"
					extraFields: ["_id"]
					lengthChange: false
					ordering: false
					pageLength: 5
					info: false
					searching: true
					autoWidth: true
					changeSelector: Creator.tabularChangeSelector

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

Creator.initObjects = ()->
	# if Meteor.isServer
	# 	_.each Creator.Objects, (object, obj_id)->
	# 		db_obj = Creator.Collections.objects.findOne(obj_id) 
	# 		if !db_obj
	# 			object._id = obj_id
	# 			Creator.Collections.objects.insert(object)
	# 		else
	# 			Creator.Collections.objects.update({_id: obj_id}, {$set: object})

Creator.getObjectSchema = (obj) ->

	_.extend(obj.fields, Creator.baseObject.fields)

	schema = {}
	_.each obj.fields, (field, field_name)->

		fs = {}
		fs.autoform = {}
		if field.type == "text"
			fs.type = "String"
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
					fs.autoform.uniPlaceholder = ()->
						t("please_select") + field_name
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


Creator.tabularChangeSelector =  (selector, userId)-> 
	if userId and selector.space
		return selector
	return {_id: "nothing"}

Creator.getTabularColumns = (object_name, columns) ->
	cols = []
	_.each columns, (field_name)->
		field = Creator.getObjectField(object_name, field_name)
		if field?.type
			col = {}
			col.data = field_name
			col.render =  (val, type, doc) ->
				
			col.sTitle = '<div class="slds-truncate" title="">' + t("" + object_name + "_" + field_name.replace(/\./g,"_")); + '</div>'
			# col.createdCell = (node, cellData, rowData) ->
			# 	$(node).css()
			col.className = "slds-cell-edit cellContainer"
			col.createdCell = (cell, val, doc) ->
				Blaze.renderWithData(Template.creator_table_cell, {_id: doc._id, val: val, doc: doc, field: field, field_name: field_name, object_name:object_name}, cell);

			# col.tmpl = Meteor.isClient && Template.creator_table_cell
			# col.tmplContext = (rowData)->
			# 	return {
			# 		cell: rowData[field_name],
			# 		row: rowData
			# 		field_name: field_name
			# 	}

			cols.push(col)

	action_col = 
		title: '<div class="slds-th__action"></div>'
		data: "_id"
		width: '20px'
		createdCell: (node, cellData, rowData) ->
			$(node).html(Blaze.toHTMLWithData Template.creator_table_actions, {_id: cellData}, node)
	cols.push(action_col)
	return cols

Creator.getObjectUrl = (object_name, record_id, app_id) ->
	if !app_id
		app_id = Session.get("app_id")
	if record_id
		return Steedos.absoluteUrl("/app/" + app_id + "/" + object_name + "/view/" + record_id)
	else 
		return Steedos.absoluteUrl("/app/" + app_id + "/" + object_name + "/list")


Creator.getObject = (object_name)->
	if !object_name
		object_name = Session.get("object_name")
	if object_name
		return Creator.Objects[object_name]

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


Creator.getListViews = (object_name)->
	if !object_name 
		object_name = Session.get("object_name")

	object = Creator.getObject(object_name)
	list_views = []
	list_views = _.keys Creator.baseObject.list_views
	if object.list_views
		list_views_object = _.keys object.list_views
		if list_views_object?.length>1
			list_views = list_views_object

	list_views = _.without list_views, "default"
	return list_views


Creator.getListView = (object_name, list_view_id)->
	if !object_name 
		object_name = Session.get("object_name")
	if !list_view_id
		list_view_id = Session.get("list_view_id")
	list_views = Creator.getListViews(object_name)
	if !list_view_id or list_views.indexOf(list_view_id) < 0
		list_view_id = list_views[0]
		if Meteor.isClient
			Session.set("list_view_id", list_view_id)
	object = Creator.getObject(object_name)
	if object.list_views?[list_view_id]
		list_view = object.list_views[list_view_id]
	else if Creator.baseObject.list_views?[list_view_id]
		list_view = Creator.baseObject.list_views[list_view_id]
	else
		list_view = 
			filter_scope: "mine"
			columns: ["name"]

	if !list_view.columns 
		if object.list_views?.default?.columns
			list_view.columns = object.list_views.default.columns
		else
			list_view.columns = ["name"]

	if !list_view.filter_scope
		list_view.filter_scope = "mine"

	return list_view

Creator.getApp = (app_id)->
	if !app_id
		app_id = Session.get("app_id")
	app = db.apps.findOne(app_id)
	if app 
		app.objects = Creator.Apps[app_id]?.objects
	return app





if Meteor.isClient
	# 切换工作区时，重置下拉框的选项
	Tracker.autorun ()->
		if  Session.get("spaceId")
			_.each Creator.Objects, (obj, object_name)->
				if Creator.Collections[object_name]
					_.each obj.fields, (field, field_name)->
						if field.type == "master_detail" or field.type == "lookup"
							_schema = Creator.Collections[object_name]?._c2?._simpleSchema?._schema
							_schema?[field_name]?.autoform?.optionsMethodParams?.space = Session.get("spaceId")

