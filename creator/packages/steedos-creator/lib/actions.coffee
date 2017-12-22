Creator.actionsByName = {}

if Meteor.isClient

	# 定义全局 actions 函数	
	Creator.actions = (actions)->
		_.each actions, (todo, action_name)->
			Creator.actionsByName[action_name] = todo 

	Creator.executeAction = (object_name, action)->
		obj = Creator.getObject(object_name)
		if action?.todo
			if action.todo instanceof String
				todo = Creator.actionsByName[action.todo]
			else if typeof action.todo == "function"
				todo = action.todo	
			if todo
				todo.apply
					object_name: object_name
					object: obj
					action: action
				

	Creator.actions 
		# 下一步在此定义全局 actions
		"standard_new": (fields)->
			return 
