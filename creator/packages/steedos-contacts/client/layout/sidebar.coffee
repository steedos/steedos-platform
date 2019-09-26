Template.contactsSidebar.helpers

	spaceId: ->
		if Session.get("spaceId")
			return Session.get("spaceId")
		else
			return localStorage.getItem("spaceId:" + Meteor.userId())

	liActive: (li)->
		if li == 'books' 
			if Session.get("contact_showBooks")
				return 'active';
			else
				return ''
		else
			if !Session.get("contact_showBooks")
				return 'active';
			else
				return ''

Template.contactsSidebar.events

	'click .main-header .logo': (event) ->
		Modal.show "app_list_box_modal"

	'click .header-app': (event) ->
		FlowRouter.go "/contacts/"
		if Steedos.isMobile()
			# 手机上可能菜单展开了，需要额外收起来
			$("body").removeClass("sidebar-open")