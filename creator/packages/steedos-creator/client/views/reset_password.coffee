
Template.reset_password_modal.helpers 
	schema: ()->
		schema =
			old_pwd:
				type: String
				label: "旧密码"
				autoform:
					type: "password"

			new_pwd:
				type: String
				label: "新密码"
				autoform:
					type: "password"

			confirm_pwd:
				type: String
				label: "确认密码"
				autoform:
					type: "password"

		return new SimpleSchema(schema)

	fields: ()->
		return ["old_pwd", "new_pwd", "confirm_pwd"]
		 

Template.reset_password_modal.events 
	"click .btn-confirm": (event, template) ->
		debugger
		doc = AutoForm.getFormValues("resetPwdForm").insertDoc
		old_pwd = doc.old_pwd
		new_pwd = doc.new_pwd
		confirm_pwd = doc.confirm_pwd

		result = Steedos.validatePassword new_pwd
		if result.error
			toastr.error result.error.reason
			return

		if !old_pwd or !new_pwd or !confirm_pwd
			toastr.error t('旧密码或新密码为空')
			return

		else if new_pwd == confirm_pwd
			Accounts.changePassword old_pwd, new_pwd, (error) ->
				if error
					toastr.error t('旧密码不正确')
				else
					toastr.success t('密码修改成功')
					Modal.hide(template);
		else
			toastr.error t('请确认两次输入的密码是否一致')
		


		
		 
