Template.accounts_admin_register.helpers
	errors: ->
		return Template.instance().errors.get()


Template.accounts_admin_register.onCreated ->
	this.errors = new ReactiveVar({})


Template.accounts_admin_register.onRendered ->

Template.accounts_admin_register.events
	'click .signin-link a': (event,template) ->
		event.preventDefault()
		AccountsTemplates.linkClick("signIn")

	'click .btn-save': (event,template) ->
		$(".weui-input").trigger("change")
		errors = template.errors.get()
		unless _.isEmpty(errors)
			return

		company = $(".form-company").val()
		name = $(".form-name").val()
		password = $(".form-password").val()
		email = $(".form-email").val()
		email = email.toLowerCase().replace(/\s+/gm, '')
		options = 
			company: company
			name: name
			email: email
			password: password
			profile: 
				company: company
				name: name

		preSignUpHook = AccountsTemplates.options.preSignUpHook;
		if preSignUpHook
			preSignUpHook(password, options)
		hash = Accounts._hashPassword(password)
		options.password = hash
		$("body").addClass("loading")
		Meteor.call "checkUser", options, (error, result)->
			$("body").removeClass("loading")
			if error
				if /_company_/.test error.reason
					errorKey = "company"
				else if /_name_/.test error.reason
					errorKey = "name"
				else if /_email_/.test error.reason
					errorKey = "email"
				else if /_password_/.test error.reason
					errorKey = "password"
				if errorKey
					errors[errorKey] = t error.reason
				template.errors.set(errors)
				toastr.error t error.reason
			if result == true
				$("body").addClass("loading");
				Meteor.call "ATCreateUserServer", options, (error, result)->
					$("body").removeClass("loading")
					loginSelector = {email: email}
					Meteor.loginWithPassword loginSelector, password, (error)-> 
						if error
							console.error error
							toastr.error t error.reason
						else
							FlowRouter.go "/"

	'change .form-company': (event,template) ->
		val = $(event.currentTarget).val()
		errors = template.errors.get()
		if val
			delete errors.company
			template.errors.set(errors)
		else
			errors.company = t "requiredField"
			template.errors.set(errors)

	'change .form-email': (event,template) ->
		val = $(event.currentTarget).val()
		errors = template.errors.get()
		if val
			delete errors.email
			reg = /.+@(.+){2,}\.(.+){2,}/
			unless reg.test val
				errors.email = t 'Invalid email'
			template.errors.set(errors)
		else
			errors.email = t "requiredField"
			template.errors.set(errors)

	'change .form-name': (event,template) ->
		val = $(event.currentTarget).val()
		errors = template.errors.get()
		if val
			delete errors.name
			template.errors.set(errors)
		else
			errors.name = t "requiredField"
			template.errors.set(errors)

	'change .form-password': (event,template) ->
		val = $(event.currentTarget).val()
		errors = template.errors.get()
		if val
			delete errors.password
			result = Steedos.validatePassword val
			if result.error
				errors.password = result.error.reason
			else if val == $(".form-confirmpwd").val()
				delete errors.confirmpwd
			template.errors.set(errors)
		else
			errors.password = t "requiredField"
			template.errors.set(errors)

	'change .form-confirmpwd': (event,template) ->
		val = $(event.currentTarget).val()
		errors = template.errors.get()
		if val
			delete errors.confirmpwd
			unless val == $(".form-password").val()
				errors.confirmpwd = t "error.pwdsDontMatch"
			template.errors.set(errors)
		else
			errors.confirmpwd = t "requiredField"
			template.errors.set(errors)



