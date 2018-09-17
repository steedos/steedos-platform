if !Creator?
	@Creator = {}
Creator.Objects = {}
Creator.Collections = {}
Creator.deps = {
	app: new Tracker.Dependency
	object: new Tracker.Dependency
};

Creator._TEMPLATE = {
	Apps: {},
	Objects: {}
}

Creator.getObjectName = (object) ->
	if object.space
		return "c_#{object.space}_#{object.name}"
	retrurn object.name

Creator.getObject = (object_name, space_id)->
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
	# Handling null values
	if !value1 and value2
		return -1
	if !value1 and !value2
		return 0
	if value1 and !value2
		return 1
	locale = Steedos.locale()
	return value1.toString().localeCompare value2.toString(), locale
