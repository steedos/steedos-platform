Template.mobileView.onRendered ->
	this.$(".mobile-view").removeClass "hidden"
	this.$(".mobile-view").animateCss "fadeInRight"

Template.mobileView.helpers
	record_id: ()->
		return Template.instance().data.record_id

Template.mobileView.events
	'click .mobile-view-back': (event, template)->
		lastUrl = urlQuery[urlQuery.length - 2]
		template.$(".mobile-view").animateCss "fadeOutRight", ->
			Blaze.remove(template.view)         
			urlQuery.pop()
			if lastUrl
				FlowRouter.go lastUrl
			else
				FlowRouter.go '/app/menu'

	'click .select-detail': (event, template)->
		template.$(".select-related").removeClass("selected")
		$(event.currentTarget).addClass("selected")
		template.$(".indicator-bar").css({"transform": "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)"})
		template.$(".record-detail-card").css({"transform": "translate3d(0px, 0px, 0px)"})

	'click .select-related': (event, template)->
		template.$(".select-detail").removeClass("selected")
		$(event.currentTarget).addClass("selected")
		width = template.$(".indicator-bar").width()
		template.$(".indicator-bar").css({"transform": "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, #{width}, 0, 0, 1)"})
		template.$(".record-detail-card").css({"transform": "translate3d(-100%, 0px, 0px)"})
