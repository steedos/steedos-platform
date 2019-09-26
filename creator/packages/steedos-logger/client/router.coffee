checkUserSigned = (context, redirect) ->
	if !Meteor.userId()
		Steedos.redirectToSignIn()

FlowRouter.route '/admin/view-logs',
	triggersEnter: [ checkUserSigned ],
	action: (params, queryParams)->
		BlazeLayout.render 'adminLayout',
			main: "viewLogs"
