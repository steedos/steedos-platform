# http://127.0.0.1:3008/oauth2/?response_type=code&client_id=hP9ZbuFJajynA847n&redirect_uri=http://127.0.0.1:3099/api/steedos_oauth2&scope=email&state=123456
@OAuth2 = {}

getUrlParams = ()->
	decode = (s)->
		decodeURIComponent s.replace(pl, " ")
	pl = /\+/g
	search = /([^&=]+)=?([^&]*)/g
	query  = window.location.search.substring(1)
	urlParams = {}
	urlParams[decode(match[1])] = decode(match[2]) while match=search.exec(query)
	return urlParams

OAuth2.getOAuth2Code = ()->
	urlParams = getUrlParams()
	oAuth2Server.callMethod.authCodeGrant(
		urlParams?.client_id,
		urlParams?.redirect_uri,
		urlParams?.response_type,
		urlParams?.scope && urlParams?.scope?.split(' '),
		urlParams?.state,
		(err, result)->
			# 未获取到授权码，执行操作
			if err
				console.log err
			if result
				# 获取到授权码，跳转链接：redirect_uri + code = 授权码参数
				# 第三方应用根据code，再调用接口获取token
				console.log result
				window.location = result?.redirectToUri
	)

Template.loginAuthorize.helpers Creator.helpers

Template.loginAuthorize.helpers
	clientName: ()->
		clientObj = Creator.Collections["OAuth2Clients"].findOne({})
		if clientObj
			return clientObj?.clientName

Template.loginAuthorize.onRendered ->
	$("body").removeClass("loading");

Template.loginAuthorize.events
	'click button#oauth2login':()->
		authorizedClients = Session.get("authorizedClients") || []
		urlParams = getUrlParams()
		clientId = urlParams?.client_id
		authoricedClients.push clientId
		OAuth2.getOAuth2Code()