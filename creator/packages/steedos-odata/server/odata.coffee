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

	dealWithExpand = (createQuery, entities, key)->
		if _.isEmpty createQuery.includes
			return

		obj = Creator.objectsByName[key]
		_.each createQuery.includes, (include)->
			# console.log 'include: ', include
			navigationProperty = include.navigationProperty
			# console.log 'navigationProperty: ', navigationProperty
			field = obj.fields[navigationProperty]
			if field and (field.type is 'lookup' or field.type is 'master_detail')
				if field.reference_to
					queryOptions = visitorParser(include)
					if _.isString field.reference_to
						referenceToCollection = Creator.Collections[field.reference_to]
						_.each entities, (entity, idx)->
							if entity[navigationProperty]
								if field.multiple
									multiQuery = _.extend {_id: {$in: entity[navigationProperty]}}, include.query
									entities[idx][navigationProperty] = referenceToCollection.find(multiQuery, queryOptions).fetch()
								else
									singleQuery = _.extend {_id: entity[navigationProperty]}, include.query
									entities[idx][navigationProperty] = referenceToCollection.findOne(singleQuery, queryOptions)

					if _.isArray field.reference_to
						_.each entities, (entity, idx)->
							if entity[navigationProperty]?.ids
								referenceToCollection = Creator.Collections[entity[navigationProperty].o]
								if field.multiple
									multiQuery = _.extend {_id: {$in: entity[navigationProperty].ids}}, include.query
									entities[idx][navigationProperty] = _.map referenceToCollection.find(multiQuery, queryOptions).fetch(), (o)->
										o['reference_to.o'] = referenceToCollection._name
										return o
								else
									singleQuery = _.extend {_id: entity[navigationProperty].ids[0]}, include.query
									entities[idx][navigationProperty] = referenceToCollection.findOne(singleQuery, queryOptions)
									entities[idx][navigationProperty]['reference_to.o'] = referenceToCollection._name

				else
				# TODO


		return

	SteedosOdataAPI.addRoute(':object_name', {authRequired: true, spaceRequired: false}, {
		get: ()->
			key = @urlParams.object_name
			if not Creator.objectsByName[key]?.enable_api
				return {
					statusCode: 404
					body: {status: 'fail', message: 'Collection not found'}
				}

			collection = Creator.Collections[key]
			if not collection
				statusCode: 404
				body: {status: 'fail', message: 'Collection not found'}

			console.log '@spaceId, @userId, key: ', @urlParams.spaceId, @userId, key
			permissions = Creator.getObjectPermissions(@urlParams.spaceId, @userId, key)
			console.log 'permissions: ', permissions
			if permissions.viewAllRecords or (permissions.allowRead and @userId)
				# console.log 'queryParams: ', @queryParams
				# console.log 'urlParams: ', @urlParams
				# console.log 'bodyParams: ', @bodyParams
				qs = querystring.unescape(querystring.stringify(@queryParams))
				# console.log 'querystring: ', qs
				createQuery = if qs then odataV4Mongodb.createQuery(qs) else odataV4Mongodb.createQuery()

				if key is 'cfs.files.filerecord'
					createQuery.query['metadata.space'] = @urlParams.spaceId
				else
					createQuery.query.space = @urlParams.spaceId

				# console.log 'createQuery: ', createQuery

				if not permissions.viewAllRecords
					createQuery.query.owner = @userId

				entities = []
				if @queryParams.$top isnt '0'
					# console.log visitorParser(createQuery)
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

		post: ()->
			key = @urlParams.object_name
			if not Creator.objectsByName[key]?.enable_api
				return {
					statusCode: 404
					body: {status: 'fail', message: 'Collection not found'}
				}
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
	})

	SteedosOdataAPI.addRoute(':object_name/:_id', {authRequired: true, spaceRequired: false}, {

	})

	_.each [], (value, key, list)-> #Creator.Collections
		if not Creator.objectsByName[key]?.enable_api
			return

		if SteedosOdataAPI
			# console.log key

			SteedosOdataAPI.addCollection Creator.Collections[key],
				excludedEndpoints: []
				routeOptions:
					authRequired: true
					spaceRequired: false
				endpoints:
					getAll:
						action: ->
							# console.log "getAll ------ #{key}"
							collection = Creator.Collections[key]
							if not collection
								statusCode: 404
								body: {status: 'fail', message: 'Collection not found'}

							console.log '@spaceId, @userId, key: ', @urlParams.spaceId, @userId, key
							permissions = Creator.getObjectPermissions(@urlParams.spaceId, @userId, key)
							console.log 'permissions: ', permissions
							if permissions.viewAllRecords or (permissions.allowRead and @userId)
									# console.log 'queryParams: ', @queryParams
									# console.log 'urlParams: ', @urlParams
									# console.log 'bodyParams: ', @bodyParams
									qs = querystring.unescape(querystring.stringify(@queryParams))
									# console.log 'querystring: ', qs
									createQuery = if qs then odataV4Mongodb.createQuery(qs) else odataV4Mongodb.createQuery()

									if key is 'cfs.files.filerecord'
										createQuery.query['metadata.space'] = @urlParams.spaceId
									else
										createQuery.query.space = @urlParams.spaceId

									# console.log 'createQuery: ', createQuery

									if not permissions.viewAllRecords
										createQuery.query.owner = @userId

									entities = []
									if @queryParams.$top isnt '0'
										# console.log visitorParser(createQuery)
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
