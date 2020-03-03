setGridSidebarFilters = (selectedItem)->
	if selectedItem and selectedItem._id
		sidebar_filter_key = "organizations"
		sidebarFilter = [ sidebar_filter_key, "=", selectedItem._id ]
		Session.set "grid_sidebar_filters", sidebarFilter
	else
		Session.set "grid_sidebar_filters", null

_actionItems = (object_name, record_id, record_permissions)->
	self = this
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

_itemDropdownClick = (e, selectionInfo)->
	self = this
	record = selectionInfo.itemData
	curObjectName = "organizations"
	record_permissions = Creator.getRecordPermissions curObjectName, record, Meteor.userId()
	actions = _actionItems.bind(self)(curObjectName, record._id, record_permissions)

	if actions.length
		actionSheetItems = _.map actions, (action)->
			return {text: action.label, record: record, action: action, object_name: curObjectName}
	else
		actionSheetItems = [{text: t("creator_list_no_actions_tip")}]

	actionSheetOption =
		dataSource: actionSheetItems
		showTitle: false
		usePopover: true
		onItemClick: (value)->
			object = Creator.getObject(curObjectName)
			action = value.itemData.action
			recordId = value.itemData.record._id
			curObjectName = value.itemData.object_name
			collectionName = object.label
			name_field_key = object.NAME_FIELD_KEY
			Session.set("action_fields", undefined)
			Session.set("action_collection", "Creator.Collections.#{curObjectName}")
			Session.set("action_collection_name", collectionName)
			Session.set("action_save_and_insert", true)
			if action.todo == "standard_delete"
				action_record_title = value.itemData.record[name_field_key]
				Creator.executeAction curObjectName, action, recordId, action_record_title, null, value.itemData.record, ()->
					# 删除组织时，重新加载相关列表数据
					if curObjectName == "organizations"
						self.dxTreeViewInstance.dispose()
						self.needToRefreshTree.set(new Date())
			else if action.todo == "standard_edit"
				record = Creator.odata.get(curObjectName, recordId)
				Session.set 'action_object_name', curObjectName
				Session.set 'action_record_id', recordId
				Session.set 'cmDoc', record
				Meteor.defer ()->
					$(".btn.creator-sidebar-orgs-edit").click()
			else
				Creator.executeAction curObjectName, action, recordId, value.itemElement
	if actions.length
		actionSheetOption.itemTemplate = "item"
	else
		actionSheetOption.itemTemplate = (itemData, itemIndex, itemElement)->
			itemElement.html "<span class='text-muted'>#{itemData.text}</span>"

	actionSheet = $(".action-sheet").dxActionSheet(actionSheetOption).dxActionSheet("instance")

	actionSheet.option("target", e.target);
	actionSheet.option("visible", true);

Template.creator_grid_sidebar_organizations.onRendered ->
	self = this
	self.autorun (c)->
		list_view_id = "all"
		object_name = "organizations"
		spaceId = Steedos.spaceId()
		userId = Meteor.userId()
		loginToken = Accounts._storedLoginToken()
		needToRefreshTree = self.needToRefreshTree.get()
		if spaceId and userId
			url = "/api/odata/v4/#{spaceId}/#{object_name}"
			dxOptions = 
				searchEnabled: false
				dataSource: 
					store: 
						type: "odata"
						version: 4
						url: Steedos.absoluteUrl(url)
						withCredentials: false
						onLoading: (loadOptions)->
							loadOptions.select = ["name", "parent", "children", "company_id"]
							loadOptions.expand = ["company_id($select=admins)"]
						onLoaded: (results)->
							if results and _.isArray(results) and results.length
								selectedItem = Session.get "organization"
								if selectedItem
									setGridSidebarFilters(selectedItem)

								_.each results, (item)->
									if selectedItem and item._id == selectedItem._id
										item.selected = true
									# 判断是否有下级节点
									item.hasItems = false
									if item.children?.length > 0
										item.hasItems = true
									# 根节点自动展开
									if !item.parent
										item.expanded = true
						beforeSend: (request) ->
							request.headers['X-User-Id'] = userId
							request.headers['X-Space-Id'] = spaceId
							request.headers['X-Auth-Token'] = loginToken
						errorHandler: (error) ->
							if error.httpStatus == 404 || error.httpStatus == 400
								error.message = t "creator_odata_api_not_found"
							else if error.httpStatus == 401
								error.message = t "creator_odata_unexpected_character"
							else if error.httpStatus == 403
								error.message = t "creator_odata_user_privileges"
							else if error.httpStatus == 500
								if error.message == "Unexpected character at 106" or error.message == 'Unexpected character at 374'
									error.message = t "creator_odata_unexpected_character"
							toastr.error(error.message)
						fieldTypes: {
							'_id': 'String'
						}
					sort: [ {
						selector: 'sort_no'
						desc: true
					},{
						selector: 'name'
						desc: false
					} ]
				itemTemplate: (itemData, itemIndex, itemElement)->
					if itemData.icon
						itemElement.append("<i class=\"dx-icon #{itemData.icon}\"></i>");
					itemElement.append("<span>" + itemData.name + "</span>");
					unless Steedos.isMobile()
						record = itemData
						record_permissions = Creator.getRecordPermissions object_name, record, Meteor.userId()
						actions = _actionItems.bind(self)(object_name, record._id, record_permissions)
						if actions.length
							htmlText = """
								<span class="slds-grid slds-grid--align-spread creator-table-actions">
									<div class="forceVirtualActionMarker forceVirtualAction">
										<a class="rowActionsPlaceHolder slds-button slds-button--icon-x-small keyboardMode--trigger" aria-haspopup="true" role="button" title="" href="javascript:void(0);" data-toggle="dropdown">
											<span class="slds-icon_container slds-icon-utility-down">
												<span class="lightningPrimitiveIcon">
													#{Blaze.toHTMLWithData Template.steedos_button_icon, {class: "slds-icon slds-icon-text-default slds-icon--xx-small", source: "utility-sprite", name:"threedots_vertical"}}
												</span>
												<span class="slds-assistive-text" data-aura-rendered-by="15534:0">显示更多信息</span>
											</span>
										</a>
									</div>
								</span>
							"""
							itemElement.append(htmlText)
			
			sidebar_multiple = false
			dxOptions.selectNodesRecursive = false
			dxOptions.selectByClick = true
			dxOptions.selectionMode = if sidebar_multiple then "multiple" else "single"
			dxOptions.showCheckBoxesMode = if sidebar_multiple then "normal" else "none"
			dxOptions.onItemClick = (selectionInfo)->
				targetDropdown = $(event.target).closest(".creator-table-actions")
				if targetDropdown.length
					# 如果点击的是右侧下拉箭头，则弹出菜单
					selectionInfo.event.preventDefault()
					_itemDropdownClick.call(self, event, selectionInfo)
			dxOptions.onItemSelectionChanged = (selectionInfo)->
				selectionItemData = if selectionInfo.node.selected then selectionInfo.itemData else null;
				if selectionItemData?._id
					Session.set "organization", selectionItemData
				else
					Session.set "organization", null
				setGridSidebarFilters(selectionItemData)


			dxOptions.keyExpr = "_id"
			dxOptions.parentIdExpr = "parent"
			dxOptions.displayExpr = "name"
			dxOptions.hasItemsExpr = "hasItems"
			dxOptions.rootValue = null
			dxOptions.dataStructure = "plain"
			dxOptions.virtualModeEnabled = true 

			self.dxTreeViewInstance = self.$(".gridSidebarContainer").dxTreeView(dxOptions).dxTreeView('instance')
			
Template.creator_grid_sidebar_organizations.helpers Creator.helpers

Template.creator_grid_sidebar_organizations.helpers 
	organization:() -> 
		return Session.get("organization")

	collection: ()->
		return Session.get("action_collection")

	fields: ->
		return Session.get("action_fields")

	collectionName: ()->
		return Session.get("action_collection_name")

	doc: ()->
		return Session.get("action_record_id")

	saveAndInsert: ()->
		allowSaveAndInsert = Session.get("action_save_and_insert")
		if allowSaveAndInsert
			collectionName = Session.get("action_collection")
			objectName = collectionName.replace(/Creator.Collections./, "")
			# 只有有新建权限的情况下显示“保存并新建”按钮
			return Creator.getPermissions(objectName)?.allowCreate
		else
			return false

Template.creator_grid_sidebar_organizations.events

Template.creator_grid_sidebar_organizations.onCreated ->
	self = this
	self.needToRefreshTree = new ReactiveVar(null)

	AutoForm.hooks creatorSidebarOrgsEditForm:
		onSuccess: (formType,result)->
			# 编辑组织，重新加载左侧树
			if result.object_name == "organizations"
				self.dxTreeViewInstance.dispose()
				self.needToRefreshTree.set(new Date())
	
	AutoForm.hooks creatorSidebarOrgsAddForm:
		onSuccess: (formType,result)->
			# 新建组织，重新加载左侧树
			if result.object_name == "organizations"
				self.dxTreeViewInstance.dispose()
				self.needToRefreshTree.set(true)

Template.creator_grid_sidebar_organizations.onDestroyed ->
	Session.set "grid_sidebar_filters", null