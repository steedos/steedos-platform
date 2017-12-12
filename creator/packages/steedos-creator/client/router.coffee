checkUserSigned = (context, redirect) ->
	if !Meteor.userId()
		FlowRouter.go '/steedos/sign-in?redirect=' + context.path;

FlowRouter.route '/creator',
	triggersEnter: [ checkUserSigned ],
	action: (params, queryParams)->
		FlowRouter.go "/creator/crm/customers/list"


FlowRouter.route '/creator/:app_id/:object_name/list',
	triggersEnter: [ checkUserSigned ],
	action: (params, queryParams)->
		BlazeLayout.render 'creatorLayout',
			main: "creator_list"
