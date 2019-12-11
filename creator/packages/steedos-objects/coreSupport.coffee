Creator.deps = {
	app: new Tracker.Dependency
	object: new Tracker.Dependency
};

Creator._TEMPLATE = {
	Apps: {},
	Objects: {}
}

Meteor.startup ->
	SimpleSchema.extendOptions({filtersFunction: Match.Optional(Match.OneOf(Function, String))})
	SimpleSchema.extendOptions({optionsFunction: Match.Optional(Match.OneOf(Function, String))})
	SimpleSchema.extendOptions({createFunction: Match.Optional(Match.OneOf(Function, String))})

# Creator.fiberLoadObjects 供steedos-cli项目使用
if Meteor.isServer
	Fiber = require('fibers')
	Creator.fiberLoadObjects = (obj, object_name)->
		Fiber(()->
			Creator.loadObjects(obj, object_name)
		).run()

Creator.loadObjects = (obj, object_name)->
	if !object_name
		object_name = obj.name

	if !obj.list_views
		obj.list_views = {}

	if obj.space
		object_name = 'c_' + obj.space + '_' + obj.name
	if object_name == 'cfs_files_filerecord'
		object_name = 'cfs.files.filerecord'
		obj = _.clone(obj)
		obj.name = object_name
		Creator.Objects[object_name] = obj

	Creator.convertObject(obj)
	new Creator.Object(obj);

	Creator.initTriggers(object_name)
	Creator.initListViews(object_name)
	return obj

Creator.getObjectName = (object) ->
	if object.space
		return "c_#{object.space}_#{object.name}"
	return object.name

Creator.getObject = (object_name, space_id)->
	if _.isArray(object_name)
		return ;
	if Meteor.isClient
		Creator.deps?.object?.depend()
	if !object_name and Meteor.isClient
		object_name = Session.get("object_name")
	if !space_id && object_name
		if Meteor.isClient && !object_name.startsWith('c_')
			space_id = Session.get("spaceId")

	if object_name
		if space_id
			obj = Creator.objectsByName["c_#{space_id}_#{object_name}"]
			if obj
				return obj

		obj = _.find Creator.objectsByName, (o)->
				return o._collection_name == object_name
		if obj
			return obj

		return Creator.objectsByName[object_name]

Creator.getObjectById = (object_id)->
	return _.findWhere(Creator.objectsByName, {_id: object_id})

Creator.removeObject = (object_name)->
	console.log("removeObject", object_name)
	delete Creator.Objects[object_name]
	delete Creator.objectsByName[object_name]

Creator.getCollection = (object_name, spaceId)->
	if !object_name
		object_name = Session.get("object_name")
	if object_name
		return Creator.Collections[Creator.getObject(object_name, spaceId)?._collection_name]

Creator.removeCollection = (object_name)->
	delete Creator.Collections[object_name]

Creator.isSpaceAdmin = (spaceId, userId)->
	if Meteor.isClient
		if !spaceId
			spaceId = Session.get("spaceId")
		if !userId
			userId = Meteor.userId()

	space = Creator.getObject("spaces")?.db?.findOne(spaceId)
	if space?.admins
		return space.admins.indexOf(userId) >= 0


Creator.evaluateFormula = (formular, context, options)->

	if !_.isString(formular)
		return formular

	if Creator.Formular.checkFormula(formular)
		return Creator.Formular.run(formular, context, options)

	return formular

Creator.evaluateFilters = (filters, context)->
	selector = {}
	_.each filters, (filter)->
		if filter?.length == 3
			name = filter[0]
			action = filter[1]
			value = Creator.evaluateFormula(filter[2], context)
			selector[name] = {}
			selector[name][action] = value
	console.log("evaluateFilters-->selector", selector)
	return selector

Creator.isCommonSpace = (spaceId) ->
	return spaceId == 'common'

###
	docs：待排序的文档数组
	ids：_id集合
	id_key: 默认为_id
	return 按照ids的顺序返回新的文档集合
###
Creator.getOrderlySetByIds = (docs, ids, id_key, hit_first)->

	if !id_key
		id_key = "_id"

	if hit_first

		#由于不能使用_.findIndex函数，因此此处先将对象数组转为普通数组类型，在获取其index
		values = docs.getProperty(id_key)

		return	_.sortBy docs, (doc)->
					_index = ids.indexOf(doc[id_key])
					if _index > -1
						return _index
					else
						return ids.length + _.indexOf(values, doc[id_key])
	else
		return	_.sortBy docs, (doc)->
			return ids.indexOf(doc[id_key])

###
	按用户所属本地化语言进行排序，支持中文、数值、日期等字段排序
	对于Object类型，如果提供作用域中key属性，则取值为value[key]进行排序比较，反之整个Object.toString()后排序比较
###
Creator.sortingMethod = (value1, value2) ->
	if this.key
		value1 = value1[this.key]
		value2 = value2[this.key]
	if value1 instanceof Date
		value1 = value1.getTime()
	if value2 instanceof Date
		value2 = value2.getTime()
	if typeof value1 is "number" and typeof value2 is "number"
		return value1 - value2
	# Handling null values
	isValue1Empty = value1 == null or value1 == undefined
	isValue2Empty = value2 == null or value2 == undefined
	if isValue1Empty and !isValue2Empty
		return -1
	if isValue1Empty and isValue2Empty
		return 0
	if !isValue1Empty and isValue2Empty
		return 1
	locale = Steedos.locale()
	return value1.toString().localeCompare value2.toString(), locale


# 该函数只在初始化Object时，把相关对象的计算结果保存到Object的related_objects属性中，后续可以直接从related_objects属性中取得计算结果而不用再次调用该函数来计算
Creator.getObjectRelateds = (object_name)->
	if Meteor.isClient
		if !object_name
			object_name = Session.get("object_name")

	related_objects = []
	# _object = Creator.getObject(object_name)
	# 因Creator.getObject函数内部要调用该函数，所以这里不可以调用Creator.getObject取对象，只能调用Creator.Objects来取对象
	_object = Creator.Objects[object_name]
	if !_object
		return related_objects
	
	relatedList = _object.relatedList
	if !_.isEmpty relatedList
		relatedListMap = {}
		_.each relatedList, (objName)->
			relatedListMap[objName] = {}
		_.each Creator.Objects, (related_object, related_object_name)->
			_.each related_object.fields, (related_field, related_field_name)->
				if (related_field.type == "master_detail" || related_field.type == "lookup") and related_field.reference_to and related_field.reference_to == object_name and relatedListMap[related_object_name]
					relatedListMap[related_object_name] = { object_name: related_object_name, foreign_key: related_field_name, sharing: related_field.sharing }
		if relatedListMap['cms_files']
			relatedListMap['cms_files'] = { object_name: "cms_files", foreign_key: "parent" }
		if relatedListMap['instances']
			relatedListMap['instances'] = { object_name: "instances", foreign_key: "record_ids" }
		_.each ['tasks', 'notes', 'events', 'approvals'], (enableObjName)->
			if relatedListMap[enableObjName]
				relatedListMap[enableObjName] = { object_name: enableObjName, foreign_key: "related_to" }
		if relatedListMap['audit_records']
			#record 详细下的audit_records仅modifyAllRecords权限可见
			if Meteor.isClient
				permissions = Creator.getPermissions(object_name)
				if _object.enable_audit && permissions?.modifyAllRecords
					relatedListMap['audit_records'] = { object_name:"audit_records", foreign_key: "related_to" }
		related_objects = _.values relatedListMap
		return related_objects

	if _object.enable_files
		related_objects.push {object_name:"cms_files", foreign_key: "parent"}

	_.each Creator.Objects, (related_object, related_object_name)->
		_.each related_object.fields, (related_field, related_field_name)->
			if related_field.type == "master_detail" and related_field.reference_to and related_field.reference_to == object_name
				if related_object_name == "object_fields"
					#TODO 待相关列表支持排序后，删除此判断
					related_objects.splice(0, 0, {object_name:related_object_name, foreign_key: related_field_name})
				else
					related_objects.push {object_name:related_object_name, foreign_key: related_field_name}

	if _object.enable_tasks
		related_objects.push {object_name:"tasks", foreign_key: "related_to"}
	if _object.enable_notes
		related_objects.push {object_name:"notes", foreign_key: "related_to"}
	if _object.enable_events
		related_objects.push {object_name:"events", foreign_key: "related_to"}
	if _object.enable_instances
		related_objects.push {object_name:"instances", foreign_key: "record_ids"}
	if _object.enable_approvals
		related_objects.push {object_name:"approvals", foreign_key: "related_to"}
	#record 详细下的audit_records仅modifyAllRecords权限可见
	if Meteor.isClient
		permissions = Creator.getPermissions(object_name)
		if _object.enable_audit && permissions?.modifyAllRecords
			related_objects.push {object_name:"audit_records", foreign_key: "related_to"}

	return related_objects

Creator.getUserContext = (userId, spaceId, isUnSafeMode)->
	if Meteor.isClient
		return Creator.USER_CONTEXT
	else
		if !(userId and spaceId)
			throw new Meteor.Error 500, "the params userId and spaceId is required for the function Creator.getUserContext"
			return null
		suFields = {name: 1, mobile: 1, position: 1, email: 1, company: 1, organization: 1, space: 1, company_id: 1, company_ids: 1}
		# check if user in the space
		su = Creator.Collections["space_users"].findOne({space: spaceId, user: userId}, {fields: suFields})
		if !su
			spaceId = null

		# if spaceId not exists, get the first one.
		if !spaceId
			if isUnSafeMode
				su = Creator.Collections["space_users"].findOne({user: userId}, {fields: suFields})
				if !su
					return null
				spaceId = su.space
			else
				return null

		USER_CONTEXT = {}
		USER_CONTEXT.userId = userId
		USER_CONTEXT.spaceId = spaceId
		USER_CONTEXT.user = {
			_id: userId
			name: su.name,
			mobile: su.mobile,
			position: su.position,
			email: su.email
			company: su.company
			company_id: su.company_id
			company_ids: su.company_ids
		}
		space_user_org = Creator.getCollection("organizations")?.findOne(su.organization)
		if space_user_org
			USER_CONTEXT.user.organization = {
				_id: space_user_org._id,
				name: space_user_org.name,
				fullname: space_user_org.fullname
			}
		return USER_CONTEXT

Creator.getRelativeUrl = (url)->
	if url
		# url开头没有"/"，需要添加"/"
		if !/^\//.test(url)
			url = "/" + url
		return __meteor_runtime_config__.ROOT_URL_PATH_PREFIX + url
	else
		return __meteor_runtime_config__.ROOT_URL_PATH_PREFIX

Creator.getUserCompanyId = (userId, spaceId)->
	userId = userId || Meteor.userId()
	if Meteor.isClient
		spaceId = spaceId || Session.get('spaceId')
	else
		if !spaceId
			throw new Meteor.Error(400, 'miss spaceId')
	su = Creator.getCollection('space_users').findOne({space: spaceId, user: userId}, {fields: {company_id:1}})
	return su.company_id

Creator.getUserCompanyIds = (userId, spaceId)->
	userId = userId || Meteor.userId()
	if Meteor.isClient
		spaceId = spaceId || Session.get('spaceId')
	else
		if !spaceId
			throw new Meteor.Error(400, 'miss spaceId')
	su = Creator.getCollection('space_users').findOne({space: spaceId, user: userId}, {fields: {company_ids:1}})
	return su?.company_ids

Creator.processPermissions = (po)->
	if po.allowCreate
		po.allowRead = true
	if po.allowEdit
		po.allowRead = true
	if po.allowDelete
		po.allowEdit = true
		po.allowRead = true
	if po.viewAllRecords
		po.allowRead = true
	if po.modifyAllRecords
		po.allowRead = true
		po.allowEdit = true
		po.allowDelete = true
		po.viewAllRecords = true
	if po.viewCompanyRecords
		po.allowRead = true
	if po.modifyCompanyRecords
		po.allowRead = true
		po.allowEdit = true
		po.allowDelete = true
		po.viewCompanyRecords = true
	return po

if Meteor.isServer
	if process.env.STEEDOS_STORAGE_DIR
		Creator.steedosStorageDir = process.env.STEEDOS_STORAGE_DIR
	else
		path = require('path')
		Creator.steedosStorageDir = path.resolve(path.join(__meteor_bootstrap__.serverDir, '../../../cfs'))
