Steedos.subsAddressBook = new SubsManager();
Steedos.subs["Organization"] = new SubsManager();
Steedos.subs["user_space"] = new SubsManager();
Steedos.subs["contacts_settings"] = new SubsManager();

Tracker.autorun (c)->
	if Meteor.userId()
		Steedos.subsAddressBook.subscribe "address_groups";

		Steedos.subsAddressBook.subscribe "address_books";

	if Session.get('contacts_org_mobile')
		Steedos.subs["Organization"].subscribe "organization", Session.get('contacts_org_mobile')


Meteor.startup ->
	Tracker.autorun (c)->
		if Meteor.userId()
			Steedos.subs["user_space"].subscribe "space_need_to_confirm"
			spaceNeedToConfirm = db.space_users.find({user: Meteor.userId(), invite_state: "pending"}).fetch() || []
			spaceNeedToConfirm.forEach (obj) ->
				Meteor.call 'getSpaceUsersInfo', obj.created_by, obj.space, (error,result) ->
					if error
						console.log error
					else
						swal {
							title: t("contact_invite_info", {inviter: result.inviter, space: result.space})
							type: "info"
							showCancelButton: true
							cancelButtonText: "拒绝"
							confirmButtonColor: "#2196f3"
							confirmButtonText: t('OK')
							closeOnConfirm: true
							allowEscapeKey: false
							allowOutsideClick: false
						}, (option)->
							if option
								Meteor.call 'acceptJoinWorkflow', obj._id, (error,result) ->
									if error
										console.log error
									else 
										console.log 'acceptJoinWorkflow'
							else
								Meteor.call 'refuseJoinWorkflow', obj._id, (error,result) ->
									if error
										console.log error
									else 
										console.log 'refuseJoinWorkflow'
									
			


