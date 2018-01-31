class share.Route

	constructor: (@api, @path, @options, @endpoints) ->
		# Check if options were provided
		if not @endpoints
			@endpoints = @options
			@options = {}


	addToApi: do ->
		availableMethods = ['get', 'post', 'put', 'patch', 'delete', 'options']

		return ->
			self = this

			# Throw an error if a route has already been added at this path
			# TODO: Check for collisions with paths that follow same pattern with different parameter names
			if _.contains @api._config.paths, @path
				throw new Error "Cannot add a route at an existing path: #{@path}"

			# Override the default OPTIONS endpoint with our own
			@endpoints = _.extend options: @api._config.defaultOptionsEndpoint, @endpoints

			# Configure each endpoint on this route
			@_resolveEndpoints()
			@_configureEndpoints()

			# Add to our list of existing paths
			@api._config.paths.push @path

			allowedMethods = _.filter availableMethods, (method) ->
				_.contains(_.keys(self.endpoints), method)
			rejectedMethods = _.reject availableMethods, (method) ->
				_.contains(_.keys(self.endpoints), method)

			# Setup endpoints on route
			fullPath = @api._config.apiPath + @path
			_.each allowedMethods, (method) ->
				endpoint = self.endpoints[method]
				JsonRoutes.add method, fullPath, (req, res) ->
					# Add function to endpoint context for indicating a response has been initiated manually
					responseInitiated = false
					doneFunc = ->
						responseInitiated = true

					endpointContext =
						urlParams: req.params
						queryParams: req.query
						bodyParams: req.body
						request: req
						response: res
						done: doneFunc
					# Add endpoint config options to context
					_.extend endpointContext, endpoint

					# Run the requested endpoint
					responseData = null
					try
						responseData = self._callEndpoint endpointContext, endpoint
					catch error
						# Do exactly what Iron Router would have done, to avoid changing the API
						ironRouterSendErrorToResponse(error, req, res);
						return

					if responseInitiated
						# Ensure the response is properly completed
						res.end()
						return
					else
						if res.headersSent
							throw new Error "Must call this.done() after handling endpoint response manually: #{method} #{fullPath}"
						else if responseData is null or responseData is undefined
							throw new Error "Cannot return null or undefined from an endpoint: #{method} #{fullPath}"

					# Generate and return the http response, handling the different endpoint response types
					if responseData.body and (responseData.statusCode or responseData.headers)
						self._respond res, responseData.body, responseData.statusCode, responseData.headers
					else
						self._respond res, responseData

			_.each rejectedMethods, (method) ->
				JsonRoutes.add method, fullPath, (req, res) ->
					responseData = status: 'error', message: 'API endpoint does not exist'
					headers = 'Allow': allowedMethods.join(', ').toUpperCase()
					self._respond res, responseData, 405, headers


	###
		Convert all endpoints on the given route into our expected endpoint object if it is a bare
		function

		@param {Route} route The route the endpoints belong to
	###
	_resolveEndpoints: ->
		_.each @endpoints, (endpoint, method, endpoints) ->
			if _.isFunction(endpoint)
				endpoints[method] = {action: endpoint}
		return


	###
		Configure the authentication and role requirement on all endpoints (except OPTIONS, which must
		be configured directly on the endpoint)

		Authentication can be required on an entire route or individual endpoints. If required on an
		entire route, that serves as the default. If required in any individual endpoints, that will
		override the default.

		After the endpoint is configured, all authentication and role requirements of an endpoint can be
		accessed at <code>endpoint.authRequired</code> and <code>endpoint.roleRequired</code>,
		respectively.

		@param {Route} route The route the endpoints belong to
		@param {Endpoint} endpoint The endpoint to configure
	###
	_configureEndpoints: ->
		_.each @endpoints, (endpoint, method) ->
			if method isnt 'options'
				# Configure acceptable roles
				if not @options?.roleRequired
					@options.roleRequired = []
				if not endpoint.roleRequired
					endpoint.roleRequired = []
				endpoint.roleRequired = _.union endpoint.roleRequired, @options.roleRequired
				# Make it easier to check if no roles are required
				if _.isEmpty endpoint.roleRequired
					endpoint.roleRequired = false

				# Configure auth requirement
				if endpoint.authRequired is undefined
					if @options?.authRequired or endpoint.roleRequired
						endpoint.authRequired = true
					else
						endpoint.authRequired = false

				if @options?.spaceRequired
					endpoint.spaceRequired = @options.spaceRequired
				return
		, this
		return


	###
		Authenticate an endpoint if required, and return the result of calling it

		@returns The endpoint response or a 401 if authentication fails
	###
	_callEndpoint: (endpointContext, endpoint) ->
		# Call the endpoint if authentication doesn't fail
		if @_authAccepted endpointContext, endpoint
			if @_roleAccepted endpointContext, endpoint
				if @_spaceAccepted endpointContext, endpoint
					#endpoint.action.call endpointContext
					invocation = new DDPCommon.MethodInvocation
						isSimulation: true,
						userId: endpointContext.userId,
						connection: null,
						randomSeed: DDPCommon.makeRpcSeed()

					return DDP._CurrentInvocation.withValue invocation, ->
						return endpoint.action.call(endpointContext);
				else
					statusCode: 403
					body: {status: 'error', message: 'Bad X-Space-Id, Only admins of paid space can call this api.'}
			else
				statusCode: 403
				body: {status: 'error', message: 'You do not have permission to do this.'}
		else
			statusCode: 401
			body: {status: 'error', message: 'You must be logged in to do this.'}


	###
		Authenticate the given endpoint if required

		Once it's globally configured in the API, authentication can be required on an entire route or
		individual endpoints. If required on an entire endpoint, that serves as the default. If required
		in any individual endpoints, that will override the default.

		@returns False if authentication fails, and true otherwise
	###
	_authAccepted: (endpointContext, endpoint) ->
		if endpoint.authRequired
			@_authenticate endpointContext
		else true


	###
		Verify the request is being made by an actively logged in user

		If verified, attach the authenticated user to the context.

		@returns {Boolean} True if the authentication was successful
	###
	_authenticate: (endpointContext) ->
		# Get auth info
		auth = @api._config.auth.user.call(endpointContext)

		# Get the user from the database
		if auth?.userId and auth?.token and not auth?.user
			userSelector = {}
			userSelector._id = auth.userId
			userSelector[@api._config.auth.token] = auth.token
			auth.user = Meteor.users.findOne userSelector

		# Attach the user and their ID to the context if the authentication was successful
		if auth?.user
			endpointContext.user = auth.user
			endpointContext.userId = auth.user._id
			true
		else false

	###
		Authenticate the user role if required

		Must be called after _authAccepted().

		@returns True if the authenticated user belongs to <i>any</i> of the acceptable roles on the
						 endpoint
	###
	_spaceAccepted: (endpointContext, endpoint) ->
		if endpoint.spaceRequired
			auth = @api._config.auth.user.call(endpointContext)
			if auth?.spaceId
				space_users_count = db.space_users.find({user: auth.userId, space:auth.spaceId}).count()
				if space_users_count
					space = db.spaces.findOne(auth.spaceId)
					# space must be paid, and user must be admins
					if space?.is_paid and _.indexOf(space.admins, auth.userId)>=0
						endpointContext.spaceId = auth.spaceId
						return true
			endpointContext.spaceId = "bad"
			return false
		return true

	###
		Authenticate the user role if required

		Must be called after _authAccepted().

		@returns True if the authenticated user belongs to <i>any</i> of the acceptable roles on the
						 endpoint
	###
	_roleAccepted: (endpointContext, endpoint) ->
		if endpoint.roleRequired
			if _.isEmpty _.intersection(endpoint.roleRequired, endpointContext.user.roles)
				return false
		true


	###
		Respond to an HTTP request
	###
	_respond: (response, body, statusCode=200, headers={}) ->
		# Override any default headers that have been provided (keys are normalized to be case insensitive)
		# TODO: Consider only lowercasing the header keys we need normalized, like Content-Type
		defaultHeaders = @_lowerCaseKeys @api._config.defaultHeaders
		headers = @_lowerCaseKeys headers
		headers = _.extend defaultHeaders, headers

		# Prepare JSON body for response when Content-Type indicates JSON type
		if headers['content-type'].match(/json|javascript/) isnt null
			if @api._config.prettyJson
				body = JSON.stringify body, undefined, 2
			else
				body = JSON.stringify body

		# Send response
		sendResponse = ->
			response.writeHead statusCode, headers
			response.write body
			response.end()
		if statusCode in [401, 403]
			# Hackers can measure the response time to determine things like whether the 401 response was
			# caused by bad user id vs bad password.
			# In doing so, they can first scan for valid user ids regardless of valid passwords.
			# Delay by a random amount to reduce the ability for a hacker to determine the response time.
			# See https://www.owasp.org/index.php/Blocking_Brute_Force_Attacks#Finding_Other_Countermeasures
			# See https://en.wikipedia.org/wiki/Timing_attack
			minimumDelayInMilliseconds = 500
			randomMultiplierBetweenOneAndTwo = 1 + Math.random()
			delayInMilliseconds = minimumDelayInMilliseconds * randomMultiplierBetweenOneAndTwo
			Meteor.setTimeout sendResponse, delayInMilliseconds
		else
			sendResponse()

	###
		Return the object with all of the keys converted to lowercase
	###
	_lowerCaseKeys: (object) ->
		_.chain object
		.pairs()
		.map (attr) ->
			[attr[0].toLowerCase(), attr[1]]
		.object()
		.value()
