
Template.adminMenu.onRendered ->
	this.$("#admin_menu").removeClass "hidden"	
	this.$("#admin_menu").animateCss "fadeInRight"

Template.adminMenu.helpers 
	avatarURL: (avatar,w,h,fs) ->
		return Steedos.absoluteUrl("/packages/steedos_lightning-design-system/client/images/themes/oneSalesforce/lightning_lite_profile_avatar_96.png")

	name: ()->
		return Creator.getCollection("users").findOne()?.name

	spaceName: ->
		if Session.get("spaceId")
			space = db.spaces.findOne(Session.get("spaceId"))
			if space
				return space.name
		return t("none_space_selected_title")
		 

Template.adminMenu.events 
	"click .admin-menu-back": (event, template) ->
		lastUrl = urlQuery[urlQuery.length - 2]
		urlQuery.pop()
		template.$("#admin_menu").animateCss "fadeOutRight", ->
			Blaze.remove(template.view)
			if lastUrl
				FlowRouter.go lastUrl
			else
				FlowRouter.go '/app/menu'
	
	'click .btn-switch-space': (event, template)->
		FlowRouter.go '/admin/switchspace'
		 
