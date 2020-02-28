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

loadCategories = (self)->
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

loadSites = (self)->
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

loadStoreItems = (self)->
	sites = self.sites.get()
	categories = self.categories.get()
	if !sites
		loadSites(self)
	if sites and !categories
		loadCategories(self)

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
			loadStoreItems(self)
			storeItems = self.storeItems.get()
			if !storeItems
				return;
			dxOptions = 
				searchEnabled: false
				# dataSource: getDataSource()
				dataSource: 
					store: storeItems
			
			sidebar_multiple = false
			dxOptions.selectNodesRecursive = false
			dxOptions.selectByClick = true
			dxOptions.selectionMode = if sidebar_multiple then "multiple" else "single"
			dxOptions.showCheckBoxesMode = if sidebar_multiple then "normal" else "none"
			dxOptions.onItemClick = (selectionInfo)->
				if selectionInfo.node.selected
					# 如果选项已经选中则不需要变更状态，即不可以把已经选中的状态变更为未选中
					selectionInfo.event.preventDefault()

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

			self.$(".gridSidebarContainer").dxTreeView(dxOptions).dxTreeView('instance')
			
Template.creator_grid_sidebar_sites.helpers Creator.helpers

Template.creator_grid_sidebar_sites.helpers 
	site:() -> 
		return Session.get("site")

Template.creator_grid_sidebar_sites.events

Template.creator_grid_sidebar_sites.onCreated ->
	this.categories = new ReactiveVar(null)
	this.sites = new ReactiveVar(null)
	this.storeItems = new ReactiveVar(null)

Template.creator_grid_sidebar_sites.onDestroyed ->
	Session.set "grid_sidebar_filters", null