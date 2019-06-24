Meteor.startup ->
	MeteorODataRouter = require('@steedos/core').MeteorODataRouter;
	ODataRouter = require('@steedos/core').ODataRouter
	express = require('express');
	app = express();
	app.use('/api/odata/v4', MeteorODataRouter);
	WebApp.connectHandlers.use(app);
	_.each Creator.steedosSchema.getDataSources(), (datasource, name)->
		if(name != 'default')
			otherApp = express();
			otherApp.use("/api/odata/#{name}", ODataRouter);
			WebApp.connectHandlers.use(otherApp);

# 	odataV4Mongodb = require 'odata-v4-mongodb'
# 	querystring = require 'querystring'

# 	handleError = (e)->
# 		console.error e.stack
# 		body = {}
# 		error = {}
# 		error['message'] = e.message
# 		statusCode = 500
# 		if e.error and _.isNumber(e.error)
# 			statusCode = e.error
# 		error['code'] = statusCode
# 		error['error'] = statusCode
# 		error['details'] = e.details
# 		error['reason'] = e.reason
# 		body['error'] = error
# 		return {
# 			statusCode: statusCode
# 			body:body
# 		}

# 	visitorParser = (visitor)->
# 		parsedOpt = {}
# 		if visitor.projection
# 			parsedOpt.fields = visitor.projection
# 		if visitor.hasOwnProperty('limit')
# 			parsedOpt.limit = visitor.limit

# 		if visitor.hasOwnProperty('skip')
# 			parsedOpt.skip = visitor.skip

# 		if visitor.sort
# 			parsedOpt.sort = visitor.sort

# 		parsedOpt
# 	dealWithExpand = (createQuery, entities, key, spaceId)->
# 		if _.isEmpty createQuery.includes
# 			return

# 		obj = Creator.getObject(key, spaceId)
# 		_.each createQuery.includes, (include)->
# 			# console.log 'include: ', include
# 			navigationProperty = include.navigationProperty
# 			# console.log 'navigationProperty: ', navigationProperty
# 			field = obj.fields[navigationProperty]
# 			if field and (field.type is 'lookup' or field.type is 'master_detail')
# 				if _.isFunction(field.reference_to)
# 					field.reference_to = field.reference_to()
# 				if field.reference_to
# 					queryOptions = visitorParser(include)
# 					if _.isString field.reference_to
# 						referenceToCollection = Creator.getCollection(field.reference_to, spaceId)
# 						_ro_NAME_FIELD_KEY = Creator.getObject(field.reference_to, spaceId)?.NAME_FIELD_KEY
# 						_.each entities, (entity, idx)->
# 							if entity[navigationProperty]
# 								if field.multiple
# 									originalData = _.clone(entity[navigationProperty])
# 									multiQuery = _.extend {_id: {$in: entity[navigationProperty]}}, include.query
# 									entities[idx][navigationProperty] = referenceToCollection.find(multiQuery, queryOptions).fetch()
# 									if !entities[idx][navigationProperty].length
# 										entities[idx][navigationProperty] = originalData
# 									#排序
# 									entities[idx][navigationProperty] = Creator.getOrderlySetByIds(entities[idx][navigationProperty], originalData)
# 									entities[idx][navigationProperty] = _.map entities[idx][navigationProperty], (o)->
# 										o['reference_to.o'] = referenceToCollection._name
# 										o['reference_to._o'] = field.reference_to
# 										o['_NAME_FIELD_VALUE'] = o[_ro_NAME_FIELD_KEY]
# 										return o
# 								else
# 									singleQuery = _.extend {_id: entity[navigationProperty]}, include.query

# 									# 特殊处理在相关表中没有找到数据的情况，返回原数据
# 									entities[idx][navigationProperty] = referenceToCollection.findOne(singleQuery, queryOptions) || entities[idx][navigationProperty]
# 									if entities[idx][navigationProperty]
# 										entities[idx][navigationProperty]['reference_to.o'] = referenceToCollection._name
# 										entities[idx][navigationProperty]['reference_to._o'] = field.reference_to
# 										entities[idx][navigationProperty]['_NAME_FIELD_VALUE'] = entities[idx][navigationProperty][_ro_NAME_FIELD_KEY]
# 					if _.isArray field.reference_to
# 						_.each entities, (entity, idx)->
# 							if entity[navigationProperty]?.ids
# 								_o = entity[navigationProperty].o
# 								_ro_NAME_FIELD_KEY = Creator.getObject(_o, spaceId)?.NAME_FIELD_KEY
# 								if queryOptions?.fields && _ro_NAME_FIELD_KEY
# 									queryOptions.fields[_ro_NAME_FIELD_KEY] = 1
# 								referenceToCollection = Creator.getCollection(entity[navigationProperty].o, spaceId)
# 								if referenceToCollection
# 									if field.multiple
# 										_ids = _.clone(entity[navigationProperty].ids)
# 										multiQuery = _.extend {_id: {$in: entity[navigationProperty].ids}}, include.query
# 										entities[idx][navigationProperty] = _.map referenceToCollection.find(multiQuery, queryOptions).fetch(), (o)->
# 											o['reference_to.o'] = referenceToCollection._name
# 											o['reference_to._o'] = _o
# 											o['_NAME_FIELD_VALUE'] = o[_ro_NAME_FIELD_KEY]
# 											return o
# 										#排序
# 										entities[idx][navigationProperty] = Creator.getOrderlySetByIds(entities[idx][navigationProperty], _ids)
# 									else
# 										singleQuery = _.extend {_id: entity[navigationProperty].ids[0]}, include.query
# 										entities[idx][navigationProperty] = referenceToCollection.findOne(singleQuery, queryOptions)
# 										if entities[idx][navigationProperty]
# 											entities[idx][navigationProperty]['reference_to.o'] = referenceToCollection._name
# 											entities[idx][navigationProperty]['reference_to._o'] = _o
# 											entities[idx][navigationProperty]['_NAME_FIELD_VALUE'] = entities[idx][navigationProperty][_ro_NAME_FIELD_KEY]

# 				else
# 				# TODO


# 		return

# 	setOdataProperty=(entities,space,key)->
# 		entities_OdataProperties = []
# 		_.each entities, (entity, idx)->
# 			entity_OdataProperties = {}
# 			id = entities[idx]["_id"]
# 			entity_OdataProperties['@odata.id'] = SteedosOData.getODataNextLinkPath(space,key)+ '(\'' + "#{id}" + '\')'
# 			entity_OdataProperties['@odata.etag'] = "W/\"08D589720BBB3DB1\""
# 			entity_OdataProperties['@odata.editLink'] = entity_OdataProperties['@odata.id']
# 			_.extend entity_OdataProperties,entity
# 			entities_OdataProperties.push entity_OdataProperties
# 		return entities_OdataProperties

# 	setErrorMessage = (statusCode,collection,key,action)->
# 		body = {}
# 		error = {}
# 		innererror = {}
# 		if statusCode == 404
# 			if collection
# 				if action == 'post'
# 					innererror['message'] = t("creator_odata_post_fail")
# 					innererror['type'] = 'Microsoft.OData.Core.UriParser.ODataUnrecognizedPathException'
# 					error['code'] = 404
# 					error['message'] = "creator_odata_post_fail"
# 				else
# 					innererror['message'] = t("creator_odata_record_query_fail")
# 					innererror['type'] = 'Microsoft.OData.Core.UriParser.ODataUnrecognizedPathException'
# 					error['code'] = 404
# 					error['message'] = "creator_odata_record_query_fail"
# 			else
# 				innererror['message'] = t("creator_odata_collection_query_fail")+ key
# 				innererror['type'] = 'Microsoft.OData.Core.UriParser.ODataUnrecognizedPathException'
# 				error['code'] = 404
# 				error['message'] = "creator_odata_collection_query_fail"
# 		if  statusCode == 401
# 			innererror['message'] = t("creator_odata_authentication_required")
# 			innererror['type'] = 'Microsoft.OData.Core.UriParser.ODataUnrecognizedPathException'
# 			error['code'] = 401
# 			error['message'] = "creator_odata_authentication_required"
# 		if statusCode == 403
# 			switch action
# 				when 'get' then innererror['message'] = t("creator_odata_user_access_fail")
# 				when 'post' then innererror['message'] = t("creator_odata_user_create_fail")
# 				when 'put' then innererror['message'] = t("creator_odata_user_update_fail")
# 				when 'delete' then innererror['message'] = t("creator_odata_user_remove_fail")
# 			innererror['message'] = t("creator_odata_user_access_fail")
# 			innererror['type'] = 'Microsoft.OData.Core.UriParser.ODataUnrecognizedPathException'
# 			error['code'] = 403
# 			error['message'] = "creator_odata_user_access_fail"
# 		error['innererror'] = innererror
# 		body['error'] = error
# 		return body

# 	removeInvalidMethod = (queryParams)->
# 		if queryParams.$filter && queryParams.$filter.indexOf('tolower(') > -1
# 			removeMethod = ($1)->
# 				return $1.replace('tolower(', '').replace(')', '')
# 			queryParams.$filter = queryParams.$filter.replace(/tolower\(([^\)]+)\)/g, removeMethod)

# 	isSameCompany = (spaceId, userId, companyId, query)->
# 		su = Creator.getCollection("space_users").findOne({ space: spaceId, user: userId }, { fields: { company_id: 1, company_ids: 1 } })
# 		if !companyId && query
# 			companyId = su.company_id
# 			query.company_id = { $in: su.company_ids }
# 		return su.company_ids.includes(companyId)

# 	# 不返回已假删除的数据
# 	excludeDeleted = (query)->
# 		query.is_deleted = { $ne: true }

# 	# 修改、删除时，如果 doc.space = "global"，报错
# 	checkGlobalRecord = (collection, id, object)->
# 		if object.enable_space_global && collection.find({ _id: id, space: 'global'}).count()
# 			throw new Meteor.Error(400, "不能修改或者删除标准对象")


# 	SteedosOdataAPI.addRoute(':object_name', {authRequired: true, spaceRequired: false}, {
# 		get: ()->
# 			try
# 				key = @urlParams.object_name
# 				spaceId = @urlParams.spaceId
# 				object = Creator.getObject(key, spaceId)
# 				if not object?.enable_api
# 					return {
# 						statusCode: 401
# 						body:setErrorMessage(401)
# 					}
# 				collection = Creator.getCollection(key, spaceId)
# 				if not collection
# 					return {
# 						statusCode: 404
# 						body:setErrorMessage(404,collection,key)
# 					}

# 				removeInvalidMethod(@queryParams)
# 				qs = decodeURIComponent(querystring.stringify(@queryParams))
# 				createQuery = if qs then odataV4Mongodb.createQuery(qs) else odataV4Mongodb.createQuery()
# 				permissions = Creator.getObjectPermissions(spaceId, @userId, key)
# 				if permissions.viewAllRecords or (permissions.viewCompanyRecords && isSameCompany(spaceId, @userId, createQuery.query.company_id, createQuery.query)) or (permissions.allowRead and @userId)

# 					if key is 'cfs.files.filerecord'
# 						createQuery.query['metadata.space'] = spaceId
# 					else if key is 'spaces'
# 						if spaceId isnt 'guest'
# 							createQuery.query._id = spaceId
# 					else
# 						if spaceId isnt 'guest' and key != "users" and createQuery.query.space isnt 'global'
# 							createQuery.query.space = spaceId

# 					if Creator.isCommonSpace(spaceId)
# 						if Creator.isSpaceAdmin(spaceId, @userId)
# 							if key is 'spaces'
# 								delete createQuery.query._id
# 							else
# 								delete createQuery.query.space
# 						else
# 							user_spaces = Creator.getCollection("space_users").find({user: @userId}, {fields: {space: 1}}).fetch()
# 							if key is 'spaces'
# 								# space 对所有用户记录为只读
# 								delete createQuery.query._id
# 								# createQuery.query._id = {$in: _.pluck(user_spaces, 'space')}
# 							else
# 								createQuery.query.space = {$in: _.pluck(user_spaces, 'space')}

# 					if not createQuery.sort or !_.size(createQuery.sort)
# 						createQuery.sort = { modified: -1 }
# 					is_enterprise = Steedos.isLegalVersion(spaceId,"workflow.enterprise")
# 					is_professional = Steedos.isLegalVersion(spaceId,"workflow.professional")
# 					is_standard = Steedos.isLegalVersion(spaceId,"workflow.standard")
# 					if createQuery.limit
# 						limit = createQuery.limit
# 						if is_enterprise and limit>100000
# 							createQuery.limit = 100000
# 						else if is_professional and limit>10000 and !is_enterprise
# 							createQuery.limit = 10000
# 						else if is_standard and limit>1000 and !is_professional and !is_enterprise
# 							createQuery.limit = 1000
# 					else
# 						if is_enterprise
# 							createQuery.limit = 100000
# 						else if is_professional and !is_enterprise
# 							createQuery.limit = 10000
# 						else if is_standard and !is_enterprise and !is_professional
# 							createQuery.limit = 1000
# 					unreadable_fields = permissions.unreadable_fields || []
# 					if createQuery.projection
# 						projection = {}
# 						_.keys(createQuery.projection).forEach (key)->
# 							if _.indexOf(unreadable_fields, key) < 0
# 								#if not ((fields[key]?.type == 'lookup' or fields[key]?.type == 'master_detail') and fields[key].multiple)
# 								projection[key] = 1
# 						createQuery.projection = projection
# 					if not createQuery.projection or !_.size(createQuery.projection)
# 						readable_fields = Creator.getFields(key, spaceId, @userId)
# 						fields = Creator.getObject(key, spaceId).fields
# 						_.each readable_fields, (field)->
# 							if field.indexOf('$') < 0
# 								#if fields[field]?.multiple!= true
# 								createQuery.projection[field] = 1
# 					if not permissions.viewAllRecords && !permissions.viewCompanyRecords
# 						if object.enable_share
# 							# 满足共享规则中的记录也要搜索出来
# 							delete createQuery.query.owner
# 							shares = []
# 							orgs = Steedos.getUserOrganizations(spaceId, @userId, true)
# 							shares.push {"owner": @userId}
# 							shares.push { "sharing.u": @userId }
# 							shares.push { "sharing.o": { $in: orgs } }
# 							createQuery.query["$or"] = shares
# 						else
# 							createQuery.query.owner = @userId
# 					entities = []

# 					excludeDeleted(createQuery.query)

# 					if @queryParams.$top isnt '0'
# 						entities = collection.find(createQuery.query, visitorParser(createQuery)).fetch()
# 					scannedCount = collection.find(createQuery.query,{fields:{_id: 1}}).count()
# 					if entities
# 						dealWithExpand(createQuery, entities, key, spaceId)
# 						#scannedCount = entities.length
# 						body = {}
# 						headers = {}
# 						body['@odata.context'] = SteedosOData.getODataContextPath(spaceId, key)
# 					#	body['@odata.nextLink'] = SteedosOData.getODataNextLinkPath(spaceId,key)+"?%24skip="+ 10
# 						body['@odata.count'] = scannedCount
# 						entities_OdataProperties = setOdataProperty(entities,spaceId, key)
# 						body['value'] = entities_OdataProperties
# 						headers['Content-type'] = 'application/json;odata.metadata=minimal;charset=utf-8'
# 						headers['OData-Version'] = SteedosOData.VERSION
# 						{body: body, headers: headers}
# 					else
# 						return{
# 							statusCode: 404
# 							body: setErrorMessage(404,collection,key)
# 						}
# 				else
# 					return{
# 						statusCode: 403
# 						body: setErrorMessage(403,collection,key,"get")
# 					}
# 			catch e
# 				return handleError e

# 		post: ()->
# 			try
# 				key = @urlParams.object_name
# 				spaceId = @urlParams.spaceId
# 				if not Creator.getObject(key, spaceId)?.enable_api
# 					return {
# 						statusCode: 401
# 						body:setErrorMessage(401)
# 				}

# 				collection = Creator.getCollection(key, spaceId)
# 				if not collection
# 					return {
# 						statusCode: 404
# 						body:setErrorMessage(404,collection,key)
# 					}
# 				permissions = Creator.getObjectPermissions(spaceId, @userId, key)
# 				if permissions.allowCreate
# 					@bodyParams.space = spaceId
# 					if spaceId is 'guest'
# 						delete @bodyParams.space
# 					entityId = collection.insert @bodyParams
# 					entity = collection.findOne entityId
# 					entities = []
# 					if entity
# 						body = {}
# 						headers = {}
# 						entities.push entity
# 						body['@odata.context'] = SteedosOData.getODataContextPath(spaceId, key) + '/$entity'
# 						entity_OdataProperties = setOdataProperty(entities,spaceId, key)
# 						body['value'] = entity_OdataProperties
# 						headers['Content-type'] = 'application/json;odata.metadata=minimal;charset=utf-8'
# 						headers['OData-Version'] = SteedosOData.VERSION
# 						{body: body, headers: headers}
# 					else
# 						return{
# 							statusCode: 404
# 							body: setErrorMessage(404,collection,key,'post')
# 						}
# 				else
# 					return{
# 						statusCode: 403
# 						body: setErrorMessage(403,collection,key,'post')
# 					}
# 			catch e
# 				return handleError e

# 	})
# 	SteedosOdataAPI.addRoute(':object_name/recent', {authRequired: true, spaceRequired: false}, {
# 		get:()->
# 			try
# 				key = @urlParams.object_name
# 				object = Creator.getObject(key, @urlParams.spaceId)
# 				if not object?.enable_api
# 					return{
# 						statusCode: 401
# 						body: setErrorMessage(401)
# 					}
# 				collection = Creator.getCollection(key, @urlParams.spaceId)
# 				if not collection
# 					return {
# 						statusCode: 404
# 						body: setErrorMessage(404,collection,key)
# 					}
# 				permissions = Creator.getObjectPermissions(@urlParams.spaceId, @userId, key)
# 				if permissions.allowRead
# 					recent_view_collection = Creator.Collections["object_recent_viewed"]
# 					recent_view_selector = {"record.o":key,created_by:@userId}
# 					recent_view_options = {}
# 					recent_view_options.sort = {created: -1}
# 					recent_view_options.fields = {record:1}
# 					recent_view_records = recent_view_collection.find(recent_view_selector,recent_view_options).fetch()
# 					recent_view_records_ids = _.pluck(recent_view_records,'record')
# 					recent_view_records_ids = recent_view_records_ids.getProperty("ids")
# 					recent_view_records_ids = _.flatten(recent_view_records_ids)
# 					recent_view_records_ids = _.uniq(recent_view_records_ids)
# 					removeInvalidMethod(@queryParams)
# 					qs = decodeURIComponent(querystring.stringify(@queryParams))
# 					createQuery = if qs then odataV4Mongodb.createQuery(qs) else odataV4Mongodb.createQuery()
# 					if key is 'cfs.files.filerecord'
# 						createQuery.query['metadata.space'] = @urlParams.spaceId
# 					else
# 						createQuery.query.space = @urlParams.spaceId
# 					if not createQuery.limit
# 						createQuery.limit = 100
# 					if createQuery.limit and recent_view_records_ids.length>createQuery.limit
# 						recent_view_records_ids = _.first(recent_view_records_ids,createQuery.limit)
# 					createQuery.query._id = {$in:recent_view_records_ids}
# 					unreadable_fields = permissions.unreadable_fields || []
# 					if createQuery.projection
# 						projection = {}
# 						_.keys(createQuery.projection).forEach (key)->
# 							if _.indexOf(unreadable_fields, key) < 0
# 								# if not ((fields[key]?.type == 'lookup' or fields[key]?.type == 'master_detail') and fields[key].multiple)
# 								projection[key] = 1
# 						createQuery.projection = projection
# 					if not createQuery.projection or !_.size(createQuery.projection)
# 						readable_fields = Creator.getFields(key, @urlParams.spaceId, @userId)
# 						fields = Creator.getObject(key, @urlParams.spaceId).fields
# 						_.each readable_fields, (field)->
# 							if field.indexOf('$') < 0
# 								#if fields[field]?.multiple!= true
# 								createQuery.projection[field] = 1

# 					excludeDeleted(createQuery.query)

# 					if @queryParams.$top isnt '0'
# 						entities = collection.find(createQuery.query, visitorParser(createQuery)).fetch()
# 					entities_index = []
# 					entities_ids = _.pluck(entities,'_id')
# 					sort_entities = []
# 					if not createQuery.sort or !_.size(createQuery.sort)
# 						_.each recent_view_records_ids ,(recent_view_records_id)->
# 							index = _.indexOf(entities_ids,recent_view_records_id)
# 							if index>-1
# 								sort_entities.push entities[index]
# 					else
# 						sort_entities = entities
# 					if sort_entities
# 						dealWithExpand(createQuery, sort_entities, key, @urlParams.spaceId)
# 						body = {}
# 						headers = {}
# 						body['@odata.context'] = SteedosOData.getODataContextPath(@urlParams.spaceId, key)
# 					#	body['@odata.nextLink'] = SteedosOData.getODataNextLinkPath(@urlParams.spaceId,key)+"?%24skip="+ 10
# 						body['@odata.count'] = sort_entities.length
# 						entities_OdataProperties = setOdataProperty(sort_entities,@urlParams.spaceId, key)
# 						body['value'] = entities_OdataProperties
# 						headers['Content-type'] = 'application/json;odata.metadata=minimal;charset=utf-8'
# 						headers['OData-Version'] = SteedosOData.VERSION
# 						{body: body, headers: headers}
# 					else
# 						return{
# 							statusCode: 404
# 							body: setErrorMessage(404,collection,key,'get')
# 						}
# 				else
# 					return{
# 						statusCode: 403
# 						body: setErrorMessage(403,collection,key,'get')
# 					}
# 			catch e
# 				return handleError e
# })

# 	SteedosOdataAPI.addRoute(':object_name/:_id', {authRequired: true, spaceRequired: false}, {
# 		post: ()->
# 			try
# 				key = @urlParams.object_name
# 				if not Creator.getObject(key, @urlParams.spaceId)?.enable_api
# 					return{
# 						statusCode: 401
# 						body: setErrorMessage(401)
# 					}
# 				collection = Creator.getCollection(key, @urlParams.spaceId)
# 				if not collection
# 					return{
# 						statusCode: 404
# 						body: setErrorMessage(404,collection,key)
# 					}
# 				permissions = Creator.getObjectPermissions(@urlParams.spaceId, @userId, key)
# 				if permissions.allowCreate
# 					@bodyParams.space = @urlParams.spaceId
# 					entityId = collection.insert @bodyParams
# 					entity = collection.findOne entityId
# 					entities = []
# 					if entity
# 						body = {}
# 						headers = {}
# 						entities.push entity
# 						body['@odata.context'] = SteedosOData.getODataContextPath(@urlParams.spaceId, key) + '/$entity'
# 						entity_OdataProperties = setOdataProperty(entities,@urlParams.spaceId, key)
# 						body['value'] = entity_OdataProperties
# 						headers['Content-type'] = 'application/json;odata.metadata=minimal;charset=utf-8'
# 						headers['OData-Version'] = SteedosOData.VERSION
# 						{body: body, headers: headers}
# 					else
# 						return{
# 							statusCode: 404
# 							body: setErrorMessage(404,collection,key,'post')
# 						}
# 				else
# 					return{
# 						statusCode: 403
# 						body: setErrorMessage(403,collection,key,'post')
# 					}
# 			catch e
# 				return handleError e
# 		get:()->
# 			key = @urlParams.object_name
# 			if key.indexOf("(") > -1
# 				body = {}
# 				headers = {}
# 				collectionInfo = key
# 				fieldName = @urlParams._id.split('_expand')[0]
# 				collectionInfoSplit = collectionInfo.split('(')
# 				collectionName = collectionInfoSplit[0]
# 				id = collectionInfoSplit[1].split('\'')[1]

# 				collection = Creator.getCollection(collectionName, @urlParams.spaceId)
# 				fieldsOptions = {}
# 				fieldsOptions[fieldName] = 1
# 				entity = collection.findOne({_id: id}, {fields: fieldsOptions})

# 				fieldValue = null
# 				if entity
# 					fieldValue = entity[fieldName]

# 				obj = Creator.getObject(collectionName, @urlParams.spaceId)
# 				field = obj.fields[fieldName]

# 				if field and fieldValue and (field.type is 'lookup' or field.type is 'master_detail')
# 					lookupCollection = Creator.getCollection(field.reference_to, @urlParams.spaceId)
# 					queryOptions = {fields: {}}
# 					readable_fields = Creator.getFields(field.reference_to, @urlParams.spaceId, @userId)
# 					_.each readable_fields, (f)->
# 						if f.indexOf('$') < 0
# 							queryOptions.fields[f] = 1

# 					if field.multiple
# 						values = []
# 						lookupCollection.find({_id: {$in: fieldValue}}, queryOptions).forEach (obj)->
# 							_.each obj, (v, k)->
# 								if _.isArray(v) || (_.isObject(v) && !_.isDate(v))
# 									obj[k] = JSON.stringify(v)
# 							values.push(obj)
# 						body['value'] = values
# 						body['@odata.context'] = SteedosOData.getMetaDataPath(@urlParams.spaceId) + "##{collectionInfo}/#{@urlParams._id}"
# 					else
# 						body = lookupCollection.findOne({_id: fieldValue}, queryOptions) || {}
# 						_.each body, (v, k)->
# 							if _.isArray(v) || (_.isObject(v) && !_.isDate(v))
# 								body[k] = JSON.stringify(v)
# 						body['@odata.context'] = SteedosOData.getMetaDataPath(@urlParams.spaceId) + "##{field.reference_to}/$entity"

# 				else
# 					body['@odata.context'] = SteedosOData.getMetaDataPath(@urlParams.spaceId) + "##{collectionInfo}/#{@urlParams._id}"
# 					body['value'] = fieldValue

# 				headers['Content-type'] = 'application/json;odata.metadata=minimal;charset=utf-8'
# 				headers['OData-Version'] = SteedosOData.VERSION

# 				{body: body, headers: headers}
# 			else
# 				try
# 					object = Creator.getObject(key, @urlParams.spaceId)
# 					if not object?.enable_api
# 						return {
# 							statusCode: 401
# 							body: setErrorMessage(401)
# 						}
# 					collection = Creator.getCollection(key, @urlParams.spaceId)
# 					if not collection
# 						return{
# 							statusCode: 404
# 							body: setErrorMessage(404,collection,key)
# 						}

# 					permissions = Creator.getObjectPermissions(@urlParams.spaceId, @userId, key)
# 					if permissions.allowRead
# 						unreadable_fields = permissions.unreadable_fields || []
# 						removeInvalidMethod(@queryParams)
# 						qs = decodeURIComponent(querystring.stringify(@queryParams))
# 						createQuery = if qs then odataV4Mongodb.createQuery(qs) else odataV4Mongodb.createQuery()
# 						createQuery.query._id =  @urlParams._id
# 						if key is 'cfs.files.filerecord'
# 							createQuery.query['metadata.space'] = @urlParams.spaceId
# 						else if key != 'spaces'
# 							createQuery.query.space =  @urlParams.spaceId
# 						unreadable_fields = permissions.unreadable_fields || []
# 						if createQuery.projection
# 							projection = {}
# 							_.keys(createQuery.projection).forEach (key)->
# 								if _.indexOf(unreadable_fields, key) < 0
# 									# if not ((fields[key]?.type == 'lookup' or fields[key]?.type == 'master_detail') and fields[key].multiple)
# 									projection[key] = 1
# 							createQuery.projection = projection
# 						if not createQuery.projection or !_.size(createQuery.projection)
# 							readable_fields = Creator.getFields(key, @urlParams.spaceId, @userId)
# 							fields = object.fields
# 							_.each readable_fields, (field) ->
# 								if field.indexOf('$') < 0
# 									createQuery.projection[field] = 1
# 						entity = collection.findOne(createQuery.query,visitorParser(createQuery))
# 						entities = []
# 						if entity
# 							isAllowed = entity.owner == @userId or permissions.viewAllRecords or (permissions.viewCompanyRecords && isSameCompany(@urlParams.spaceId, @userId, entity.company_id))
# 							if object.enable_share and !isAllowed
# 								shares = []
# 								orgs = Steedos.getUserOrganizations(@urlParams.spaceId, @userId, true)
# 								shares.push { "sharing.u": @userId }
# 								shares.push { "sharing.o": { $in: orgs } }
# 								isAllowed = collection.findOne({ _id: @urlParams._id, "$or": shares }, { fields: { _id: 1 } })
# 							if isAllowed
# 								body = {}
# 								headers = {}
# 								entities.push entity
# 								dealWithExpand(createQuery, entities, key, @urlParams.spaceId)
# 								body['@odata.context'] = SteedosOData.getODataContextPath(@urlParams.spaceId, key) + '/$entity'
# 								entity_OdataProperties = setOdataProperty(entities,@urlParams.spaceId, key)
# 								_.extend body,entity_OdataProperties[0]
# 								headers['Content-type'] = 'application/json;odata.metadata=minimal;charset=utf-8'
# 								headers['OData-Version'] = SteedosOData.VERSION
# 								{body: body, headers: headers}
# 							else
# 								return{
# 									statusCode: 403
# 									body: setErrorMessage(403,collection,key,'get')
# 								}
# 						else
# 							return{
# 								statusCode: 404
# 								body: setErrorMessage(404,collection,key,'get')
# 							}
# 					else
# 						return{
# 							statusCode: 403
# 							body: setErrorMessage(403,collection,key,'get')
# 						}
# 				catch e
# 					return handleError e

# 		put:()->
# 			try
# 				key = @urlParams.object_name
# 				object = Creator.getObject(key, @urlParams.spaceId)
# 				if not object?.enable_api
# 					return{
# 						statusCode: 401
# 						body: setErrorMessage(401)
# 					}

# 				collection = Creator.getCollection(key, @urlParams.spaceId)
# 				if not collection
# 					return{
# 						statusCode: 404
# 						body: setErrorMessage(404,collection,key)
# 					}
# 				spaceId = @urlParams.spaceId
# 				permissions = Creator.getObjectPermissions(spaceId, @userId, key)
# 				if key == "users"
# 					record_owner = @urlParams._id
# 				else
# 					record_owner = collection.findOne({ _id: @urlParams._id }, { fields: { owner: 1 } })?.owner

# 				companyId = collection.findOne({ _id: @urlParams._id }, { fields: { company_id: 1 } })?.company_id

# 				isAllowed = permissions.modifyAllRecords or (permissions.allowEdit and record_owner == @userId ) or (permissions.modifyCompanyRecords && isSameCompany(spaceId, @userId, companyId))
# 				if isAllowed
# 					checkGlobalRecord(collection, @urlParams._id, object)
# 					selector = {_id: @urlParams._id, space: spaceId}
# 					if spaceId is 'guest' or spaceId is 'common' or key == "users"
# 						delete selector.space
# 					fields_editable = true
# 					_.keys(@bodyParams.$set).forEach (key)->
# 						if _.indexOf(permissions.uneditable_fields, key) > -1
# 							fields_editable = false
# 					if fields_editable
# 						if key is 'spaces'
# 							delete selector.space
# 						entityIsUpdated = collection.update selector, @bodyParams
# 						if entityIsUpdated
# 							#statusCode: 201
# 							# entity = collection.findOne @urlParams._id
# 							# entities = []
# 							# body = {}
# 							headers = {}
# 							body = {}
# 							# entities.push entity
# 							# body['@odata.context'] = SteedosOData.getODataContextPath(spaceId, key) + '/$entity'
# 							# entity_OdataProperties = setOdataProperty(entities,spaceId, key)
# 							# _.extend body,entity_OdataProperties[0]
# 							headers['Content-type'] = 'application/json;odata.metadata=minimal;charset=utf-8'
# 							headers['OData-Version'] = SteedosOData.VERSION
# 							{headers: headers,body:body}
# 						else
# 							return{
# 								statusCode: 404
# 								body: setErrorMessage(404,collection,key)
# 							}
# 					else
# 						return{
# 							statusCode: 403
# 							body: setErrorMessage(403,collection,key,'put')
# 						}
# 				else
# 					return{
# 						statusCode: 403
# 						body: setErrorMessage(403,collection,key,'put')
# 					}
# 			catch e
# 				return handleError e
# 		delete:()->
# 			try
# 				key = @urlParams.object_name
# 				object = Creator.getObject(key, @urlParams.spaceId)
# 				if not object?.enable_api
# 					return{
# 						statusCode: 401
# 						body: setErrorMessage(401)
# 						}

# 				collection = Creator.getCollection(key, @urlParams.spaceId)
# 				if not collection
# 					return{
# 						statusCode: 404
# 						body: setErrorMessage(404,collection,key)
# 					}
# 				spaceId = @urlParams.spaceId
# 				permissions = Creator.getObjectPermissions(@urlParams.spaceId, @userId, key)
# 				recordData = collection.findOne({_id: @urlParams._id}, { fields: { owner: 1, company_id: 1 } })
# 				record_owner = recordData?.owner
# 				companyId = recordData?.company_id
# 				isAllowed = (permissions.modifyAllRecords and permissions.allowDelete) or (permissions.modifyCompanyRecords and permissions.allowDelete and isSameCompany(spaceId, @userId, companyId)) or (permissions.allowDelete and record_owner==@userId )
# 				if isAllowed
# 					checkGlobalRecord(collection, @urlParams._id, object)
# 					selector = {_id: @urlParams._id, space: spaceId}
# 					if spaceId is 'guest'
# 						delete selector.space

# 					if object?.enable_trash
# 						entityIsUpdated = collection.update(selector, {
# 							$set: {
# 								is_deleted: true,
# 								deleted: new Date(),
# 								deleted_by: @userId
# 							}
# 						})
# 						if entityIsUpdated
# 							headers = {}
# 							body = {}
# 							headers['Content-type'] = 'application/json;odata.metadata=minimal;charset=utf-8'
# 							headers['OData-Version'] = SteedosOData.VERSION
# 							{headers: headers,body:body}
# 						else
# 							return{
# 								statusCode: 404
# 								body: setErrorMessage(404,collection,key)
# 							}
# 					else
# 						if collection.remove selector
# 							headers = {}
# 							body = {}
# 							# entities.push entity
# 							# body['@odata.context'] = SteedosOData.getODataContextPath(spaceId, key) + '/$entity'
# 							# entity_OdataProperties = setOdataProperty(entities,spaceId, key)
# 							# _.extend body,entity_OdataProperties[0]
# 							headers['Content-type'] = 'application/json;odata.metadata=minimal;charset=utf-8'
# 							headers['OData-Version'] = SteedosOData.VERSION
# 							{headers: headers,body:body}
# 						else
# 							return{
# 								statusCode: 404
# 								body: setErrorMessage(404,collection,key)
# 							}
# 				else
# 					return {
# 						statusCode: 403
# 						body: setErrorMessage(403,collection,key)
# 					}
# 			catch e
# 				return handleError e
# 	})

# 	# _id可传all
# 	SteedosOdataAPI.addRoute(':object_name/:_id/:methodName', {authRequired: true, spaceRequired: false}, {
# 		post: ()->
# 			try
# 				key = @urlParams.object_name
# 				if not Creator.getObject(key, @urlParams.spaceId)?.enable_api
# 					return{
# 						statusCode: 401
# 						body: setErrorMessage(401)
# 					}
# 				collection = Creator.getCollection(key, @urlParams.spaceId)
# 				if not collection
# 					return{
# 						statusCode: 404
# 						body: setErrorMessage(404,collection,key)
# 					}

# 				permissions = Creator.getObjectPermissions(@urlParams.spaceId, @userId, key)
# 				if permissions.allowRead
# 					methodName = @urlParams.methodName
# 					methods = Creator.Objects[key]?.methods || {}
# 					if methods.hasOwnProperty(methodName)
# 						thisObj = {
# 							object_name: key
# 							record_id: @urlParams._id
# 							space_id: @urlParams.spaceId
# 							user_id: @userId
# 							permissions: permissions
# 						}
# 						return methods[methodName].apply(thisObj, [@bodyParams]) || {}
# 					else
# 						return {
# 							statusCode: 404
# 							body: setErrorMessage(404,collection,key)
# 						}
# 				else
# 					return {
# 						statusCode: 403
# 						body: setErrorMessage(403,collection,key)
# 					}
# 			catch e
# 				return handleError e

# 	})

# 	#TODO remove
# 	_.each [], (value, key, list)-> #Creator.Collections
# 		if not Creator.getObject(key)?.enable_api
# 			return

# 		if SteedosOdataAPI

# 			SteedosOdataAPI.addCollection Creator.getCollection(key),
# 				excludedEndpoints: []
# 				routeOptions:
# 					authRequired: true
# 					spaceRequired: false
# 				endpoints:
# 					getAll:
# 						action: ->
# 							collection = Creator.getCollection(key)
# 							if not collection
# 								statusCode: 404
# 								body: {status: 'fail', message: 'Collection not found'}

# 							permissions = Creator.getObjectPermissions(@urlParams.spaceId, @userId, key)
# 							if permissions.viewAllRecords or (permissions.allowRead and @userId)
# 									removeInvalidMethod(@queryParams)
# 									qs = decodeURIComponent(querystring.stringify(@queryParams))
# 									createQuery = if qs then odataV4Mongodb.createQuery(qs) else odataV4Mongodb.createQuery()

# 									if key is 'cfs.files.filerecord'
# 										createQuery.query['metadata.space'] = @urlParams.spaceId
# 									else
# 										createQuery.query.space = @urlParams.spaceId

# 									if not permissions.viewAllRecords
# 										createQuery.query.owner = @userId

# 									entities = []
# 									if @queryParams.$top isnt '0'
# 										entities = collection.find(createQuery.query, visitorParser(createQuery)).fetch()
# 									scannedCount = collection.find(createQuery.query).count()

# 									if entities
# 										dealWithExpand(createQuery, entities, key, @urlParams.spaceId)

# 										body = {}
# 										headers = {}
# 										body['@odata.context'] = SteedosOData.getODataContextPath(@urlParams.spaceId, key)
# 										body['@odata.count'] = scannedCount
# 										body['value'] = entities
# 										headers['Content-type'] = 'application/json;odata.metadata=minimal;charset=utf-8'
# 										headers['OData-Version'] = SteedosOData.VERSION
# 										{body: body, headers: headers}
# 									else
# 										statusCode: 404
# 										body: {status: 'fail', message: 'Unable to retrieve items from collection'}
# 							else
# 								statusCode: 400
# 								body: {status: 'fail', message: 'Action not permitted'}
# 					post:
# 						action: ->
# 							collection = Creator.getCollection(key)
# 							if not collection
# 								statusCode: 404
# 								body: {status: 'fail', message: 'Collection not found'}

# 							permissions = Creator.getObjectPermissions(@spaceId, @userId, key)
# 							if permissions.allowCreate
# 									@bodyParams.space = @spaceId
# 									entityId = collection.insert @bodyParams
# 									entity = collection.findOne entityId
# 									if entity
# 										statusCode: 201
# 										{status: 'success', value: entity}
# 									else
# 										statusCode: 404
# 										body: {status: 'fail', message: 'No item added'}
# 							else
# 								statusCode: 400
# 								body: {status: 'fail', message: 'Action not permitted'}
# 					get:
# 						action: ->
# 							collection = Creator.getCollection(key)
# 							if not collection
# 								statusCode: 404
# 								body: {status: 'fail', message: 'Collection not found'}

# 							permissions = Creator.getObjectPermissions(@spaceId, @userId, key)
# 							if permissions.allowRead
# 									selector = {_id: @urlParams.id, space: @spaceId}
# 									entity = collection.findOne selector
# 									if entity
# 										{status: 'success', value: entity}
# 									else
# 										statusCode: 404
# 										body: {status: 'fail', message: 'Item not found'}
# 							else
# 								statusCode: 400
# 								body: {status: 'fail', message: 'Action not permitted'}
# 					put:
# 						action: ->
# 							collection = Creator.getCollection(key)
# 							if not collection
# 								statusCode: 404
# 								body: {status: 'fail', message: 'Collection not found'}

# 							permissions = Creator.getObjectPermissions(@spaceId, @userId, key)
# 							if permissions.allowEdit
# 									selector = {_id: @urlParams.id, space: @spaceId}
# 									entityIsUpdated = collection.update selector, $set: @bodyParams
# 									if entityIsUpdated
# 										entity = collection.findOne @urlParams.id
# 										{status: 'success', value: entity}
# 									else
# 										statusCode: 404
# 										body: {status: 'fail', message: 'Item not found'}
# 							else
# 								statusCode: 400
# 								body: {status: 'fail', message: 'Action not permitted'}
# 					delete:
# 						action: ->
# 							collection = Creator.getCollection(key)
# 							if not collection
# 								statusCode: 404
# 								body: {status: 'fail', message: 'Collection not found'}

# 							permissions = Creator.getObjectPermissions(@spaceId, @userId, key)
# 							if permissions.allowDelete
# 									selector = {_id: @urlParams.id, space: @spaceId}
# 									if collection.remove selector
# 										{status: 'success', message: 'Item removed'}
# 									else
# 										statusCode: 404
# 										body: {status: 'fail', message: 'Item not found'}
# 							else
# 								statusCode: 400
# 								body: {status: 'fail', message: 'Action not permitted'}
