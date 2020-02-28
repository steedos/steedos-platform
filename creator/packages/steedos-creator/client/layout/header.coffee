Template.creatorHeader.helpers Creator.helpers

Template.creatorHeader.helpers
	logoUrl: ()->
		avatar = db.spaces.findOne(Steedos.getSpaceId())?.avatar_square
		if avatar
			return Steedos.absoluteUrl("/api/files/avatars/#{avatar}")
		else
			logo_url = "/packages/steedos_creator/assets/logo-square.png"
			return Creator.getRelativeUrl(logo_url)
	
	currentUserUser: ()->
		url = "app/admin/users/view/#{Steedos.userId()}"
		return Creator.getRelativeUrl(url)

	showSwitchOrganization : ()->
		show_switch_organization = Meteor?.settings?.public?.theme?.show_switch_organization
		if show_switch_organization
			return show_switch_organization
		else
			return false
		
	avatarURL: (avatar,w,h,fs) ->
		userId = Meteor.userId()
		avatar = Creator.getCollection("users").findOne({_id: userId})?.avatar
		if avatar
			return Steedos.absoluteUrl("avatar/#{Meteor.userId()}?w=220&h=200&fs=160&avatar=#{avatar}")
		else
			return Creator.getRelativeUrl("/packages/steedos_lightning-design-system/client/images/themes/oneSalesforce/lightning_lite_profile_avatar_96.png")

	displayName: ->
		if Meteor.user()
			return Meteor.user().displayName()
		else
			return " "

	signOutUrl: ()->
		return Creator.getRelativeUrl("/steedos/logout")

	isAdmin: ()->
		return Steedos.isSpaceAdmin()

	showShopping: ()->
		return Steedos.isSpaceAdmin() && !_.isEmpty(Creator?._TEMPLATE?.Apps)

	spaceName: (spaceId)->
		if !spaceId
			spaceId = Steedos.getSpaceId()
		if spaceId
			space = db.spaces.findOne(spaceId)
			if space
				return space.name

Template.creatorHeader.events

	'click .creator-button-setup': (e, t)->
		FlowRouter.go("/app/admin")

	'click .creator-button-help': (e, t)->
		Steedos.openWindow("https://www.steedos.com/cn/help/creator/")

	'click .creator-button-shopping': (e, t)->
		Modal.show('template_apps_list_modal')
		
	'click .creator-button-toggle': (e, t)->
		Modal.show("list_tree_modal")

	'click .current-user-link': (e, t)->
		url = Steedos.getUserRouter();
		FlowRouter.go(url)

	'click .history-back': ()->
		history.back()

	'click .history-forward': ()->
		history.forward()

	'click .refresh': ()->
		location.reload()
