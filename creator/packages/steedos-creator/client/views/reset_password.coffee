
Template.reset_password_modal.helpers 
	schema: ()->
		schema =
			old_pwd:
				type: String
				label: t "Old Password"
				autoform:
					type: "password"

			new_pwd:
				type: String
				label: t "New Password"
				autoform:
					type: "password"

			confirm_pwd:
				type: String
				label: t "Confirm Password"
				autoform:
					type: "password"

		return new SimpleSchema(schema)

	fields: ()->
		return ["old_pwd", "new_pwd", "confirm_pwd"]

	isMobile: ()->
		return Steedos.isMobile()



Template.reset_password_modal.rendered = ->
	$("#reset_password_modal").on "hidden.bs.modal", ->
		AutoForm.resetForm("resetPwdForm")

Template.reset_password_modal.events 
	"click .btn-confirm": (event, template) ->
		doc = AutoForm.getFormValues("resetPwdForm").insertDoc
		old_pwd = doc.old_pwd
		new_pwd = doc.new_pwd
		confirm_pwd = doc.confirm_pwd

		if !old_pwd or !new_pwd or !confirm_pwd
			toastr.error t('Old_and_new_password_required')
			return

		result = Steedos.validatePassword new_pwd
		if result.error
			toastr.error result.error.reason
			return

		else if new_pwd == confirm_pwd
			Accounts.changePassword old_pwd, new_pwd, (error) ->
				if error
					toastr.error t('Incorrect_Password')
				else
					toastr.success t('Password_changed_successfully')
					Modal.hide(template);
		else
			toastr.error t('Confirm_Password_Not_Match')
		


		
		 
