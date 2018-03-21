if !Creator?
	@Creator = {}
Creator.Objects = {}
Creator.Collections = {}


Creator.getObject = (object_name)->
	if !object_name and Meteor.isClient
		object_name = Session.get("object_name")
	if object_name
		return Creator.objectsByName[object_name]

Creator.removeObject = (object_name)->
	delete Creator.Objects[object_name]
	delete Creator.objectsByName[object_name]

Creator.getCollection = (object_name)->
	if !object_name
		object_name = Session.get("object_name")
	if object_name
		return Creator.Collections[object_name]

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


Creator.evaluateFormula = (formular, context)->

	if !_.isString(formular)
		return formular

	if Creator.Formular.checkFormula(formular)
		return Creator.Formular.run(formular, context)

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
