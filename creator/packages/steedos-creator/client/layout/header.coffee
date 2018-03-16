Template.creatorHeader.helpers Creator.helpers

Template.creatorHeader.helpers
	logo: ()->
		return Steedos.absoluteUrl("/packages/steedos_creator/assets/logo.png")


	avatarURL: (avatar,w,h,fs) ->
		#return Steedos.absoluteUrl("avatar/#{Meteor.userId()}?w=#{w}&h=#{h}&fs=#{fs}&avatar=#{avatar}");
		return Steedos.absoluteUrl("/packages/steedos_lightning-design-system/client/images/themes/oneSalesforce/lightning_lite_profile_avatar_96.png")

	displayName: ->
		if Meteor.user()
			return Meteor.user().displayName()
		else
			return " "

	signOutUrl: ()->
		return Steedos.absoluteUrl("/steedos/logout")
