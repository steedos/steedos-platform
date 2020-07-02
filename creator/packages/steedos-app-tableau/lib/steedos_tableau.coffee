CreatorTableau = {}


CreatorTableau._get_tableau_access_token = (userId)->
	user = db.users.findOne({_id: userId})
	if user && user.secrets
		tableau_access_token = user.secrets.findPropertyByPK("name","tableau")
		return tableau_access_token?.token

if Meteor.isClient
	Meteor.startup ()->
		Tracker.autorun (c)->
			user = db.users.findOne({_id: Meteor.userId()})
			if user && Steedos.subsBootstrap.ready("userData")
				if !user.secrets
					Meteor.call("create_secret","tableau")
					return;

				tableau_accounts_token = user.secrets.findPropertyByPK("name","tableau")

				if !tableau_accounts_token
					Meteor.call("create_secret","tableau")


	CreatorTableau.get_workflow_instance_by_flow_connector = (spaceId, flowId)->

		access_token = CreatorTableau._get_tableau_access_token(Meteor.userId())

		if access_token
			p = "?access_token=" + access_token

		url = "tableau/workflow/space/#{spaceId}/flow/#{flowId}" + p

		if Meteor.isCordova
			return Meteor.absoluteUrl(url);
		else
			return window.location.origin + "/" + url

	CreatorTableau.get_workflow_cost_time_connector = (spaceId)->
		access_token = CreatorTableau._get_tableau_access_token(Meteor.userId())

		if access_token
			p = "?access_token=" + access_token

		url = "tableau/workflow/space/#{Session.get("spaceId")}/cost_time" + p

		if Meteor.isCordova

			return Meteor.absoluteUrl(url);

		else
			return window.location.origin + "/" + url
