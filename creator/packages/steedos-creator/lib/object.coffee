
Creator.objectsByName = {}   # 此对象只能在确保所有Object初始化完成后调用， 否则获取到的object不全

Creator.Object = (options)->
	self = this

	if (!options.name) 
		throw new Error('Creator.Object options must specify name');
	self.name = options.name
	self.label = options.label
	self.icon = options.icon
	self.description = options.description
	self.enable_search = options.enable_search

	if (!options.fields) 
		throw new Error('Creator.Object options must specify name');	

	self.fields = _.clone(options.fields)

	_.each self.fields, (field, field_name)->
		if field_name == 'name' || field.is_name
			self.NAME_FIELD_KEY = field_name

	_.each Creator.baseObject.fields, (field, field_name)->
		if !self.fields[field_name]
			self.fields[field_name] = {}
		self.fields[field_name] = _.extend(_.clone(field), self.fields[field_name])

	self.list_views = {} 
	_.each options.list_views, (item, item_name)->
		oitem = _.clone(item)
		oitem.name = item_name
		if !oitem.columns
			if self.list_views.default?.columns
				oitem.columns = self.list_views.default.columns
		if !oitem.columns
			oitem.columns = ["name"]
		if !oitem.filter_scope
			oitem.filter_scope = "mime"
		self.list_views[item_name] = oitem

	self.triggers = _.clone(Creator.baseObject.triggers)
	_.each options.triggers, (item, item_name)->
		if !self.triggers[item_name]
			self.triggers[item_name] = {}
		self.triggers[item_name].name = item_name
		self.triggers[item_name] = _.extend(_.clone(self.triggers[item_name]), item)

	self.actions = _.clone(Creator.baseObject.actions)
	_.each options.actions, (item, item_name)->
		if !self.actions[item_name]
			self.actions[item_name] = {}
		self.actions[item_name].name = item_name
		self.actions[item_name] = _.extend(_.clone(self.actions[item_name]), item)

	self.permission_set = _.clone(Creator.baseObject.permission_set)
	_.each options.permission_set, (item, item_name)->
		if !self.permission_set[item_name]
			self.permission_set[item_name] = {}
		self.permission_set[item_name] = _.extend(_.clone(self.permission_set[item_name]), item)

	self.permissions = new ReactiveVar(Creator.baseObject.permission_set.none)

	if db[self.name]
		Creator.Collections[self.name] = db[self.name]
	else if !Creator.Collections[self.name]
		Creator.Collections[self.name] = new Meteor.Collection(self.name)
	self.db = Creator.Collections[self.name]

	schema = Creator.getObjectSchema(self)
	self.schema = new SimpleSchema(schema)
	if self.name != "users"
		if Meteor.isClient
			Creator.Collections[self.name].attachSchema(self.schema, {replace: true})
		else
			Creator.Collections[self.name].attachSchema(self.schema)

	Creator.objectsByName[self.name] = self

	return self

Creator.Object.prototype.i18n = ()->
	# set object label
	self = this

	key = self.name
	if t(key) == key
		if !self.label
			self.label = self.name
	else
		self.label = t(key)

	# set field labels
	_.each self.fields, (field, field_name)->
		fkey = self.name + "_" + field_name
		if t(fkey) == fkey
			if !field.label
				field.label = field_name
		else
			field.label = t(fkey)
		self.schema?._schema?[field_name]?.label = field.label


	# set listview labels
	_.each self.list_views, (item, item_name)->
		i18n_key = self.name + "_listview_" + item_name
		if t(i18n_key) == i18n_key
			if !item.label
				item.label = item_name
		else
			item.label = t(i18n_key)


if Meteor.isClient

	Meteor.startup ->
		Tracker.autorun ->
			if Session.get("steedos-locale")
				_.each Creator.objectsByName, (object, object_name)->
					object.i18n()

		Tracker.autorun ->
			if Session.get("spaceId")
				Meteor.call "creator.object_permissions", Session.get("spaceId"), (error, result)->
					if error
						console.log error
					else
						_.each result, (permissions, object_name)->
							Creator.getObject(object_name).permissions.set(permissions)
							_.each permissions.fields, (field, field_name)->
								f = Creator.getObject(object_name).fields[field_name]
								if f
									fs = Creator.getObject(object_name).schema._schema[field_name]
									if !fs.autoform
										fs.autoform = {}
									if field.readonly
										f.readonly = true
										fs.autoform.readonly = true
										fs.autoform.disabled = true
									if field.hidden
										f.hidden = true
										f.omit = true
										fs.autoform.omit = true