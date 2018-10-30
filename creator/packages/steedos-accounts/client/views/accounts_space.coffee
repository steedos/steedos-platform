Template.accounts_space.helpers
	title: ->
		return t "accounts_space_title"

Template.accounts_space.onRendered ->

Template.accounts_space.events
	'click .btn-ok': (event,template) ->
		name = $(".accounts-space-name").val().trim()
		if !name
			return false
		$("body").addClass("loading")
		Meteor.call 'adminInsertDoc', {name:name}, "spaces", (e,r)->
			$("body").removeClass("loading")
			if e
				toastr.error e.message
				return false

			if r && r._id
				Steedos.setSpaceId(r._id)
				toastr.success t("accounts_space_success")
				FlowRouter.go("/")

	'click .btn-cancel': (event,template) ->
		if Steedos.spaceId()
			FlowRouter.go("/admin/space/info")
			event.preventDefault()
			return false

