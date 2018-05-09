
Template.switchSpace.onRendered ->
	this.$("#switch_space").removeClass "hidden"	
	this.$("#switch_space").animateCss "fadeInRight"

Template.switchSpace.helpers 
	spaces: ->
		return db.spaces.find();

	current_space: (_id)->
		if _id == Session.get("spaceId")
			return true
		
		return false
		 

Template.switchSpace.events 
	"click .switchSpace": (event, template) ->
		Steedos.setSpaceId(this._id)
		FlowRouter.go '/app'

	"click .switch-space-back": (event, template) ->
		lastUrl = urlQuery[urlQuery.length - 2]
		urlQuery.pop()
		template.$("#switch_space").animateCss "fadeOutRight", ->
			Blaze.remove(template.view)
			if lastUrl
				FlowRouter.go lastUrl
			else
				FlowRouter.go '/app'
		 
