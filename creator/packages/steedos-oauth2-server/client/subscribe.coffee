Creator.subs["OAuth2Clients"] = new SubsManager()

Meteor.startup ->
	Tracker.autorun (c)->
        client_id = FlowRouter.getQueryParam("client_id")
        if client_id
            Creator.subs["OAuth2Clients"].subscribe "OAuth2Clients",client_id