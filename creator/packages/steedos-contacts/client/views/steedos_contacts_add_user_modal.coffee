Template.steedos_contacts_add_user_modal.helpers
	fields: ->
		modalFields = 
			space:
				type: String,
				autoform:
					type: "hidden",
					defaultValue: ->
						return Session.get("spaceId");

			name:
				type: String,
				max: 50,
				label: t("space_users_name")

			mobile: 
				type: String,
				optional: true,
				label: t("space_users_mobile")
				autoform:
					type: ->
						return "text"

			email:
				type: String,
				label: t("space_users_email")
				optional: true
				autoform:
					type: "text"

			work_phone:
				type: String,
				label: t("space_users_work_phone")
				optional: true

			organizations:
				type: [String],
				label: t("space_users_organizations")
				autoform:
					type: "selectorg"
					multiple: true
					defaultValue: ->
						if Steedos.isMobile()
							currentOrg = Session.get('contacts_org_mobile')
						else
							currentOrg = Session.get("contacts_orgId")
						return [currentOrg]

			user_accepted:
				type: Boolean,
				optional: true,
				autoform:
					omit: true

			position:
				type: String,
				label: t("space_users_position")
				optional: true

			invite_state:
				type: String
				optional: true,
				autoform:
					omit: true

			created:
				type: Date,
				optional: true
				autoform:
					omit: true

			created_by:
				type: String,
				optional: true
				autoform:
					omit: true

			modified:
				type: Date,
				optional: true
				autoform:
					omit: true
					
			modified_by:
				type: String,
				optional: true
				autoform:
					omit: true

		new SimpleSchema(modalFields)

	values: ->
		return {}

Template.steedos_contacts_add_user_modal.events
	"click .contacts-add-user-save": (event,template)->
		unless AutoForm.validateForm("addContactsUser")
			return
		if AutoForm.getFieldValue("mobile","addContactsUser") or AutoForm.getFieldValue("email","addContactsUser")
			$('input[data-schema-key="mobile"] + .need-phone-email').remove()
			$('input[data-schema-key="mobile"]').closest(".form-group").removeClass("has-error")
		else
			$('input[data-schema-key="mobile"]').after("""<span class="help-block need-phone-email">#{t("contact_need_phone_or_email")}</span>""")
			$('input[data-schema-key="mobile"]').closest(".form-group").addClass("has-error")
			return
		doc = AutoForm.getFormValues("addContactsUser")?.insertDoc
		
		$("body").addClass("loading")
		# console.log doc
		Meteor.call 'addContactsUser', doc, (error,result) ->
			if error
				$("body").removeClass("loading")
				toastr.error t(error.reason)
			else
				$("body").removeClass("loading")
				toastr.success t(result)
				Modal.hide(template)