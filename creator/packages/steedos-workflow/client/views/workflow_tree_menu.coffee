getInboxCount = (categoryIds)->
	count = 0
	flow_instances = db.flow_instances.findOne(Steedos.getSpaceId())
	categoryIds.forEach (categoryId)->
		_.each flow_instances?.flows, (_f)->
			if _f.category == categoryId
				count += _f?.count || 0
	return count

getInboxCategory = (category_id)->
	inboxInstancesFlow = []
	category = db.categories.findOne({_id: category_id})
	if category_id
		category_forms = db.forms.find({category: category_id}, {fields: {_id:1}}).fetch();
	else
		category_forms = db.forms.find({category: {
			$in: [null, ""]
		}}, {fields: {_id:1}}).fetch();

	category_flows = db.flows.find({form: {$in: category_forms.getProperty("_id")}})
	category_inbox_count = 0
	flow_instances = db.flow_instances.findOne(Steedos.getSpaceId())
	category_flows.forEach (flow)->
		flow_instance = _.find(flow_instances?.flows, (_f)->
			return _f._id == flow._id
		)
		flow.inbox_count = flow_instance?.count || 0
		if flow.inbox_count > 0
			category_inbox_count = category_inbox_count + flow.inbox_count
			inboxInstancesFlow.push(flow)
	return {_id: category_id, name: category?.name, inbox_count: category_inbox_count, inboxInstancesFlow: inboxInstancesFlow}

getDraftCount = ()->
	spaceId = Steedos.spaceId()
	userId = Meteor.userId()
	return db.instances.find({state:"draft",space:spaceId,submitter:userId,$or:[{inbox_users: {$exists:false}}, {inbox_users: []}]}).count()

getInboxBadge = ()->
	if _.isEmpty(Session.get("workflow_categories"))
		# categorys = WorkflowManager.getSpaceCategories(Session.get("spaceId"), Session.get("workflow_categories"))
		# if categorys?.length
		# 	# 有分类时，数量只显示在分类下面的子菜单，即流程菜单链接的右侧，总菜单不计算和显示数量
		# 	return ""
		spaceId = Steedos.spaceId()
		return Steedos.getBadge("workflow", spaceId)
	else
		count = getInboxCount(Session.get("workflow_categories"))
		if count
			return count

getSpaceName = (_id)->
	return db.spaces.findOne({_id: _id})?.name

getIsShowMonitorBox = ()->
	if Meteor.settings.public?.workflow?.onlyFlowAdminsShowMonitorBox
		space = db.spaces.findOne(Session.get("spaceId"))
		if !space
			return false

		if space.admins?.includes(Meteor.userId())
			return true
		else
			flow_ids = WorkflowManager.getMyAdminOrMonitorFlows()
			if _.isEmpty(flow_ids)
				return false
			else
				return true

	return true

getInboxSpaces = ()->
	return db.steedos_keyvalues.find({key: "badge"}).fetch().filter (_item)->
		if _item?.value["workflow"] > 0 && _item.space && _item.space != Session.get("spaceId")
			if db.spaces.findOne({_id: _item.space})
				return _item

getBoxs = ()->
	spaceId = Steedos.getSpaceId()
	boxs = [
		{
			_id: "inbox"
			name: t("inbox")
			url: "/workflow/space/#{spaceId}/inbox/"
		}
		{
			_id: "outbox"
			name: t("outbox")
			url: "/workflow/space/#{spaceId}/outbox/"
		}
		{
			_id: "draft"
			name: t("draft")
			url: "/workflow/space/#{spaceId}/draft/"
		}
		{
			_id: "pending"
			name: t("pending")
			url: "/workflow/space/#{spaceId}/pending/"
		}
		{
			_id: "completed"
			name: t("completed")
			url: "/workflow/space/#{spaceId}/completed/"
		}
	]

	if getIsShowMonitorBox()
		boxs.push 
			_id: "monitor"
			name: t("monitor")
			url: "/workflow/space/#{spaceId}/monitor/"
	
	otherInboxs = getInboxSpaces()
	otherInboxs.forEach (n, i)->
		spaceName = getSpaceName(n.space)
		count = Steedos.getBadge "workflow", n.space
		otherItem = 
			_id: n._id
			name: spaceName
			url: "/workflow/space/#{n.space}/inbox/"
			inbox_count: count
			isOtherInbox: true
		if i == 0
			otherItem.isFirstOtherInbox = true
		boxs.push otherItem

	return boxs

getCategories = ()->
	return WorkflowManager.getSpaceCategories(Session.get("spaceId"), Session.get("workflow_categories"))

getStoreItems = ()->
	boxs = getBoxs()
	categories = getCategories()
	flows = []

	spaceId = Steedos.getSpaceId()
	if boxs and categories
		if _.isArray(boxs) and boxs.length
			selectedItem = Tracker.nonreactive ()->
				return Session.get("box")
			unless selectedItem
				# 默认选中第一个菜单，即Inbox
				selectedItem = "inbox"
		boxs.forEach (item)->
			item.isRoot = true
			switch item._id
				when "inbox"
					item.icon = 'ion ion-archive'
				when "outbox"
					item.icon = 'ion ion-android-done-all'
				when "draft"
					item.icon = 'ion ion-compose'
				when "pending"
					item.icon = 'ion ion-ios-loop'
				when "completed"
					item.icon = 'ion ion-android-checkbox-outline'
				when "monitor"
					item.icon = 'ion ion-eye'
				else
					item.icon = 'ion ion-archive'
			item.hasItems = item._id == "inbox" && !!categories.length
			item.expanded = item.hasItems 

			if item._id == "draft"
				item.draft_count = getDraftCount()
			else if item._id == "inbox"
				item.inbox_count = getInboxBadge()

			if item._id == selectedItem
				item.selected = true

		selectedItem = Tracker.nonreactive ()->
			return Session.get("workflowCategory")
		categories.forEach (item)->
			item.parent = "inbox"
			item.isCategory = true
			item.url = "/workflow/space/#{spaceId}/inbox/"
			categoryItemData = getInboxCategory item._id
			item.inbox_count = categoryItemData?.inbox_count
			item.hasItems = item.inbox_count > 0

			if item._id == selectedItem
				item.selected = true
				parentBox = boxs.find((n)-> return n._id == item.parent)
				if parentBox
					parentBox.expanded = true
					parentBox.selected = false

			selectedItem = Tracker.nonreactive ()->
				return Session.get("flowId")
			categoryItemData?.inboxInstancesFlow?.forEach (flow)->
				flow.parent = item._id
				flow.isFlow = true
				flow.url = "/workflow/space/#{spaceId}/inbox/"
				flow.hasItems = false

				if flow._id == selectedItem
					flow.selected = true
					parentCategory = categories.find((n)-> return n._id == flow.parent)
					if parentCategory
						parentCategory.expanded = true
						parentCategory.selected = false
				flows.push flow

		categories = categories.filter (n)-> return n.hasItems
		
		return _.union boxs, categories, flows

Template.workflowTreeMenu.onCreated ->

Template.workflowTreeMenu.onRendered ->
	self = this
	self.autorun (c)->
		spaceId = Steedos.spaceId()
		userId = Meteor.userId()
		loginToken = Accounts._storedLoginToken()
		if spaceId and userId
			self.dxTreeViewInstance?.dispose()
			storeItems = getStoreItems()
			console.log "Reloading instance dxTreeViewInstance"
			if !storeItems
				return;
			dxOptions = 
				searchEnabled: false
				dataSource: 
					store: storeItems
				itemTemplate: (itemData, itemIndex, itemElement)->
					if itemData.icon
						itemElement.append("<i class=\"dx-icon #{itemData.icon}\"></i>");
					itemElement.append("<span>" + itemData.name + "</span>");
					count = if itemData.draft_count then itemData.draft_count else itemData.inbox_count
					if count
						if itemData._id == "draft" or itemData.isFlow
							bg = "bg-special"
						else if itemData.isRoot
							bg = "bg-red"
						else
							bg = "bg-gray"

						htmlText = """
							<span class="pull-right-container">
								<span class="label pull-right #{bg}">#{count}</span>
							</span>
						"""
						itemElement.append(htmlText)
					if itemData.isFirstOtherInbox
						Meteor.defer ()->
							itemElement.closest(".dx-treeview-node").addClass("other-inbox-node").addClass("first-other-inbox-node")
					else if itemData.isOtherInbox
						Meteor.defer ()->
							itemElement.closest(".dx-treeview-node").addClass("other-inbox-node")
			
			sidebar_multiple = false
			dxOptions.selectNodesRecursive = false
			dxOptions.selectByClick = true
			dxOptions.selectionMode = if sidebar_multiple then "multiple" else "single"
			dxOptions.showCheckBoxesMode = if sidebar_multiple then "normal" else "none"
			dxOptions.onItemClick = (selectionInfo)->
				# 点击任意a标签，跳转路由，应该关闭菜单
				$("body").removeClass("sidebar-open")
				if selectionInfo.node.selected
					# 如果选项已经选中则不需要变更状态，即不可以把已经选中的状态变更为未选中
					selectionInfo.event.preventDefault()

			dxOptions.onItemSelectionChanged = (selectionInfo)->
				if selectionInfo.node.selected
					if selectionInfo.itemData.isRoot
						# 切换箱子的时候清空搜索条件
						$("#instance_search_tip_close_btn").click()
						url = selectionInfo.itemData.url
						if url
							Session.set("workflowCategory", undefined)
							FlowRouter.go url
					else if selectionInfo.itemData.isCategory
						url = selectionInfo.itemData.url
						if url
							Session.set("flowId", false)
							Session.set("workflowCategory",selectionInfo.itemData._id || "-1")
							FlowRouter.go url
					else if selectionInfo.itemData.isFlow
						url = selectionInfo.itemData.url
						if url
							Session.set("workflowCategory",selectionInfo.itemData.parent || "-1")
							Session.set("flowId", selectionInfo.itemData._id);
							FlowRouter.go url

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
