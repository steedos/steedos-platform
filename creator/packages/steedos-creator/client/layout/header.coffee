Template.creatorHeader.helpers Creator.helpers

Template.creatorHeader.helpers
	logo: ()->
		return Steedos.absoluteUrl("/packages/steedos_creator/assets/logo.png")

		
	avatarURL: (avatar,w,h,fs) ->
		return Steedos.absoluteUrl("avatar/#{Meteor.userId()}?w=#{w}&h=#{h}&fs=#{fs}&avatar=#{avatar}");

	displayName: ->
		if Meteor.user()
			return Meteor.user().displayName()
		else
			return " "
