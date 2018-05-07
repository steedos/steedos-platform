FlowRouter.route '/',
	action: (params, queryParams)->
		Meteor.autorun (c)->
			if !Meteor.userId()
				FlowRouter.go '/steedos/sign-in';
			else
				FlowRouter.go '/app'

				# if Steedos.isMobile()
				# 	FlowRouter.go '/app/menu'
				# else
				# 	FlowRouter.go '/app'


# Meteor.startup ->
# 	db.apps.INTERNAL_APPS = ["/app/crm", "/app/creator"]
# 	Session.set("apps", ["crm", "creator"]);
# 	Session.set("app_objects", ["customers", "contacts", "flow_roles"]);