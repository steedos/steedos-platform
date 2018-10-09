db = {}

Steedos =
	settings: {}
	db: db
	subs: {}
	isPhoneEnabled: ->
		return !!Meteor.settings?.public?.phone
	numberToString: (number, locale)->
		if typeof number == "number"
			number = number.toString()

		if !number
			return '';

		if number != "NaN"
			unless locale
				locale = Steedos.locale()
			if locale == "zh-cn" || locale == "zh-CN"
				# 中文万分位财务人员看不惯，所以改为国际一样的千分位
				return number.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
			else
				return number.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
		else
			return ""
	valiJquerySymbols: (str)->
		# reg = /^[^!"#$%&'()*+,./:;<=>?@[\]^`{|}~]+$/g
		reg = new RegExp("^[^!\"#$%&'()*\+,\.\/:;<=>?@[\\]^`{|}~]+$")
		return reg.test(str)

###
# Kick off the global namespace for Steedos.
# @namespace Steedos
###

Steedos.getHelpUrl = (locale)->
	country = locale.substring(3)
	return "http://www.steedos.com/" + country + "/help/"

if Meteor.isClient

	Steedos.spaceUpgradedModal = ()->
		swal({title: TAPi18n.__("space_paid_info_title"), text: TAPi18n.__("space_paid_info_text"), html: true, type:"warning", confirmButtonText: TAPi18n.__("OK")});

	Steedos.getAccountBgBodyValue = ()->
		accountBgBody = db.steedos_keyvalues.findOne({user:Steedos.userId(),key:"bg_body"})
		if accountBgBody
			return accountBgBody.value
		else
			return {};

	Steedos.applyAccountBgBodyValue = (accountBgBodyValue,isNeedToLocal)->
		if Meteor.loggingIn() or !Steedos.userId()
			# 如果是正在登录中或在登录界面，则取localStorage中设置，而不是直接应用空设置
			accountBgBodyValue = {}
			accountBgBodyValue.url = localStorage.getItem("accountBgBodyValue.url")
			accountBgBodyValue.avatar = localStorage.getItem("accountBgBodyValue.avatar")

		url = accountBgBodyValue.url
		avatar = accountBgBodyValue.avatar
		if accountBgBodyValue.url
			if url == avatar
				avatarUrl = 'api/files/avatars/' + avatar
				$("body").css "backgroundImage","url(#{if Meteor.isCordova then avatarUrl else Meteor.absoluteUrl(avatarUrl)})"
			else
				# 这里不可以用Steedos.absoluteUrl，因为app中要从本地抓取资源可以加快速度并节约流量
				$("body").css "backgroundImage","url(#{if Meteor.isCordova then url else Meteor.absoluteUrl(url)})"
		else
			# 这里不可以用Steedos.absoluteUrl，因为app中要从本地抓取资源可以加快速度并节约流量
			background = Meteor.settings?.public?.admin?.background
			if background
				$("body").css "backgroundImage","url(#{if Meteor.isCordova then background else Meteor.absoluteUrl(background)})"
			else
				background = "/packages/steedos_theme/client/background/sea.jpg"
				$("body").css "backgroundImage","url(#{if Meteor.isCordova then background else Meteor.absoluteUrl(background)})"

		if isNeedToLocal
			if Meteor.loggingIn()
				# 正在登录中，则不做处理，因为此时Steedos.userId()不足于证明已登录状态
				return
			# 这里特意不在localStorage中存储Steedos.userId()，因为需要保证登录界面也应用localStorage中的设置
			# 登录界面不设置localStorage，因为登录界面accountBgBodyValue肯定为空，设置的话，会造成无法保持登录界面也应用localStorage中的设置
			if Steedos.userId()
				if url
					localStorage.setItem("accountBgBodyValue.url",url)
					localStorage.setItem("accountBgBodyValue.avatar",avatar)
				else
					localStorage.removeItem("accountBgBodyValue.url")
					localStorage.removeItem("accountBgBodyValue.avatar")

	Steedos.getAccountSkinValue = ()->
		accountSkin = db.steedos_keyvalues.findOne({user:Steedos.userId(),key:"skin"})
		if accountSkin
			return accountSkin.value
		else
			return {};

	Steedos.getAccountZoomValue = ()->
		accountZoom = db.steedos_keyvalues.findOne({user:Steedos.userId(),key:"zoom"})
		if accountZoom
			return accountZoom.value
		else
			return {};

	Steedos.applyAccountZoomValue = (accountZoomValue,isNeedToLocal)->
		if Meteor.loggingIn() or !Steedos.userId()
			# 如果是正在登录中或在登录界面，则取localStorage中设置，而不是直接应用空设置
			accountZoomValue = {}
			accountZoomValue.name = localStorage.getItem("accountZoomValue.name")
			accountZoomValue.size = localStorage.getItem("accountZoomValue.size")
		$("body").removeClass("zoom-normal").removeClass("zoom-large").removeClass("zoom-extra-large");
		zoomName = accountZoomValue.name
		zoomSize = accountZoomValue.size
		unless zoomName
			zoomName = "large"
			zoomSize = 1.2
		if zoomName && !Session.get("instancePrint")
			$("body").addClass("zoom-#{zoomName}")
			# if Steedos.isNode()
			# 	if accountZoomValue.size == "1"
			# 		# node-webkit中size为0才表示100%
			# 		zoomSize = 0
			# 	nw.Window.get().zoomLevel = Number.parseFloat(zoomSize)
			# else
			# 	$("body").addClass("zoom-#{zoomName}")
		if isNeedToLocal
			if Meteor.loggingIn()
				# 正在登录中，则不做处理，因为此时Steedos.userId()不足于证明已登录状态
				return
			# 这里特意不在localStorage中存储Steedos.userId()，因为需要保证登录界面也应用localStorage中的设置
			# 登录界面不设置localStorage，因为登录界面accountZoomValue肯定为空，设置的话，会造成无法保持登录界面也应用localStorage中的设置
			if Steedos.userId()
				if accountZoomValue.name
					localStorage.setItem("accountZoomValue.name",accountZoomValue.name)
					localStorage.setItem("accountZoomValue.size",accountZoomValue.size)
				else
					localStorage.removeItem("accountZoomValue.name")
					localStorage.removeItem("accountZoomValue.size")

	Steedos.showHelp = (url)->
		locale = Steedos.getLocale()
		country = locale.substring(3)

		url = url || "http://www.steedos.com/" + country + "/help/"

		window.open(url, '_help', 'EnableViewPortScale=yes')

	Steedos.getUrlWithToken = (url)->
		authToken = {};
		authToken["spaceId"] = Steedos.getSpaceId()
		authToken["X-User-Id"] = Meteor.userId();
		authToken["X-Auth-Token"] = Accounts._storedLoginToken();

		linker = "?"

		if url.indexOf("?") > -1
			linker = "&"

		return url + linker + $.param(authToken)

	Steedos.getAppUrlWithToken = (app_id)->
		authToken = {};
		authToken["spaceId"] = Steedos.getSpaceId()
		authToken["X-User-Id"] = Meteor.userId();
		authToken["X-Auth-Token"] = Accounts._storedLoginToken();
		return "api/setup/sso/" + app_id + "?" + $.param(authToken)

	Steedos.openAppWithToken = (app_id)->
		url = Steedos.getAppUrlWithToken app_id
		url = Steedos.absoluteUrl url

		app = db.apps.findOne(app_id)

		if !app.is_new_window && !Steedos.isMobile() && !Steedos.isCordova()
			window.location = url
		else
			Steedos.openWindow(url);

	Steedos.openUrlWithIE = (url)->
		if url
			if Steedos.isNode()
				exec = nw.require('child_process').exec
				open_url = url
				cmd = "start iexplore.exe \"#{open_url}\""
				exec cmd, (error, stdout, stderr) ->
					if error
						toastr.error error
					return
			else
				Steedos.openWindow(url)

	Steedos.redirectToSignIn = (redirect)->
		signInUrl = AccountsTemplates.getRoutePath("signIn")
		if redirect
			if signInUrl.indexOf("?") > 0
				signInUrl += "&redirect=#{redirect}"
			else
				signInUrl += "?redirect=#{redirect}"
		FlowRouter.go signInUrl

	Steedos.openApp = (app_id)->
		if !Meteor.userId()
			Steedos.redirectToSignIn()
			return true

		app = db.apps.findOne(app_id)
		if !app
			FlowRouter.go("/")
			return

		on_click = app.on_click
		if app.is_use_ie
			if Steedos.isNode()
				exec = nw.require('child_process').exec
				if on_click
					path = "api/app/sso/#{app_id}?authToken=#{Accounts._storedLoginToken()}&userId=#{Meteor.userId()}"
					open_url = window.location.origin + "/" + path
				else
					open_url = Steedos.getAppUrlWithToken app_id
					open_url = window.location.origin + "/" + open_url
				cmd = "start iexplore.exe \"#{open_url}\""
				exec cmd, (error, stdout, stderr) ->
					if error
						toastr.error error
					return
			else
				Steedos.openAppWithToken(app_id)

		else if db.apps.isInternalApp(app.url)
			FlowRouter.go(app.url)

		else if app.is_use_iframe
			if app.is_new_window && !Steedos.isMobile() && !Steedos.isCordova()
				Steedos.openWindow(Steedos.absoluteUrl("apps/iframe/" + app._id))
			else if Steedos.isMobile() || Steedos.isCordova()
				Steedos.openAppWithToken(app_id)
			else
				if FlowRouter.current()?.path != "/apps/iframe/#{app._id}"
					$("body").addClass("loading").addClass("iframe-loading")
				FlowRouter.go("/apps/iframe/#{app._id}")

		else if on_click
			# 这里执行的是一个不带参数的闭包函数，用来避免变量污染
			evalFunString = "(function(){#{on_click}})()"
			try
				eval(evalFunString)
			catch e
				# just console the error when catch error
				console.error "catch some error when eval the on_click script for app link:"
				console.error "#{e.message}\r\n#{e.stack}"
		else
			Steedos.openAppWithToken(app_id)

	Steedos.checkSpaceBalance = (spaceId)->
		unless spaceId
			spaceId = Steedos.spaceId()
		min_months = 1
		if Steedos.isSpaceAdmin()
			min_months = 3
		space = db.spaces.findOne(spaceId)
		end_date = space?.end_date
		if space?.is_paid and end_date != undefined and (end_date - new Date) <= (min_months*30*24*3600*1000)
			# 提示用户余额不足
			toastr.error t("space_balance_insufficient")

	Steedos.setModalMaxHeight = ()->
		accountZoomValue = Steedos.getAccountZoomValue()
		unless accountZoomValue.name
			accountZoomValue.name = 'large'
		switch accountZoomValue.name
			when 'normal'
				if Steedos.isMobile()
					offset = -12
				else
					offset = 75
			when 'large'
				if Steedos.isMobile()
					offset = -6
				else
					# 区分IE浏览器
					if Steedos.detectIE()
						offset = 199
					else
						offset = 9
			when 'extra-large'
				if Steedos.isMobile()
					offset = -26
				else
					# 区分IE浏览器
					if Steedos.detectIE()
						offset = 303
					else
						offset = 53

		if $(".modal").length
			$(".modal").each ->
				headerHeight = 0
				footerHeight = 0
				totalHeight = 0
				$(".modal-header", $(this)).each ->
					headerHeight += $(this).outerHeight(false)
				$(".modal-footer", $(this)).each ->
					footerHeight += $(this).outerHeight(false)

				totalHeight = headerHeight + footerHeight
				height = $("body").innerHeight() - totalHeight - offset
				if $(this).hasClass("cf_contact_modal")
					$(".modal-body",$(this)).css({"max-height": "#{height}px", "height": "#{height}px"})
				else
					$(".modal-body",$(this)).css({"max-height": "#{height}px", "height": "auto"})

	Steedos.getModalMaxHeight = (offset)->
		if Steedos.isMobile()
			reValue = window.screen.height - 126 - 180 - 25
		else
			reValue = $(window).height() - 180 - 25
		unless Steedos.isiOS() or Steedos.isMobile()
			# ios及手机上不需要为zoom放大功能额外计算
			accountZoomValue = Steedos.getAccountZoomValue()
			switch accountZoomValue.name
				when 'large'
					# 测下来这里不需要额外减数
					reValue -= 50
				when 'extra-large'
					reValue -= 145
		if offset
			reValue -= offset
		return reValue + "px";

	Steedos.isiOS = (userAgent, language)->
		DEVICE =
			android: 'android'
			blackberry: 'blackberry'
			desktop: 'desktop'
			ipad: 'ipad'
			iphone: 'iphone'
			ipod: 'ipod'
			mobile: 'mobile'
		browser = {}
		conExp = '(?:[\\/:\\::\\s:;])'
		numExp = '(\\S+[^\\s:;:\\)]|)'
		userAgent = (userAgent or navigator.userAgent).toLowerCase()
		language = language or navigator.language or navigator.browserLanguage
		device = userAgent.match(new RegExp('(android|ipad|iphone|ipod|blackberry)')) or userAgent.match(new RegExp('(mobile)')) or [
			''
			DEVICE.desktop
		]
		browser.device = device[1]
		return browser.device == DEVICE.ipad or browser.device == DEVICE.iphone or browser.device == DEVICE.ipod

	Steedos.getUserOrganizations = (isIncludeParents)->
		userId = Meteor.userId()
		spaceId = Steedos.spaceId()
		space_user = db.space_users.findOne({user:userId,space:spaceId},fields:{organizations:1})
		organizations = space_user?.organizations
		unless organizations
			return []
		if isIncludeParents
			parents = _.flatten db.organizations.find(_id:{$in:organizations}).fetch().getProperty("parents")
			return _.union organizations,parents
		else
			return organizations

	Steedos.forbidNodeContextmenu = (target, ifr)->
		unless Steedos.isNode()
			return
		target.document.body.addEventListener 'contextmenu', (ev) ->
			ev.preventDefault()
			return false
		if ifr
			if typeof ifr == 'string'
				ifr = target.$(ifr)
			ifr.load ->
				ifrBody = ifr.contents().find('body')
				if ifrBody
					ifrBody[0].addEventListener 'contextmenu', (ev) ->
						ev.preventDefault()
						return false

if Meteor.isServer
	Steedos.getUserOrganizations = (spaceId,userId,isIncludeParents)->
		space_user = db.space_users.findOne({user:userId,space:spaceId},fields:{organizations:1})
		organizations = space_user?.organizations
		unless organizations
			return []
		if isIncludeParents
			parents = _.flatten db.organizations.find(_id:{$in:organizations}).fetch().getProperty("parents")
			return _.union organizations,parents
		else
			return organizations

#	Steedos.chargeAPIcheck = (spaceId)->

if Meteor.isServer
	Cookies = Npm.require("cookies")
	#TODO 添加服务端是否手机的判断(依据request)
	Steedos.isMobile = ()->
		return false;

	Steedos.isSpaceAdmin = (spaceId, userId)->
		if !spaceId || !userId
			return false
		space = db.spaces.findOne(spaceId)
		if !space || !space.admins
			return false;
		return space.admins.indexOf(userId)>=0

	Steedos.isLegalVersion = (spaceId,app_version)->
		if !spaceId
			return false
		check = false
		modules = db.spaces.findOne(spaceId)?.modules
		if modules and modules.includes(app_version)
			check = true
		return check

	# 判断数组orgIds中的org id集合对于用户userId是否有组织管理员权限，只要数组orgIds中任何一个组织有权限就返回true，反之返回false
	Steedos.isOrgAdminByOrgIds = (orgIds, userId)->
		isOrgAdmin = false
		useOrgs = db.organizations.find({_id: {$in:orgIds}},{fields:{parents:1,admins:1}}).fetch()
		parents = []
		allowAccessOrgs = useOrgs.filter (org) ->
			if org.parents
				parents = _.union parents,org.parents
			return org.admins?.includes(userId)
		if allowAccessOrgs.length
			isOrgAdmin = true
		else
			parents = _.flatten parents
			parents = _.uniq parents
			if parents.length and db.organizations.findOne({_id:{$in:parents}, admins:userId})
				isOrgAdmin = true
		return isOrgAdmin


	# 判断数组orgIds中的org id集合对于用户userId是否有全部组织管理员权限，只有数组orgIds中每个组织都有权限才返回true，反之返回false
	Steedos.isOrgAdminByAllOrgIds = (orgIds, userId)->
		unless orgIds.length
			return true
		i = 0
		while i < orgIds.length
			isOrgAdmin = Steedos.isOrgAdminByOrgIds [orgIds[i]], userId
			unless isOrgAdmin
				break
			i++
		return isOrgAdmin

	Steedos.absoluteUrl = (url)->
		if url
			# url以"/"开头的话，去掉开头的"/"
			url = url.replace(/^\//,"")
		if (Meteor.isCordova)
			return Meteor.absoluteUrl(url);
		else
			if Meteor.isClient
				try
					root_url = new URL(Meteor.absoluteUrl())
					if url
						return root_url.pathname + url
					else
						return root_url.pathname
				catch e
					return Meteor.absoluteUrl(url)
			else
				Meteor.absoluteUrl(url)

	#	通过request.headers、cookie 获得有效用户
	Steedos.getAPILoginUser	= (req, res) ->

		username = req.query?.username

		password = req.query?.password

		if username && password
			user = db.users.findOne({steedos_id: username})

			if !user
				return false

			result = Accounts._checkPassword user, password

			if result.error
				throw new Error(result.error)
			else
				return user

		userId = req.query?["X-User-Id"]

		authToken = req.query?["X-Auth-Token"]

		if Steedos.checkAuthToken(userId,authToken)
			return db.users.findOne({_id: userId})

		cookies = new Cookies(req, res);

		if req.headers
			userId = req.headers["x-user-id"]
			authToken = req.headers["x-auth-token"]

		# then check cookie
		if !userId or !authToken
			userId = cookies.get("X-User-Id")
			authToken = cookies.get("X-Auth-Token")

		if !userId or !authToken
			return false

		if Steedos.checkAuthToken(userId, authToken)
			return db.users.findOne({_id: userId})

		return false

	#	检查userId、authToken是否有效
	Steedos.checkAuthToken = (userId, authToken) ->
		if userId and authToken
			hashedToken = Accounts._hashLoginToken(authToken)
			user = Meteor.users.findOne
				_id: userId,
				"services.resume.loginTokens.hashedToken": hashedToken
			if user
				return true
			else
				return false
		return false


if Meteor.isServer
	crypto = Npm.require('crypto');
	Steedos.decrypt = (password, key, iv)->
		try
			key32 = ""
			len = key.length
			if len < 32
				c = ""
				i = 0
				m = 32 - len
				while i < m
					c = " " + c
					i++
				key32 = key + c
			else if len >= 32
				key32 = key.slice(0, 32)

			decipher = crypto.createDecipheriv('aes-256-cbc', new Buffer(key32, 'utf8'), new Buffer(iv, 'utf8'))

			decipherMsg = Buffer.concat([decipher.update(password, 'base64'), decipher.final()])

			password = decipherMsg.toString();
			return password;
		catch e
			return password;

	Steedos.encrypt = (password, key, iv)->
		key32 = ""
		len = key.length
		if len < 32
			c = ""
			i = 0
			m = 32 - len
			while i < m
				c = " " + c
				i++
			key32 = key + c
		else if len >= 32
			key32 = key.slice(0, 32)

		cipher = crypto.createCipheriv('aes-256-cbc', new Buffer(key32, 'utf8'), new Buffer(iv, 'utf8'))

		cipheredMsg = Buffer.concat([cipher.update(new Buffer(password, 'utf8')), cipher.final()])

		password = cipheredMsg.toString('base64')

		return password;

	Steedos.getUserIdFromAccessToken = (access_token)->

		if !access_token
			return null;

		userId = access_token.split("-")[0]

		hashedToken = Accounts._hashLoginToken(access_token)

		user = db.users.findOne({_id: userId, "secrets.hashedToken": hashedToken})

		if user
			return userId
		else
			# 如果user表未查到，则使用oauth2协议生成的token查找用户
			collection = oAuth2Server.collections.accessToken

			obj = collection.findOne({'accessToken': access_token})
			if obj
				# 判断token的有效期
				if obj?.expires < new Date()
					return "oauth2 access token:"+access_token+" is expired."
				else
					return obj?.userId
			else
				return "oauth2 access token:"+access_token+" is not found."
		return null

	Steedos.getUserIdFromAuthToken = (req, res)->

		userId = req.query?["X-User-Id"]

		authToken = req.query?["X-Auth-Token"]

		if Steedos.checkAuthToken(userId,authToken)
			return db.users.findOne({_id: userId})?._id

		cookies = new Cookies(req, res);

		if req.headers
			userId = req.headers["x-user-id"]
			authToken = req.headers["x-auth-token"]

		# then check cookie
		if !userId or !authToken
			userId = cookies.get("X-User-Id")
			authToken = cookies.get("X-Auth-Token")

		if !userId or !authToken
			return null

		if Steedos.checkAuthToken(userId, authToken)
			return db.users.findOne({_id: userId})?._id

	Steedos.APIAuthenticationCheck = (req, res) ->
		try
			userId = req.userId

			user = db.users.findOne({_id: userId})

			if !userId || !user
				JsonRoutes.sendResult res,
					data:
						"error": "Validate Request -- Missing X-Auth-Token,X-User-Id Or access_token",
					code: 401,
				return false;
			else
				return true;
		catch e
			if !userId || !user
				JsonRoutes.sendResult res,
					code: 401,
					data:
						"error": e.message,
						"success": false
				return false;


# This will add underscore.string methods to Underscore.js
# except for include, contains, reverse and join that are
# dropped because they collide with the functions already
# defined by Underscore.js.

mixin = (obj) ->
	_.each _.functions(obj), (name) ->
		if not _[name] and not _.prototype[name]?
			func = _[name] = obj[name]
			_.prototype[name] = ->
				args = [this._wrapped]
				push.apply(args, arguments)
				return result.call(this, func.apply(_, args))

#mixin(_s.exports())

if Meteor.isServer
# 判断是否是节假日
	Steedos.isHoliday = (date)->
		if !date
			date = new Date
		check date, Date
		day = date.getDay()
		# 周六周日为假期
		if day is 6 or day is 0
			return true

		return false
	# 根据传入时间(date)计算几个工作日(days)后的时间,days目前只能是整数
	Steedos.caculateWorkingTime = (date, days)->
		check date, Date
		check days, Number
		param_date = new Date date
		caculateDate = (i, days)->
			if i < days
				param_date = new Date(param_date.getTime() + 24*60*60*1000)
				if !Steedos.isHoliday(param_date)
					i++
				caculateDate(i, days)
			return
		caculateDate(0, days)
		return param_date

	# 计算半个工作日后的时间
	# 参数 next如果为true则表示只计算date时间后面紧接着的time_points
	Steedos.caculatePlusHalfWorkingDay = (date, next) ->
		check date, Date
		time_points = Meteor.settings.remind?.time_points
		if not time_points or _.isEmpty(time_points)
			console.error "time_points is null"
			time_points = [{"hour": 8, "minute": 30 }, {"hour": 14, "minute": 30 }]

		len = time_points.length
		start_date = new Date date
		end_date = new Date date
		start_date.setHours time_points[0].hour
		start_date.setMinutes time_points[0].minute
		end_date.setHours time_points[len - 1].hour
		end_date.setMinutes time_points[len - 1].minute

		caculated_date = new Date date

		j = 0
		max_index = len - 1
		if date < start_date
			if next
				j = 0
			else
				# 加半个time_points
				j = len/2
		else if date >= start_date and date < end_date
			i = 0
			while i < max_index
				first_date = new Date date
				second_date = new Date date
				first_date.setHours time_points[i].hour
				first_date.setMinutes time_points[i].minute
				second_date.setHours time_points[i + 1].hour
				second_date.setMinutes time_points[i + 1].minute

				if date >= first_date and date < second_date
					break

				i++

			if next
				j = i + 1
			else
				j = i + len/2

		else if date >= end_date
			if next
				j = max_index + 1
			else
				j = max_index + len/2

		if j > max_index
			# 隔天需判断节假日
			caculated_date = Steedos.caculateWorkingTime date, 1
			caculated_date.setHours time_points[j - max_index - 1].hour
			caculated_date.setMinutes time_points[j - max_index - 1].minute
		else if j <= max_index
			caculated_date.setHours time_points[j].hour
			caculated_date.setMinutes time_points[j].minute

		return caculated_date

if Meteor.isServer
	_.extend Steedos,
		getSteedosToken: (appId, userId, authToken)->
			crypto = Npm.require('crypto')
			app = db.apps.findOne(appId)
			if app
				secret = app.secret

			if userId and authToken
				hashedToken = Accounts._hashLoginToken(authToken)
				user = Meteor.users.findOne
					_id: userId,
					"services.resume.loginTokens.hashedToken": hashedToken
				if user
					steedos_id = user.steedos_id
					if app.secret
						iv = app.secret
					else
						iv = "-8762-fcb369b2e8"
					now = parseInt(new Date().getTime()/1000).toString()
					key32 = ""
					len = steedos_id.length
					if len < 32
						c = ""
						i = 0
						m = 32 - len
						while i < m
							c = " " + c
							i++
						key32 = steedos_id + c
					else if len >= 32
						key32 = steedos_id.slice(0,32)

					cipher = crypto.createCipheriv('aes-256-cbc', new Buffer(key32, 'utf8'), new Buffer(iv, 'utf8'))

					cipheredMsg = Buffer.concat([cipher.update(new Buffer(now, 'utf8')), cipher.final()])

					steedos_token = cipheredMsg.toString('base64')

			return steedos_token

		locale: (userId, isI18n)->
			user = db.users.findOne({_id:userId},{fields: {locale: 1}})
			locale = user?.locale
			if isI18n
				if locale == "en-us"
					locale = "en"
				if locale == "zh-cn"
					locale = "zh-CN"
			return locale

		checkUsernameAvailability: (username) ->
			return not Meteor.users.findOne({ username: { $regex : new RegExp("^" + s.trim(s.escapeRegExp(username)) + "$", "i") } })


		validatePassword: (pwd)->
			reason = t "password_invalid"
			valid = true
			unless pwd
				valid = false
			unless /\d+/.test(pwd)
				valid = false
			unless /[a-zA-Z]+/.test(pwd)
				valid = false
			if pwd.length < 8
				valid = false
			if valid
				return true
			else
				return error:
					reason: reason

Steedos.convertSpecialCharacter = (str)->
	return str.replace(/([\^\$\(\)\*\+\?\.\\\|\[\]\{\}])/g, "\\$1")

Steedos.removeSpecialCharacter = (str)->
	return str.replace(/([\^\$\(\)\*\+\?\.\\\|\[\]\{\}\~\`\@\#\%\&\=\'\"\:\;\<\>\,\/])/g, "")