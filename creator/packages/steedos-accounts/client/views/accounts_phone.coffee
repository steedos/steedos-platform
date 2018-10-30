Template.accounts_phone.helpers
	currentPhoneNumber: ->
		return Accounts.getPhoneNumber()
	title: ->
		if Meteor.userId()
			# 设置密码路由单独设置标题
			isSetupPassword = /\/setup\/password\b/.test(FlowRouter.current().path)
			if isSetupPassword
				return t "accounts_phone_password_title"
			else
				return t "accounts_phone_title"
		else
			return t "steedos_phone_title"
	isBackButtonNeeded: ->
		isSetupPassword = /\/setup\/password\b/.test(FlowRouter.current().path)
		if isSetupPassword
			return Steedos.isMobile()
		else
			return Accounts.isPhoneVerified() || Steedos.isMobile() || !Meteor.userId()
	isCloseButtonNeeded: ->
		if window.name == "setup_phone"
			return true
		else
			return false
	isSetupPassword: ->
		return /\/setup\/password\b/.test(FlowRouter.current().path)
	prefix: ->
		return Accounts.getPhonePrefix()?.replace("+","")

Template.accounts_phone.onRendered ->
	$("body").addClass("no-sidebar")
	$(".wrapper .content-wrapper").addClass("flex-center")
	$(".wrapper .content-wrapper").addClass("bg-shadow")

Template.accounts_phone.onDestroyed ->
	$("body").removeClass("no-sidebar")
	$(".wrapper .content-wrapper").removeClass("flex-center")
	$(".wrapper .content-wrapper").removeClass("bg-shadow")

Template.accounts_phone.events
	'click .btn-send-code': (event,template) ->
		isSetupPassword = /\/setup\/password\b/.test(FlowRouter.current().path)
		unless isSetupPassword
			number = $("input.accounts-phone-number").val()
		else
			number = $(".accounts-phone-number").text()
		unless number
			toastr.error t "accounts_phone_enter_phone_number"
			return

		phonePrefix = $('.accounts-wrapper .phone-prefixes-select').val()
		number = "+#{phonePrefix} #{number}"

		swal {
			title: t("accounts_phone_swal_confirm_title"),
			text: t("accounts_phone_swal_confirm_text",number),
			confirmButtonColor: "#DD6B55",
			confirmButtonText: t('OK'),
			cancelButtonText: t('Cancel'),
			showCancelButton: true,
			closeOnConfirm: false
		}, (reason) ->
			# 用户选择取消
			if (reason == false)
				return false;
			$(document.body).addClass('loading')
			# 如果是重置密码，则发验证码前要求手机号验证通过
			# 反之，修改/绑定手机号或手机号登录界面不要求手机号验证通过
			checkVerified = isSetupPassword
			Accounts.requestPhoneVerification number, checkVerified, (error)->
				$(document.body).removeClass('loading')
				if error
					toastr.error t(error.reason)
					console.log error
					return
				if Meteor.userId()
					if isSetupPassword
						FlowRouter.go "/accounts/setup/password/code"
					else
						FlowRouter.go "/accounts/setup/phone/#{encodeURIComponent(number)}"
				else
					FlowRouter.go "/steedos/setup/phone/#{encodeURIComponent(number)}"
			sweetAlert.close();

	'click .btn-back': (event,template) ->
		currentPath = FlowRouter.current().path
		if /steedos\/setup\/phone/.test(currentPath) and !Meteor.userId()
			# 手机号登录界面可能会从验证码输入界面返回过来，即oldRoute可能是验证码输入界面
			# 所以这里不可以直接FlowRouter.go oldPath或history.back()
			Steedos.redirectToSignIn()
		else if /accounts\/setup\/phone/.test(currentPath) and Meteor.userId()
			# 手机上绑定手机号界面可能会从验证码输入界面返回过来，即oldRoute可能是验证码输入界面
			# 所以这里不可以直接FlowRouter.go oldPath或history.back()
			FlowRouter.go "/admin/profile/account"
		else if /accounts\/setup\/password/.test(currentPath) and Meteor.userId()
			# 手机上设置密码界面可能会从验证码输入界面返回过来，即oldRoute可能是验证码输入界面
			# 所以这里不可以直接FlowRouter.go oldPath或history.back()
			FlowRouter.go "/admin/profile/password"
		else
			history.back()

		# oldPath = FlowRouter.current().oldRoute?.path
		# if oldPath
		# 	FlowRouter.go oldPath
		# else
		# 	FlowRouter.go "/steedos/admin"

	'click .btn-close': (event,template) ->
		window.close()
