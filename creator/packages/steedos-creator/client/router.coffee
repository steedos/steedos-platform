@urlQuery = new Array()

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

initLayout = ()->
	if Steedos.isMobile() and (!$(".wrapper").length or !$("#home_menu").length)
		BlazeLayout.render Creator.getLayout(),
			main: "homeMenu"

FlowRouter.route '/app',
	triggersEnter: [ checkUserSigned, initLayout ],
	action: (params, queryParams)->
		if Steedos.isMobile()
			FlowRouter.go '/app/menu'
		else
			app_id = Session.get("app_id")
			if !app_id
				app_id = "crm"
			object_name = Session.get("object_name")
			if object_name
				FlowRouter.go "/app/" + app_id + "/" + object_name + "/list"
			else
				FlowRouter.go "/app/" + app_id

FlowRouter.route '/app/menu',
	triggersEnter: [ checkUserSigned, initLayout ],
	action: (params, queryParams)->
		return

FlowRouter.route '/app/:app_id',
	triggersEnter: [ checkUserSigned, initLayout ],
	action: (params, queryParams)->
		if Steedos.isMobile() 
			if $(".content-wrapper #object_menu").length == 0
				app_id = FlowRouter.getParam("app_id")
				data = {app_id: app_id}
				Meteor.defer ->
					Blaze.renderWithData(Template.objectMenu, data, $(".content-wrapper")[0], $(".layout-placeholder")[0])
		else
			Session.set("app_id", FlowRouter.getParam("app_id"))
			BlazeLayout.render Creator.getLayout(),
				main: "creator_app_home"

objectRoutes = FlowRouter.group
	prefix: '/app/:app_id/:object_name',
	name: 'objectRoutes',
	triggersEnter: [checkUserSigned, set_sessions, initLayout]

objectRoutes.route '/list/switch',
	action: (params, queryParams)->
		if Steedos.isMobile() and $(".content-wrapper #list_switch").length == 0
			app_id = FlowRouter.getParam("app_id")
			object_name = FlowRouter.getParam("object_name")
			data = {app_id: app_id, object_name: object_name}
			Meteor.defer ->
				Blaze.renderWithData(Template.listSwitch, data, $(".content-wrapper")[0], $(".layout-placeholder")[0])

objectRoutes.route '/:list_view_id/list',
	action: (params, queryParams)->
		app_id = FlowRouter.getParam("app_id")
		object_name = FlowRouter.getParam("object_name")
		list_view_id = FlowRouter.getParam("list_view_id")
		data = {app_id: app_id, object_name: object_name, list_view_id: list_view_id}
		if Steedos.isMobile()
			Meteor.defer ->
				Blaze.renderWithData(Template.mobileList, data, $(".content-wrapper")[0], $(".layout-placeholder")[0])

FlowRouter.route '/app/:app_id/:object_name/list',
	triggersEnter: [ checkUserSigned, initLayout ],
	action: (params, queryParams)->
		if Session.get("object_name") != FlowRouter.getParam("object_name")
			Session.set("list_view_id", null)
		Session.set("app_id", FlowRouter.getParam("app_id"))
		Session.set("object_name", FlowRouter.getParam("object_name"))
		Session.set("list_view_visible", false)
		Tracker.afterFlush ()->
			Session.set("list_view_visible", true)
		BlazeLayout.render Creator.getLayout(),
			main: "creator_list"


FlowRouter.route '/app/:app_id/reports/view/:record_id',
	triggersEnter: [ checkUserSigned ],
	action: (params, queryParams)->
		app_id = FlowRouter.getParam("app_id")
		record_id = FlowRouter.getParam("record_id")
		object_name = FlowRouter.getParam("object_name")
		Session.set("app_id", app_id)
		Session.set("object_name", "reports")
		Session.set("record_id", record_id)
		BlazeLayout.render Creator.getLayout(),
			main: "creator_report"

FlowRouter.route '/app/:app_id/:object_name/view/:record_id',
	triggersEnter: [ checkUserSigned ],
	action: (params, queryParams)->
		Session.set("app_id", FlowRouter.getParam("app_id"))
		Session.set("object_name", FlowRouter.getParam("object_name"))
		Session.set("record_id", FlowRouter.getParam("record_id"))
		Session.set("detail_info_visible", true)
		# Session.set("cmDoc", Creator.getObjectRecord())
		Meteor.call "object_recent_viewed", FlowRouter.getParam("object_name"), FlowRouter.getParam("record_id")
		BlazeLayout.render Creator.getLayout(),
			main: "creator_view"
