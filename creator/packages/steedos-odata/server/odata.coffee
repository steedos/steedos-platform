Meteor.startup ->

	odataV4Mongodb = Npm.require 'odata-v4-mongodb'

	optionsParser = (options)->
		parsedOpt = {}

		if options.$select
			parsedOpt.fields = {}
			_.each options.$select.split(','), (s)->
				parsedOpt.fields[s] = 1

		if options.hasOwnProperty('$top')
			parsedOpt.limit = parseInt options.$top

		if options.hasOwnProperty('$skip')
			parsedOpt.skip = parseInt options.$skip

		if options.$orderby
			sort = []
			_.each options.$orderby.split(','), (item)->
				data = item.trim().split(' ')
				if data.length > 2
					console.error "odata: Syntax error at #{options.$orderby}"
					return
				if data.length == 1
					data.push 'asc'
				sort.push(data)

			if sort.length > 0
				parsedOpt.sort = sort

		parsedOpt

	_.each Creator.Collections, (value, key, list)->
		if not Creator.Objects[key]?.enable_api
			return

		if SteedosOdataAPI
			console.log key

			SteedosOdataAPI.addCollection Creator.Collections[key],
				excludedEndpoints: []
				routeOptions:
					authRequired: SteedosOData.AUTHREQUIRED
					spaceRequired: false
				endpoints:
					getAll:
						action: ->
							console.log "getAll ------ #{key}"
							collection = Creator.Collections[key]
							if not collection
								statusCode: 404
								body: {status: 'fail', message: 'Collection not found'}

							permissions = Creator.getObjectPermissions(@spaceId, @userId, key)
							if permissions.viewAllRecords
									console.log 'queryParams: ', @queryParams
									console.log 'urlParams: ', @urlParams
									console.log 'bodyParams: ', @bodyParams
									createFilter = odataV4Mongodb.createFilter(@queryParams.$filter)
									# 强制增加過濾掉件space: @spaceId

									console.log("@spaceId", @spaceId)

									createFilter.space = @urlParams.spaceId #@spaceId

									entities = []
									if @queryParams.$top isnt '0'
										console.log optionsParser(@queryParams)
										entities = collection.find(createFilter, optionsParser(@queryParams)).fetch()
									scannedCount = collection.find(createFilter).count()
									if entities
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
