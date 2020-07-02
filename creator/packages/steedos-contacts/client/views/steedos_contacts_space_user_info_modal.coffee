Template.steedos_contacts_space_user_info_modal.helpers
	isMobile: ->
		return Steedos.isMobile()

	spaceUser: ->
		return db.space_users.findOne Template.instance().data.targetId;
	
	spaceUserOrganizations: ->
		spaceUser = db.space_users.findOne Template.instance().data.targetId;
		if spaceUser
			if Steedos.isMobile()
				return SteedosDataManager.organizationRemote.find({_id: {$in: spaceUser.organizations}},{fields: {name: 1}})
			else
				return SteedosDataManager.organizationRemote.find({_id: {$in: spaceUser.organizations}},{fields: {fullname: 1}})
		return []

	isPrimaryOrg: (id)->
		spaceUser = db.space_users.findOne Template.instance().data.targetId;
		return spaceUser?.organization == id

	spaceUserInfo: ->
		info = ""
		spaceUser = db.space_users.findOne Template.instance().data.targetId, {fields: {name: 1, email: 1, position: 1, mobile: 1, work_phone: 1, organizations: 1}};
		if spaceUser
			orgArray = SteedosDataManager.organizationRemote.find({_id: {$in: spaceUser.organizations}},{fields: {fullname: 1}})
			if orgArray
				userInfo = []
				orgFullname = ""
				orgArray.forEach (org)->
					orgFullname = org.fullname + "\r\n               " + orgFullname
				# 定义复制信息的样式
				userInfo.push("#{t('steedos_contacts_name')}:#{spaceUser.name}")
				userInfo.push("#{t('steedos_contacts_email')}:#{if spaceUser.email then spaceUser.email else ""}")
				userInfo.push("#{t('steedos_contacts_position')}:#{if spaceUser.position then spaceUser.position else ""}")
				userInfo.push("#{t('steedos_contacts_mobile')}:#{if spaceUser.mobile then spaceUser.mobile else ""}")
				userInfo.push("#{t('steedos_contacts_work_phone')}:#{if spaceUser.work_phone then spaceUser.work_phone else ""}")
				userInfo.push("#{t('steedos_contacts_organizations')}:#{orgFullname}")
				
				info = userInfo.join('\n')
		
		return info

	isEditable: ->
		spaceUser = db.space_users.findOne Template.instance().data.targetId
		if Steedos.isSpaceAdmin() || Session.get('contacts_is_org_admin')
			return true
		else
			return false
	
	isDeletable: ->
		if Steedos.isSpaceAdmin()
			return true
		else
			return false

	username: () ->
		return Template.instance().username?.get()

	isModifiable: (id)->
		userObj = db.space_users.findOne(id)
		if userObj?.invite_state == "pending" || userObj?.invite_state == "refused"
			return false
		
		return true

	isShowInviteState: (state) ->
		if state == 'pending'
			return t('contact_invite_pending')
		else if state == 'refused'
			return t('contact_invite_refused') 

		return false

	isShowReinvite: (state) ->
		if state == 'refused'
			return true

		return false

	isHiddenUser: () ->
		return false
		# if Steedos.isSpaceAdmin() || (Session.get('contacts_is_org_admin') && !Session.get("contact_list_search"))
		# 	return false
		# else
		# 	su = db.space_users.findOne Template.instance().data.targetId;
		# 	hidden_users = SteedosContacts.getHiddenUsers(Session.get("spaceId"))
		# 	if hidden_users.indexOf(su.user) > -1
		# 		return true
		# return false


Template.steedos_contacts_space_user_info_modal.events
	'click .steedos-info-close': (event,template) ->
		$("#steedos_contacts_space_user_info_modal .close").trigger("click")

	'click .steedos-info-edit': (event, template) ->
		AdminDashboard.modalEdit 'space_users', event.currentTarget.dataset.id, ->
			$("body").off("click",".admin-dashboard-body input[name=mobile]")

	'click .btn-edit-username': (event, template) ->
		space_id = Session.get("spaceId")
		username = template.username?.get()
		user_id = event.currentTarget.dataset.id
		unless user_id
			return;
		swal {
			title: t('Change username')
			type: "input"
			inputValue: username || ""
			showCancelButton: true
			closeOnConfirm: false
			confirmButtonText: t('OK')
			cancelButtonText: t('Cancel')
			showLoaderOnConfirm: false
		}, (inputValue)->
			if inputValue is false
				return false
			if inputValue?.trim() == username?.trim()
				swal.close()
				return false;
			Meteor.call "setUsername", space_id, inputValue?.trim(), user_id, (error, results)->
				if results
					template.username.set(results);
					toastr.success t('Change username successfully')
					swal.close()
				if error
					toastr.error(TAPi18n.__(error.reason))

	'click .steedos-contact-reinvite': (event, template) ->
		id = event.currentTarget.dataset.id
		Meteor.call 'reInviteUser', id, (error, result) ->
			if error
				console.log error
			

	'click .steedos-info-delete': (event, template) ->
		AdminDashboard.modalDelete 'space_users', event.currentTarget.dataset.id, ->
			$("#steedos_contacts_space_user_info_modal .close").trigger("click")

	'click .btn-set-primary': (event, template) ->
		$("body").addClass("loading")
		spaceUserId = template.data.targetId
		orgId = event.currentTarget.dataset.id
		Meteor.call "set_primary_org", orgId, spaceUserId, (error, results)->
			$("body").removeClass("loading")
			if error
				toastr.error(TAPi18n.__(error.reason))



Template.steedos_contacts_space_user_info_modal.onRendered ()->
	copyInfoClipboard = new Clipboard('.steedos-info-copy', text: (spaceUser) ->
		return spaceUser.dataset.info
	)

	Template.steedos_contacts_space_user_info_modal.copyInfoClipboard = copyInfoClipboard
	
	copyInfoClipboard.on 'success', (e) ->
		e.clearSelection()
		toastr.success t("steedos_contacts_copy_successfully")
		return
	copyInfoClipboard.on 'error', (e) ->
		toastr.error t("steedos_contacts_copy_failed")
		return

Template.steedos_contacts_space_user_info_modal.onDestroyed ->
	Modal.allowMultiple = false
	Template.steedos_contacts_space_user_info_modal.copyInfoClipboard.destroy()


Template.steedos_contacts_space_user_info_modal.onCreated ->
	self = this
	self.username = new ReactiveVar("")
	space_user = db.space_users.findOne Template.instance().data.targetId
	$("body").addClass("loading")
	Meteor.call 'fetchUsername', space_user.user, (error, result) ->
		$("body").removeClass("loading")
		if error
			toastr.error TAPi18n.__(error.reason)
		else
			self.username.set(result)
