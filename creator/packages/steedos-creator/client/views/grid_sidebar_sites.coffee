setGridSidebarFilters = (selectedItem)->
	if selectedItem and selectedItem.site_id
		sidebar_filter_key = "site"
		sidebarFilter = [ sidebar_filter_key, "=", selectedItem.site_id ]
		Session.set "grid_sidebar_filters", sidebarFilter
	else
		Session.set "grid_sidebar_filters", null


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
			setGridSidebarFilters({site_id: -1})
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
							# loadOptions.select = ["name", "parent", "children"]
							loadOptions.select = ["name", "admins"]
						onLoaded: (results)->
							if results and _.isArray(results)
								_.each results, (item, index)->
									if index == 0
										# 默认选中第一个站点，并按第一个站点过滤文章
										item.selected = true
										selectedItem = {
											site_id: item._id,
											is_site_admin: item?.admins.indexOf(userId) > -1
										}
										Session.set "grid_sidebar_selected", selectedItem
										setGridSidebarFilters(selectedItem)
									# 判断是否有下级节点
									item.hasItems = false
									if item.children?.length > 0
										item.hasItems = true
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
						selector: 'order'
						desc: false
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
				debugger;
				selectionItemData = selectionInfo.itemData;
				if selectionItemData?._id
					selectedItem = {
						site_id: selectionItemData._id,
						is_site_admin: selectionItemData?.admins.indexOf(userId) > -1
					}
					Session.set "grid_sidebar_selected", selectedItem
					setGridSidebarFilters(selectedItem)
				else
					# 未设置站点时应该看不到右侧列表相关数据
					setGridSidebarFilters({site_id: -1})

			dxOptions.keyExpr = "_id"
			dxOptions.parentIdExpr = "parent"
			dxOptions.displayExpr = "name"
			dxOptions.hasItemsExpr = "hasItems"
			dxOptions.rootValue = null
			dxOptions.dataStructure = "plain"
			dxOptions.virtualModeEnabled = true 
			# dxOptions.onInitialized = ()->
			# dxOptions.onContentReady = ()->

			self.$(".gridSidebarContainer").dxTreeView(dxOptions).dxTreeView('instance')
			
Template.creator_grid_sidebar_sites.helpers Creator.helpers

Template.creator_grid_sidebar_sites.helpers 

Template.creator_grid_sidebar_sites.events

Template.creator_grid_sidebar_sites.onCreated ->

Template.creator_grid_sidebar_sites.onDestroyed ->
	Session.set "grid_sidebar_selected", null
	Session.set "grid_sidebar_filters", null