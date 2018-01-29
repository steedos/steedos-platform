Meteor.startup ->
	odataV4Mongodb = Npm.require('odata-v4-mongodb')

	optionsParser = (options)->
		parsedOpt = {}

		if options.$select
			parsedOpt.fields = {}
			_.each options.$select.split(','), (s)->
				parsedOpt.fields[s] = 1

		if options.$top
			parsedOpt.limit = parseInt options.$top

		if options.$skip
			parsedOpt.skip = parseInt options.$skip

		parsedOpt

	_.each Creator.Collections, (value, key, list)->
		if not Creator.Objects[key]?.enable_api
			return

		if API
			console.log key

			API.addCollection Creator.Collections[key],
				excludedEndpoints: []
				routeOptions:
					authRequired: true
					spaceRequired: true
				endpoints:
					getAll:
						action: ->
							collection = Creator.Collections[key]
							if not collection
								statusCode: 404
								body: {status: 'fail', message: 'Collection not found'}

							permissions = Creator.getObjectPermissions(@spaceId, @userId, key)
							if permissions.viewAllRecords
									if _.isEmpty @queryParams
										selector = {space: @spaceId}
										entities = collection.find(selector).fetch()
										if entities
											{status: 'success', data: entities}
										else
											statusCode: 404
											body: {status: 'fail', message: 'Unable to retrieve items from collection'}
									else
										console.log @queryParams

										createFilter = odataV4Mongodb.createFilter(@queryParams.$filter)
										entities = collection.find(createFilter,optionsParser(@queryParams)).fetch()
										scannedCount = collection.find(createFilter).count()
										if entities
											{status: 'success', data: entities, count: scannedCount}
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
										{status: 'success', data: entity}
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
										{status: 'success', data: entity}
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
										{status: 'success', data: entity}
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
										{status: 'success', data: message: 'Item removed'}
									else
										statusCode: 404
										body: {status: 'fail', message: 'Item not found'}
							else
								statusCode: 400
								body: {status: 'fail', message: 'Action not permitted'}
