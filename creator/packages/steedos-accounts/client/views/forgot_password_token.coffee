Template.forgot_password_token.helpers

Template.forgot_password_token.onRendered ->

Template.forgot_password_token.events
	'click .btn-reset-pwd': (event,template) ->
		forgot_pwd_token = $(".accounts-email-code").val()
		Meteor.call 'VerifyForgotPwdToken', forgot_pwd_token, (error) ->
			if error
				toastr.error t(error.reason)
			else
				FlowRouter.go '/steedos/reset-password/%@'.replace('%@', forgot_pwd_token)

	'click .btn-back': (event,template) ->
		FlowRouter.go "/steedos/forgot-password"

