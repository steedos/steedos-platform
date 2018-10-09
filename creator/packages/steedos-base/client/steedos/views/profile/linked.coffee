Template.linked.helpers
	services: ->
		[	
			{ service: "google", icon: "google plus" }, 
			{ service: "facebook", icon: "facebook"}, 
			{ service: "linkedin", icon: "linkedin"} 
		]


Template.linked.events

	'click link_google': (e, t) ->
		Meteor.connectWith("google");

	'click link_facebook': (e, t) ->
		Meteor.connectWith("facebook");

	'click link_linkedin': (e, t) ->
		Meteor.connectWith("linkedin");