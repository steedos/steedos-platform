checkUserSigned = (context, redirect) ->
	if !Meteor.userId()
		Steedos.redirectToSignIn()

contactsRoutes = FlowRouter.group
	prefix: '/contacts',
	name: 'contactsRoutes',
	triggersEnter: [ checkUserSigned ],

contactsRoutes.route '/', 
	action: (params, queryParams)->
		FlowRouter.go '/contacts/orgs'

contactsRoutes.route '/orgs', 
	action: (params, queryParams)->
		Session.set('contact_showBooks', false)
		if Steedos.isMobile()
			BlazeLayout.render 'contactsLayout',
				main: "org_main_mobile"
		else
			BlazeLayout.render 'contactsLayout',
				main: "admin_org_main"

contactsRoutes.route '/banch',
	action: (params, queryParams)->
		Session.set('contact_showBooks', false)
		BlazeLayout.render 'contactsLayout',
			main: "org_main_mobile"

contactsRoutes.route '/books', 
	action: (params, queryParams)->
		Session.set('contact_showBooks', true)
		BlazeLayout.render 'contactsLayout',
			main: "book_main"

FlowRouter.route '/admin/contacts/settings',
	action: (params, queryParams)->
		BlazeLayout.render 'adminLayout',
			main: "contacts_settings"
