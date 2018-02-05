Meteor.methods
	"addClient" : (client)->
		oAuth2Server.collections.client.upsert(
			{
				clientId: client.clientId
			},
			{
				$set: client
			})


	# Exists purely for testing purposes.
	# @returns {any}
    "clientCount": ()->
        return oAuth2Server.collections.client.find({}).count()

	# Exists purely for testing purposes.
	"deleteAllClients": ()->
		oAuth2Server.collections.client.remove({})

