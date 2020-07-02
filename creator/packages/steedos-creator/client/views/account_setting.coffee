Template.account_setting.onCreated ->

Template.account_setting.onRendered ->

Template.account_setting.helpers Creator.helpers

Template.account_setting.helpers

	user: ->
		return Meteor.user()
	
	emails: ()->
		return Meteor.user()?.emails

	more_than_one_address: ()->
		if Meteor.user()?.emails.length > 1
			return true
		return false

	isPrimary: (email)->
		isPrimary = false
		if Meteor.user()?.emails.length > 0
			Meteor.user().emails.forEach (e)->
				if e.address == email && e.primary == true
					isPrimary = true
					return

		return isPrimary
	
	accountPhoneNumber: ()->
		user = Meteor.user()
		if user.phone
			return user.phone.number
	
	usePhone: ()->
		if Meteor?.settings?.public?.phone
			return true


Template.account_setting.events

	'click .add-email': (event, template) ->
		$(document.body).addClass("loading")
		inputValue = $('#newEmail').val()
		Meteor.call "users_add_email", inputValue, (error, result)->
			if result?.error
				$(document.body).removeClass('loading')
				toastr.error t(result.message)
			else
				$(document.body).removeClass('loading')
				swal {
					title:t("primary_email_updated"), 
					type: "success",
					confirmButtonText:t('OK')
				}
				$('#newEmail').val("")

	'click .fa-trash-o': (event, template)->
		email = event.target.dataset.email
		swal {
			title: t("Are you sure?"),
			type: "warning",
			showCancelButton: true,
			cancelButtonText: t('Cancel'),
			confirmButtonColor: "#DD6B55",
			confirmButtonText: t('OK'),
			closeOnConfirm: true
		}, () ->
			$(document.body).addClass("loading")
			Meteor.call "users_remove_email", email, (error, result)->
				if result?.error
					$(document.body).removeClass('loading')
					toastr.error t(result.message)
				else
					$(document.body).removeClass('loading')

	'click .send-verify-email': (event, template)->
		$(document.body).addClass("loading")
		email = event.target.dataset.email
		Meteor.call "users_verify_email", email, (error, result)->
			if result?.error
				$(document.body).removeClass('loading')
				toastr.error t(result.message)
			else
				$(document.body).removeClass('loading')
				swal {
					title:t("email_verify_sent"),
					type: "success",
					confirmButtonText:t('OK')
				}

	'click .set-primary-email': (event, template)->
		$(document.body).addClass("loading")
		email = event.target.dataset.email
		Meteor.call "users_set_primary_email", email, (error, result)->
			if result?.error
				$(document.body).removeClass('loading')
				toastr.error t(result.message)
			else
				$(document.body).removeClass('loading')
				swal {
					title:t("email_set_primary_success"),
					type:"success",
					confirmButtonText:t('OK')
				}

	'click .remove-email': (event, template)->
		email = this.address
		swal {
			title: t("Are you sure?"),
			text: email,
			type: "warning",
			showCancelButton: true,
			cancelButtonText: t('Cancel'),
			confirmButtonColor: "#DD6B55",
			confirmButtonText: t('OK'),
			closeOnConfirm: false
		}, () ->
			Meteor.call "users_remove_email", email, (error, result)->
				if result?.error
					toastr.error t(result.message)
				else
					swal {
						title: t('email_remove_success'),
						text:email,
						type:"success",
						confirmButtonText:t('OK')
					}

	'click .change-username': (event, template) ->
		user = Meteor.user()
		spaceId = Steedos.spaceId()
		swal {
			title: t('Change username')
			type: "input"
			inputValue: user.username || ""
			showCancelButton: true
			closeOnConfirm: false
			confirmButtonText: t('OK')
			cancelButtonText: t('Cancel')
			showLoaderOnConfirm: false
		}, (inputValue)->
			if inputValue is false
				return false
			Meteor.call "setUsername", spaceId, inputValue.trim(), (error, results)->
				if results
					toastr.success t('Change username successfully')
					swal.close()

				if error
					toastr.error(TAPi18n.__(error.reason))

	'click .btn-change-phone': (event, template) ->
		FlowRouter.go("/accounts/setup/phone")

	'click [name=mobile]': (event, template) ->
		if Steedos.isAndroidOrIOS()
			FlowRouter.go("/accounts/setup/phone")
		else
			Steedos.openWindow(Steedos.absoluteUrl("accounts/setup/phone"),'setup_phone')

	'click .btn-set-password-by-phone': (event, template) ->
		if Accounts.isPhoneVerified()
			if Steedos.isAndroidOrIOS()
				FlowRouter.go("/accounts/setup/password")
			else
				Steedos.openWindow(Steedos.absoluteUrl("accounts/setup/password"),'setup_phone')
		else
			toastr.error t("account_phone_invalid")