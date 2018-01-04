Template.creator_table_actions.helpers
	object_name: ()->
		return Template.instance().data.object_name
	
	record_id: ()->
		return Template.instance().data._id

	actions: ()->
		self = this
		obj = Creator.getObject(self.object_name)
		actions = _.map obj.actions, (val, key) ->
			val._ACTION_KEY = key
			return val
		actions = _.values(actions) 
		actions = _.filter actions, (action)->
			actionKey = if self.is_related then "related_list_item" else "list_item"
			if action.on == actionKey
				if typeof action.visible == "function"
					return action.visible(self)
				else
					return action.visible
			else
				return false
		return actions