Template.creatorHeader.helpers Creator.helpers

Template.creatorHeader.helpers
	logo: ()->
		return Creator.getRelativeUrl("/packages/steedos_creator/assets/logo.png")


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


Template.creatorHeader.events

	'click .creator-button-setup': (e, t)->
		FlowRouter.go("/app/admin")

	'click .creator-button-help': (e, t)->
		Steedos.openWindow("https://www.steedos.com/cn/help/creator/")

	'click .creator-button-shopping': (e, t)->
		Modal.show('template_apps_list_modal')