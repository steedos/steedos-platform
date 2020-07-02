Template.contacts_settings.helpers

	hidden_users: ()->

		spaceId = Session.get("spaceId");

		setting = db.space_settings.findOne({space: spaceId, key: "contacts_hidden_users"})

		values = setting?.values || []

		if setting
			return SteedosDataManager.spaceUserRemote.find({space: spaceId, user: {$in: values}}, {fields: {_id: 1, name: 1, user: 1, email: 1}})
		else
			return []

	view_limits: ()->
		spaceId = Steedos.spaceId()
		return db.space_settings.find(space: spaceId, key: "contacts_view_limits")

	limit_from_names: (froms)->
		orgs = SteedosDataManager.organizationRemote.find _id: {$in: froms}, {fields:{fullname:1}}
		return orgs.getProperty("fullname")

	no_force_phone_users: ()->
		spaceId = Session.get("spaceId");
		setting = db.space_settings.findOne({space: spaceId, key: "contacts_no_force_phone_users"})
		values = setting?.values || []
		if setting
			return SteedosDataManager.spaceUserRemote.find({space: spaceId, user: {$in: values}}, {fields: {_id: 1, name: 1, user: 1, email: 1}})
		else
			return []

	isForceAccountBindPhone: ()->
		return Meteor.settings?.public?.phone?.forceAccountBindPhone


Template.contacts_settings.events
	'click .set_settings': (event, template)->
		Modal.show("contacts_settings_hidden_modal")

	'click .view-limit-block .btn-add': (event, template)->
		Modal.show("contacts_settings_limit_modal")

	'click .view-limit-block .btn-edit': (event, template)->
		index = event.currentTarget.dataset.index
		Modal.show("contacts_settings_limit_modal", index)

	'click .view-limit-block .btn-delete': (event, template)->
		index = event.currentTarget.dataset.index
		spaceId = Steedos.spaceId()
		swal {
			title: t('flow_db_admin_confirm_delete')
			text: t('flow_db_admin_confirm_delete_document')
			type: 'warning'
			showCancelButton: true
			closeOnConfirm: true
			confirmButtonColor: '#DD6B55'
			confirmButtonText: t('OK')
			cancelButtonText: t('Cancel')
		}, ->
			limits = db.space_settings.findOne(space: spaceId, key: "contacts_view_limits")
			unless limits?.values?.length
				Modal.hide(template)
				return
			if index
				index = parseInt index
				limits.values.splice(index,1)
				Meteor.call("set_space_settings", spaceId, "contacts_view_limits", limits.values, false, (error, result)->
					if error
						toastr.error error.reason
					else
						Modal.hide(template)
						toastr.success(t("saved_successfully"))
				)

	'click .no-force-phone-block .btn-edit': (event, template)->
		Modal.show("contacts_settings_no_force_phone_modal")

Template.contacts_settings.onCreated ->
	spaceId = Steedos.spaceId()
	Steedos.subs["contacts_settings"].subscribe("contacts_view_limits", spaceId)
	Steedos.subs["contacts_settings"].subscribe("contacts_no_force_phone_users", spaceId)

Template.contacts_settings.onDestroyed ->
	Steedos.subs["contacts_settings"].clear()
