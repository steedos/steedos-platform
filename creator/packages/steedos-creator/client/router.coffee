@urlQuery = new Array()

Accounts.onLogout ()->
	Creator.bootstrapLoaded.set(false)

checkUserSigned = (context, redirect) ->
	if !Meteor.userId()
		FlowRouter.go '/steedos/sign-in?redirect=' + context.path;
	else
		currentPath = FlowRouter.current().path
		if currentPath != urlQuery[urlQuery.length - 1]
			urlQuery.push currentPath

subscribe_object_listviews = (context, redirect)->
	Tracker.autorun ()->
		Creator.subs["Creator"]?.subscribe "object_listviews", context.params.object_name

set_sessions = (context, redirect)->
	Session.set("app_id", context.params.app_id)
	Session.set("object_name", context.params.object_name)
	Session.set("record_id", context.params.record_id)

checkAppPermission = (context, redirect)->
	Tracker.autorun (c)->
		if Creator.bootstrapLoaded.get() and Session.get("spaceId")
			c.stop()
			app_id = context.params.app_id
			apps = _.pluck(Creator.getVisibleApps(),"_id")
			if apps.indexOf(app_id) < 0
				Session.set("app_id", null)
				FlowRouter.go "/app"

checkObjectPermission = (context, redirect)->
	Tracker.autorun (c)->
		if Creator.bootstrapLoaded.get() and Session.get("spaceId")
			c.stop()
			object_name = context.params.object_name
			allowRead = Creator.getObject(object_name)?.permissions?.get()?.allowRead
			unless allowRead
				Session.set("object_name", null)
				FlowRouter.go "/app"

initLayout = ()->
	if Steedos.isMobile() and (!$(".wrapper").length or !$("#home_menu").length)
		BlazeLayout.render Creator.getLayout(),
			main: "objectMenu"

FlowRouter.route '/app',
	triggersEnter: [ checkUserSigned, initLayout ],
	action: (params, queryParams)->
		$("body").addClass("loading")
		BlazeLayout.render Creator.getLayout(),
			main: "creator_app_home"
		Tracker.autorun (c)->
			if Creator.bootstrapLoaded.get()
				c.stop()
				$("body").removeClass("loading")
				apps = Creator.getVisibleApps()
				firstAppId = apps[0]?._id
				if firstAppId
					FlowRouter.go '/app/' + firstAppId

FlowRouter.route '/app/menu',
	triggersEnter: [ checkUserSigned, initLayout ],
	action: (params, queryParams)->
		return

FlowRouter.route '/app/:app_id',
	triggersEnter: [ checkUserSigned, checkAppPermission, initLayout ],
	action: (params, queryParams)->
		Session.set("app_id", FlowRouter.getParam("app_id"))
		if Steedos.isMobile()
			Tracker.autorun (c)->
				if Creator.bootstrapLoaded.get() and Session.get("spaceId")
					c.stop()
					if $(".mobile-content-wrapper #object_menu").length == 0
						Meteor.defer ->
							Blaze.renderWithData(Template.objectMenu, {}, $(".mobile-content-wrapper")[0], $(".layout-placeholder")[0])
		else
			BlazeLayout.render Creator.getLayout(),
				main: "creator_app_home"

FlowRouter.route '/admin',
	triggersEnter: [ checkUserSigned, initLayout ],
	action: (params, queryParams)->
		if Steedos.isMobile()
			Tracker.autorun (c)->
				if Creator.bootstrapLoaded.get() and Session.get("spaceId")
					c.stop()
					if $(".mobile-content-wrapper #admin_menu").length == 0
						Meteor.defer ->
							Blaze.renderWithData(Template.adminMenu, {}, $(".mobile-content-wrapper")[0], $(".layout-placeholder")[0])

FlowRouter.route '/admin/switchspace',
	triggersEnter: [ checkUserSigned, initLayout ],
	action: (params, queryParams)->
		if Steedos.isMobile()
			Tracker.autorun (c)->
				if Creator.bootstrapLoaded.get() and Session.get("spaceId")
					c.stop()
					if $(".mobile-content-wrapper #switch_space").length == 0
						Meteor.defer ->
							Blaze.renderWithData(Template.switchSpace, {}, $(".mobile-content-wrapper")[0], $(".layout-placeholder")[0])

FlowRouter.route '/app/:app_id/search/:search_text',
	triggersEnter: [ checkUserSigned, initLayout ],
	action: (params, queryParams)->
		Session.set("app_id", FlowRouter.getParam("app_id"))
		Session.set("search_text", FlowRouter.getParam("search_text"))
		Session.set("record_id", null) #有的地方会响应Session中record_id值，如果不清空可能会有异常现象，比如删除搜索结果中的记录后会跳转到记录对应的object的列表
		BlazeLayout.render Creator.getLayout(),
			main: "record_search_list"

FlowRouter.route '/app/:app_id/reports/view/:record_id',
	triggersEnter: [ checkUserSigned, initLayout ],
	action: (params, queryParams)->
		app_id = FlowRouter.getParam("app_id")
		record_id = FlowRouter.getParam("record_id")
		object_name = FlowRouter.getParam("object_name")
		data = {app_id: app_id, record_id: record_id, object_name: object_name}
		Session.set("app_id", app_id)
		Session.set("object_name", "reports")
		Session.set("record_id", record_id)
		if Steedos.isMobile()
			Tracker.autorun (c)->
				if Creator.bootstrapLoaded.get() and Session.get("spaceId")
					c.stop()
					if $("#report_view_id").length == 0
						Meteor.defer ->
							Blaze.renderWithData(Template.reportView, data, $(".mobile-content-wrapper")[0], $(".layout-placeholder")[0])
		else
			BlazeLayout.render Creator.getLayout(),
				main: "creator_report"

objectRoutes = FlowRouter.group
	prefix: '/app/:app_id/:object_name',
	name: 'objectRoutes',
	triggersEnter: [checkUserSigned, checkObjectPermission, set_sessions, initLayout]

objectRoutes.route '/list/switch',
	action: (params, queryParams)->
		if Steedos.isMobile() and $(".mobile-content-wrapper #list_switch").length == 0
			Tracker.autorun (c)->
				if Creator.bootstrapLoaded.get() and Session.get("spaceId")
					c.stop()
					app_id = FlowRouter.getParam("app_id")
					object_name = FlowRouter.getParam("object_name")
					data = {app_id: app_id, object_name: object_name}
					Meteor.defer ->
						Blaze.renderWithData(Template.listSwitch, data, $(".mobile-content-wrapper")[0], $(".layout-placeholder")[0])

objectRoutes.route '/:list_view_id/list',
	action: (params, queryParams)->
		app_id = FlowRouter.getParam("app_id")
		object_name = FlowRouter.getParam("object_name")
		list_view_id = FlowRouter.getParam("list_view_id")
		data = {app_id: app_id, object_name: object_name, list_view_id: list_view_id}
		Session.set("reload_dxlist", false)
		if Steedos.isMobile() and $("#mobile_list_#{object_name}").length == 0
			Tracker.autorun (c)->
				if Creator.bootstrapLoaded.get() and Session.get("spaceId")
					c.stop()
					Meteor.defer ->
						Blaze.renderWithData(Template.mobileList, data, $(".mobile-content-wrapper")[0], $(".layout-placeholder")[0])

objectRoutes.route '/:record_id/:related_object_name/grid',
	action: (params, queryParams)->
		app_id = FlowRouter.getParam("app_id")
		object_name = FlowRouter.getParam("object_name")
		record_id = FlowRouter.getParam("record_id")
		related_object_name = FlowRouter.getParam("related_object_name")
		data = {app_id: app_id, object_name: object_name, record_id: record_id, related_object_name: related_object_name}
		if Steedos.isMobile()
			Tracker.autorun (c)->
				if Creator.bootstrapLoaded.get() and Session.get("spaceId")
					c.stop()
					if $("#related_object_list_#{related_object_name}").length == 0
						Meteor.defer ->
							Blaze.renderWithData(Template.relatedObjectList, data, $(".mobile-content-wrapper")[0], $(".layout-placeholder")[0])
		else
			Session.set 'related_object_name', related_object_name
			BlazeLayout.render Creator.getLayout(),
				main: "related_object_list"

objectRoutes.route '/view/:record_id',
	action: (params, queryParams)->
		app_id = FlowRouter.getParam("app_id")
		object_name = FlowRouter.getParam("object_name")
		record_id = FlowRouter.getParam("record_id")
		data = {app_id: app_id, object_name: object_name, record_id: record_id}
		ObjectRecent.insert(object_name, record_id, Session.get("spaceId"))
		if Steedos.isMobile()
			Tracker.autorun (c)->
				if Creator.bootstrapLoaded.get() and Session.get("spaceId")
					c.stop()
					if $("#mobile_view_#{record_id}").length == 0
						Meteor.defer ->
							Blaze.renderWithData(Template.mobileView, data, $(".mobile-content-wrapper")[0], $(".layout-placeholder")[0])
		else
			Session.set("detail_info_visible", true)
			if object_name == "users"
				main = "user"
			else
				main = "creator_view"
			BlazeLayout.render Creator.getLayout(),
				main: main

FlowRouter.route '/app/:app_id/:object_name/:template/:list_view_id',
	triggersEnter: [ checkUserSigned, checkObjectPermission, initLayout ],
	action: (params, queryParams)->
		if Session.get("object_name") != FlowRouter.getParam("object_name")
			Session.set("list_view_id", null)

		Session.set("app_id", FlowRouter.getParam("app_id"))
		Session.set("object_name", FlowRouter.getParam("object_name"))
		Session.set("list_view_id", FlowRouter.getParam("list_view_id"))
		Session.set("list_view_visible", false)

		Tracker.afterFlush ()->
			Session.set("list_view_visible", true)
		
		BlazeLayout.render Creator.getLayout(),
			main: "creator_list_wrapper"

FlowRouter.route '/app/:app_id/:object_name/calendar/',
	triggersEnter: [ checkUserSigned, checkObjectPermission, initLayout ],
	action: (params, queryParams)->
		if Session.get("object_name") != FlowRouter.getParam("object_name")
			Session.set("list_view_id", null)

		Session.set("app_id", FlowRouter.getParam("app_id"))
		Session.set("object_name", FlowRouter.getParam("object_name"))
		Session.set("list_view_visible", false)

		Tracker.afterFlush ()->
			Session.set("list_view_visible", true)
		
		BlazeLayout.render Creator.getLayout(),
			main: "creator_calendar"
