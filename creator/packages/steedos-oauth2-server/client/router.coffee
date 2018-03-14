getUrlParams = ()->
	decode = (s)->
		decodeURIComponent s.replace(pl, " ")
	pl = /\+/g
	search = /([^&=]+)=?([^&]*)/g
	query  = window.location.search.substring(1)
	urlParams = {}
	urlParams[decode(match[1])] = decode(match[2]) while match=search.exec(query)
	return urlParams
	
FlowRouter.route '/oauth2',
	triggersEnter: [ ()->
		urlParams = OAuth2.urlParams
		userId = Meteor.userId()
		clientId = urlParams?.client_id
		if userId && clientId
			# debugger
			Meteor.call("isAuthorized", userId, clientId,
				(error,result) ->
					if result
						OAuth2.getOAuth2Code()
			)
	],
	action: (params, queryParams)->
		if !Meteor.userId()
			BlazeLayout.render 'loginLayout',
				main: "loginAuthorize"
		else
			BlazeLayout.render 'loginLayout',
				main: "loginAuthorize"