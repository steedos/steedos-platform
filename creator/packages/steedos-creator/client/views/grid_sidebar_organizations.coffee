setGridSidebarFilters = (selectedKeys)->
	if selectedKeys and selectedKeys.length
		sidebar_filter_key = "organizations"
		if selectedKeys.length == 1
			sidebarFilter = [ sidebar_filter_key, "=", selectedKeys[0] ]
		else if selectedKeys.length > 1
			sidebarFilter = []
			selectedKeys.forEach (value_item)->
				sidebarFilter.push [ sidebar_filter_key, "=", value_item ]
				sidebarFilter.push "or"
			sidebarFilter.pop()
		Session.set "grid_sidebar_filters", sidebarFilter
	else
		Session.set "grid_sidebar_filters", null


Template.creator_grid_sidebar_organizations.onRendered ->
	self = this
	self.autorun (c)->
		list_view_id = "all"
		object_name = "organizations"
		spaceId = Steedos.spaceId()
		userId = Meteor.userId()
		loginToken = Accounts._storedLoginToken()
		if spaceId and userId
			isSpaceAdmin = Creator.isSpaceAdmin()
			user_permission_sets = Session.get("user_permission_sets")
			userCompanyOrganizationId = Steedos.getUserCompanyOrganizationId()
			isOrganizationAdmin = _.include(user_permission_sets,"organization_admin")
			unless isSpaceAdmin
				# 如果不是工作区管理员左侧选中组织需要有默认值userCompanyOrganizationId
				selectedKeys = null
				if isOrganizationAdmin and userCompanyOrganizationId
					selectedKeys = [userCompanyOrganizationId]
				Session.set "grid_sidebar_selected", selectedKeys
				if selectedKeys and selectedKeys.length
					setGridSidebarFilters(selectedKeys)
				else
					# 没有权限时，应该看不到右侧列表相关数据
					setGridSidebarFilters([-1])
				if isOrganizationAdmin and !userCompanyOrganizationId
					toastr.error("您的单位信息未设置，请联系系统管理员。");
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
							loadOptions.select = ["name", "parent", "children"]
						onLoaded: (results)->
							if results and _.isArray(results)
								_.each results, (item)->
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
			
			sidebar_multiple = false
			dxOptions.selectNodesRecursive = false
			dxOptions.selectByClick = true
			dxOptions.selectionMode = if sidebar_multiple then "multiple" else "single"
			dxOptions.showCheckBoxesMode = if sidebar_multiple then "normal" else "none"
			dxOptions.onItemSelectionChanged = (selectionInfo)->
				selectedKeys = selectionInfo.component.getSelectedNodesKeys()
				if isSpaceAdmin or (selectedKeys and selectedKeys.length)
					Session.set "grid_sidebar_selected", selectedKeys
					setGridSidebarFilters(selectedKeys)
				else
					# 如果不是工作区管理员，清空选项时，左侧选中组织需要有默认值userCompanyOrganizationId
					selectedKeys = null
					if isOrganizationAdmin and userCompanyOrganizationId
						selectedKeys = [userCompanyOrganizationId]
					Session.set "grid_sidebar_selected", selectedKeys
					if selectedKeys and selectedKeys.length
						setGridSidebarFilters(selectedKeys)
					else
						# 没有权限时，应该看不到右侧列表相关数据
						setGridSidebarFilters([-1])
				
				if isOrganizationAdmin and !userCompanyOrganizationId
					toastr.error("您的单位信息未设置，请联系系统管理员。");

			dxOptions.keyExpr = "_id"
			dxOptions.parentIdExpr = "parent"
			dxOptions.displayExpr = "name"
			dxOptions.hasItemsExpr = "hasItems"
			dxOptions.rootValue = null
			dxOptions.dataStructure = "plain"
			dxOptions.virtualModeEnabled = true 
			
#			unless isSpaceAdmin
#				if isOrganizationAdmin
#					if userCompanyOrganizationId
#						dxOptions.rootValue = userCompanyOrganizationId
#					else
#						dxOptions.rootValue = "-1"
#				else
#					dxOptions.rootValue = "-1"

			self.$(".gridSidebarContainer").dxTreeView(dxOptions).dxTreeView('instance')
			
Template.creator_grid_sidebar_organizations.helpers Creator.helpers

Template.creator_grid_sidebar_organizations.helpers 

Template.creator_grid_sidebar_organizations.events

Template.creator_grid_sidebar_organizations.onCreated ->

Template.creator_grid_sidebar_organizations.onDestroyed ->
	Session.set "grid_sidebar_selected", null
	Session.set "grid_sidebar_filters", null