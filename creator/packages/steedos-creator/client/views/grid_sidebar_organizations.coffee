setGridSidebarFilters = (selectedItem)->
	if selectedItem and selectedItem._id
		sidebar_filter_key = "organizations"
		sidebarFilter = [ sidebar_filter_key, "=", selectedItem._id ]
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
							if results and _.isArray(results) and results.length
								selectedItem = Session.get "organization"
								if selectedItem
									Session.set "organization", selectedItem
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
			
			sidebar_multiple = false
			dxOptions.selectNodesRecursive = false
			dxOptions.selectByClick = true
			dxOptions.selectionMode = if sidebar_multiple then "multiple" else "single"
			dxOptions.showCheckBoxesMode = if sidebar_multiple then "normal" else "none"
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

			self.$(".gridSidebarContainer").dxTreeView(dxOptions).dxTreeView('instance')
			
Template.creator_grid_sidebar_organizations.helpers Creator.helpers

Template.creator_grid_sidebar_organizations.helpers 
	organization:() -> 
		return Session.get("organization")

Template.creator_grid_sidebar_organizations.events

Template.creator_grid_sidebar_organizations.onCreated ->

Template.creator_grid_sidebar_organizations.onDestroyed ->
	Session.set "grid_sidebar_filters", null