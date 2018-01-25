Meteor.startup ->
	mongoose = Npm.require('mongoose')
	mongoose.connect(process.env.MONGO_URL)
	Schema = mongoose.Schema
	_.each Creator.Collections, (value, key, list)->
		if not Creator.Objects[key]?.enable_api
			return

		if API
			console.log key

			collectionSchema = new Schema Creator.getObjectOdataSchema(Creator.Objects[key])

			collectionModel = mongoose.model(key, collectionSchema)

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
										getList = (req, model, place_hold, cb) ->
												SteedosOdata.list(req, model, {})
												.then (result)->
													cb(null, {status: 'success', data: result.entity.value, count: result.entity['@odata.count']})
												.catch (err)->
													cb(null, {statusCode: 404, body: {status: 'fail', message: 'Unable to retrieve items from collection'}})

										wrappedGetList = Meteor.wrapAsync(getList)
										# 因为typeof collectionModel === 'function'会被认为是callback所以添加一个占位参数
										wrappedGetList(@request, collectionModel, {})
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
