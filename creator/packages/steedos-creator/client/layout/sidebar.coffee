Template.creatorSidebar.helpers Creator.helpers

Template.creatorSidebar.helpers

setParentMenuExpanded = (currentMenu)->
	parent = currentMenu.parent
	if parent
		parentMenu = Creator.Menus.find (menu)->
			return menu._id == parent
		if parentMenu
			parentMenu.expanded = true
			setParentMenuExpanded parentMenu

Template.creatorSidebar.onRendered ->
	current_object_name = FlowRouter.current()?.queryParams?.ref || Creator.getObject()?.name
	current_admin_template_name = Session.get("admin_template_name")
	# 根据当前所在界面实现自动选中相关菜单，同时展开父层菜单（支持任意多层）
	if current_object_name
		currentMenu = Creator.Menus.find (menu)->
			return menu.object_name == current_object_name
	else if current_admin_template_name
		currentMenu = Creator.Menus.find (menu)->
			return menu.template_name == current_admin_template_name
	if currentMenu
		currentMenu.selected = true
		setParentMenuExpanded currentMenu
	
	$('#sidebar-menu').dxTreeView
		items: Creator.Menus
		dataStructure: 'plain'
		parentIdExpr: 'parent'
		keyExpr: '_id'
		displayExpr: 'name'
		searchEnabled: true
		expandEvent: "click"
		selectionMode: "single"
		selectNodesRecursive: false
		# selectByClick: true
		onItemClick: (e) ->
			# - template_name 指向 Meteor Template, url=/app/admin/page/{template_name}/
			# - object_name 指向对象, url=/app/admin/{object_name}/grid/all/
			object_name = e.itemData?.object_name
			template_name = e.itemData?.template_name
			if object_name or template_name
				e.component.selectItem(e.itemData)
			if object_name
				if object_name == "spaces"
					spaceId = Steedos.spaceId()
					menuUrl = "/app/admin/spaces/view/#{spaceId}"
				else if object_name == "users"
					menuUrl = Steedos.getUserRouter()
				else
					listViews = Creator.getListViews(object_name)
					if listViews && listViews.length > 0
						menuUrl = "/app/admin/#{object_name}/grid/#{listViews[0]?._id}"
					else
						menuUrl = "/app/admin/#{object_name}/grid/all"
			else if template_name
				menuUrl = "/app/admin/page/#{template_name}"
			
			if menuUrl
				FlowRouter.go(menuUrl);