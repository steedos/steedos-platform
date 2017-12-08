checkUserSigned = (context, redirect) ->
	if !Meteor.userId()
		FlowRouter.go '/steedos/sign-in?redirect=' + context.path;

FlowRouter.route '/creator',
	triggersEnter: [ checkUserSigned ],
	action: (params, queryParams)->
		FlowRouter.go "/creator/objects/home"


FlowRouter.route '/creator/:collection_name/home',
	triggersEnter: [ checkUserSigned ],
	action: (params, queryParams)->
		Meteor.call "creator_object_init", params.collection_name, (error, object)->
			if object
				Creator.objectClientInit(params.collection_name, object);
			BlazeLayout.render 'recordLayout',
				main: "creator_list"
