Template.loginAuthorize.events
	'click button.authorize':()->
		
		urlParams = getUrlParams()

		oAuth2Server.callMethod.authCodeGrant(
			urlParams?.client_id,
			urlParams?.redirect_uri,
			urlParams?.response_type,
			urlParams?.scope && urlParams?.scope?.split(' '),
			urlParams?.state,
			(err, result)->
				if err
					# 未获取到授权码，执行操作
					console.log err
				if result
					# 获取到授权码，跳转链接：redirect_uri + code=授权码参数
					# 第三方应用根据code，再调用接口获取token
					###
					result = {
						success: true, 
						error: null, 
						authorizationCode: "xxxxxx", 
						redirectToUri: "http://xxx/?code=xxx&state=xxx"
					}
					###
					console.log result
					console.log "===================="
		)


getUrlParams = ()->
	decode = (s)->
		decodeURIComponent s.replace(pl, " ")

	pl = /\+/g

	search = /([^&=]+)=?([^&]*)/g
	
	query  = window.location.search.substring(1)

	urlParams = {}

	urlParams[decode(match[1])] = decode(match[2]) while match=search.exec(query)

	return urlParams