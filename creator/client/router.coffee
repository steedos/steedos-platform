FlowRouter.route '/',
	action: (params, queryParams)->
		FlowRouter.go '/app'

FlowRouter.route '/admin',
	action: (params, queryParams)->
		FlowRouter.go '/app/admin'

FlowRouter.route '/steedos/logout',
	action: (params, queryParams)->
		$("body").addClass('loading')
		Meteor.logout ()->
			return
		