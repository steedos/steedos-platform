Template.account_background.onCreated ->

Template.account_background.onRendered ->
	this.$("#account_background").removeClass "hidden"	
	this.$("#account_background").animateCss "fadeInRight"

Template.account_background.helpers Creator.helpers

Template.account_background.helpers
	accountBgBodyValue: ()->
		return Steedos.getAccountBgBodyValue()

	isCurrentBgUrlActive: (url)->
		return if url == Steedos.getAccountBgBodyValue().url then "active" else ""

	isCurrentBgUrlWaitingSave: (url)->
		return if url == Session.get("waiting_save_profile_bg") then "btn-warning" else "btn-default"

	bgBodys: ->
		bgs = [{
			name: "flower",
			url: "/packages/steedos_theme/client/background/flower.jpg"
		}, {
			name: "beach",
			url: "/packages/steedos_theme/client/background/beach.jpg"
		}, {
			name: "birds",
			url: "/packages/steedos_theme/client/background/birds.jpg"
		}, {
			name: "books",
			url: "/packages/steedos_theme/client/background/books.jpg"
		}, {
			name: "cloud",
			url: "/packages/steedos_theme/client/background/cloud.jpg"
		}, {
			name: "sea",
			url: "/packages/steedos_theme/client/background/sea.jpg"
		}, {
			name: "fish",
			url: "/packages/steedos_theme/client/background/fish.jpg"
		}]

		background = Meteor.settings?.public?.admin?.background
		if background
			bgs.unshift 
				name: "default",
				url: background

		return bgs

	absoluteUrl: (url)->
		return Steedos.absoluteUrl url


Template.account_background.events

	'click #creator-account-background-form .bg-body-setting a.thumbnail': (event)->
		dataset = event.currentTarget.dataset
		url = dataset.url
		accountBgBodyValue = Steedos.getAccountBgBodyValue()
		btn_save = $("#creator-account-background-form button.btn-save-bg")[0]
		btn_save.dataset.url = url
		btn_save.dataset.avatar = accountBgBodyValue.avatar #自定义头像保持不变
		Steedos.applyAccountBgBodyValue(btn_save.dataset)
		Session.set("waiting_save_profile_bg", url)
		$("#creator-account-background-form button.btn-save-bg").trigger("click")

	'click #creator-account-background-form button.btn-save-bg': (event)->
		dataset = event.currentTarget.dataset
		url = dataset.url
		accountBgBodyValue = Steedos.getAccountBgBodyValue()
		unless accountBgBodyValue
			accountBgBodyValue = {}
		accountBgBodyValue.url = url
		Meteor.call 'setKeyValue', 'bg_body', accountBgBodyValue, (error, is_suc) ->
			if is_suc
				Session.set("waiting_save_profile_bg", "")
				toastr.success t('profile_save_bg_suc')
			else
				console.error error
				toastr.error(error)

	'change #creator-account-background-form .btn-upload-bg-file .avatar-file': (event, template) ->
		oldAvatar = Steedos.getAccountBgBodyValue().avatar
		if oldAvatar
			Session.set("waiting_save_profile_bg", oldAvatar)
		file = event.target.files[0];
		fileObj = db.avatars.insert file
		fileId = fileObj._id
		url = fileId
		absUrl = Steedos.absoluteUrl("api/files/avatars/#{fileId}")
		setTimeout(()->
			Steedos.applyAccountBgBodyValue({url:url, avatar:fileId})
			Meteor.call 'setKeyValue', 'bg_body', {'url': url, 'avatar': fileId}, (error, is_suc) ->
				if is_suc
					Session.set("waiting_save_profile_bg", "")
					toastr.success t('profile_save_bg_suc')
					
					accountBgBodyValue = Steedos.getAccountBgBodyValue()
					btn_save = $("#creator-account-background-form button.btn-save-bg")[0]
					btn_save.dataset.url = url
					btn_save.dataset.avatar = accountBgBodyValue.avatar #自定义头像保持不变
				else
					console.error error
					toastr.error(error)
		, 3000)
