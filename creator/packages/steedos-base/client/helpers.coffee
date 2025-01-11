moment = require('meteor/momentjs:moment').moment;
DOCUMENT_TITLE_SUFFIX = "Steedos";
DOCUMENT_TITLE_PROPS = {
	suffix: DOCUMENT_TITLE_SUFFIX,
	separator: " | ",
	tabName: '',
	pageName: ''
}

Meteor.startup(()->
	if Meteor.settings.public?.platform?.is_oem && Meteor.settings.public?.platform?.licensed_to
		DOCUMENT_TITLE_SUFFIX = Meteor.settings.public.platform.licensed_to;
		DOCUMENT_TITLE_PROPS.suffix = DOCUMENT_TITLE_SUFFIX;
		document.title = DOCUMENT_TITLE_SUFFIX
)

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

	setDocumentTitle: (props)->
		if _.has(props, 'tabName') && DOCUMENT_TITLE_PROPS.tabName != props.tabName
			props.pageName = ''
		DOCUMENT_TITLE_PROPS = Object.assign(DOCUMENT_TITLE_PROPS, props);
		titles = [];
		if DOCUMENT_TITLE_PROPS.pageName
			if _.isArray(DOCUMENT_TITLE_PROPS.pageName)
				_.each(DOCUMENT_TITLE_PROPS.pageName, (_pageName)->
					titles.push _pageName
				)
			else
				titles.push DOCUMENT_TITLE_PROPS.pageName
		if DOCUMENT_TITLE_PROPS.tabName
			titles.push DOCUMENT_TITLE_PROPS.tabName
		if DOCUMENT_TITLE_PROPS.suffix
			titles.push DOCUMENT_TITLE_PROPS.suffix
		Steedos.setAppTitle(titles.join(DOCUMENT_TITLE_PROPS.separator));

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

		passwordConfig = Meteor.settings?.public?.password

		passwordPolicy = passwordConfig?.policy

		passwordPolicyError = passwordConfig?.policyError || passwordConfig?.policyerror || "密码不符合规则"

		passworPolicies = passwordConfig?.policies

		policyFunction = passwordConfig?.policyFunction

		if valid && passwordPolicy
			if !(new RegExp(passwordPolicy)).test(pwd || '')
				reason = passwordPolicyError
				valid = false
			else
				valid = true

		if valid && passworPolicies
			for item in passworPolicies
				if valid
					if !(new RegExp(item.policy)).test(pwd || '')
						reason = item.policyError || '密码不符合规则'
						valid = false
					else
						valid = true

		if valid && policyFunction
			try
				window.eval("var fun = " + policyFunction);
				fun(pwd);
				valid = true
			catch e
				valid = false
				reason = e.message
			
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
		return Steedos.numberToString number

	selfCompanyOrganizationIds: ()->
		# 返回当前用户所属公司的关联组织Id集合
		company_ids = Steedos.getUserCompanyOrganizationIds()
		return if company_ids?.length then company_ids else null

	getObjectBadge: (object, appId)->
		spaceId = Steedos.getSpaceId()
		unless appId
			appId = Session.get("app_id")
		if typeof appId == "object"
			console.log("zero....");
			return 0
		if object?.name == "instances"
			return Steedos.getWorkflowBadge(appId)
			# return Steedos.getInstanceBadge(appId, spaceId)

	getUserRouter: (userId)->
		if !userId
			userId = Steedos.userId();
			space_userId = db.space_users.findOne({user: userId, space: Steedos.spaceId()})._id;
		return "/app/admin/space_users/view/#{space_userId}?ref=users"

	getOpenWindowScript: (href)->
		return "window.open('#{href}','_blank','width=800, height=600, left=50, top= 50, toolbar=no, status=no, menubar=no, resizable=yes, scrollbars=yes');event.stopPropagation();return false;"

	getUserOrganizationsPathLabel: (organizations_parents)->
		if organizations_parents
			labels = organizations_parents.map (org)->
				return org._NAME_FIELD_VALUE
			return labels.reverse().join(" / ")

	objectUrl: (object_name, record_id, app_id)->
		return Creator.getObjectUrl(object_name, record_id, app_id)

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
			s = db.spaces.findOne(spaceId,{fields:{admins:1}})
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
				return true

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

	# getWorkflowBadge: ()->
	# 	if _.isEmpty(Session.get("workflow_categories"))
	# 		# categorys = WorkflowManager.getSpaceCategories(Session.get("spaceId"), Session.get("workflow_categories"))
	# 		# if categorys?.length
	# 		# 	# 有分类时，数量只显示在分类下面的子菜单，即流程菜单链接的右侧，总菜单不计算和显示数量
	# 		# 	return ""
	# 		spaceId = Steedos.spaceId()
	# 		return Steedos.getBadge("workflow", spaceId)
	# 	else
	# 		getInboxCount = (categoryIds)->
	# 			count = 0
	# 			flow_instances = db.flow_instances.findOne(Steedos.getSpaceId())
	# 			categoryIds.forEach (categoryId)->
	# 				_.each flow_instances?.flows, (_f)->
	# 					if _f.category == categoryId
	# 						count += _f?.count || 0
	# 			return count
	# 		count = getInboxCount(Session.get("workflow_categories"))
	# 		if count
	# 			return count

	getWorkflowBadge: (appId)->
		result = 0
		workflow_categories = _.pluck(db.categories.find({app: appId}).fetch(), '_id')
		if _.isEmpty(workflow_categories)
			# categorys = WorkflowManager.getSpaceCategories(Session.get("spaceId"), Session.get("workflow_categories"))
			# if categorys?.length
			# 	# 有分类时，数量只显示在分类下面的子菜单，即流程菜单链接的右侧，总菜单不计算和显示数量
			# 	return ""
			spaceId = Steedos.spaceId()
			result = Steedos.getBadge("workflow", spaceId)
		else
			getInboxCount = (categoryIds)->
				count = 0
				flow_instances = db.flow_instances.findOne(Steedos.getSpaceId())
				categoryIds.forEach (categoryId)->
					_.each flow_instances?.flows, (_f)->
						if _f.category == categoryId
							count += _f?.count || 0
				return count
			# count = getInboxCount(Session.get("workflow_categories"))
			count = getInboxCount(workflow_categories)
			if count
				result = count
		# 客户端推送依赖了订阅raix_push_notifications，可能不稳定，这里拿到最新数据后再播放一次客户端推送效果
		Steedos.playNodeBadge(result)
		return result

	# getInstanceBadge: (appId, spaceId)->
	# 	workflow_categories = _.pluck(db.categories.find({app: appId}).fetch(), '_id')
	# 	if workflow_categories.length > 0
	# 		return Steedos.getWorkflowCategoriesBadge(workflow_categories, spaceId)
	# 	else
	# 		return Steedos.getBadge("workflow", spaceId)

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
		userId = Meteor.userId()
		unless spaceId
			spaceId = Steedos.spaceId()
		unless spaceId and userId
			return
		count = 0
		authToken = Accounts._storedLoginToken()
		headers = {}
		headers['Authorization'] = 'Bearer ' + spaceId + ',' + authToken
		headers['X-User-Id'] = userId
		headers['X-Auth-Token'] = authToken
		$.ajax
			url: Steedos.absoluteUrl('/api/workflow/open/pending?limit=0&spaceId=' + spaceId + "&workflow_categories=" + workflow_categories.join(','))
			type: 'get'
			async: false
			dataType: 'json'
			headers: headers
			success: (responseText, status)->
				if (responseText.errors)
					toastr.error(responseText.errors);
					return;
				count = responseText.count;
			error: (jqXHR, textStatus, errorThrown) ->
				error = jqXHR.responseJSON
				console.error error
				if error?.reason
					toastr?.error?(TAPi18n.__(error.reason))
				else if error?.message
					toastr?.error?(TAPi18n.__(error.message))
				else
					toastr?.error?(error)
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

	addTokenTodownloadUrl: (url) ->
		# 文件下载增加认证参数
		authObject = { authToken : Accounts._storedLoginToken() }
		token = window.btoa(JSON.stringify(authObject))
		# 如果url已经有参数则拼接token
		if url.indexOf('?') > 0
			url = url + '&token=' + token
		else
			url = url + '?token=' + token
		return url

	generateShortStringFromUrl: (url, length = 6) ->
		# 简单哈希函数
		hash = 0
		for i in [0...url.length]
			char = url.charCodeAt(i)
			hash = (hash << 5) - hash + char
			hash |= 0  # 转换为32位整数

		# 基于哈希生成的随机字符串
		characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
		shortString = ''

		# 生成指定长度的短字符串
		for i in [0...length]
			shortString += characters[Math.abs(hash) % characters.length]
			hash = Math.floor(hash / characters.length)

		shortString

	cordovaDownload: (url, filename, rev, length) ->
		url = Steedos.addTokenTodownloadUrl(url)
		
		if not cordova?.plugins?.fileOpener2
			# window.open(url, '_blank', 'EnableViewPortScale=yes')
			fileUrl = url;
			if !url.startsWith('http://') && !url.startsWith('https://')
				fileUrl = Meteor.absoluteUrl(url);
			return webkit.messageHandlers.cordova_iab.postMessage(
				JSON.stringify({
					type: 'fileOpen',
					props: {
						url: fileUrl,
						filename: filename, 
						rev: rev, 
						length: length
					}
				})
			);

		$(document.body).addClass 'loading'
		# fileName = rev + '-' + filename
		fileName = filename
		size = length
		if typeof length == 'string'
			size = length.to_float()

		directory = ""
		if Steedos.isAndroidApp()
			directory = cordova.file.externalCacheDirectory
			try
				fileName = Steedos.generateShortStringFromUrl(url) + '-' + filename
			catch e
				console.log(e)
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
						window.fileOpen fileEntry.toURL()
					else
						sPath = fileEntry.toURL()
						fileTransfer = new FileTransfer
						fileEntry.remove()
						fileTransfer.download url, sPath, ((theFile) ->
							$(document.body).removeClass 'loading'
							window.fileOpen theFile.toURL()
						), (error) ->
							$(document.body).removeClass 'loading'
							console.error 'download error source' + error.source
							console.error 'download error target' + error.target
							console.error 'upload error code: ' + error.code
							if error.http_status == 404
								toastr.error t("creator_files_download_error_not_found")
							else
								toastr.error error.body
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

	inAppBrowser: ()->
		return window.inAppBrowser

	canCordovaDownloadFile: ()->
		return Meteor.isCordova || window.inAppBrowser
	
_.extend Steedos, TemplateHelpers

Template.registerHelpers TemplateHelpers