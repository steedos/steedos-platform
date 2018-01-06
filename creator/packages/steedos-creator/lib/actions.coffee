Creator.actionsByName = {}

if Meteor.isClient

	# 定义全局 actions 函数	
	Creator.actions = (actions)->
		_.each actions, (todo, action_name)->
			Creator.actionsByName[action_name] = todo 

	Creator.executeAction = (object_name, action, id)->
		obj = Creator.getObject(object_name)
		if action?.todo
			if typeof action.todo == "string"
				todo = Creator.actionsByName[action.todo]
			else if typeof action.todo == "function"
				todo = action.todo	
			if todo
				todo.apply
					object_name: object_name
					record_id: id
					object: obj
					action: action
				

	Creator.actions 
		# 在此定义全局 actions
		"standard_new": (fields)->
			Meteor.defer ()->
				$(".creator-add").click()
			return 

		"standard_edit": (fields)->
			console.log 'click .list-action-custom========339922'
			console.log 'click .list-action-custom========339922', this
			record_id = this.record_id
			object_name = this.object_name

			if record_id
				Session.set 'action_object_name', object_name
				Session.set 'action_record_id', record_id

				Meteor.defer ()->
					$(".btn.creator-edit").click()

		"standard_delete": (fields)->
			object_name = Session.get('object_name')
			record = Creator.getObjectRecord()

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

								appid = Session.get("app_id")
								FlowRouter.go "/app/#{appid}/#{object_name}/list"

		"standard_list_item_edit": (object_name, id, fields)->
			record_id = this.record_id
			object_name = this.object_name

			if record_id
				Session.set 'action_object_name', object_name
				Session.set 'action_record_id', record_id

				Meteor.defer ()->
					$(".btn.creator-edit").click()
		
		"standard_list_item_delete": (fields)->
			record_id = this.record_id
			object_name = this.object_name
			record = Creator.Collections[object_name].findOne record_id

			swal
				title: "删除#{t(object_name)}"
				text: "<div class='delete-creator-warning'>是否确定要删除此#{t(object_name)}？</div>"
				html: true
				showCancelButton:true
				confirmButtonText: t('Delete')
				cancelButtonText: t('Cancel')
				(option) ->
					if option
						Creator.Collections[object_name].remove {_id: record_id}, (error, result) ->
							if error
								toastr.error error.reason
							else
								info = t(object_name) + '"' + record.name + '"' + "已删除"
								toastr.success info

		"standard_related_list_item_edit": (fields)->
			record_id = this.record_id
			object_name = this.object_name

			if record_id
				Session.set 'action_object_name', object_name
				Session.set 'action_record_id', record_id

				Meteor.defer ()->
					$(".btn.creator-edit").click()
		
		"standard_related_list_item_delete": (fields)->
			record_id = this.record_id
			object_name = this.object_name
			record = Creator.Collections[object_name].findOne record_id

			swal
				title: "删除#{t(object_name)}"
				text: "<div class='delete-creator-warning'>是否确定要删除此#{t(object_name)}？</div>"
				html: true
				showCancelButton:true
				confirmButtonText: t('Delete')
				cancelButtonText: t('Cancel')
				(option) ->
					if option
						Creator.Collections[object_name].remove {_id: record_id}, (error, result) ->
							if error
								toastr.error error.reason
							else
								info = t(object_name) + '"' + record.name + '"' + "已删除"
								toastr.success info
		