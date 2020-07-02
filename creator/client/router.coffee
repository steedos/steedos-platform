FlowRouter.route '/',
	action: (params, queryParams)->
		FlowRouter.go '/app'

FlowRouter.route '/admin',
	action: (params, queryParams)->
		FlowRouter.go '/app/admin'
		