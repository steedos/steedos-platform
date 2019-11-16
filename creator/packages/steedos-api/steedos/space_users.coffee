Meteor.startup ->
	API.addCollection db.space_users, 
		excludedEndpoints: []
		routeOptions:
			authRequired: true
			spaceRequired: true