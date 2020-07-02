Template.contacts_settings_limit_modal.helpers
	limits_schema: ()->
		index = Template.instance().data
		if index
			index = parseInt index
			spaceId = Steedos.spaceId()
			limits = db.space_settings.findOne(space: spaceId, key: "contacts_view_limits")
			currentLimit = limits.values[index]
		fields =
			froms:
				autoform:
					type: 'selectorg'
					multiple: true
					defaultValue: ()->
						if currentLimit
							return currentLimit.froms
						else
							return []
				optional: false
				type: [ String ]
				label: t 'space_viewing_limits_froms_label'
			tos:
				autoform:
					type: 'selectorg'
					multiple: true
					defaultValue: ()->
						if currentLimit
							return currentLimit.tos
						else
							return []
				optional: true
				type: [ String ]
				label: t 'space_viewing_limits_tos_label'

		return new SimpleSchema(fields)


Template.contacts_settings_limit_modal.events
	'click .btn-save': (event, template)->
		spaceId = Steedos.spaceId()
		limits = db.space_settings.findOne(space: spaceId, key: "contacts_view_limits")
		unless limits
			limits = {values:[]}
		index = template.data
		if index
			index = parseInt index
			currentLimit = limits.values[index]
		unless currentLimit
			currentLimit = {}
			limits.values.push currentLimit
		currentLimit.froms = AutoForm.getFieldValue("froms","contacts_settings_limits") || []
		currentLimit.tos = AutoForm.getFieldValue("tos","contacts_settings_limits") || []
		unless currentLimit.froms?.length
			toastr.error t "space_viewing_limits_froms_required"
			return
		Meteor.call("set_space_settings", spaceId, "contacts_view_limits", limits.values, false, (error, result)->
			if error
				toastr.error error.reason
			else
				Modal.hide(template)
				toastr.success(t("saved_successfully"))
		)