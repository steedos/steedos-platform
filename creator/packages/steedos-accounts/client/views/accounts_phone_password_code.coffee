Template.accounts_phone_password_code.helpers
	number: ->
		isPhoneVerified = Accounts.isPhoneVerified()
		if isPhoneVerified
			return Accounts.getPhoneNumber(true)
		else
			return t "accounts_phone_verify_fail"
	title: ->
		return t "accounts_phone_password_title"

Template.accounts_phone_password_code.onRendered ->

Template.accounts_phone_password_code.events
	'click .btn-verify-code': (event,template) ->
		number = $(".accounts-phone-number").text()
		unless number
			toastr.error t "accounts_phone_invalid"
			return
		code = $("input.accounts-phone-code").val()
		unless code
			toastr.error t "accounts_phone_enter_phone_code"
			return
		password = $(".accounts-password").val()
		unless password
			toastr.error t "accounts_phone_password_invalid"
			return
		result = Steedos.validatePassword password
		if result.error
			return toastr.error result.error.reason

		password2 = $(".accounts-password-again").val()
		unless password2 is password
			toastr.error t "accounts_phone_password_again_invalid"
			return

		$(document.body).addClass('loading')
		mobile = Accounts.getPhoneNumber()
		Accounts.verifyPhone number, mobile, code, password, (error) ->
			$(document.body).removeClass('loading')
			if error
				toastr.error t error.reason
				console.error error
				return
			if window.name == "setup_phone"
				toastr.success t "accounts_phone_password_suc_wait"
				setTimeout ->
					# 如果在修改密码后不把路由重新定位，则当前主界面会跳转并保持在登录界面（而且是假的登录界面）
					# 这里要加到延时之后，否则不能跳转成功
					window.opener.FlowRouter.go "/admin/profile/password"
					window.close()
				,4200
			else
				toastr.success t "accounts_phone_password_suc"
				FlowRouter.go "/admin"


	'click .btn-code-unreceived': (event,template) ->
		number = $(".accounts-phone-number").text()
		swal {
			title: t("accounts_phone_swal_unreceived_title"),
			text: t("accounts_phone_swal_unreceived_text",number),
			confirmButtonColor: "#DD6B55",
			type: "warning",
			confirmButtonText: t('OK'),
			cancelButtonText: t('Cancel'),
			showCancelButton: true,
			closeOnConfirm: false
		}, (reason) ->
			# 用户选择取消
			if (reason == false)
				return false;
			$(document.body).addClass('loading')
			Accounts.requestPhoneVerification number, true, (error)->
				$(document.body).removeClass('loading')
				if error
					toastr.error t error.reason
					console.error error
					return
			sweetAlert.close();

	'click .btn-back': (event,template) ->
		FlowRouter.go "/accounts/setup/password"

