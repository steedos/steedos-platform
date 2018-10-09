Template.admin_api.helpers
	user: ->
		return Meteor.user()

Template.admin_api.onCreated ->

	this.copyTableauUrlClipboard = new Clipboard('.copy-secret');
	this.copyTableauUrlClipboard.on 'success', (e) ->
		toastr.success(t("instance_readonly_view_url_copy_success"))
		e.clearSelection()


Template.admin_api.onDestroyed ->
	this.copyTableauUrlClipboard.destroy();

Template.admin_api.events
	'click .btn-get-secrets': ()->
		swal {
			title: t('description')
			type: "input"
			inputValue: ""
			showCancelButton: true
			closeOnConfirm: false
			confirmButtonText: t('OK')
			cancelButtonText: t('Cancel')
			showLoaderOnConfirm: false
		}, (inputValue)->
			if inputValue is false
				return false

			if !inputValue?.trim()
				toastr.warning t('warning_description')
				return false
			Meteor.call "create_secret", inputValue.trim(), (error, results)->
				if results
					toastr.success t('get_secret_successfully')
					swal.close()

				if error
					toastr.error(TAPi18n.__(error.error))

	'click .remove-secret': ()->
		token = this.token
		swal({
			title: t('delete_confirm'),
			type: "warning",
			showCancelButton: true,
			confirmButtonColor: "#DD6B55",
			confirmButtonText: t('OK'),
			cancelButtonText: t('Cancel'),
			closeOnConfirm: false
		},()->
			Meteor.call "remove_secret", token, (error, results)->
				if results
					toastr.success t('afModal_remove_suc')
					swal.close()

				if error
					toastr.error(TAPi18n.__(error.error))

		);