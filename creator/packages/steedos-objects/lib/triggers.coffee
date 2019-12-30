Creator._trigger_hooks = {}

initTrigger = (object_name, trigger)->
	try
		collection = Creator.getCollection(object_name)
		if !trigger.todo
			return
		todoWrapper = ()->
			  this.object_name = object_name
			  return trigger.todo.apply(this, arguments)
		if trigger.when == "before.insert"
			  return collection?.before?.insert(todoWrapper)
		  else if trigger.when == "before.update"
			  return collection?.before?.update(todoWrapper)
		  else if trigger.when == "before.remove"
			  return collection?.before?.remove(todoWrapper)
		  else if trigger.when == "after.insert"
			  return collection?.after?.insert(todoWrapper)
		  else if trigger.when == "after.update"
			  return collection?.after?.update(todoWrapper)
		  else if trigger.when == "after.remove"
			  return collection?.after?.remove(todoWrapper)
	catch error
		console.error('initTrigger error', error)

cleanTrigger = (object_name)->
	###
    	由于collection-hooks package 的remove函数是使用下标删除对象的，所以此处反转hooks集合后，再删除
    	因为一个数组元素删除后，其他元素的下标会发生变化
	###
    #TODO 由于collection-hooks package 的remove函数bug
	Creator._trigger_hooks[object_name]?.reverse().forEach (_hook)->
		_hook.remove()

Creator.initTriggers = (object_name)->
#	console.log('Creator.initTriggers object_name', object_name)
	obj = Creator.getObject(object_name)

	cleanTrigger(object_name)

	Creator._trigger_hooks[object_name] = []

	_.each obj.triggers, (trigger, trigger_name)->
		if Meteor.isServer and trigger.on == "server" and trigger.todo and trigger.when
			_trigger_hook = initTrigger object_name, trigger
			Creator._trigger_hooks[object_name].push(_trigger_hook)
		if Meteor.isClient and trigger.on == "client" and trigger.todo and trigger.when
			_trigger_hook = initTrigger object_name, trigger
			Creator._trigger_hooks[object_name].push(_trigger_hook)