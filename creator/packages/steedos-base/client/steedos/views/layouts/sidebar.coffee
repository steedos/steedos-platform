Template.sidebar.helpers

	spaceId: ->
		if Session.get("spaceId")
			return Session.get("spaceId")
		else
			return localStorage.getItem("spaceId:" + Meteor.userId())

Template.sidebar.events
	'click .main-header .logo': (event) ->
		Modal.show "app_list_box_modal"


