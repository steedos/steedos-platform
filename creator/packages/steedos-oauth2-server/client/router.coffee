getUrlParams = ()->
	decode = (s)->
		decodeURIComponent s.replace(pl, " ")
	pl = /\+/g
	search = /([^&=]+)=?([^&]*)/g
	query  = window.location.search.substring(1)
	urlParams = {}
	urlParams[decode(match[1])] = decode(match[2]) while match=search.exec(query)
	return urlParams
	