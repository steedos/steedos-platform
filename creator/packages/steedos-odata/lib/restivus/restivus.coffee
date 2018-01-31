basicAuth = Npm.require('basic-auth')

class @OdataRestivus

	constructor: (options) ->
		@_routes = []
		@_config =
			paths: []
			useDefaultAuth: false
			apiPath: 'api/'
			version: null
			prettyJson: false
			auth:
				token: 'services.resume.loginTokens.hashedToken'
				user: ->
					if @request.headers['x-auth-token']
						token = Accounts._hashLoginToken @request.headers['x-auth-token']
					if @request.userId
						_user = db.users.findOne({_id: @request.userId})
						user: _user
						userId: @request.headers['x-user-id']
						spaceId: @request.headers['x-space-id'] || @urlParams['spaceId']
						token: token
					else if @request.headers['authorization']
							console.log 'basicAuth: ', basicAuth(@request.headers['authorization'])
							auth = basicAuth(@request.headers['authorization'])
							user = Meteor.users.findOne({username: auth.name})
							userId: user._id
							spaceId: @request.headers['x-space-id'] || @urlParams['spaceId']
							token: token
					else
						userId: @request.headers['x-user-id']
						spaceId: @request.headers['x-space-id'] || @urlParams['spaceId']
						token: token
			defaultHeaders:
				'Content-Type': 'application/json'
			enableCors: true

		# Configure API with the given options
		_.extend @_config, options

		if @_config.enableCors
			corsHeaders =
				'Access-Control-Allow-Origin': '*'
				'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'

			if @_config.useDefaultAuth
				corsHeaders['Access-Control-Allow-Headers'] += ', X-User-Id, X-Auth-Token, X-Space-Id'

			# Set default header to enable CORS if configured
			_.extend @_config.defaultHeaders, corsHeaders

			if not @_config.defaultOptionsEndpoint
				@_config.defaultOptionsEndpoint = ->
					@response.writeHead 200, corsHeaders
					@done()

		# Normalize the API path
		if @_config.apiPath[0] is '/'
			@_config.apiPath = @_config.apiPath.slice 1
		if _.last(@_config.apiPath) isnt '/'
			@_config.apiPath = @_config.apiPath + '/'

		# URL path versioning is the only type of API versioning currently available, so if a version is
		# provided, append it to the base path of the API
		if @_config.version
			@_config.apiPath += @_config.version + '/'

		# Add default login and logout endpoints if auth is configured
		if @_config.useDefaultAuth
			@_initAuth()
		else if @_config.useAuth
			@_initAuth()
			console.warn 'Warning: useAuth API config option will be removed in Restivus v1.0 ' +
					'\n    Use the useDefaultAuth option instead'

		return this


	###*
		Add endpoints for the given HTTP methods at the given path

		@param path {String} The extended URL path (will be appended to base path of the API)
		@param options {Object} Route configuration options
		@param options.authRequired {Boolean} The default auth requirement for each endpoint on the route
		@param options.roleRequired {String or String[]} The default role required for each endpoint on the route
		@param endpoints {Object} A set of endpoints available on the new route (get, post, put, patch, delete, options)
		@param endpoints.<method> {Function or Object} If a function is provided, all default route
				configuration options will be applied to the endpoint. Otherwise an object with an `action`
				and all other route config options available. An `action` must be provided with the object.
	###
	addRoute: (path, options, endpoints) ->
		# Create a new route and add it to our list of existing routes
		route = new share.Route(this, path, options, endpoints)
		@_routes.push(route)

		route.addToApi()

		return this


	###*
		Generate routes for the Meteor Collection with the given name
	###
	addCollection: (collection, options={}) ->
		methods = ['get', 'post', 'put', 'delete', 'getAll']
		methodsOnCollection = ['post', 'getAll']

		# Grab the set of endpoints
		if collection is Meteor.users
			collectionEndpoints = @_userCollectionEndpoints
		else
			collectionEndpoints = @_collectionEndpoints

		# Flatten the options and set defaults if necessary
		endpointsAwaitingConfiguration = options.endpoints or {}
		routeOptions = options.routeOptions or {}
		excludedEndpoints = options.excludedEndpoints or []
		# Use collection name as default path
		path = options.path or collection._name

		# Separate the requested endpoints by the route they belong to (one for operating on the entire
		# collection and one for operating on a single entity within the collection)
		collectionRouteEndpoints = {}
		entityRouteEndpoints = {}
		if _.isEmpty(endpointsAwaitingConfiguration) and _.isEmpty(excludedEndpoints)
			# Generate all endpoints on this collection
			_.each methods, (method) ->
				# Partition the endpoints into their respective routes
				if method in methodsOnCollection
					_.extend collectionRouteEndpoints, collectionEndpoints[method].call(this, collection)
				else _.extend entityRouteEndpoints, collectionEndpoints[method].call(this, collection)
				return
			, this
		else
			# Generate any endpoints that haven't been explicitly excluded
			_.each methods, (method) ->
				if method not in excludedEndpoints and endpointsAwaitingConfiguration[method] isnt false
					# Configure endpoint and map to it's http method
					# TODO: Consider predefining a map of methods to their http method type (e.g., getAll: get)
					endpointOptions = endpointsAwaitingConfiguration[method]
					configuredEndpoint = {}
					_.each collectionEndpoints[method].call(this, collection), (action, methodType) ->
						configuredEndpoint[methodType] =
							_.chain action
							.clone()
							.extend endpointOptions
							.value()
					# Partition the endpoints into their respective routes
					if method in methodsOnCollection
						_.extend collectionRouteEndpoints, configuredEndpoint
					else _.extend entityRouteEndpoints, configuredEndpoint
					return
			, this

		# Add the routes to the API
		@addRoute path, routeOptions, collectionRouteEndpoints
		@addRoute "#{path}/:id", routeOptions, entityRouteEndpoints

		return this


	###*
		A set of endpoints that can be applied to a Collection Route
	###
	_collectionEndpoints:
		get: (collection) ->
			get:
				action: ->
					selector = {_id: @urlParams.id}
					if this.spaceId
						selector.space = this.spaceId
					entity = collection.findOne selector
					if entity
						{status: 'success', data: entity}
					else
						statusCode: 404
						body: {status: 'fail', message: 'Item not found'}
		put: (collection) ->
			put:
				action: ->
					selector = {_id: @urlParams.id}
					if this.spaceId
						selector.space = this.spaceId
					entityIsUpdated = collection.update selector, $set: @bodyParams
					if entityIsUpdated
						entity = collection.findOne @urlParams.id
						{status: 'success', data: entity}
					else
						statusCode: 404
						body: {status: 'fail', message: 'Item not found'}
		delete: (collection) ->
			delete:
				action: ->
					selector = {_id: @urlParams.id}
					if this.spaceId
						selector.space = this.spaceId
					if collection.remove selector
						{status: 'success', data: message: 'Item removed'}
					else
						statusCode: 404
						body: {status: 'fail', message: 'Item not found'}
		post: (collection) ->
			post:
				action: ->
					if this.spaceId
						@bodyParams.space = this.spaceId
					entityId = collection.insert @bodyParams
					entity = collection.findOne entityId
					if entity
						statusCode: 201
						body: {status: 'success', data: entity}
					else
						statusCode: 400
						body: {status: 'fail', message: 'No item added'}
		getAll: (collection) ->
			get:
				action: ->
					selector = {}
					if this.spaceId
						selector.space = this.spaceId
					entities = collection.find(selector).fetch()
					if entities
						{status: 'success', data: entities}
					else
						statusCode: 404
						body: {status: 'fail', message: 'Unable to retrieve items from collection'}


	###*
		A set of endpoints that can be applied to a Meteor.users Collection Route
	###
	_userCollectionEndpoints:
		get: (collection) ->
			get:
				action: ->
					entity = collection.findOne @urlParams.id, fields: profile: 1
					if entity
						{status: 'success', data: entity}
					else
						statusCode: 404
						body: {status: 'fail', message: 'User not found'}
		put: (collection) ->
			put:
				action: ->
					entityIsUpdated = collection.update @urlParams.id, $set: profile: @bodyParams
					if entityIsUpdated
						entity = collection.findOne @urlParams.id, fields: profile: 1
						{status: "success", data: entity}
					else
						statusCode: 404
						body: {status: 'fail', message: 'User not found'}
		delete: (collection) ->
			delete:
				action: ->
					if collection.remove @urlParams.id
						{status: 'success', data: message: 'User removed'}
					else
						statusCode: 404
						body: {status: 'fail', message: 'User not found'}
		post: (collection) ->
			post:
				action: ->
					# Create a new user account
					entityId = Accounts.createUser @bodyParams
					entity = collection.findOne entityId, fields: profile: 1
					if entity
						statusCode: 201
						body: {status: 'success', data: entity}
					else
						statusCode: 400
						{status: 'fail', message: 'No user added'}
		getAll: (collection) ->
			get:
				action: ->
					entities = collection.find({}, fields: profile: 1).fetch()
					if entities
						{status: 'success', data: entities}
					else
						statusCode: 404
						body: {status: 'fail', message: 'Unable to retrieve users'}


	###
		Add /login and /logout endpoints to the API
	###
	_initAuth: ->
		self = this
		###
			Add a login endpoint to the API

			After the user is logged in, the onLoggedIn hook is called (see Restfully.configure() for
			adding hook).
		###
		@addRoute 'login', {authRequired: false},
			post: ->
				# Grab the username or email that the user is logging in with
				user = {}
				if @bodyParams.user
					if @bodyParams.user.indexOf('@') is -1
						user.username = @bodyParams.user
					else
						user.email = @bodyParams.user
				else if @bodyParams.username
					user.username = @bodyParams.username
				else if @bodyParams.email
					user.email = @bodyParams.email

				# Try to log the user into the user's account (if successful we'll get an auth token back)
				try
					auth = Auth.loginWithPassword user, @bodyParams.password
				catch e
					console.error e
					return {} =
						statusCode: e.error
						body: status: 'error', message: e.reason

				# Get the authenticated user
				# TODO: Consider returning the user in Auth.loginWithPassword(), instead of fetching it again here
				if auth.userId and auth.authToken
					searchQuery = {}
					searchQuery[self._config.auth.token] = Accounts._hashLoginToken auth.authToken
					@user = Meteor.users.findOne
						'_id': auth.userId
						searchQuery
					@userId = @user?._id

				response = {status: 'success', data: auth}

				# Call the login hook with the authenticated user attached
				extraData = self._config.onLoggedIn?.call(this)
				if extraData?
					_.extend(response.data, {extra: extraData})

				response

		logout = ->
			# Remove the given auth token from the user's account
			authToken = @request.headers['x-auth-token']
			hashedToken = Accounts._hashLoginToken authToken
			tokenLocation = self._config.auth.token
			index = tokenLocation.lastIndexOf '.'
			tokenPath = tokenLocation.substring 0, index
			tokenFieldName = tokenLocation.substring index + 1
			tokenToRemove = {}
			tokenToRemove[tokenFieldName] = hashedToken
			tokenRemovalQuery = {}
			tokenRemovalQuery[tokenPath] = tokenToRemove
			Meteor.users.update @user._id, {$pull: tokenRemovalQuery}

			response = {status: 'success', data: {message: 'You\'ve been logged out!'}}

			# Call the logout hook with the authenticated user attached
			extraData = self._config.onLoggedOut?.call(this)
			if extraData?
				_.extend(response.data, {extra: extraData})

			response

		###
			Add a logout endpoint to the API

			After the user is logged out, the onLoggedOut hook is called (see Restfully.configure() for
			adding hook).
		###
		@addRoute 'logout', {authRequired: true},
			get: ->
				console.warn "Warning: Default logout via GET will be removed in Restivus v1.0. Use POST instead."
				console.warn "    See https://github.com/kahmali/meteor-restivus/issues/100"
				return logout.call(this)
			post: logout

OdataRestivus = @OdataRestivus
