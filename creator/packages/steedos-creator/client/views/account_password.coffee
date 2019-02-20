Template.account_password.onCreated ->

	@clearForm = ->
		@find('#oldPassword').value = ''
		@find('#Password').value = ''
		@find('#confirmPassword').value = ''

	@changePassword = (callback) ->
		instance = @

		oldPassword = $('#oldPassword').val()
		Password = $('#Password').val()
		confirmPassword = $('#confirmPassword').val()

		result = Steedos.validatePassword Password
		if result.error
			return toastr.error result.error.reason

		if !oldPassword or !Password or !confirmPassword
			toastr.error t('Old_and_new_password_required')

		else if Password == confirmPassword
			Accounts.changePassword oldPassword, Password, (error) ->
				if error
					toastr.error t('Incorrect_Password')
				else
					toastr.success t('Password_changed_successfully')
					instance.clearForm();
					if callback
						return callback()
					else
						return undefined
		else
			toastr.error t('Confirm_Password_Not_Match')

Template.account_password.onRendered ->

Template.account_password.helpers Creator.helpers

Template.account_password.helpers

Template.account_password.events

	'click .change-password': (e, t) ->
		t.changePassword()

	'click .btn-set-password-by-phone': (event, template) ->
		if Accounts.isPhoneVerified()
			if Steedos.isAndroidOrIOS()
				FlowRouter.go("/accounts/setup/password")
			else
				Steedos.openWindow(Steedos.absoluteUrl("accounts/setup/password"),'setup_phone')
		else
			toastr.error t("account_phone_invalid")
