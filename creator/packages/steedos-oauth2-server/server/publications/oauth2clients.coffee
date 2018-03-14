Meteor.publish "OAuth2Clients", (clientId)->
	collection = oAuth2Server.collections.client
	return collection.find({'clientId': clientId}, {fields:{clientName:1}})