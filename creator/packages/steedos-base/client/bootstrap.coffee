require('url-search-params-polyfill');
clone = require('clone')
getCookie = (name)->
	pattern = RegExp(name + "=.[^;]*")
	matched = document.cookie.match(pattern)
	if(matched)
		cookie = matched[0].split('=')
		return cookie[1]
	return false

@Setup = {}
Creator.__l = new ReactiveVar({})
Creator.bootstrapLoaded = new ReactiveVar(false)
Creator.validated = new ReactiveVar(false);
Creator.steedosInit = new ReactiveVar(false);

Blaze._allowJavascriptUrls() 
FlowRouter.wait();

getRedirectUrl = ()->
	redirect = location.href.replace("/steedos/sign-in", "").replace("/accounts/a/#/logout", "");
	u = new URL(redirect);
	u.searchParams.delete('no_redirect');
	u.searchParams.delete('X-Space-Id');
	u.searchParams.delete('X-Auth-Token');
	u.searchParams.delete('X-User-Id');
	return u.toString();


Steedos.logout = (redirect)->
	Accounts._unstoreLoginToken();
	Setup.clearAuthLocalStorage()
	accountsUrl = Meteor.settings.public?.webservices?.accounts?.url
	if accountsUrl
		if !redirect
			redirect = getRedirectUrl();
	window.location.href = Steedos.absoluteUrl("/accounts/a/#/logout?redirect_uri="+ redirect);

Steedos.goResetPassword = (redirect)->
	accountsUrl = Meteor.settings.public?.webservices?.accounts?.url
	if accountsUrl
		if !redirect
			redirect = getRedirectUrl()
		Accounts._unstoreLoginToken();
		Setup.clearAuthLocalStorage()
		window.location.href = Steedos.absoluteUrl(accountsUrl + "/a/#/update-password?redirect_uri=" + redirect);

Steedos.redirectToSignIn = (redirect)->
	accountsUrl = Meteor.settings.public?.webservices?.accounts?.url
	if accountsUrl 
		if !redirect
			redirect = getRedirectUrl();
		window.location.href = Steedos.absoluteUrl(accountsUrl + "/authorize?redirect_uri=" + encodeURIComponent(redirect));

Steedos.clearAuth = ()->
	Accounts._unstoreLoginToken()
	Setup.clearAuthLocalStorage()

Setup.validate = (onSuccess)->

	# if window.location.pathname.indexOf('/steedos/sign-in')>=0
	# 	if (!FlowRouter._initialized)
	# 		FlowRouter.initialize();
	# 	return;

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
	spaceId = searchParams.get("X-Space-Id");
	if (!spaceId)
		spaceId = localStorage.getItem("spaceId")
	if (!spaceId)
		spaceId = getCookie("X-Space-Id");
	headers = {}
	requestData = { 'utcOffset': moment().utcOffset() / 60 }
	if !loginToken
		loginToken = localStorage.getItem("steedos:token");
		if loginToken == 'undefined'
			loginToken = null
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
		if Meteor.userId() != data.userId
			Accounts.connection.setUserId(data.userId);
			Accounts.loginWithToken data.authToken, (err) ->
				if (err)
					Meteor._debug("Error logging in with token: " + err);
					Steedos.logout();
					return

		if data.webservices
			Steedos.settings.webservices = data.webservices
		Setup.lastUserId = data.userId
		if data.password_expired
			Steedos.goResetPassword()
		if data.spaceId 
			Setup.lastSpaceId = data.spaceId
			if (data.spaceId != Session.get("spaceId"))
				Steedos.setSpaceId(data.spaceId)

		Creator.USER_CONTEXT = {
			spaceId: data.spaceId,
			userId: data.userId,
			user: data
		}

		# stores.Settings.setTenantId(data.spaceId);
		# stores.Settings.setUserId(data.userId);
		# stores.Settings.setAuthToken(data.authToken);

		# stores.API.client.setUserId(data.userId)
		# stores.API.client.setToken(data.authToken);
		# stores.API.client.setSpaceId(data.spaceId);

		if !Meteor.loggingIn()
			# 第一次在登录界面输入用户名密码登录后loggingIn为true，这时还没有登录成功
			Setup.bootstrap(Session.get("spaceId"))
		Creator.validated.set(true);
		if onSuccess
			onSuccess()
	.fail ( e ) ->
		if (e.status == 401)
			Steedos.clearAuth()
			Steedos.redirectToSignIn()
		return

Setup.clearAuthLocalStorage = ()->
	keysforRemove = []
	localStorage = window.localStorage;
	i = 0
	while i < localStorage.length
		key = localStorage.key(i)
		if key?.startsWith("Meteor.loginToken") || key?.startsWith("Meteor.userId")  || key?.startsWith("Meteor.loginTokenExpires") || key?.startsWith('accounts:')
			keysforRemove.push(key)
		i++
	keysforRemove.forEach (k) ->
		localStorage.removeItem(k)

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

Setup.setGlobalAjaxHeader = () ->
	$.ajaxSetup
		beforeSend: (request) ->
			request.setRequestHeader('X-User-Id', Meteor.userId())

Meteor.startup ->
	Setup.setGlobalAjaxHeader()

	Setup.validate();
	Accounts.onLogin ()->
		console.log("onLogin")
		
		if Meteor.userId() != Setup.lastUserId
			Setup.validate();
		else 
			Setup.bootstrap(Session.get("spaceId"))

		# Tracker.autorun (c)->
		# 	# 登录后需要清除登录前订阅的space数据，以防止默认选中登录前浏览器url参数中的的工作区ID所指向的工作区
		# 	# 而且可能登录后的用户不属性该SpaceAvatar中订阅的工作区，所以需要清除订阅，由之前的订阅来决定当前用户可以选择哪些工作区
		# 	if Steedos.subsSpaceBase.ready()
		# 		c.stop()
		# 		Steedos.subs["SpaceAvatar"]?.clear()
		# 	return
		return

	Accounts.onLogout ()->
		console.log("onLogout")
		Setup.logout ()-> 
			Creator.bootstrapLoaded.set(false)
			$("body").removeClass('loading')
			Setup.lastUserId = null;
			Steedos.redirectToSignIn()

	Tracker.autorun (c)->
		spaceId = Session.get("spaceId");
		if Setup.lastSpaceId && (Setup.lastSpaceId != spaceId)
			# 一定要在spaceId变化时立即设置bootstrapLoaded为false，而不可以在请求bootstrap之前才设置为false
			# 否则有订阅的话，在请求bootsrtrap前，会先触发订阅的变化，订阅又会触发Creator.bootstrapLoaded.get()值的变化，而且是true变为true
			# 这样的话在autorun中监听Creator.bootstrapLoaded.get()变化就会多进入一次
			Creator.bootstrapLoaded.set(false)
			console.log("spaceId change from " + Setup.lastSpaceId + " to " + Session.get("spaceId"))
			Setup.validate()
		return

	if (localStorage.getItem("app_id") && !Session.get("app_id"))
		Session.set("app_id", localStorage.getItem("app_id"));

	Tracker.autorun (c)->
		#console.log("app_id change: " + Session.get("app_id"))
		if Session.get("app_id")
			localStorage.setItem("app_id", Session.get("app_id"))
		return

	return

Tracker.autorun ()->
	if Creator.steedosInit.get() && Creator.validated.get()
		Creator.bootstrapLoaded.set(true)
		if (!FlowRouter._initialized)
			FlowRouter.initialize();

handleBootstrapData = (result, callback)->
	if _.isFunction(callback)
		callback()

	if FlowRouter.current()?.context?.pathname == "/steedos/sign-in"
		if FlowRouter.current()?.queryParams?.redirect
			document.location.href = FlowRouter.current().queryParams.redirect;
			return
		else
			FlowRouter.go("/")

requestBootstrapDataUseAjax = (spaceId, callback)->
	unless spaceId and Meteor.userId()
		return
	handleBootstrapData({spaceId: spaceId}, callback)



requestBootstrapData = (spaceId, callback)->
	requestBootstrapDataUseAjax(spaceId, callback);

Setup.bootstrap = (spaceId, callback)->
	requestBootstrapData(spaceId, callback)
