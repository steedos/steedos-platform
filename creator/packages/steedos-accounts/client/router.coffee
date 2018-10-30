checkUserSigned = (context, redirect) ->
	if !Meteor.userId()
		Steedos.redirectToSignIn()

accountsRoutes = FlowRouter.group
	triggersEnter: [ checkUserSigned ],
	prefix: '/accounts',
	name: 'accountsRoutes'

accountsRoutes.route '/',
	action: (params, queryParams)->
		FlowRouter.go "/accounts/setup/phone"

# 修改/绑定手机号
accountsRoutes.route '/setup/phone',
	action: (params, queryParams)->
		BlazeLayout.render 'masterLayout',
			main: "accounts_phone"

# 修改/绑定手机号中发送验证码短信后，跳转到的验证码输入界面
accountsRoutes.route '/setup/phone/:number',
	action: (params, queryParams)->
		BlazeLayout.render 'masterLayout',
			main: "accounts_phone_verify"

# 重置密码
accountsRoutes.route '/setup/password',
	action: (params, queryParams)->
		BlazeLayout.render 'loginLayout',
			main: "accounts_phone"

# 重置密码中发送验证码短信后，跳转到的验证码输入界面
accountsRoutes.route '/setup/password/code',
	action: (params, queryParams)->
		BlazeLayout.render 'loginLayout',
			main: "accounts_phone_password_code"

# 手机号登录
FlowRouter.route '/steedos/setup/phone',
	action: (params, queryParams)->
		BlazeLayout.render 'loginLayout',
			main: "accounts_phone"

# 手机号登录中输入手机号发送验证码短信后，跳转到的验证码输入界面
FlowRouter.route '/steedos/setup/phone/:number',
	action: (params, queryParams)->
		BlazeLayout.render 'loginLayout',
			main: "accounts_phone_verify"

# 登录界面忘记密码功能（即通过邮件账户找回密码功能）中跳转到的验证码输入界面
FlowRouter.route '/steedos/forgot-password-token',
	action: (params, queryParams)->
		if Meteor.userId()
			FlowRouter.go "/"
		BlazeLayout.render 'loginLayout',
			main: "forgot_password_token"

# 新建工作区
accountsRoutes.route '/setup/space',
	action: (params, queryParams)->
		BlazeLayout.render 'loginLayout',
			main: "accounts_space"

# 手机号注册企业
FlowRouter.route '/steedos/admin/register',
	action: (params, queryParams)->
		BlazeLayout.render 'loginLayout',
			main: "accounts_admin_register"