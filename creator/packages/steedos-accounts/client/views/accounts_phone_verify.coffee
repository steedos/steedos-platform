Template.accounts_phone_verify.helpers
	number: ->
		number = FlowRouter.current().path.match(/phone\/(.+)/)?[1]
		return decodeURIComponent number
	title: ->
		if Meteor.userId()
			return t "accounts_phone_title"
		else
			return t "steedos_phone_title"

Template.accounts_phone_verify.onRendered ->
	$("body").addClass("no-sidebar")
	$(".wrapper .content-wrapper").addClass("flex-center")
	$(".wrapper .content-wrapper").addClass("bg-shadow")

Template.accounts_phone_verify.onDestroyed ->
	$("body").removeClass("no-sidebar")
	$(".wrapper .content-wrapper").removeClass("flex-center")
	$(".wrapper .content-wrapper").removeClass("bg-shadow")

Template.accounts_phone_verify.events
	'click .btn-verify-code': (event,template) ->
		number = $(".accounts-phone-number").text().trim()
		unless number
			toastr.error t "accounts_phone_invalid"
			return
		code = $("input.accounts-phone-code").val()
		unless code
			toastr.error t "accounts_phone_enter_phone_code"
			return

		prefix = number.match(/\+\d+\s/)
		unless prefix
			toastr.error t "accounts_phone_invalid"
			return
		mobile = number.replace(prefix[0],"")
		userId = Meteor.userId()
		$(document.body).addClass('loading')
		Accounts.verifyPhone number, mobile, code, (error) ->
			if error
				$(document.body).removeClass('loading')
				toastr.error t error.reason
				console.error error
				return
			$(document.body).removeClass('loading')
			if userId
				# 绑定手机号
				if window.name == "setup_phone"
					# 是从新窗口打开绑定手机号界面
					toastr.success t "accounts_phone_verify_suc_wait"
					setTimeout ->
						window.close()
					,5000
				else
					# 是从跳转路由进入绑定手机号界面
					toastr.success t "accounts_phone_verify_suc"
					FlowRouter.go "/"
			else
				# 手机号登录
				FlowRouter.go "/"

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
			Accounts.requestPhoneVerification number, (error)->
				$(document.body).removeClass('loading')
				if error
					toastr.error t error.reason
					console.error error
					return
			sweetAlert.close();


	'click .btn-back': (event,template) ->
		if Meteor.userId()
			FlowRouter.go "/accounts/setup/phone"
		else
			FlowRouter.go "/steedos/setup/phone"

