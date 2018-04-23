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
				moreArgs = Array.prototype.slice.call(arguments, 3)
				todoArgs = _.union [object_name, record_id], moreArgs
				todo.apply {
					object_name: object_name
					record_id: record_id
					object: obj
					action: action
				}, todoArgs
				

	Creator.actions 
		# 在此定义全局 actions
		"standard_new": (object_name, record_id, fields)->
			Meteor.defer ()->
				$(".creator-add").click()
			return 

		"standard_edit": (object_name, record_id, fields)->
			if record_id
				if Steedos.isMobile()
					record = Creator.getObjectRecord(object_name, record_id)
					Session.set 'cmDoc', record
					Session.set 'reload_dxlist', false
					Meteor.defer ()->
						$(".btn-edit-record").click()
				else
					Session.set 'action_object_name', object_name
					Session.set 'action_record_id', record_id
					Meteor.call "object_record", object_name, record_id, (error, result)->
						if result
							Session.set 'cmDoc', result
							Meteor.defer ()->
								$(".btn.creator-edit").click()

		"standard_delete": (object_name, record_id, record_title, call_back)->
			object = Creator.getObject(object_name)
			if record_title
				text = "是否确定要删除此#{object.label} [#{record_title}]"
			else
				text = "是否确定要删除此#{object.label}"
			swal
				title: "删除#{object.label}"
				text: "<div class='delete-creator-warning'>#{text}？</div>"
				html: true
				showCancelButton:true
				confirmButtonText: t('Delete')
				cancelButtonText: t('Cancel')
				(option) ->
					if option
						Creator.odata.delete object_name, record_id, ()->
							if record_title
								info = object.label + "\"#{record_title}\"" + "已删除"
							else
								info = "删除成功"
							toastr.success info
							if record_id == Session.get("record_id") and !Steedos.isMobile()
								appid = Session.get("app_id")
								FlowRouter.go "/app/#{appid}/#{object_name}/grid"
							if call_back and typeof call_back == "function"
								call_back()
