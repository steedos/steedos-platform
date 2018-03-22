Meteor.startup ->

	odataV4Mongodb = Npm.require 'odata-v4-mongodb'
	querystring = Npm.require 'querystring'

	visitorParser = (visitor)->
		parsedOpt = {}

		if visitor.projection
			parsedOpt.fields = visitor.projection

		if visitor.hasOwnProperty('limit')
			parsedOpt.limit = visitor.limit

		if visitor.hasOwnProperty('skip')
			parsedOpt.skip = visitor.skip

		if visitor.sort
			parsedOpt.sort = visitor.sort

		parsedOpt

	dealWithExpand = (createQuery, entities, key,action)->
		if _.isEmpty createQuery.includes
			return

		obj = Creator.objectsByName[key]
		_.each createQuery.includes, (include)->
			# console.log 'include: ', include
			navigationProperty = include.navigationProperty
			# console.log 'navigationProperty: ', navigationProperty
			field = obj.fields[navigationProperty]
			if field and (field.type is 'lookup' or field.type is 'master_detail')
				if _.isFunction(field.reference_to)
					field.reference_to = field.reference_to()
				if field.reference_to
					queryOptions = visitorParser(include)
					if _.isString field.reference_to
						referenceToCollection = Creator.Collections[field.reference_to]
						_.each entities, (entity, idx)->
							if entity[navigationProperty]
								if field.multiple
									originalData = _.clone(entity[navigationProperty])
									multiQuery = _.extend {_id: {$in: entity[navigationProperty]}}, include.query
									entities[idx][navigationProperty] = referenceToCollection.find(multiQuery, queryOptions).fetch()
									if !entities[idx][navigationProperty].length
										entities[idx][navigationProperty] = originalData
									#排序
									entities[idx][navigationProperty] = Creator.getOrderlySetByIds(entities[idx][navigationProperty], originalData)
								else
									singleQuery = _.extend {_id: entity[navigationProperty]}, include.query

									# 特殊处理在相关表中没有找到数据的情况，返回原数据
									entities[idx][navigationProperty] = referenceToCollection.findOne(singleQuery, queryOptions) || entities[idx][navigationProperty]

					if _.isArray field.reference_to
						_.each entities, (entity, idx)->
							if entity[navigationProperty]?.ids
								referenceToCollection = Creator.Collections[entity[navigationProperty].o]
								if referenceToCollection
									if field.multiple
										_ids = _.clone(entity[navigationProperty].ids)
										multiQuery = _.extend {_id: {$in: entity[navigationProperty].ids}}, include.query
										entities[idx][navigationProperty] = _.map referenceToCollection.find(multiQuery, queryOptions).fetch(), (o)->
											o['reference_to.o'] = referenceToCollection._name
											return o
										#排序
										entities[idx][navigationProperty] = Creator.getOrderlySetByIds(entities[idx][navigationProperty], _ids)
									else
										singleQuery = _.extend {_id: entity[navigationProperty].ids[0]}, include.query
										entities[idx][navigationProperty] = referenceToCollection.findOne(singleQuery, queryOptions)
										entities[idx][navigationProperty]['reference_to.o'] = referenceToCollection._name

				else
				# TODO


		return

	setOdataProperty=(entities,space,key)->
		entities_OdataProperties = []
		_.each entities, (entity, idx)->
			entity_OdataProperties = {}
			id = entities[idx]["_id"]
			entity_OdataProperties['@odata.id'] = SteedosOData.getODataNextLinkPath(space,key)+ '(\'' + "#{id}" + '\')'
			entity_OdataProperties['@odata.etag'] = "W/\"08D589720BBB3DB1\""
			entity_OdataProperties['@odata.editLink'] = entity_OdataProperties['@odata.id']
			_.extend entity_OdataProperties,entity
			entities_OdataProperties.push entity_OdataProperties
		return entities_OdataProperties

	setErrorMessage = (statusCode,collection,key,action)->
		body = {}
		error = {}
		innererror = {}
		if statusCode == 404
			if collection
				if action == 'post'
					innererror['message'] = 'the record added fail.'
					innererror['type'] = 'Microsoft.OData.Core.UriParser.ODataUnrecognizedPathException'
					error['code'] = 'No item added'
					error['message'] = 'the record added fail'
				else
					innererror['message'] = 'the record does not exist for the given query.'
					innererror['type'] = 'Microsoft.OData.Core.UriParser.ODataUnrecognizedPathException'
					error['code'] = 'Record Not Found'
					error['message'] = 'the record does not exist for the given query.'
			else
				innererror['message'] = 'Collection not found for the segment '+ key
				innererror['type'] = 'Microsoft.OData.Core.UriParser.ODataUnrecognizedPathException'
				error['code'] = 'Collection Not Found'
				error['message'] = 'Collection not found for the segment '+ key
		if  statusCode == 401
			innererror['message'] = 'Authentication is required and has not been provided.'
			innererror['type'] = 'Microsoft.OData.Core.UriParser.ODataUnrecognizedPathException'
			error['code'] = 'Unauthorized'
			error['message'] = 'Authentication is required and has not been provided.'
		if statusCode == 403
			switch action
				when 'get' then innererror['message'] = 'User does not have privileges to access the entity'
				when 'post' then innererror['message'] = 'User does not have privileges to create the entity'
				when 'put' then innererror['message'] = 'User does not have privileges to update the entity'
				when 'delete' then innererror['message'] = 'User does not have privileges to remove the entity'
			innererror['message'] = 'User does not have privileges to access the entity'
			innererror['type'] = 'Microsoft.OData.Core.UriParser.ODataUnrecognizedPathException'
			error['code'] = 'Unauthorized'
			error['message'] = innererror['message']
		error['innererror'] = innererror
		body['error'] = error
		return body
	SteedosOdataAPI.addRoute(':object_name', {authRequired: true, spaceRequired: false}, {
		get: ()->
			key = @urlParams.object_name
			if not Creator.objectsByName[key]?.enable_api
				statusCode: 401
				body = setErrorMessage(401)
				return body

			collection = Creator.Collections[key]
			if not collection
				statusCode: 404
				body = setErrorMessage(404,collection,key)
				return body
			permissions = Creator.getObjectPermissions(@urlParams.spaceId, @userId, key)
			if permissions.viewAllRecords or (permissions.allowRead and @userId)
				qs = querystring.unescape(querystring.stringify(@queryParams))
				createQuery = if qs then odataV4Mongodb.createQuery(qs) else odataV4Mongodb.createQuery()

				if key is 'cfs.files.filerecord'
					createQuery.query['metadata.space'] = @urlParams.spaceId
				else if key is 'spaces'
					createQuery.query._id = @urlParams.spaceId
				else
					createQuery.query.space = @urlParams.spaceId

				if Creator.isCommonSpace(@urlParams.spaceId) && Creator.isSpaceAdmin(@urlParams.spaceId, @userId)
					delete createQuery.query.space

				if not createQuery.sort or !_.size(createQuery.sort)
					createQuery.sort = { modified: -1 }
				if not createQuery.limit
					if Steedos.isLegalVersion(@urlParams.spaceId,"workflow.professional")
						createQuery.limit = 10000
					else
						createQuery.limit = 1000
				if not createQuery.projection or !_.size(createQuery.projection)
					_.each permissions.readable_fields,(field)->
						createQuery.projection[field] = 1
				if not permissions.viewAllRecords
					createQuery.query.owner = @userId

				entities = []
				if @queryParams.$top isnt '0'
					entities = collection.find(createQuery.query, visitorParser(createQuery)).fetch()
				scannedCount = collection.find(createQuery.query).count()
				if entities
					dealWithExpand(createQuery, entities, key)
					body = {}
					headers = {}
					body['@odata.context'] = SteedosOData.getODataContextPath(@urlParams.spaceId, key)
				#	body['@odata.nextLink'] = SteedosOData.getODataNextLinkPath(@urlParams.spaceId,key)+"?%24skip="+ 10
					body['@odata.count'] = scannedCount
					entities_OdataProperties = setOdataProperty(entities,@urlParams.spaceId, key)
					body['value'] = entities_OdataProperties
					headers['Content-type'] = 'application/json;odata.metadata=minimal;charset=utf-8'
					headers['OData-Version'] = SteedosOData.VERSION
					{body: body, headers: headers}
				else
					statusCode: 404
					body  = setErrorMessage(404,collection,key)
			else
				statusCode: 403
				body  = setErrorMessage(403,collection,key,get)
		post: ()->
			key = @urlParams.object_name
			if not Creator.objectsByName[key]?.enable_api
				statusCode: 401
				body = setErrorMessage(401)
				return body

			collection = Creator.Collections[key]
			if not collection
				statusCode: 404
				body = setErrorMessage(404,collection,key)
				return body

			permissions = Creator.getObjectPermissions(@urlParams.spaceId, @userId, key)
			if permissions.allowCreate
				@bodyParams.space = @urlParams.spaceId
				entityId = collection.insert @bodyParams
				entity = collection.findOne entityId
				entities = []
				if entity
					body = {}
					headers = {}
					entities.push entity
					body['@odata.context'] = SteedosOData.getODataContextPath(@urlParams.spaceId, key) + '/$entity'
					entity_OdataProperties = setOdataProperty(entities,@urlParams.spaceId, key)
					body['value'] = entity_OdataProperties
					headers['Content-type'] = 'application/json;odata.metadata=minimal;charset=utf-8'
					headers['OData-Version'] = SteedosOData.VERSION
					{body: body, headers: headers}
				else
					statusCode: 404
					body = setErrorMessage(404,collection,key,post)
			else
				statusCode: 403
				body  = setErrorMessage(403,collection,key,post)
	})
	SteedosOdataAPI.addRoute(':object_name/recent', {authRequired: true, spaceRequired: false}, {
		get:()->
			key = @urlParams.object_name
			if not Creator.objectsByName[key]?.enable_api
				statusCode: 401
				body = setErrorMessage(401)
				return body
			collection = Creator.Collections[key]
			if not collection
				statusCode: 404
				body = setErrorMessage(404,collection,key)
				return body
			permissions = Creator.getObjectPermissions(@urlParams.spaceId, @userId, key)
			if permissions.allowRead
				recent_view_collection = Creator.Collections["object_recent_viewed"]
				recent_view_selector = {object_name:key,created_by:@userId}
				recent_view_options = {}
				recent_view_options.sort = {created: -1}
				recent_view_options.fields = {record_id:1}
				recent_view_records = recent_view_collection.find(recent_view_selector,recent_view_options).fetch()
				recent_view_records_ids = _.pluck(recent_view_records,'record_id')
				recent_view_records_ids = _.uniq(recent_view_records_ids)
				qs = querystring.unescape(querystring.stringify(@queryParams))
				createQuery = if qs then odataV4Mongodb.createQuery(qs) else odataV4Mongodb.createQuery()
				createQuery.query._id = {$in:recent_view_records_ids}
				if key is 'cfs.files.filerecord'
					createQuery.query['metadata.space'] = @urlParams.spaceId
				else
					createQuery.query.space = @urlParams.spaceId
				if not createQuery.limit
					createQuery.limit = 100
				if @queryParams.$top isnt '0'
					entities = collection.find(createQuery.query, visitorParser(createQuery)).fetch()
				entities_index = []
				entities_ids = _.pluck(entities,'_id')
				sort_entities = []
				_.each recent_view_records_ids ,(recent_view_records_id)->
					index = _.indexOf(entities_ids,recent_view_records_id)
					if index>-1
						sort_entities.push entities[index]
				#console.log "sort_entities=====",sort_entities
				if sort_entities
					dealWithExpand(createQuery, sort_entities, key)
					body = {}
					headers = {}
					body['@odata.context'] = SteedosOData.getODataContextPath(@urlParams.spaceId, key)
				#	body['@odata.nextLink'] = SteedosOData.getODataNextLinkPath(@urlParams.spaceId,key)+"?%24skip="+ 10
					body['@odata.count'] = sort_entities.length
					entities_OdataProperties = setOdataProperty(sort_entities,@urlParams.spaceId, key)
					body['value'] = entities_OdataProperties
					headers['Content-type'] = 'application/json;odata.metadata=minimal;charset=utf-8'
					headers['OData-Version'] = SteedosOData.VERSION
					{body: body, headers: headers}
				else
					statusCode: 404
					body  = setErrorMessage(404,collection,key,'get')
			else
				statusCode: 403
				body  = setErrorMessage(403,collection,key,'get')
	})

	SteedosOdataAPI.addRoute(':object_name/:_id', {authRequired: true, spaceRequired: false}, {
		post: ()->
			key = @urlParams.object_name
			if not Creator.objectsByName[key]?.enable_api
				statusCode: 401
				body = setErrorMessage(401)
				return body
			collection = Creator.Collections[key]
			if not collection
				statusCode: 404
				body = setErrorMessage(404,collection,key)
				return body

			permissions = Creator.getObjectPermissions(@urlParams.spaceId, @userId, key)
			if permissions.allowCreate
				@bodyParams.space = @urlParams.spaceId
				entityId = collection.insert @bodyParams
				entity = collection.findOne entityId
				entities = []
				if entity
					body = {}
					headers = {}
					entities.push entity
					body['@odata.context'] = SteedosOData.getODataContextPath(@urlParams.spaceId, key) + '/$entity'
					entity_OdataProperties = setOdataProperty(entities,@urlParams.spaceId, key)
					body['value'] = entity_OdataProperties
					headers['Content-type'] = 'application/json;odata.metadata=minimal;charset=utf-8'
					headers['OData-Version'] = SteedosOData.VERSION
					{body: body, headers: headers}
				else
					statusCode: 404
					body = setErrorMessage(404,collection,key,post)
			else
				statusCode: 403
				body  = setErrorMessage(403,collection,key,post)
		get:()->
			console.log "@urlParams", @urlParams

			key = @urlParams.object_name

			if key.indexOf("(") > -1
				body = {}
				headers = {}
				collectionInfo = key
				fieldName = @urlParams._id.split('_expand')[0]
				collectionInfoSplit = collectionInfo.split('(')
				collectionName = collectionInfoSplit[0]
				id = collectionInfoSplit[1].split('\'')[1]

				collection = Creator.Collections[collectionName]
				fieldsOptions = {}
				fieldsOptions[fieldName] = 1
				entity = collection.findOne({_id: id}, {fields: fieldsOptions})

				fieldValue = null
				if entity
					fieldValue = entity[fieldName]

				obj = Creator.objectsByName[collectionName]
				field = obj.fields[fieldName]

				if field  and fieldValue and (field.type is 'lookup' or field.type is 'master_detail')
					lookupCollection = Creator.Collections[field.reference_to]
					lookupObj = Creator.objectsByName[field.reference_to]
					queryOptions = {fields: {}}
					_.each lookupObj.fields, (v, k)->
						queryOptions.fields[k] = 1

					if field.multiple
						body['value'] = lookupCollection.find({_id: {$in: fieldValue}}, queryOptions).fetch()
						body['@odata.context'] = SteedosOData.getMetaDataPath(@urlParams.spaceId) + "##{collectionInfo}/#{@urlParams._id}"
					else
						body = lookupCollection.findOne({_id: fieldValue}, queryOptions) || {}
						body['@odata.context'] = SteedosOData.getMetaDataPath(@urlParams.spaceId) + "##{field.reference_to}/$entity"

				else
					body['@odata.context'] = SteedosOData.getMetaDataPath(@urlParams.spaceId) + "##{collectionInfo}/#{@urlParams._id}"
					body['value'] = fieldValue

				headers['Content-type'] = 'application/json;odata.metadata=minimal;charset=utf-8'
				headers['OData-Version'] = SteedosOData.VERSION

				{body: body, headers: headers}
			else

				if not Creator.objectsByName[key]?.enable_api
					statusCode: 401
					body = setErrorMessage(401)
					return body

				collection = Creator.Collections[key]
				if not collection
					statusCode: 404
					body = setErrorMessage(404,collection,key)
					return body

				permissions = Creator.getObjectPermissions(@urlParams.spaceId, @userId, key)
				if permissions.allowRead
						selector = {_id: @urlParams._id, space: @urlParams.spaceId}
						entity = collection.findOne selector
						entities = []
						if entity
							body = {}
							headers = {}
							entities.push entity
							body['@odata.context'] = SteedosOData.getODataContextPath(@urlParams.spaceId, key) + '/$entity'
							entity_OdataProperties = setOdataProperty(entities,@urlParams.spaceId, key)
							_.extend body,entity_OdataProperties[0]
							headers['Content-type'] = 'application/json;odata.metadata=minimal;charset=utf-8'
							headers['OData-Version'] = SteedosOData.VERSION
							{body: body, headers: headers}
						else
							statusCode: 404
							body  = setErrorMessage(404,collection,key,'get')
				else
					statusCode: 403
					body  = setErrorMessage(403,collection,key,'get')
		put:()->
			key = @urlParams.object_name
			if not Creator.objectsByName[key]?.enable_api
				statusCode: 401
				body = setErrorMessage(401)
				return body

			collection = Creator.Collections[key]
			if not collection
				statusCode: 404
				body = setErrorMessage(404,collection,key)
				return body
			permissions = Creator.getObjectPermissions(@urlParams.spaceId, @userId, key)
			if permissions.allowEdit
					selector = {_id: @urlParams._id, space: @urlParams.spaceId}
					entityIsUpdated = collection.update selector, $set: @bodyParams
					if entityIsUpdated
						entity = collection.findOne @urlParams._id
						entities = []
						body = {}
						headers = {}
						entities.push entity
						body['@odata.context'] = SteedosOData.getODataContextPath(@urlParams.spaceId, key) + '/$entity'
						entity_OdataProperties = setOdataProperty(entities,@urlParams.spaceId, key)
						_.extend body,entity_OdataProperties[0]
						headers['Content-type'] = 'application/json;odata.metadata=minimal;charset=utf-8'
						headers['OData-Version'] = SteedosOData.VERSION
						{body: body, headers: headers}
					else
						statusCode: 404
						body  = setErrorMessage(404,collection,key)
			else
				statusCode: 403
				body  = setErrorMessage(403,collection,key,put)
		delete:()->
			key = @urlParams.object_name
			if not Creator.objectsByName[key]?.enable_api
				statusCode: 401
				body = setErrorMessage(401)
				return body

			collection = Creator.Collections[key]
			if not collection
				statusCode: 404
				body = setErrorMessage(404,collection,key)
				return body
			permissions = Creator.getObjectPermissions(@urlParams.spaceId, @userId, key)
			if permissions.allowDelete
					selector = {_id: @urlParams._id, space: @urlParams.spaceId}
					if collection.remove selector
						{status: 'success', message: 'Item removed'}
					else
						statusCode: 404
						body: {status: 'fail', message: 'Item not found'}
			else
				statusCode: 400
				body: {status: 'fail', message: 'Action not permitted'}
	})
	
	#TODO remove
	_.each [], (value, key, list)-> #Creator.Collections
		if not Creator.objectsByName[key]?.enable_api
			return

		if SteedosOdataAPI

			SteedosOdataAPI.addCollection Creator.Collections[key],
				excludedEndpoints: []
				routeOptions:
					authRequired: true
					spaceRequired: false
				endpoints:
					getAll:
						action: ->
							collection = Creator.Collections[key]
							if not collection
								statusCode: 404
								body: {status: 'fail', message: 'Collection not found'}

							permissions = Creator.getObjectPermissions(@urlParams.spaceId, @userId, key)
							if permissions.viewAllRecords or (permissions.allowRead and @userId)
									qs = querystring.unescape(querystring.stringify(@queryParams))
									createQuery = if qs then odataV4Mongodb.createQuery(qs) else odataV4Mongodb.createQuery()

									if key is 'cfs.files.filerecord'
										createQuery.query['metadata.space'] = @urlParams.spaceId
									else
										createQuery.query.space = @urlParams.spaceId

									if not permissions.viewAllRecords
										createQuery.query.owner = @userId

									entities = []
									if @queryParams.$top isnt '0'
										entities = collection.find(createQuery.query, visitorParser(createQuery)).fetch()
									scannedCount = collection.find(createQuery.query).count()

									if entities
										dealWithExpand(createQuery, entities, key)

										body = {}
										headers = {}
										body['@odata.context'] = SteedosOData.getODataContextPath(@urlParams.spaceId, key)
										body['@odata.count'] = scannedCount
										body['value'] = entities
										headers['Content-type'] = 'application/json;odata.metadata=minimal;charset=utf-8'
										headers['OData-Version'] = SteedosOData.VERSION
										{body: body, headers: headers}
									else
										statusCode: 404
										body: {status: 'fail', message: 'Unable to retrieve items from collection'}
							else
								statusCode: 400
								body: {status: 'fail', message: 'Action not permitted'}
					post:
						action: ->
							collection = Creator.Collections[key]
							if not collection
								statusCode: 404
								body: {status: 'fail', message: 'Collection not found'}

							permissions = Creator.getObjectPermissions(@spaceId, @userId, key)
							if permissions.allowCreate
									@bodyParams.space = @spaceId
									entityId = collection.insert @bodyParams
									entity = collection.findOne entityId
									if entity
										statusCode: 201
										{status: 'success', value: entity}
									else
										statusCode: 404
										body: {status: 'fail', message: 'No item added'}
							else
								statusCode: 400
								body: {status: 'fail', message: 'Action not permitted'}
					get:
						action: ->
							collection = Creator.Collections[key]
							if not collection
								statusCode: 404
								body: {status: 'fail', message: 'Collection not found'}

							permissions = Creator.getObjectPermissions(@spaceId, @userId, key)
							if permissions.allowRead
									selector = {_id: @urlParams.id, space: @spaceId}
									entity = collection.findOne selector
									if entity
										{status: 'success', value: entity}
									else
										statusCode: 404
										body: {status: 'fail', message: 'Item not found'}
							else
								statusCode: 400
								body: {status: 'fail', message: 'Action not permitted'}
					put:
						action: ->
							collection = Creator.Collections[key]
							if not collection
								statusCode: 404
								body: {status: 'fail', message: 'Collection not found'}

							permissions = Creator.getObjectPermissions(@spaceId, @userId, key)
							if permissions.allowEdit
									selector = {_id: @urlParams.id, space: @spaceId}
									entityIsUpdated = collection.update selector, $set: @bodyParams
									if entityIsUpdated
										entity = collection.findOne @urlParams.id
										{status: 'success', value: entity}
									else
										statusCode: 404
										body: {status: 'fail', message: 'Item not found'}
							else
								statusCode: 400
								body: {status: 'fail', message: 'Action not permitted'}
					delete:
						action: ->
							collection = Creator.Collections[key]
							if not collection
								statusCode: 404
								body: {status: 'fail', message: 'Collection not found'}

							permissions = Creator.getObjectPermissions(@spaceId, @userId, key)
							if permissions.allowDelete
									selector = {_id: @urlParams.id, space: @spaceId}
									if collection.remove selector
										{status: 'success', message: 'Item removed'}
									else
										statusCode: 404
										body: {status: 'fail', message: 'Item not found'}
							else
								statusCode: 400
								body: {status: 'fail', message: 'Action not permitted'}
