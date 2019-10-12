getCookie = (name)->
	pattern = RegExp(name + "=.[^;]*")
	matched = document.cookie.match(pattern)
	if(matched)
		cookie = matched[0].split('=')
		return cookie[1]
	return false

@Setup = {}

Setup.lastSpaceId = null;

require('url-search-params-polyfill');

Setup.validate = (onSuccess)->
	console.log("Validating user...")
	searchParams = new URLSearchParams(window.location.search);
	# 优先使用 URL 变量
	loginToken = searchParams.get("X-Auth-Token");
	userId = searchParams.get("X-User-Id");
	# 然后使用 Meteor LocalStorage 变量
	if (!userId or !loginToken)
		loginToken = Accounts._storedLoginToken()
		userId = Accounts._storedUserId();
	# 然后使用 Cookie 变量
	if (!userId or !loginToken)
		loginToken = getCookie("X-Auth-Token");
		userId = getCookie("X-User-Id");
	spaceId = localStorage.getItem("spaceId")
	if (!spaceId)
		spaceId = getCookie("X-Space-Id");
	headers = {}
	requestData = { 'utcOffset': moment().utcOffset() / 60 }
	if loginToken && spaceId
		headers['Authorization'] = 'Bearer ' + spaceId + ',' + loginToken
	else if loginToken
		# headers['Authorization'] = 'Bearer ' + loginToken
		headers['X-User-Id'] = userId
		headers['X-Auth-Token'] = loginToken
	
	$.ajax
		type: "POST",
		url: Steedos.absoluteUrl("api/v4/users/validate"),
		contentType: "application/json",
		dataType: 'json',
		data: JSON.stringify(requestData),
		xhrFields: 
			withCredentials: true
		crossDomain: true
		headers: headers
	.done ( data ) ->
		if !data
			Steedos.redirectToSignIn()

		if Meteor.userId() != data.userId
			Accounts.connection.setUserId(data.userId);
			Accounts.loginWithToken data.authToken, (err) ->
				if (err)
					Meteor._debug("Error logging in with token: " + err);
					FlowRouter.go("/steedos/logout");

		if data.webservices
			Steedos.settings.webservices = data.webservices
		if data.spaceId 
			Setup.lastSpaceId = data.spaceId
			if (data.spaceId != Session.get("spaceId"))
				Steedos.setSpaceId(data.spaceId)

		Creator.USER_CONTEXT = data

		if FlowRouter.current()?.context?.pathname == "/steedos/sign-in"
			if FlowRouter.current()?.queryParams?.redirect
				FlowRouter.go FlowRouter.current().queryParams.redirect
			else
				FlowRouter.go "/"

		Setup.bootstrap(Session.get("spaceId"))

		if onSuccess
			onSuccess()
	.fail ( e ) ->
		FlowRouter.go("/steedos/logout");

Setup.clearAuthLocalStorage = ()->
	localStorage = window.localStorage;
	i = 0
	while i < localStorage.length
		key = localStorage.key(i)
		if key?.startsWith("Meteor.loginToken") || key?.startsWith("Meteor.userId")  || key?.startsWith("Meteor.loginTokenExpires") || key?.startsWith('accounts:')
			localStorage.removeItem(key)
		i++

Setup.logout = (callback) ->
	$.ajax
		type: "POST",
		url: Steedos.absoluteUrl("api/v4/users/logout"),
		dataType: 'json',
		xhrFields: 
		   withCredentials: true
		crossDomain: true,
	.always ( data ) ->
		Setup.clearAuthLocalStorage()
		if callback
			callback()

Meteor.startup ->

	Accounts.onLogin ()->
		Setup.validate();
		Tracker.autorun (c)->
			# 登录后需要清除登录前订阅的space数据，以防止默认选中登录前浏览器url参数中的的工作区ID所指向的工作区
			# 而且可能登录后的用户不属性该SpaceAvatar中订阅的工作区，所以需要清除订阅，由之前的订阅来决定当前用户可以选择哪些工作区
			if Steedos.subsSpaceBase.ready()
				c.stop()
				Steedos.subs["SpaceAvatar"]?.clear()
			return
		return

	Accounts.onLogout ()->
		Creator.bootstrapLoaded.set(false)
		Steedos.redirectToSignIn()
		return

	Tracker.autorun (c)->
		console.log("spaceId change: " + Session.get("spaceId"))

		if !Setup.lastSpaceId or (Setup.lastSpaceId != Session.get("spaceId"))
			Setup.validate()
	return


Creator.bootstrapLoaded = new ReactiveVar(false)

Setup.bootstrap = (spaceId, callback)->
	if Meteor.loggingIn() || Meteor.loggingOut()
		return
	unless spaceId and Meteor.userId()
		return
	url = Steedos.absoluteUrl "/api/bootstrap/#{spaceId}"
	$.ajax
		type: "get"
		url: url
		dataType: "json"
		#contentType: "application/json"
		beforeSend: (request) ->
			request.setRequestHeader('X-User-Id', Meteor.userId())
			request.setRequestHeader('X-Auth-Token', Accounts._storedLoginToken())
		error: (jqXHR, textStatus, errorThrown) ->
				error = jqXHR.responseJSON
				console.error error
				if error?.reason
					toastr?.error?(TAPi18n.__(error.reason))
				else if error?.message
					toastr?.error?(TAPi18n.__(error.message))
				else
					toastr?.error?(error)
		success: (result) ->
			# if result.space._id != spaceId
			# 	Steedos.setSpaceId(result.space._id)

			Creator.Objects = result.objects
			object_listviews = result.object_listviews
			Creator.object_workflows = result.object_workflows
			isSpaceAdmin = Steedos.isSpaceAdmin()

			Session.set "user_permission_sets", result.user_permission_sets

			_.each Creator.Objects, (object, object_name)->
				_object_listviews = object_listviews[object_name]
				_.each _object_listviews, (_object_listview)->
					if _.isString(_object_listview.options)
						_object_listview.options = JSON.parse(_object_listview.options)
					if _object_listview.api_name
						_key = _object_listview.api_name
					else
						_key = _object_listview._id
					object.list_views[_key] = _object_listview
				Creator.loadObjects object, object_name

			_.each result.apps, (app, key) ->
				if !app._id
					app._id = key
				if app.is_creator
					if isSpaceAdmin
						# 如果是工作区管理员应该强制把is_creator的应该显示出来
						app.visible = true
				else
					# 非creator应该一律不显示
					app.visible = false
			
			sortedApps = _.sortBy _.values(result.apps), 'sort'
			# 按钮sort排序次序设置Creator.Apps值
			Creator.Apps = {}
			adminApp = {}
			_.each sortedApps, (n) ->
				if n._id == "admin"
					adminApp = n
				else
					Creator.Apps[n._id] = n
			
			# admin菜单显示在最后
			Creator.Apps.admin = adminApp

			apps = result.assigned_apps
			if apps.length
				_.each Creator.Apps, (app, key)->
					if apps.indexOf(key) > -1
						app.visible = app.is_creator
					else
						app.visible = false
			
			Creator.Menus = result.assigned_menus

			if (!Session.get("app_id"))
				apps = Creator.getVisibleApps(true)
				Session.set("app_id", apps[0]?._id)
			
			Creator.Plugins = result.plugins;
				
			if _.isFunction(callback)
				callback()

			Creator.bootstrapLoaded.set(true)

FlowRouter.route '/steedos/logout',
	action: (params, queryParams)->
		#AccountsTemplates.logout();
		$("body").addClass('loading')
		Meteor.logout ()->
			Setup.logout ()-> 
				$("body").removeClass('loading')
				Steedos.redirectToSignIn()
