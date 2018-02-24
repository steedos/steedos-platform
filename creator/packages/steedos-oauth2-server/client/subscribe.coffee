Creator.subs["OAuth2Clients"] = new SubsManager()

getUrlParams = ()->
	decode = (s)->
		decodeURIComponent s.replace(pl, " ")
	pl = /\+/g
	search = /([^&=]+)=?([^&]*)/g
	query  = window.location.search.substring(1)
	urlParams = {}
	urlParams[decode(match[1])] = decode(match[2]) while match=search.exec(query)
	return urlParams

Meteor.startup ->
	Tracker.autorun (c)->
        urlParams = getUrlParams()
        Creator.subs["OAuth2Clients"].subscribe "OAuth2Clients",urlParams?.client_id