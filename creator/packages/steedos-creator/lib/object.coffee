Creator.Object = (options)->
	self = this

	if (!options.name) 
		throw new Error('Creator.Object options must specify name');
	self.name = options.name
	self.icon = options.icon
	self.description = options.description

	if (!options.fields) 
		throw new Error('Creator.Object options must specify name');	
	self.fields = _.clone(Creator.baseObject.fields)
	_.each options.fields, (field, field_name)->
		if !self.fields[field_name]
			self.fields[field_name] = {}
		self.fields[field_name] = _.extend(_.clone(self.fields[field_name]), field)

	self.list_views = _.clone(Creator.baseObject.list_views)
	_.each options.list_views, (item, item_name)->
		if !self.list_views[item_name]
			self.list_views[item_name] = {}
		self.list_views[item_name].name = item_name
		self.list_views[item_name] = _.extend(_.clone(self.list_views[item_name]), item)

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

	self.permissions = _.clone(Creator.baseObject.permissions)
	_.each options.permissions, (item, item_name)->
		if !self.permissions[item_name]
			self.permissions[item_name] = {}
		self.permissions[item_name] = _.extend(_.clone(self.permissions[item_name]), item)

	if db[self.name]
		Creator.Collections[self.name] = db[self.name]
	else if !Creator.Collections[self.name]
		Creator.Collections[self.name] = new Meteor.Collection(self.name)
	self.db = Creator.Collections[self.name]

	schema = Creator.getObjectSchema(self)
	self.schema = new SimpleSchema(schema)
	if self.name != "users"
		Creator.Collections[self.name].attachSchema(self.schema)

	Creator.objectsByName[self.name] = self

	return self

Creator.Object.prototype.getPermissions = ()->
	# 下一步需要判断用户是否工作区管理员，是否object管理员
	return this.permissions.user