Creator.actionsByName = {}

if Meteor.isClient
	# 定义全局 actions 函数	
	Creator.actions = (actions)->
		_.each actions, (todo, action_name)->
			Creator.actionsByName[action_name] = todo 

	Creator.executeAction = (object_name, action, record_id, item_element, list_view_id, record, callback)->
		if action && action.type == 'word-print'
			if record_id
				filters = ['_id', '=', record_id]
			else
				filters = ObjectGrid.getFilters(object_name, list_view_id, false, null, null)
			url = "/api/v4/word_templates/" + action.word_template + "/print" + "?filters=" + SteedosFilters.formatFiltersToODataQuery(filters);
			url = Steedos.absoluteUrl(url);
			return window.open(url);

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
			else
				toastr.warning(t("_object_actions_none_todo"))
		else
			toastr.warning(t("_object_actions_none_todo"))


	_deleteRecord = (object_name, record_id, record_title, list_view_id, record, call_back, call_back_error)->
		# console.log("===_deleteRecord===", object_name, record_id, record_title, list_view_id, record, call_back, call_back_error);
		object = Creator.getObject(object_name)
		previousDoc = FormManager.getPreviousDoc(object_name, record_id, 'delete')
		Creator.odata.delete object_name, record_id, ()->
			if record_title
				# info = object.label + "\"#{record_title}\"" + "已删除"
				info =t "creator_record_remove_swal_title_suc", object.label + "\"#{record_title}\""
			else
				info = t('creator_record_remove_swal_suc')
			toastr.success info
			if call_back and typeof call_back == "function"
				call_back()

			FormManager.runHook(object_name, 'delete', 'after', {_id: record_id, previousDoc: previousDoc})
		, (error)->
			if call_back_error and typeof call_back_error == "function"
				call_back_error()
			FormManager.runHook(object_name, 'delete', 'error', {_id: record_id, error: error})

	Creator.relatedObjectStandardNew = (related_object_name)->
		relateObject = Creator.getObject(related_object_name)
		collection_name = relateObject.label
		collection = "Creator.Collections.#{Creator.getObject(related_object_name)._collection_name}"
		current_object_name = Session.get("object_name")
		current_record_id = Session.get("record_id")
		ids = Creator.TabularSelectedIds[related_object_name]
		initialValues = {};
		if ids?.length
			# 列表有选中项时，取第一个选中项，复制其内容到新建窗口中
			# 这的第一个指的是第一次勾选的选中项，而不是列表中已勾选的第一项
			record_id = ids[0]
			doc = Creator.odata.get(related_object_name, record_id)
			initialValues = doc
			# “保存并新建”操作中自动打开的新窗口中需要再次复制最新的doc内容到新窗口中
			Session.set 'cmShowAgainDuplicated', true
		else
			defaultDoc = FormManager.getRelatedInitialValues(current_object_name, current_record_id, related_object_name);
			if !_.isEmpty(defaultDoc)
				initialValues = defaultDoc
		if relateObject?.version >= 2
			return SteedosUI.showModal(stores.ComponentRegistry.components.ObjectForm, {
				name: "#{related_object_name}_standard_new_form",
				objectApiName: related_object_name,
				title: '新建 ' + relateObject.label,
				initialValues: initialValues,
				afterInsert: (result)->
					setTimeout(()->
						# ObjectForm有缓存，新建子表记录可能会有汇总字段，需要刷新表单数据
						if Creator.getObject(current_object_name).version > 1
							SteedosUI.reloadRecord(current_object_name, current_record_id)
						FlowRouter.reload();
					, 1);
					return true;
			}, null, {iconPath: '/assets/icons'})


		if ids?.length
			# 列表有选中项时，取第一个选中项，复制其内容到新建窗口中
			# 这的第一个指的是第一次勾选的选中项，而不是列表中已勾选的第一项
			Session.set 'cmDoc', initialValues
			# “保存并新建”操作中自动打开的新窗口中需要再次复制最新的doc内容到新窗口中
			Session.set 'cmShowAgainDuplicated', true
		else
			if !_.isEmpty(initialValues)
				Session.set 'cmDoc', initialValues

		Session.set("action_fields", undefined)
		Session.set("action_collection", collection)
		Session.set("action_collection_name", collection_name)
		Session.set("action_save_and_insert", false)
		Meteor.defer ()->
			$(".creator-add-related").click()
		return

	Creator.actions 
		# 在此定义全局 actions
		"standard_query": ()->
			Modal.show("standard_query_modal")

		"standard_new": (object_name, record_id, fields)->
			# current_record_id = Session.get("record_id")
			# if current_record_id
			# 	# amis 相关子表右上角新建
			# 	Creator.relatedObjectStandardNew(object_name)
			# 	return 
			object = Creator.getObject(object_name);
			gridName = this.action.gridName;
			isRelated = this.action.isRelated;
			if isRelated
				relatedFieldName = this.action.relatedFieldName;
				masterRecordId = this.action.masterRecordId;
				initialValues = this.action.initialValues
				if !initialValues
					initialValues = {};
					initialValues[relatedFieldName] = masterRecordId
			else
				initialValues={}
				if(gridName)
					selectedRows = window.gridRefs?[gridName].current?.api?.getSelectedRows()
				else
					selectedRows = window.gridRef?.current?.api?.getSelectedRows()	
				
				if selectedRows?.length
					record_id = selectedRows[0]._id;
					if record_id
						initialValues = Creator.odata.get(object_name, record_id)

				else
					initialValues = FormManager.getInitialValues(object_name)

			if object?.version >= 2
				return Steedos.Page.Form.StandardNew.render(Session.get("app_id"), object_name, '新建 ' + object.label, initialValues , {gridName: gridName});
			Session.set 'action_object_name', object_name
			if selectedRows?.length
				# 列表有选中项时，取第一个选中项，复制其内容到新建窗口中
				# 这的第一个指的是第一次勾选的选中项，而不是列表中已勾选的第一项
				Session.set 'cmDoc', initialValues
				# “保存并新建”操作中自动打开的新窗口中需要再次复制最新的doc内容到新窗口中
				Session.set 'cmShowAgainDuplicated', true
			else
				Session.set 'cmDoc', initialValues
			Meteor.defer ()->
				$(".creator-add").click()
			return 

		"standard_open_view": (object_name, record_id, fields)->
			href = Creator.getObjectUrl(object_name, record_id)
			FlowRouter.redirect(href)
			return false

		"standard_edit": (object_name, record_id, fields)->
			if record_id
				object = Creator.getObject(object_name);
				if object?.version >= 2
					return Steedos.Page.Form.StandardEdit.render(Session.get("app_id"), object_name, '编辑 ' + object.label, record_id, {
						gridName: this.action.gridName
					})
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

		"standard_delete": (object_name, record_id, record_title, list_view_id, record, call_back)->
			gridName = this.action.gridName;
			# console.log("===standard_delete===", object_name, record_id, record_title, list_view_id, record, call_back);
			if record_id
				beforeHook = FormManager.runHook(object_name, 'delete', 'before', {_id: record_id})
				if !beforeHook
					return false;
			object = Creator.getObject(object_name)
			nameField = object.NAME_FIELD_KEY || "name"

			unless list_view_id
				list_view_id = Session.get("list_view_id")
			unless list_view_id
				list_view_id = "all"

			if(!_.isString(record_title) && record_title)
				record_title = record_title[nameField]
			
			if record && !record_title
				record_title = record[nameField]
			
			i18nTitleKey = "creator_record_remove_swal_title"
			i18nTextKey = "creator_record_remove_swal_text"

			unless record_id
				i18nTitleKey = "creator_record_remove_many_swal_title"
				i18nTextKey = "creator_record_remove_many_swal_text"

				# 如果是批量删除，则传入的list_view_id为列表视图的name，用于获取列表选中项
				# 主列表规则是"listview_#{object_name}_#{list_view_id}"，相关表规则是"related_listview_#{object_name}_#{related_object_name}_#{related_field_name}"
				selectedRecords = SteedosUI.getTableSelectedRows(gridName || list_view_id)
				if !selectedRecords || !selectedRecords.length
					toastr.warning(t("creator_record_remove_many_no_selection"))
					return

			if record_title
				text = t i18nTextKey, "#{object.label} \"#{record_title}\""
			else
				text = t i18nTextKey, "#{object.label}"
			swal
				title: t i18nTitleKey, "#{object.label}"
				text: "<div class='delete-creator-warning'>#{text}</div>"
				html: true
				showCancelButton:true
				confirmButtonText: t('Delete')
				cancelButtonText: t('Cancel')
				(option) ->
					if option
						if record_id
							# 单条记录删除
							_deleteRecord object_name, record_id, record_title, list_view_id, record, ()->
								# 文件版本为"cfs.files.filerecord"，需要替换为"cfs-files-filerecord"
								gridObjectNameClass = object_name.replace(/\./g,"-")
								gridContainer = $(".gridContainer.#{gridObjectNameClass}")
								unless gridContainer?.length
									if window.opener
										isOpenerRemove = false
										gridContainer = window.opener.$(".gridContainer.#{gridObjectNameClass}")
								try
									# ObjectForm有缓存，删除子表记录可能会有汇总字段，需要刷新表单数据
									current_object_name = Session.get("object_name")
									current_record_id = Session.get("record_id")
									if current_object_name && Creator.getObject(current_object_name)?.version > 1
										SteedosUI.reloadRecord(current_object_name, current_record_id)
									if FlowRouter.current().route.path.endsWith("/:record_id")
										if object_name != Session.get("object_name")
											FlowRouter.reload();
									else
										window.refreshGrid(gridName);
								catch _e
									console.error(_e);
								if gridContainer?.length
									if object.enable_tree
										dxDataGridInstance = gridContainer.dxTreeList().dxTreeList('instance')
									else
										dxDataGridInstance = gridContainer.dxDataGrid().dxDataGrid('instance')
								if dxDataGridInstance
									if object.enable_tree
										dxDataGridInstance.refresh()
									else
										if object_name != Session.get("object_name")
											FlowRouter.reload();
										else
											Template.creator_grid.refresh(dxDataGridInstance)
								recordUrl = Creator.getObjectUrl(object_name, record_id)
								tempNavRemoved = Creator.removeTempNavItem(object_name, recordUrl) #无论是在记录详细界面还是列表界面执行删除操作，都会把临时导航删除掉
								if isOpenerRemove or !dxDataGridInstance
									if isOpenerRemove
										window.close()
									else if record_id == Session.get("record_id") and list_view_id != 'calendar'
										appid = Session.get("app_id")
										unless tempNavRemoved
											# 如果确实删除了临时导航，就可能已经重定向到上一个页面了，没必要再重定向一次
											FlowRouter.go "/app/#{appid}/#{object_name}/grid/#{list_view_id}"
								if call_back and typeof call_back == "function"
									call_back()			
						else
							# 批量删除
							if selectedRecords && selectedRecords.length
								$("body").addClass("loading")
								deleteCounter = 0;
								afterBatchesDelete = ()->
									deleteCounter++
									if deleteCounter >= selectedRecords.length
										# console.log("deleteCounter, selectedRecords.length===", deleteCounter, selectedRecords.length);
										$("body").removeClass("loading")
										window.refreshGrid(gridName);
								selectedRecords.forEach (record)->
									record_id = record._id
									beforeHook = FormManager.runHook(object_name, 'delete', 'before', {_id: record_id})
									if !beforeHook
										afterBatchesDelete()
										return;
									recordTitle = record[nameField] || record_id
									_deleteRecord object_name, record._id, recordTitle, list_view_id, record, (()->
										recordUrl = Creator.getObjectUrl(object_name, record_id)
										Creator.removeTempNavItem(object_name, recordUrl) #无论是在记录详细界面还是列表界面执行删除操作，都会把临时导航删除掉
										afterBatchesDelete()
									), ()->
										afterBatchesDelete()