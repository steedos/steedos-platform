Template.account_avatar.onCreated ->

Template.account_avatar.onRendered ->

Template.account_avatar.helpers Creator.helpers

Template.account_avatar.helpers

	user: ->
		return Meteor.user()

	userId: ->
		return Meteor.userId()

	avatarURL: (avatar) ->
		if Meteor.user()
			return Steedos.absoluteUrl("avatar/#{Meteor.userId()}?w=220&h=200&fs=100&avatar=#{avatar}");

Template.account_avatar.events

	'change .change-avatar .avatar-file': (event, template) ->
		file = event.target.files[0];
		unless file
			return
		$("body").addClass("loading");
		db.avatars.insert file, (error, fileDoc)->
			if error
				console.error error
				toastr.error t(error.reason)
				$(document.body).removeClass('loading')
			else
				# Inserted new doc with ID fileDoc._id, and kicked off the data upload using HTTP
				# 理论上这里不需要加setTimeout，但是当上传图片很快成功的话，定阅到Avatar变化时可能请求不到上传成功的图片
				setTimeout(()->
					Meteor.call "updateUserAvatar", fileDoc._id, (error, result)->
						if result?.error
							$(document.body).removeClass('loading')
							toastr.error t(result.message)
						else
							$(document.body).removeClass('loading')
				, 3000)
