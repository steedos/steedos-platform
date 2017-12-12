checkUserSigned = (context, redirect) ->
	if !Meteor.userId()
		FlowRouter.go '/steedos/sign-in?redirect=' + context.path;

FlowRouter.route '/creator',
	triggersEnter: [ checkUserSigned ],
	action: (params, queryParams)->
		FlowRouter.go "/creator/crm/customers"


FlowRouter.route '/creator/:app_id/:object_name',
	triggersEnter: [ checkUserSigned ],
	action: (params, queryParams)->
		Meteor.call "creator_object_init", params.object_name, (error, object)->
			if object
				Creator.objectClientInit(params.object_name, object);
			BlazeLayout.render 'recordLayout',
				main: "creator_list"
