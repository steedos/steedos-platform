RelatedInstances.helpers =
	showRelatedInstaces: ->
		if Meteor.isClient
			ins = WorkflowManager.getInstance();
		else
			ins = this.instance
		if ins?.related_instances && _.isArray(ins?.related_instances)
			if db.instances.find({_id: {$in: ins.related_instances}}, {fields: {space: 1, name: 1}}).count() > 0
				return true
			return false
		else
			return false

	related_instaces: ->
		if Meteor.isClient
			ins = WorkflowManager.getInstance();
		else
			ins = this.instance
		if ins?.related_instances && _.isArray(ins?.related_instances)
			return db.instances.find({_id: {$in: ins.related_instances}}, {fields: {space: 1, name: 1}}).fetch()

	related_instace_url: (ins) ->

		if Meteor.isClient && (Steedos.isMobile() || Steedos.isCordova())
			return ''

		absolute = false

		if Meteor.isServer
			absolute = this.absolute
		if absolute
			return Meteor.absoluteUrl("workflow/space/"+ins.space+"/view/readonly/" + ins._id + '?hide_traces=0')
		else
			return Steedos.absoluteUrl("workflow/space/"+ins.space+"/view/readonly/" + ins._id + '?hide_traces=0')

	_t: (key)->
		if Meteor.isClient
			return TAPi18n.__(key)
		else
			locale = Template.instance().view.template.steedosData.locale
			return TAPi18n.__(key, {}, locale)

	show_delete: ()->
		if !Meteor.isClient
			return false
		else
			if Session.get("box") == "draft" || Session.get("box") == 'inbox'
				current_step = InstanceManager.getCurrentStep()
				if current_step
					if (current_step.can_edit_main_attach || current_step.can_edit_normal_attach == true || current_step.can_edit_normal_attach == undefined)
						return true