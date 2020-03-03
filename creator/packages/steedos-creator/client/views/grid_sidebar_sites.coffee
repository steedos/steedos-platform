setGridSidebarFilters = ()->
	site = Tracker.nonreactive ()->
		return Session.get("site")
	category = Tracker.nonreactive ()->
		return Session.get("category")
	sidebarFilter = []
	if site and site._id
		sidebarFilter.push [ "site", "=", site._id ]
	if category and category._id
		sidebarFilter.push [ "category", "=", category._id ]
	if sidebarFilter.length
		Session.set "grid_sidebar_filters", sidebarFilter
	else
		# 未选中站点时，不显示右侧文档列表
		Session.set "grid_sidebar_filters", [ "_id", "=", "-1" ]

loadCategories = ()->
	self = this
	sites = self.sites.get()
	options = $select: 'name,parent,site'
	queryFilters = [["site", "in", _.pluck(sites, "_id")]];
	steedosFilters = require('@steedos/filters')
	odataFilter = steedosFilters.formatFiltersToODataQuery(queryFilters)
	options.$filter = odataFilter
	options.$orderby = "order,name"
	Creator.odata.query("cms_categories", options, true, (result)->
		self.categories.set(result);
	)

loadSites = ()->
	self = this
	userId = Meteor.userId()
	options = $select: ["name", "admins", "visibility"].toString()
	queryFilters = [["visibility","<>","private"], "or", ["owner","=",userId], "or", ["admins","=",userId]]
	steedosFilters = require('@steedos/filters')
	odataFilter = steedosFilters.formatFiltersToODataQuery(queryFilters)
	options.$filter = odataFilter
	options.$orderby = "order,name"
	Creator.odata.query("cms_sites", options, true, (result)->
		self.sites.set(result);
	)

loadStoreItems = ()->
	self = this
	sites = self.sites.get()
	categories = self.categories.get()
	if !sites
		loadSites.call(self)
	if sites and !categories
		loadCategories.call(self)

	if sites and categories
		if _.isArray(sites) and sites.length
			selectedItem = Tracker.nonreactive ()->
				return Session.get("site")
			unless selectedItem
				# 默认选中第一个站点，并按第一个站点过滤文章
				selectedItem = sites[0]
			Session.set "site", selectedItem
		sites.forEach (item)->
			item.isRoot = true
			item.icon = 'ion ion-ios-book-outline' 
			if item._id == selectedItem?._id
				item.selected = true
			item.hasItems = !!categories.find((n)-> return n.site == item._id)
		if _.isArray(categories) and categories.length
			selectedItem = Tracker.nonreactive ()->
				return Session.get("category")
			if selectedItem
				Session.set "category", selectedItem
			else
				Session.set "category", null
		categories.forEach (item)->
			if item._id == selectedItem?._id
				item.selected = true
				parentSite = sites.find((n)-> return n._id == item.site)
				if parentSite
					parentSite.expanded = true
					parentSite.selected = false
				parentCategory = categories.find((n)-> return n._id == item.parent)
				if parentCategory
					parentCategory.expanded = true
					parentCategory.selected = false
			item.hasItems = !!categories.find((n)-> return n.parent == item._id)
			if !item.parent
				item.parent = item.site
		
		setGridSidebarFilters()
		self.storeItems.set(_.union sites, categories);

getDataSource = ()->
	return new (DevExpress.data.DataSource)(
		load: (loadOptions) ->
			d = $.Deferred()
			userId = Meteor.userId()
			options = {}
			options.$select = ["name", "admins", "visibility"].toString()
			steedosFilters = require("@steedos/filters")
			dxFilter = steedosFilters.formatFiltersToODataQuery [["visibility","<>","private"], "or", ["owner","=",userId], "or", ["admins","=",userId]]
			options.$filter = dxFilter
			Creator.odata.query("cms_sites", options, true, (result)->
				d.resolve result
			)
			return d.promise()
	)

getExtraActions = (object_name, record_id, record_permissions)->
	self = this
	if object_name == "cms_sites"
		return [
			label: "新建栏目",
			name: "new_category_of_site",
			visible: (object_name, record_id, record_permissions) ->
				allowCreate = false
				permissions = Creator.getPermissions("cms_categories")
				if (permissions)
					allowCreate = permissions["allowCreate"]
				if !allowCreate
					# permissions配置没有权限则不给权限
					return false
				# 管理员要单独判断，只给到有对应站点成员的权限
				if Steedos.isSpaceAdmin()
					true
				else
					sites = self.sites.get()
					site = sites.find((n)-> return n._id == record_id)
					userId = Steedos.userId()
					isSiteAdmin = site and site.admins and site.admins.indexOf(userId) > -1
					return isSiteAdmin
			on: "list_item",
			todo: (object_name, record_id, fields) ->
				curObjectName = "cms_categories"
				object = Creator.getObject(curObjectName)
				collectionName = object.label
				Session.set("action_fields", undefined)
				Session.set("action_collection", "Creator.Collections.#{curObjectName}")
				Session.set("action_collection_name", collectionName)
				Session.set("action_save_and_insert", true)
				Session.set 'cmDoc', {
					site: record_id
				}
				Meteor.defer ()->
					$(".creator-sidebar-sites-add").click()
		]
	if object_name == "cms_categories"
		return [
			label: "新建子栏目",
			name: "new_sub_category_of_category",
			visible: (object_name, record_id, record_permissions) ->
				allowCreate = false
				permissions = Creator.getPermissions("cms_categories")
				if (permissions)
					allowCreate = permissions["allowCreate"]
				if !allowCreate
					# permissions配置没有权限则不给权限
					return false
				# 管理员要单独判断，只给到有对应站点成员的权限
				if Steedos.isSpaceAdmin()
					true
				else
					categories = self.categories.get()
					category = categories.find((n)-> return n._id == record_id)
					sites = self.sites.get()
					site = sites.find((n)-> return n._id == category.site)
					userId = Steedos.userId()
					isSiteAdmin = site and site.admins and site.admins.indexOf(userId) > -1
					return isSiteAdmin
			on: "list_item",
			todo: (object_name, record_id, fields) ->
				curObjectName = "cms_categories"
				object = Creator.getObject(curObjectName)
				collectionName = object.label
				Session.set("action_fields", undefined)
				Session.set("action_collection", "Creator.Collections.#{curObjectName}")
				Session.set("action_collection_name", collectionName)
				Session.set("action_save_and_insert", true)
				categories = self.categories.get()
				category = categories.find((n)-> return n._id == record_id)
				Session.set 'cmDoc', {
					site: category.site,
					parent: record_id
				}
				Meteor.defer ()->
					$(".creator-sidebar-sites-add").click()
		]

_actionItems = (object_name, record_id, record_permissions)->
	self = this
	obj = Creator.getObject(object_name)
	actions = Creator.getActions(object_name)
	extraActions = getExtraActions.bind(self)(object_name, record_id, record_permissions)
	if extraActions and extraActions.length
		actions = _.union actions, extraActions
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
	curObjectName = if record.isRoot then "cms_sites" else "cms_categories"
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
					# 删除站点或栏目时，重新加载相关列表数据
					if curObjectName == "cms_sites"
						self.dxTreeViewInstance.dispose()
						loadSites.call(self)
					if curObjectName == "cms_categories"
						self.dxTreeViewInstance.dispose()
						loadCategories.call(self)
			else if action.todo == "standard_edit"
				record = Creator.odata.get(curObjectName, recordId)
				Session.set 'action_object_name', curObjectName
				Session.set 'action_record_id', recordId
				Session.set 'cmDoc', record
				Meteor.defer ()->
					$(".btn.creator-sidebar-sites-edit").click()
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

Template.creator_grid_sidebar_sites.onRendered ->
	self = this
	self.autorun (c)->
		list_view_id = "all"
		object_name = "cms_sites"
		spaceId = Steedos.spaceId()
		userId = Meteor.userId()
		loginToken = Accounts._storedLoginToken()
		if spaceId and userId
			# 默认不显示右侧数据，只有选中站点后才显示
			setGridSidebarFilters()
			loadStoreItems.call(self)
			storeItems = self.storeItems.get()
			if !storeItems
				return;
			dxOptions = 
				searchEnabled: false
				# dataSource: getDataSource()
				dataSource: 
					store: storeItems
				itemTemplate: (itemData, itemIndex, itemElement)->
					if itemData.icon
						itemElement.append("<i class=\"dx-icon #{itemData.icon}\"></i>");
					itemElement.append("<span>" + itemData.name + "</span>");
					unless Steedos.isMobile()
						record = itemData
						curObjectName = if record.isRoot then "cms_sites" else "cms_categories"
						record_permissions = Creator.getRecordPermissions curObjectName, record, Meteor.userId()
						actions = _actionItems.bind(self)(curObjectName, record._id, record_permissions)
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
				if selectionInfo.node.selected
					# 如果选项已经选中则不需要变更状态，即不可以把已经选中的状态变更为未选中
					selectionInfo.event.preventDefault()
				targetDropdown = $(event.target).closest(".creator-table-actions")
				if targetDropdown.length
					# 如果点击的是右侧下拉箭头，则弹出菜单
					selectionInfo.event.preventDefault()
					_itemDropdownClick.call(self, event, selectionInfo)

			dxOptions.onItemSelectionChanged = (selectionInfo)->
				if selectionInfo.node.selected
					if selectionInfo.itemData.isRoot
						Session.set "site", selectionInfo.itemData
					else
						siteId = selectionInfo.itemData.site
						sites = self.sites.get()
						Session.set "site", sites.find((n)-> return n._id == siteId)
						Session.set "category", selectionInfo.itemData
				else
					if selectionInfo.itemData.isRoot
						Session.set "site", null
					else
						Session.set "category", null
				setGridSidebarFilters()

			dxOptions.keyExpr = "_id"
			dxOptions.parentIdExpr = "parent"
			dxOptions.displayExpr = "name"
			dxOptions.hasItemsExpr = "hasItems"
			dxOptions.rootValue = null
			dxOptions.dataStructure = "plain"
			dxOptions.virtualModeEnabled = true 
			# dxOptions.onItemExpanded = ()->
			# dxOptions.onContentReady = ()->

			self.dxTreeViewInstance = self.$(".gridSidebarContainer").dxTreeView(dxOptions).dxTreeView('instance')
			
Template.creator_grid_sidebar_sites.helpers Creator.helpers

Template.creator_grid_sidebar_sites.helpers 
	site:() -> 
		return Session.get("site")

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
	
	allowCreateSite: ()->
		if Steedos.isMobile()
			return false
		return Creator.getPermissions("cms_sites")?.allowCreate

Template.creator_grid_sidebar_sites.events
	'click .btn-new-site': (event) ->
		objectName = "cms_sites"
		object = Creator.getObject(objectName)
		collection_name = object.label
		Session.set("action_fields", undefined)
		Session.set("action_collection", "Creator.Collections.#{objectName}")
		Session.set("action_collection_name", collection_name)
		Session.set("action_save_and_insert", true)
		Meteor.defer ()->
			$(".creator-sidebar-sites-add").click()

Template.creator_grid_sidebar_sites.onCreated ->
	this.categories = new ReactiveVar(null)
	this.sites = new ReactiveVar(null)
	this.storeItems = new ReactiveVar(null)

	self = this

	AutoForm.hooks creatorSidebarSitesEditForm:
		onSuccess: (formType,result)->
			# 编辑站点或栏目时，重新加载相关列表数据
			if result.object_name == "cms_sites"
				self.dxTreeViewInstance.dispose()
				loadSites.call(self)
			if result.object_name == "cms_categories"
				self.dxTreeViewInstance.dispose()
				loadCategories.call(self)
	
	AutoForm.hooks creatorSidebarSitesAddForm:
		onSuccess: (formType,result)->
			# 新建站点或栏目时，重新加载相关列表数据
			if result.object_name == "cms_sites"
				self.dxTreeViewInstance.dispose()
				loadSites.call(self)
			if result.object_name == "cms_categories"
				self.dxTreeViewInstance.dispose()
				loadCategories.call(self)

Template.creator_grid_sidebar_sites.onDestroyed ->
	Session.set "grid_sidebar_filters", null
