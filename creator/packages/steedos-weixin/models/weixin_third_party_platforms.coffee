#  主键_id为平台appId
Creator.Objects.weixin_third_party_platforms =
	name: "weixin_third_party_platforms"
	label: "微信第三方平台"
	icon: "record"
	fields:
		# 平台名称
		name:
			label: '名称'
			type: 'text'
		# 平台密钥
		secret:
			label: 'APP密钥'
			type: 'text'
		# 微信服务器会向其“授权事件接收URL”每隔10分钟定时推送component_verify_ticket
		component_verify_ticket:
			label: 'component_verify_ticket'
			type: 'text'
		# 接口的调用凭据，也叫做令牌
		component_access_token:
			label: 'component_access_token'
			type: 'text'
		# 令牌过期时间，有效期（2小时）
		component_access_token_expired_at:
			label: 'component_access_token_expired_at'
			type: 'datetime'
		# 预授权码
		pre_auth_code:
			label: 'pre_auth_code'
			type: 'text'
		# # 授权方接口调用凭据
		# authorizer_access_token:
		# 	label: 'authorizer_access_token'
		# 	type: 'text'
		# # 授权方接口调用凭据过期时间, 有效期（2小时）
		# authorizer_access_token_expired_at:
		# 	label: 'component_access_token_expired_at'
		# 	type: 'datetime'
		# # 接口调用凭据刷新令牌
		# authorizer_refresh_token:
		# 	label: 'authorizer_refresh_token'
		# 	type: 'text'