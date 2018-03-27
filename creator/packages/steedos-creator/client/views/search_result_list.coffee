_itemClick = (e, object_name, dxSearchGridInstance)->
	record = e.data
	if !record
		return
	record_permissions = Creator.getRecordPermissions object_name, record, Meteor.userId()
	actions = _actionItems(object_name, record._id, record_permissions)

	if actions.length
		actionSheetItems = _.map actions, (action)->
			return {text: action.label, record: record, action: action, object_name: object_name}
	else
		actionSheetItems = [{text: t("creator_list_no_actions_tip"), record: undefined, action: undefined, object_name: undefined}]
	
	actionSheetOption = 
		dataSource: actionSheetItems
		showTitle: false
		usePopover: true
		onItemClick: (value)->
			if !value.itemData.action
				return false
			action = value.itemData.action
			recordId = value.itemData.record._id
			objectName = value.itemData.object_name
			object = Creator.getObject(objectName)
			collectionName = object.label
			name_field_key = object.NAME_FIELD_KEY
			if action.todo == "standard_delete"
				action_record_title = value.itemData.record[name_field_key]
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
									dxSearchGridInstance.refresh()
			else
				Session.set("action_fields", undefined)
				Session.set("action_collection", "Creator.Collections.#{objectName}")
				Session.set("action_collection_name", collectionName)
				Session.set("action_save_and_insert", true)
				Creator.executeAction objectName, action, recordId

	unless actions.length
		actionSheetOption.itemTemplate = (itemData, itemIndex, itemElement)->
			itemElement.html "<span class='text-muted'>#{itemData.text}</span>"

	actionSheet = $(".action-sheet").dxActionSheet(actionSheetOption).dxActionSheet("instance")
	
	actionSheet.option("target", e.event.target);
	actionSheet.option("visible", true);

_actionItems = (object_name, record_id, record_permissions)->
	obj = Creator.getObject(object_name)
	actions = Creator.getActions(object_name)
	actions = _.filter actions, (action)->
		if action.on == "record" or action.on == "record_more"
			if action.only_detail
				return false
			if typeof action.visible == "function"
				return action.visible(object_name, record_id, record_permissions)
			else
				return action.visible
		else
			return false
	return actions

_filter = (record_ids) ->
	filter = []
	_.each record_ids, (id)->
		if filter.length > 0
			filter.push "or"
		filter.push ["_id", "=", id]
	return filter

_select = (object_name) ->
	obj = Creator.getObject(object_name)
	if !obj
		return
	default_columns = obj.list_views?.default.columns || [obj.NAME_FIELD_KEY]
	fields = obj.fields
	default_columns = _.map default_columns, (column) ->
		if fields[column].type and !fields[column].hidden
			return column
		else
			return undefined
	default_columns = _.compact(default_columns)
	return default_columns

_columns = (object_name, columns)->
	object = Creator.getObject(object_name)
	return columns.map (n,i)->
		field = object.fields[n]
		columnItem = 
			cssClass: "slds-cell-edit"
			caption: field.label || TAPi18n.__(object.schema.label(n))
			dataField: n
			alignment: "left"
			cellTemplate: (container, options) ->
				field_name = n
				if /\w+\.\$\.\w+/g.test(field_name)
					# object类型带子属性的field_name要去掉中间的美元符号，否则显示不出字段值
					field_name = n.replace(/\$\./,"")
				cellOption = {_id: options.data._id, val: options.data[n], doc: options.data, field: field, field_name: field_name, object_name:object_name, agreement: "odata"}
				Blaze.renderWithData Template.creator_table_cell, cellOption, container[0]
		return columnItem

Template.search_result_list.onRendered -> 
	self = this
	self.autorun ->
		object_name = Template.instance().data.object_name
		record_ids = Template.instance().data.record_ids

		url = "/api/odata/v4/#{Steedos.spaceId()}/#{object_name}"
		filter = _filter(record_ids)
		select = _select(object_name)
		columns = _columns(object_name, select)

		actions = Creator.getActions(object_name)
		if actions.length
			columns.push
				dataField: "_id_actions"
				width: 46
				allowSorting: false
				allowReordering: false
				headerCellTemplate: (container) ->
					return ""
				cellTemplate: (container, options) ->
					htmlText = """
						<span class="slds-grid slds-grid--align-spread creator-table-actions">
							<div class="forceVirtualActionMarker forceVirtualAction">
								<a class="rowActionsPlaceHolder slds-button slds-button--icon-x-small slds-button--icon-border-filled keyboardMode--trigger" aria-haspopup="true" role="button" title="" href="javascript:void(0);" data-toggle="dropdown">
									<span class="slds-icon_container slds-icon-utility-down">
										<span class="lightningPrimitiveIcon">
											#{Blaze.toHTMLWithData Template.steedos_button_icon, {class: "slds-icon slds-icon-text-default slds-icon--xx-small", source: "utility-sprite", name:"down"}}
										</span>
										<span class="slds-assistive-text" data-aura-rendered-by="15534:0">显示更多信息</span>
									</span>
								</a>
							</div>
						</span>
					"""
					$("<div>").append(htmlText).appendTo(container);

		dxOptions = 
			paging: 
				pageSize: 10
			pager: 
				showPageSizeSelector: true,
				allowedPageSizes: [10,25, 50, 100],
				showInfo: false,
				showNavigationButtons: true
			showColumnLines: false
			allowColumnReordering: true
			allowColumnResizing: true
			columnResizingMode: "widget"
			showRowLines: true
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
					errorHandler: (error) ->
						if error.httpStatus == 404 || error.httpStatus == 400
							error.message = t "creator_odata_api_not_found"
				select: select
				filter: filter
			columns: columns
			onCellClick: (e)->
				if e.column?.dataField ==  "_id_actions"
					_itemClick(e, object_name, self.dxSearchGridInstance)

		self.dxSearchGridInstance = self.$(".search-gridContainer-#{object_name}").dxDataGrid(dxOptions).dxDataGrid('instance')

Template.search_result_list.helpers 
	object_name: ()->
		return Template.instance().data.object_name

	object_label: ()->
		object_name = Template.instance().data.object_name
		return Creator.getObject(object_name).label || Creator.getObject(object_name).name

	object_icon: ()->
		object_name = Template.instance().data.object_name
		return Creator.getObject(object_name).icon
		 
	show_more_records: ()->
		return Template.instance().showMoreRecords.get()

Template.search_result_list.events 
	"dbclick .results-item": (event, template) ->
		$(".table-cell-edit", event.currentTarget).click()

	"click .table-cell-edit": (event, template)	->
		field = this.field_name

		if this.field.depend_on && _.isArray(this.field.depend_on)
			field = _.clone(this.field.depend_on)
			field.push(this.field_name)
			field = field.join(",")

		objectName = this.object_name
		collection_name = Creator.getObject(objectName).label

		Meteor.call "object_record", objectName, this._id, (error, result)->
			console.log "method: object_record", error, result
			if result
				console.log result, "result"
				Session.set 'cmDoc', result
				Session.set("action_fields", field)
				Session.set("action_collection", "Creator.Collections.#{objectName}")
				Session.set("action_collection_name", collection_name)
				Session.set("action_save_and_insert", false)
				Session.set 'cmIsMultipleUpdate', true
				Session.set 'cmTargetIds', Creator.TabularSelectedIds?[objectName]
				Meteor.defer ()->
					$(".btn.creator-cell-edit").click()
	
	"click .btn-more-records": (event, template) ->
		object_name = Template.instance().data.object_name
		search_text = Session.get("search_text")
		obj_fields = Creator.getObject(object_name).fields
		filter = []
		_.each obj_fields, (field,field_name)->
			if field.searchable
				search_Keywords = search_text.trim().split(" ")
				search_Keywords.forEach (keyword)->
					# 特殊字符编码
					keyword = escape(Creator.convertSpecialCharacter(keyword))
					console.log "keyword", keyword
					if filter.length > 0
						filter.push "or"
					filter.push [field_name, "contains", keyword]

		Template.instance().dxSearchGridInstance.filter(filter)
		
		template.showMoreRecords.set(false)

Template.search_result_list.onCreated ->
	self = this
	self.showMoreRecords = new ReactiveVar(false)
	if Template.instance().data.record_ids and Template.instance().data.record_ids.length == 5
		self.showMoreRecords.set(true)
		
	AutoForm.hooks creatorAddForm:
		onSuccess: (formType,result)->
			self.dxSearchGridInstance.refresh()
	,false
	AutoForm.hooks creatorEditForm:
		onSuccess: (formType,result)->
			self.dxSearchGridInstance.refresh()
	,false
	AutoForm.hooks creatorCellEditForm:
		onSuccess: (formType,result)->
			self.dxSearchGridInstance.refresh()
	,false

Template.search_result_list.onDestroyed ->
	#离开界面时，清除hooks为空函数
	AutoForm.hooks creatorAddForm:
		onSuccess: ()->
			$('#afModal').modal 'hide'
	,true
	AutoForm.hooks creatorEditForm:
		onSuccess: ()->
			$('#afModal').modal 'hide'
	,true
	AutoForm.hooks creatorCellEditForm:
		onSuccess: ()->
			$('#afModal').modal 'hide'
	,true