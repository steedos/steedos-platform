Creator.actionsByName = {}

if Meteor.isClient

	# 定义全局 actions 函数	
	Creator.actions = (actions)->
		_.each actions, (todo, action_name)->
			Creator.actionsByName[action_name] = todo 

	Creator.executeAction = (object_name, action, record_id, item_element, list_view_id, record)->
		obj = Creator.getObject(object_name)
		if action?.todo
			if typeof action.todo == "string"
				todo = Creator.actionsByName[action.todo]
			else if typeof action.todo == "function"
				todo = action.todo	
			if !record && object_name && record_id
				record = Creator.odata.get(object_name, record_id)
			if todo
				# item_element为空时应该设置默认值（对象的name字段），否则moreArgs拿到的后续参数位置就不对
				item_element = if item_element then item_element else ""
				moreArgs = Array.prototype.slice.call(arguments, 3)
				todoArgs = [object_name, record_id].concat(moreArgs)
				todo.apply {
					object_name: object_name
					record_id: record_id
					object: obj
					action: action
					item_element: item_element
					record: record
				}, todoArgs
				

	Creator.actions 
		# 在此定义全局 actions
		"standard_query": ()->
			Modal.show("standard_query_modal")

		"standard_new": (object_name, record_id, fields)->
			ids = Creator.TabularSelectedIds[object_name]
			if ids?.length
				# 列表有选中项时，取第一个选中项，复制其内容到新建窗口中
				# 这的第一个指的是第一次勾选的选中项，而不是列表中已勾选的第一项
				record_id = ids[0]
				doc = Creator.odata.get(object_name, record_id)
				Session.set 'cmDoc', doc
				# “保存并新建”操作中自动打开的新窗口中需要再次复制最新的doc内容到新窗口中
				Session.set 'cmShowAgainDuplicated', true
			Meteor.defer ()->
				$(".creator-add").click()
			return 
			
		"standard_open_view": (object_name, record_id, fields)->
			href = Creator.getObjectUrl(object_name, record_id)
			window.open(
				href,
				'_blank',
				'width=800, height=600, left=50, top= 50, toolbar=no, status=no, menubar=no, resizable=yes, scrollbars=yes'
			)
			return false

		"standard_open_view": (object_name, record_id, fields)->
			href = Creator.getObjectUrl(object_name, record_id)
			window.open(
				href,
				'_blank',
				'width=800, height=600, left=50, top= 50, toolbar=no, status=no, menubar=no, resizable=yes, scrollbars=yes'
			)
			return false

		"standard_edit": (object_name, record_id, fields)->
			if record_id
				if Steedos.isMobile() && false
#					record = Creator.getObjectRecord(object_name, record_id)
#					Session.set 'cmDoc', record
#					Session.set 'reload_dxlist', false
					Session.set 'action_object_name', object_name
					Session.set 'action_record_id', record_id
					if this.record
						Session.set 'cmDoc', this.record
					Meteor.defer ()->
						$(".btn-edit-record").click()
				else
					Session.set 'action_object_name', object_name
					Session.set 'action_record_id', record_id
					if this.record
						Session.set 'cmDoc', this.record
						Meteor.defer ()->
							$(".btn.creator-edit").click()

		"standard_delete": (object_name, record_id, record_title, list_view_id, call_back)->
			console.log("standard_delete", object_name, record_id, record_title, list_view_id)
			object = Creator.getObject(object_name)

			if(!_.isString(record_title) && record_title?.name)
				record_title = record_title?.name

			if record_title
				text = "是否确定要删除此#{object.label}\"#{record_title}\""
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
							# 文件版本为"cfs.files.filerecord"，需要替换为"cfs-files-filerecord"
							gridObjectNameClass = object_name.replace(/\./g,"-")
							gridContainer = $(".gridContainer.#{gridObjectNameClass}")
							unless gridContainer?.length
								if window.opener
									isOpenerRemove = true
									gridContainer = window.opener.$(".gridContainer.#{gridObjectNameClass}")
							if gridContainer?.length
								if object.enable_tree
									dxDataGridInstance = gridContainer.dxTreeList().dxTreeList('instance')
								else
									dxDataGridInstance = gridContainer.dxDataGrid().dxDataGrid('instance')
							if dxDataGridInstance
								if object.enable_tree
									dxDataGridInstance.refresh()
								else
									Template.creator_grid.refresh(dxDataGridInstance)
							if isOpenerRemove or !dxDataGridInstance
								if isOpenerRemove
									window.close()
								else if record_id == Session.get("record_id") and !Steedos.isMobile() and list_view_id != 'calendar'
									appid = Session.get("app_id")
									unless list_view_id
										list_view_id = Session.get("list_view_id")
									unless list_view_id
										list_view_id = "all"
									FlowRouter.go "/app/#{appid}/#{object_name}/grid/#{list_view_id}"
							if call_back and typeof call_back == "function"
								call_back()
