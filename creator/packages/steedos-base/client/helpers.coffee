import {moment} from 'meteor/momentjs:moment';

Steedos.Helpers =

	isPad: ()->
		return /iP(ad)/.test(navigator.userAgent)

	getAppTitle: ()->
		t = Session.get("app_title")
		if t
			return t
		else
			return "Steedos"

	# 根据当前路由路径前缀，得到当前所属app名字
	getAppName: (path)->
		app = Steedos.getCurrentApp(path)
		if app
			return app.name
		else
			return ""

	# 根据当前路由路径前缀，得到当前所属app
	getCurrentApp: (path)->
		unless path
			path = Session.get "router-path"
		unless path
			return null
		if /^\/?apps\/iframe\/.+/.test(path)
			# 格式如："/apps/iframe/xxx..."这般，则取出xxx作为appId
			appId = path.match(/^\/?apps\/iframe\/([^\/?]+)\b/)?[1]
			if appId
				return db.apps.findOne(appId)
			else
				return null
		else if /^\/?[^\/?]+\b/.test(path)
			# 格式如："/xxx..."这般，则取出xxx作为rootName
			# 并以"/" + rootName作为app的url，来搜索app
			rootName = path.match(/^\/?([^\/?]+)\b/)?[1]
			if rootName
				reg = new RegExp("^\/?#{rootName}\\b")
				return db.apps.findOne({url: reg})
			else
				return null
		else
			return null

	getUserId: ()->
		return Meteor.userId()

	setAppTitle: (title)->
		Session.set("app_title", title);
		document.title = title;

	getLocale: ()->
		return Session.get("steedos-locale")

	# （1）1小时之内的，显示为 “＊分钟前”，鼠标移动到时 显示日期
	# （2）1-24小时之内的，显示为 “＊小时前”，鼠标移动到时 显示日期
	# （3）当年的 ，显示为 “月－日”如“2-20”
	# （4）去年及之前的，显示为“年－月－日”如“2015-4-20”
	momentFromNow: (time)->
		unless time instanceof Date
			return ""
		now = new Date()
		hoursPart = Math.floor((now.getTime() - time.getTime())/(60*60*1000))
		timeMoment = moment(time)
		if hoursPart < 24
			return timeMoment.fromNow()
		else if now.getFullYear() == time.getFullYear()
			return timeMoment.format('MM-DD')
		else
			return timeMoment.format('YYYY-MM-DD')

	# 10分钟更新一次moment结果
	momentReactiveFromNow: (time)->
		#Steedos.deps?.miniute?.depend()
		return Steedos.momentFromNow(time)

	afModalInsert: ->
		return t "afModal_insert"

	afModalUpdate: ->
		return t "afModal_update"

	afModalRemove: ->
		return t "afModal_remove"

	afModalCancel: ->
		return t "afModal_cancel"

	isPhoneEnabled: ->
		return !!Meteor.settings?.public?.phone

	validatePassword: (pwd)->
		reason = t "password_invalid"
		valid = true
		unless pwd
			valid = false

		passworPolicy = Meteor.settings.public?.password?.policy
		passworPolicyError = Meteor.settings.public?.password?.policyError
		if passworPolicy
			if !(new RegExp(passworPolicy)).test(pwd || '')
				reason = passworPolicyError
				valid = false
			else
				valid = true
#		else
#			unless /\d+/.test(pwd)
#				valid = false
#			unless /[a-zA-Z]+/.test(pwd)
#				valid = false
#			if pwd.length < 8
#				valid = false
		if valid
			return true
		else
			return error:
				reason: reason

	handleOpenURL: (url)->
		search = url.split('?')[1]
		if search
			urlQuery = (name)->
				reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)")
				r = search.match(reg)
				if r isnt null
					return unescape(r[2])
				return null
			space_id = urlQuery('space_id')
			ins_id = urlQuery('ins_id')
			if space_id and ins_id
				FlowRouter.go("/workflow/space/#{space_id}/inbox/#{ins_id}")

	notificationOpened: (extras)->
		extra_obj = {}
		extras.forEach (e)->
			extra_obj[Object.keys(e)[0]] = Object.values(e)[0]
		space_id = extra_obj.space
		ins_id = extra_obj.instance
		if space_id and ins_id
			FlowRouter.go("/workflow/space/#{space_id}/inbox/#{ins_id}")

	isAppActive: (app)->
		path = Session.get("router-path")
		unless path
			return false
		
		isUrl = if typeof app is "string" then true else false
		current_app_id = Steedos.getCurrentAppId()
		if !isUrl and current_app_id
			return current_app_id == app._id
		
		if !isUrl and !current_app_id
			# 刷新浏览器时，判断如果是id不是workflow但url是workflow的话不要选中，以避免选中两个workflow
			if app._id != "workflow"
				appUrl = db.apps.findOne(app._id).url
				if /^\/?workflow\b/.test(appUrl)
					return false

		if !isUrl and /^\/apps\/iframe\/.+/.test path
			# 以/apps/iframe/开头的url，则检查后面的id是否正好为app._id
			matchs = path.match("/apps/iframe/#{app._id}")
			if matchs and matchs.index == 0
				return true
			else
				return false

		url = if isUrl then app else app.url
		#要加"/"检测是因为url可能以"/"结尾，而path不是以"/"结尾
		matchs = (path + "/").match(url)
		if matchs and matchs.index == 0
			return true

	coreformNumberToString: (number, locale)->
		return Steedos.numberToString number, locale

	selfCompanyOrganizationIds: ()->
		# 返回当前用户所属公司的关联组织Id集合
		company_ids = Steedos.getUserCompanyOrganizationIds()
		return if company_ids?.length then company_ids else null

_.extend Steedos, Steedos.Helpers

Template.registerHelpers = (dict) ->
	_.each dict, (v, k)->
		Template.registerHelper k, v

Template.registerHelpers Steedos.Helpers

TemplateHelpers =

	equals: (a, b)->
		return a == b

	session: (v)->
		return Session.get(v)

	absoluteUrl: (url, realAbsolute)->
		if url
			# url以"/"开头的话，去掉开头的"/"
			url = url.replace(/^\//,"")
		if (Meteor.isCordova)
			return Meteor.absoluteUrl(url);
		else
			if Meteor.isClient
				try
					root_url = new URL(Meteor.absoluteUrl())
					origin = if realAbsolute then window.location.origin else ''
					if url
						return origin + root_url.pathname + url
					else
						return origin + root_url.pathname
				catch e
					return Meteor.absoluteUrl(url)
			else
				Meteor.absoluteUrl(url)

	urlPrefix: ->
		return __meteor_runtime_config__.ROOT_URL_PATH_PREFIX

	isMobile: ->
		return $(window).width() < 767

	isAndroidOrIOS: ->
		return Steedos.isAndroidApp() || Steedos.isiOS()

	userId: ->
		return Meteor.userId()

	userName: ->
		return Meteor.user()?.name

	userAvatarURL: () ->
		avatar = Meteor.user()?.avatar
		return Steedos.absoluteUrl("avatar/#{Meteor.userId()}?avatar=#{avatar}");

	setSpaceId: (spaceId)->
		console.log("set spaceId " + spaceId)
		if !spaceId
			Session.set("spaceId", null)
			localStorage.removeItem("spaceId:" + Meteor.userId())
			localStorage.removeItem("spaceId")
		else if spaceId != Session.get("spaceId")
			Session.set("flowId", undefined);
			Session.set("spaceId", spaceId)
			localStorage.setItem("spaceId", spaceId)
			Steedos.checkSpaceBalance spaceId

	getSpaceId: ()->
		# find space from session and local storage

		return Session.get("spaceId")

	isSpaceAdmin: (spaceId)->
		if !spaceId
			spaceId = Steedos.getSpaceId()
		if spaceId
			s = db.spaces.findOne(spaceId)
			if s
				return s.admins?.includes(Meteor.userId())

	isSpaceOwner: (spaceId)->
		if !spaceId
			spaceId = Steedos.getSpaceId()
		if spaceId
			s = db.spaces.findOne(spaceId)
			if s
				return s.owner == Meteor.userId()

	spaceId: ()->
		return Steedos.getSpaceId();

	spaceName: (spaceId)->
		if !spaceId
			spaceId = Steedos.getSpaceId()
		if spaceId
			space = db.spaces.findOne(spaceId)
			if space
				return space.name

	spaces: ->
		return db.spaces.find();

	isPaidSpace: (spaceId)->
		if !spaceId
			spaceId = Steedos.getSpaceId()
		if spaceId
			space = db.spaces.findOne(spaceId)
			if space
				return space.is_paid

	isLegalVersion: (spaceId,app_version)->
		if !spaceId
			spaceId = Steedos.getSpaceId()
		check = false
		modules = db.spaces.findOne(spaceId)?.modules
		if modules and modules.includes(app_version)
			check = true
		return check
	
	isCloudAdmin: ->
		return Meteor.user()?.is_cloudadmin

	isOrgAdmin: (orgId)->
		if Steedos.isSpaceAdmin()
			return true
		unless orgId
			return false
		currentOrg = SteedosDataManager.organizationRemote.findOne(orgId)
		unless currentOrg
			return false
		userId = Steedos.userId()
		if currentOrg?.admins?.includes(userId)
			return true
		else
			if currentOrg?.parent and SteedosDataManager.organizationRemote.findOne({_id:{$in:currentOrg.parents}, admins:{$in:[userId]}})
				return true
			else
				return false

	getSpaceApps: ()->
		organizations = Steedos.getUserOrganizations(true)
		userId = Meteor.userId()
		selector = $or: [
			{ space:{ $exists: false } }
			{ 'members.organizations': $in: organizations }
			{ 'members.users': $in: [ userId ] }
		]
		# if Steedos.getSpaceId()
		# 	space = db.spaces.findOne(Steedos.getSpaceId())
			# if space?.apps_enabled?.length>0
			# 	selector._id = {$in: space.apps_enabled}
		if Steedos.isMobile()
			selector.mobile = true

		apps = Session.get("apps")
		if apps and apps instanceof Array
			selector["_id"] = {$in:apps};
		return db.apps.find(selector, {sort: {sort: 1}});

	getSpaceFirstApp: ()->
		selector = {}
		if Steedos.getSpaceId()
			space = db.spaces.findOne(Steedos.getSpaceId())
			# if space?.apps_enabled?.length>0
			# 	selector._id = {$in: space.apps_enabled}
		if Steedos.isMobile()
			selector.mobile = true
		return db.apps.findOne(selector, {sort: {sort: 1}})

	getSpaceTopApps: (count)->
		unless count
			count = 1
		selector = {}
		if Steedos.getSpaceId()
			space = db.spaces.findOne(Steedos.getSpaceId())
			# if space?.apps_enabled?.length>0
			# 	selector._id = {$in: space.apps_enabled}
		if Steedos.isMobile()
			selector.mobile = true
		return db.apps.find(selector, {sort: {sort: 1}, limit: count})

	getSpaceAppById: (app_id)->
		selector = {}
		if Steedos.getSpaceId()
			space = db.spaces.findOne(Steedos.getSpaceId())
			# if space?.apps_enabled?.length>0
			# 	selector._id = {$in: space.apps_enabled}
		if Steedos.isMobile()
			selector.mobile = true
		selector._id = "#{app_id}"
		return db.apps.findOne(selector)

	getSpaceAppByUrl: (app_url)->
		selector = {}
		if Steedos.getSpaceId()
			space = db.spaces.findOne(Steedos.getSpaceId())
			# if space?.apps_enabled?.length>0
			# 	selector._id = {$in: space.apps_enabled}
		if Steedos.isMobile()
			selector.mobile = true
		selector.url = "#{app_url}"
		return db.apps.findOne(selector)

	# getLocale: ()->
	# 	if Meteor.user()?.locale
	# 		locale = Meteor.user().locale
	# 	else
	# 		l = window.navigator.userLanguage || window.navigator.language || 'en'
	# 		if l.indexOf("zh") >=0
	# 			locale = "zh-cn"
	# 		else
	# 			locale = "en-us"

	getBadge: (appId, spaceId)->
		appId = if appId then appId else Steedos.getAppName()
		if !appId
			return;
		badge = 0
		if appId == "chat"
			if db.rocketchat_subscription
				subscriptions = db.rocketchat_subscription.find().fetch()
				_.each subscriptions, (s)->
					badge = badge + s.unread
		else if appId == "cms"
			# spaceId为空时统计所有space计数值，返回不计数
			if spaceId
				badge = 0
			else
				if db.cms_unreads
					badge = db.cms_unreads.find({user: Meteor.userId()}).count()
		else if appId == "calendar"
			calendarid = Session.get("defaultcalendarid")
			userId = Meteor.userId()
			today = moment(moment().format("YYYY-MM-DD 00:00")).toDate()
			endLine = moment().toDate()
			selector = 
				{
					calendarid: calendarid,
					start: {$gte:today},
					end: {$gte: endLine},
					"attendees": {
						$elemMatch: {
							id: userId,
							partstat: "NEEDS-ACTION"
						}
					}
				}
			badge = Events?.find(selector).count()
		else
			appUrl = db.apps.findOne(appId)?.url
			# 如果appId不为workflow，但是url为/workflow格式则按workflow这个app来显示badge
			if /^\/?workflow\b/.test(appUrl)
				appId = "workflow"
			# spaceId为空时统计所有space计数值
			spaceSelector = if spaceId then {user: Meteor.userId(), space: spaceId, key: "badge"} else {user: Meteor.userId(), space: null, key: "badge"}
			b = db.steedos_keyvalues.findOne(spaceSelector)
			if b
				badge = b.value?[appId]

		if badge
			return badge

	getWorkflowCategoriesBadge: (workflow_categories, spaceId)->
		count = 0
		$.ajax
			url: Steedos.absoluteUrl('/api/workflow/open/pending?limit=0&spaceId=' + spaceId + "&workflow_categories=" + workflow_categories.join(','))
			type: 'get'
			async: false
			dataType: 'json'
			success: (responseText, status)->
				if (responseText.errors)
					toastr.error(responseText.errors);
					return;
				count = responseText.count;
			error: (xhr, msg, ex) ->
				toastr.error(msg);
		if count
			return count

	locale: (isI18n)->
		locale = Steedos.getLocale()
		if isI18n
			if locale == "en-us"
				locale = "en"
			if locale == "zh-cn"
				locale = "zh-CN"
		return locale

	country: ->
		locale = Steedos.getLocale()
		if locale == "zh-cn"
			return "cn"
		else
			return "us"

	fromNow: (posted)->
		return moment(posted).fromNow()

	dateFormat: (value, formatString) ->
		if !formatString
			formatString = "YYYY-MM-DD"
		return moment(value).format(formatString)

	isPaid: (app)->
		if !app
			app = "workflow"
		if Session.get('spaceId')
			space = db.spaces.findOne(Session.get('spaceId'))
			if space?.apps_paid?.length >0
				return _.indexOf(space.apps_paid, app)>=0

	isAndroidApp: ()->
		if Meteor.isCordova
			if device?.platform == "Android"
				return true

		return false

	loginWithCookie: (onSuccess) ->
		userId = Steedos.getCookie("X-User-Id")
		authToken = Steedos.getCookie("X-Auth-Token")
		if userId and authToken
			if Meteor.userId() != userId
				Accounts.connection.setUserId(userId);
				Accounts.loginWithToken authToken,  (err) ->
					if (err)
						Meteor._debug("Error logging in with token: " + err);
						Accounts.makeClientLoggedOut();
					else if onSuccess
						onSuccess();
			else
				onSuccess()

	getCookie: (name)->
		pattern = RegExp(name + "=.[^;]*")
		matched = document.cookie.match(pattern)
		if(matched)
			cookie = matched[0].split('=')
			return cookie[1]
		return false

	isNotSync: (spaceId)->
		if !spaceId
			spaceId = Steedos.getSpaceId()
		if spaceId
			space = db.spaces.findOne({_id:spaceId,imo_cid:{$exists:false},"services.bqq.company_id":{$exists:false},"services.dingtalk.corp_id":{$exists:false}})
			if space
				return true

	isNode: ()->
		return nw?.require?

	detectIE: ()->
		ua = window.navigator.userAgent
		msie = ua.indexOf('MSIE ')
		if msie > 0
			# IE 10 or older => return version number
			return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10)
		trident = ua.indexOf('Trident/')
		if trident > 0
			# IE 11 => return version number
			rv = ua.indexOf('rv:')
			return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10)
		edge = ua.indexOf('Edge/')
		if edge > 0
			# Edge (IE 12+) => return version number
			return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10)
		# other browser
		false

	isIE: ()->
		d = Steedos.detectIE()
		if d && d < 12
			return true
		false

	isOfficeFile: (filename) ->
		#无文件类型时
		if filename.split('.').length < 2
			return false
		# 获取文件类型
		_exp = filename.split('.').pop().toLowerCase()
		switch _exp
			when 'doc'
				return true
			when 'docx'
				return true
			when 'xls'
				unless Steedos.isNode()
					return true
			when 'xlsx'
				unless Steedos.isNode()
					return true
			when 'ppt'
				unless Steedos.isNode()
					return true
			when 'pptx'
				unless Steedos.isNode()
					return true
			else
				return false
		false

	isPdfFile: (filename) ->
		# 无文件类型时
		if filename.split('.').length < 2
			return false
		# 获取文件类型
		type = filename.split('.').pop().toLowerCase()
		
		if type == 'pdf'
			return true
		
		false
	
	isExcelFile: (filename) ->
		# 无文件类型时
		if filename.split('.').length < 2
			return false
		# 获取文件类型
		type = filename.split('.').pop().toLowerCase()
		
		if (type == 'xlsx') || (type == 'xls')
			return true
		
		false

	isTiffFile: (filename) ->
		# 无文件类型时
		if filename.split('.').length < 2
			return false
		# 获取文件类型
		type = filename.split('.').pop().toLowerCase()
		
		if type == "tif"
			return true
		
		false

	isTextFile: (filename) ->
		# 无文件类型时
		if filename.split('.').length < 2
			return false
		# 获取文件类型
		type = filename.split('.').pop().toLowerCase()
		
		if type == "txt"
			return true
		
		false

	isPPTFile: (filename) ->
		# 无文件类型时
		if filename.split('.').length < 2
			return false
		# 获取文件类型
		type = filename.split('.').pop().toLowerCase()
		
		if (type == "ppt") || (type == "pptx")
			return true
		
		false
	
	isMac: ()->
		os = navigator.platform
		macs = ['Mac68K', 'MacPPC', 'Macintosh', 'MacIntel']
		if (macs.includes(os))
			return true
		false

	cordovaDownload: (url, filename, rev, length) ->
		if not cordova?.plugins?.fileOpener2
			window.open(url, '_blank', 'EnableViewPortScale=yes')
			return

		$(document.body).addClass 'loading'
		# fileName = rev + '-' + filename
		fileName = filename
		size = length
		if typeof length == 'string'
			size = length.to_float()

		directory = ""
		if Steedos.isAndroidApp()
			directory = cordova.file.externalCacheDirectory
		else
			directory = cordova.file.cacheDirectory

		window.resolveLocalFileSystemURL directory, ((directoryEntry) ->
			directoryEntry.getFile fileName, {
				create: true
				exclusive: false
			}, ((fileEntry) ->
				fileEntry.file ((file) ->
					if file.size == size
						$(document.body).removeClass 'loading'
						window.open fileEntry.toURL(), '_system', 'EnableViewPortScale=yes'
					else
						sPath = fileEntry.toURL()
						fileTransfer = new FileTransfer
						fileEntry.remove()
						fileTransfer.download url, sPath, ((theFile) ->
							$(document.body).removeClass 'loading'
							window.open theFile.toURL(), '_system', 'EnableViewPortScale=yes'
						), (error) ->
							$(document.body).removeClass 'loading'
							console.error 'download error source' + error.source
							console.error 'download error target' + error.target
							console.error 'upload error code: ' + error.code
				), (error) ->
					$(document.body).removeClass 'loading'
					console.error 'upload error code: ' + error.code
			), (error) ->
				$(document.body).removeClass 'loading'
				console.error 'get directoryEntry error source' + error.source
				console.error 'get directoryEntry error target' + error.target
				console.error 'get directoryEntry error code:' + error.code
		), (error) ->
			$(document.body).removeClass 'loading'
			console.error 'resolveLocalFileSystemURL error code' + error.code

	skinName: (defaultName)->
		unless defaultName
			defaultName = "blue"
		# accountSkinValue = Steedos.getAccountSkinValue()
		# return if accountSkinValue.name then accountSkinValue.name else defaultName
		return defaultName

	avatarUrl: (avatar)->
		return Meteor.absoluteUrl('api/files/avatars/' + avatar)

	isZoomNormal: ()->
		name = Steedos.getAccountZoomValue().name
		unless name
			return true
		return name == "normal"

	isCordova: ()->
		return Meteor.isCordova

_.extend Steedos, TemplateHelpers

Template.registerHelpers TemplateHelpers
