dxDataGridInstance = null

### TO DO LIST
	1.支持$in操作符，实现recent视图
	$eq, $ne, $lt, $gt, $lte, $gte
###

initFilter = (list_view_id, object_name)->
	userId = Meteor.userId()
	spaceId = Session.get("spaceId")
	custom_list_view = Creator.Collections.object_listviews.findOne(list_view_id)
	selector = []
	if custom_list_view
		filter_scope = custom_list_view.filter_scope
		filters = custom_list_view.filters
		if filter_scope == "mine"
			selector.push ["owner", "=", Meteor.userId()]
		else if filter_scope == "space"
			selector.push ["space", "=", Steedos.spaceId()]

		if filters and filters.length > 0
			selector.push "and"
			filters = _.map filters, (obj)->
				return [obj.field, obj.operation, obj.value]
			
			filters = Creator.formatFiltersToDev(filters)
			_.each filters, (filter)->
				selector.push filter
	else
		# TODO
		if spaceId and userId
			list_view = Creator.getListView(object_name, list_view_id)
			if list_view.filter_scope == "spacex"
				selector.push ["space", "=", null], "or", ["space", "=", space]
			else if object_name == "users"
				selector.push ["_id", "=", userId]
			else if object_name == "spaces"
				selector.push ["_id", "=", spaceId]
			else
				selector.push ["space", "=", spaceId]

			if list_view_id == "recent"
				viewed = Creator.Collections.object_recent_viewed.find({object_name: object_name}).fetch()
				record_ids = _.pluck(viewed, "record_id")
				record_ids = _.uniq(record_ids)
				record_ids = record_ids.join(",or,").split(",")
				id_selector = _.map record_ids, (_id)->
					if _id != "or"
						return ["_id", "=", _id]
					else
						return _id
				selector.push "and", id_selector

			# $eq, $ne, $lt, $gt, $lte, $gte
			# [["is_received", "$eq", true],["destroy_date","$lte",new Date()],["is_destroyed", "$eq", false]]
			if list_view.filters
				filters = Creator.formatFiltersToDev(list_view.filters)
				if filters and filters.length > 0
					selector.push "and"
					_.each filters, (filter)->
						selector.push filter

				if list_view.filter_scope == "mine"
					selector.push "and", ["owner", "=", userId]
			else
				permissions = Creator.getPermissions(object_name)
				if permissions.viewAllRecords
					if list_view.filter_scope == "mine"
						selector.push "and", ["owner", "=", userId]
				else if permissions.allowRead
					selector.push "and", ["owner", "=", userId]
	return selector

Template.creator_grid.onRendered ->
	self = this
	self.autorun (c)->
		object_name = Session.get("object_name")
		name_field_key = Creator.getObject(object_name).NAME_FIELD_KEY
		list_view_id = Session.get("list_view_id")
		if Steedos.spaceId() and Creator.subs["CreatorListViews"].ready()
			url = "/api/odata/v4/#{Steedos.spaceId()}/#{object_name}"
			filter = initFilter(list_view_id, object_name)
			
			object = Creator.getObject(object_name)
			objectFields = object?.fields
			columns = [name_field_key]
			if object.list_views?.default?.columns
				columns = object.list_views.default.columns
			# 暂时不支持子字段，后续odata支持后要去掉并单独处理子字段相关问题
			columns = columns.map (n,i)->
				return n.split(".")[0]
			extra_columns = ["owner"]
			if object.list_views?.default?.extra_columns
				extra_columns = _.union extra_columns, object.list_views.default.extra_columns
			
			selectColumns = _.union ["_id"], columns, extra_columns
			showColumns = columns.map (n,i)->
				columnItem = 
					dataField: n
					cellTemplate: (container, options) ->
						field = object.fields[n]
						field_name = n
						if /\w+\.\$\.\w+/g.test(field_name)
							# object类型带子属性的field_name要去掉中间的美元符号，否则显示不出字段值
							field_name = n.replace(/\$\./,"")
						cellOption = {_id: options.data._id, val: options.data[n], doc: options.data, field: field, field_name: field_name, object_name:object_name}
						Blaze.renderWithData Template.creator_table_cell, cellOption, container[0]
				return columnItem
			showColumns.push
				dataField: "_id"
				width: 60
				allowSorting: false
				headerCellTemplate: (container) ->
					return ""
				cellTemplate: (container, options) ->
					container.css("overflow", "visible")
					record_permissions = Creator.getRecordPermissions object_name, options.data, Meteor.userId()
					actionsOption = {_id: options.data._id, object_name: object_name, record_permissions: record_permissions, is_related: false}
					Blaze.renderWithData Template.creator_table_actions, actionsOption, container[0]
			showColumns.splice 0, 0, 
				dataField: "_id"
				width: 80
				allowSorting: false
				headerCellTemplate: (container) ->
					Blaze.renderWithData Template.creator_table_checkbox, {_id: "#", object_name: object_name}, container[0]
				cellTemplate: (container, options) ->
					Blaze.renderWithData Template.creator_table_checkbox, {_id: options.data._id, object_name: object_name}, container[0]

			dxOptions = 
				dataSource: 
					store: 
						type: "odata"
						version: 4
						url: Steedos.absoluteUrl(url)
						withCredentials: false
						beforeSend: (request) ->
							request.headers['X-User-Id'] = Meteor.userId()
							request.headers['X-Space-Id'] = Steedos.spaceId()
							request.headers['X-Auth-Token'] = Accounts._storedLoginToken()
					select: selectColumns
					filter: filter
				columns: showColumns
				onContentReady: (e)->
					self.data.total.set dxDataGridInstance.totalCount()

			dxDataGridInstance = self.$(".gridContainer").dxDataGrid(dxOptions).dxDataGrid('instance')

Template.creator_grid.helpers Creator.helpers

Template.creator_grid.events
	
	'click .list-item-action': (event, template) ->
		actionKey = event.currentTarget.dataset.actionKey
		objectName = event.currentTarget.dataset.objectName
		recordId = event.currentTarget.dataset.recordId
		object = Creator.getObject(objectName)
		action = object.actions[actionKey]
		collection_name = object.label
		if action.todo == "standard_delete"
			action_record_title = template.$(".list-item-link-"+ recordId).attr("title")
			swal
				title: "删除#{object.label}"
				text: "<div class='delete-creator-warning'>是否确定要删除此#{object.label}？</div>"
				html: true
				showCancelButton:true
				confirmButtonText: t('Delete')
				cancelButtonText: t('Cancel')
				(option) ->
					if option
						Creator.Collections[objectName].remove {_id: recordId}, (error, result) ->
							if error
								toastr.error error.reason
							else
								info = object.label + "\"#{action_record_title}\"" + "已删除"
								toastr.success info
								dxDataGridInstance.refresh()
		else
			Session.set("action_fields", undefined)
			Session.set("action_collection", "Creator.Collections.#{objectName}")
			Session.set("action_collection_name", collection_name)
			Session.set("action_save_and_insert", true)
			Creator.executeAction objectName, action, recordId

	'click .table-cell-edit': (event, template) ->
		field = this.field_name

		if this.field.depend_on && _.isArray(this.field.depend_on)
			field = _.clone(this.field.depend_on)
			field.push(this.field_name)
			field = field.join(",")

		objectName = Session.get("object_name")
		collection_name = Creator.getObject(objectName).label
		rowData = this.doc

		if rowData
			Session.set("action_fields", field)
			Session.set("action_collection", "Creator.Collections.#{objectName}")
			Session.set("action_collection_name", collection_name)
			Session.set("action_save_and_insert", false)
			Session.set 'cmDoc', rowData
			Session.set 'cmIsMultipleUpdate', true
			Session.set 'cmTargetIds', Creator.TabularSelectedIds?[objectName]
			Meteor.defer ()->
				$(".btn.creator-cell-edit").click()

	'dblclick .slds-table td': (event) ->
		$(".table-cell-edit", event.currentTarget).click()

	'click .slds-table td': (event, template)->
		$(".slds-table td").removeClass("slds-has-focus")
		$(event.currentTarget).addClass("slds-has-focus")

Template.creator_grid.onCreated ->
	AutoForm.hooks creatorAddForm:
		onSuccess: (formType,result)->
			# 在最近查看列表中添加记录会重新执行onRendered中的autorun，所以不需要再次刷新数据
			if Session.get("list_view_id") != "recent"
				dxDataGridInstance.refresh().done (result)->
					Creator.remainCheckboxState(dxDataGridInstance.$element())
	,true
	AutoForm.hooks creatorEditForm:
		onSuccess: (formType,result)->
			dxDataGridInstance.refresh().done (result)->
				Creator.remainCheckboxState(dxDataGridInstance.$element())
	,true
	AutoForm.hooks creatorCellEditForm:
		onSuccess: (formType,result)->
			dxDataGridInstance.refresh().done (result)->
				Creator.remainCheckboxState(dxDataGridInstance.$element())
	,true

Template.creator_grid.onDestroyed ->
	#离开界面时，清除hooks为空函数
	AutoForm.hooks creatorAddForm:
		onSuccess: undefined
	,true
	AutoForm.hooks creatorEditForm:
		onSuccess: undefined
	,true
	AutoForm.hooks creatorCellEditForm:
		onSuccess: undefined
	,true
