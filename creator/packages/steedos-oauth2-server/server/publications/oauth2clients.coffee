Meteor.publish "OAuth2Clients", (clientId)->
	collection = Creator.Collections["OAuth2Clients"]
	return collection.find({'clientId': clientId}, {fields:{clientName:1}})