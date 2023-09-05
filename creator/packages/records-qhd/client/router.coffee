checkUserSigned = (context, redirect) ->
	if !Meteor.userId()
		Steedos.redirectToSignIn(context.path)


FlowRouter.route '/records',
	triggersEnter: [checkUserSigned]


recordsQHDRoutes = FlowRouter.group
	prefix: '/records_qhd',
	name: 'records',
	triggersEnter: [checkUserSigned],
# subscriptions: (params, queryParams) ->
# 	if params.spaceId
# 		this.register 'apps', Meteor.subscribe("apps", params.spaceId)
# 		this.register 'space_users', Meteor.subscribe("space_users", params.spaceId)
# 		this.register 'organizations', Meteor.subscribe("organizations", params.spaceId)
# 		this.register 'flow_roles', Meteor.subscribe("flow_roles", params.spaceId)
# 		this.register 'flow_positions', Meteor.subscribe("flow_positions", params.spaceId)

# 		this.register 'categories', Meteor.subscribe("categories", params.spaceId)
# 		this.register 'forms', Meteor.subscribe("forms", params.spaceId)
# 		this.register 'flows', Meteor.subscribe("flows", params.spaceId)


recordsQHDRoutes.route '/sync_contracts',
	action: (params, queryParams)->
#		Steedos.setSpaceId(params.spaceId)
		BlazeLayout.render Creator.getLayout(),
			main: "recordsQHDSyncContracts"

recordsQHDRoutes.route '/sync_archive',
	action: (params, queryParams)->
#		Steedos.setSpaceId(params.spaceId)
		BlazeLayout.render Creator.getLayout(),
			main: "recordsQHDSyncArchive"