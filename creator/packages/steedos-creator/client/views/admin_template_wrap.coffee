Template.admin_template_wrap.onCreated ->

Template.admin_template_wrap.onRendered ->
	if Steedos.isMobile()
		this.$("##{this.data.id}").removeClass "hidden"	
		this.$("##{this.data.id}").animateCss "fadeInRight"

Template.admin_template_wrap.helpers Creator.helpers

Template.admin_template_wrap.helpers

Template.admin_template_wrap.events
	"click .admin-menu-back": (event, template) ->
		debugger
		lastUrl = urlQuery[urlQuery.length - 2]
		urlQuery.pop()
		template.$("##{template.data.id}").animateCss "fadeOutRight", ->
			Blaze.remove(template.view)
			if lastUrl
				FlowRouter.go lastUrl
			else
				FlowRouter.go '/app'