Template.creator_table_actions.helpers Creator.helpers

Template.creator_table_actions.helpers
	object_name: ()->
		return Template.instance().data.object_name
	
	record_id: ()->
		return Template.instance().data._id

	actions: ()->
		object_name = this.object_name
		record_id = this._id
		record_permissions = this.record_permissions
		obj = Creator.getObject(object_name)
		actions = Creator.getActions(object_name)
		actions = _.filter actions, (action)->
			if action.on == "record" or action.on == "record_more" or action.on == "list_item"
				if typeof action.visible == "function"
					return action.visible(object_name, record_id, record_permissions)
				else
					return action.visible
			else
				return false
		return actions

	getSvgUrl: (source, name)->
		url = "/packages/steedos_lightning-design-system/client/icons/#{source}/symbols.svg##{name}"
		return Creator.getRelativeUrl(url)