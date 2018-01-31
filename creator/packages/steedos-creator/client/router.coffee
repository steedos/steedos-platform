checkUserSigned = (context, redirect) ->
	if !Meteor.userId()
		FlowRouter.go '/steedos/sign-in?redirect=' + context.path;

initLayout = ()->
	if Steedos.isMobile() and (!$(".wrapper").length or !$(".object-menu").length)
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
		if Steedos.isMobile() and $(".content-wrapper .object-menu.mobile-template-container").length == 0
			app_id = FlowRouter.getParam("app_id")
			data = {app_id: app_id}
			Meteor.defer ->
				Blaze.renderWithData(Template.objectMenu, data, $(".content-wrapper")[0], $(".layout-placeholder")[0])
		else
			Session.set("app_id", FlowRouter.getParam("app_id"))
			BlazeLayout.render Creator.getLayout(),
				main: "creator_app_home"

FlowRouter.route '/app/:app_id/:object_name/list/switch',
	triggersEnter: [ checkUserSigned, initLayout ],
	action: (params, queryParams)->
		app_id = FlowRouter.getParam("app_id")
		object_name = FlowRouter.getParam("object_name")
		console.log app_id, object_name


FlowRouter.route '/app/:app_id/:object_name/list',
	triggersEnter: [ checkUserSigned, initLayout ],
	action: (params, queryParams)->
		if Steedos.isMobile()
			app_id = FlowRouter.getParam("app_id")
			object_name = FlowRouter.getParam("object_name")
			data = {app_id: app_id, object_name: object_name}
			Meteor.defer ->
				Blaze.renderWithData(Template.mobileList, data, $(".content-wrapper")[0], $(".layout-placeholder")[0])
		else
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
