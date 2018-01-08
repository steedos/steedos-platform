Creator.actionsByName = {}

if Meteor.isClient

	# 定义全局 actions 函数	
	Creator.actions = (actions)->
		_.each actions, (todo, action_name)->
			Creator.actionsByName[action_name] = todo 

	Creator.executeAction = (object_name, action, record_id)->
		obj = Creator.getObject(object_name)
		if action?.todo
			if typeof action.todo == "string"
				todo = Creator.actionsByName[action.todo]
			else if typeof action.todo == "function"
				todo = action.todo	
			if todo
				todo.apply {
					object_name: object_name
					record_id: record_id
					object: obj
					action: action
				}, [
					object_name
					record_id
				]
				

	Creator.actions 
		# 在此定义全局 actions
		"standard_new": (object_name, record_id, fields)->
			Meteor.defer ()->
				$(".creator-add").click()
			return 

		"standard_edit": (object_name, record_id, fields)->
			if record_id
				Session.set 'action_object_name', object_name
				Session.set 'action_record_id', record_id

				Meteor.defer ()->
					$(".btn.creator-edit").click()

		"standard_delete": (object_name, record_id, fields)->
			record = Creator.getObjectRecord(object_name, record_id)
			swal
				title: "删除#{t(object_name)}"
				text: "<div class='delete-creator-warning'>是否确定要删除此#{t(object_name)}？</div>"
				html: true
				showCancelButton:true
				confirmButtonText: t('Delete')
				cancelButtonText: t('Cancel')
				(option) ->
					if option
						Creator.Collections[object_name].remove {_id: record._id}, (error, result) ->
							if error
								toastr.error error.reason
							else
								info = t(object_name) + '"' + record.name + '"' + "已删除"
								toastr.success info
								if record_id == Session.get("record_id")
									appid = Session.get("app_id")
									FlowRouter.go "/app/#{appid}/#{object_name}/list"
