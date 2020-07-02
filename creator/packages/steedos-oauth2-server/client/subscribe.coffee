subClients = new SubsManager()

Meteor.startup ->
	Tracker.autorun (c)->
        if subClients.ready()
            client_id = FlowRouter.getQueryParam("client_id")
            if client_id
                subClients.subscribe "OAuth2Clients",client_id