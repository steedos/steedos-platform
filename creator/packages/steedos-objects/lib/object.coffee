
Creator.objectsByName = {}   # 此对象只能在确保所有Object初始化完成后调用， 否则获取到的object不全

Creator.Object = (options)->
	self = this

	if (!options.name) 
		throw new Error('Creator.Object options must specify name');
	unless options.permission_set
		options.permission_set = {}
	if !(options.permission_set?.admin)
		options.permission_set.admin = {}
	if !(options.permission_set?.user)
		options.permission_set.user = {}

	self._id = options._id || options.name
	self.space = options.space
	self.name = options.name
	self.label = options.label
	self.icon = options.icon
	self.description = options.description
	self.is_view = options.is_view
	if !_.isBoolean(options.is_enable)  || options.is_enable == true
		self.is_enable = true
	else
		self.is_enable = false
	self.enable_search = options.enable_search
	self.enable_files = options.enable_files
	self.enable_tasks = options.enable_tasks
	self.enable_notes = options.enable_notes
	self.enable_audit = options.enable_audit
	self.hidden = options.hidden
	self.enable_api = (options.enable_api == undefined) or options.enable_api
	self.custom = options.custom
	self.enable_share = options.enable_share

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
	defaultColumns = Creator.getObjectDefaultColumns(self.name)
	_.each options.list_views, (item, item_name)->
		oitem = Creator.convertListView(defaultColumns, item, item_name)
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
		copyItem = _.clone(self.actions[item_name])
		delete self.actions[item_name] #先删除相关属性再重建才能保证后续重复定义的属性顺序生效
		self.actions[item_name] = _.extend(copyItem, item)

	_.each self.actions, (item, item_name)->
		item.name = item_name

	self.related_objects = Creator.getObjectRelateds(self.name)
	
	# 让所有object默认有所有list_views/actions/related_objects/readable_fields/editable_fields完整权限，该权限可能被数据库中设置的admin/user权限覆盖
	self.permission_set = _.clone(Creator.baseObject.permission_set)
	# defaultListViews = _.keys(self.list_views)
	# defaultActions = _.keys(self.actions)
	# defaultRelatedObjects = _.pluck(self.related_objects,"object_name")
	# defaultReadableFields = []
	# defaultEditableFields = []
	# _.each self.fields, (field, field_name)->
	# 	if !(field.hidden)    #231 omit字段支持在非编辑页面查看, 因此删除了此处对omit的判断
	# 		defaultReadableFields.push field_name
	# 		if !field.readonly
	# 			defaultEditableFields.push field_name
		
	# _.each self.permission_set, (item, item_name)->
	# 	if item_name == "none"
	# 		return
	# 	if self.list_views
	# 		self.permission_set[item_name].list_views = defaultListViews
	# 	if self.actions
	# 		self.permission_set[item_name].actions = defaultActions
	# 	if self.related_objects
	# 		self.permission_set[item_name].related_objects = defaultRelatedObjects
	# 	if self.fields
	# 		self.permission_set[item_name].readable_fields = defaultReadableFields
	# 		self.permission_set[item_name].editable_fields = defaultEditableFields

	_.each options.permission_set, (item, item_name)->
		if !self.permission_set[item_name]
			self.permission_set[item_name] = {}
		self.permission_set[item_name] = _.extend(_.clone(self.permission_set[item_name]), item)

	# 前端根据permissions改写field相关属性，后端只要走默认属性就行，不需要改写
	if Meteor.isClient
		permissions = options.permissions
		disabled_list_views = permissions.disabled_list_views
		if disabled_list_views?.length
			defaultListViewId = options.list_views?.all?._id
			if defaultListViewId
				# 把视图权限配置中默认的all视图id转换成all关键字
				permissions.disabled_list_views = _.map disabled_list_views, (list_view_item) ->
					return if defaultListViewId == list_view_item then "all" else list_view_item
		self.permissions = new ReactiveVar(permissions)
		_.each self.fields, (field, field_name)->
			if field
				if _.indexOf(permissions.unreadable_fields, field_name) < 0
					if field.hidden
						return
					if _.indexOf(permissions.uneditable_fields, field_name) > -1
						field.readonly = true
						field.disabled = true
						# 当只读时，如果不去掉必填字段，autoform是会报错的
						field.required = false
				else
					field.hidden = true
	else
		self.permissions = new ReactiveVar(Creator.baseObject.permission_set.none)

	Creator.Collections[self.name] = Creator.createCollection(options)
	self.db = Creator.Collections[self.name]

	schema = Creator.getObjectSchema(self)
	self.schema = new SimpleSchema(schema)
	if self.name != "users" and self.name != "cfs.files.filerecord" && !self.is_view
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
			if Session.get("steedos-locale") && Creator.bootstrapLoaded.get()
				_.each Creator.objectsByName, (object, object_name)->
					object.i18n()
