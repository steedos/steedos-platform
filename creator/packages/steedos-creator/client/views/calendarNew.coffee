dxSchedulerInstance = null

_getSelect = (options)->
	select = ['_id', 'owner', 'name']

	if options.startDateExpr
		select.push(options.startDateExpr)

	if options.endDateExpr
		select.push(options.endDateExpr)

	if options.textExpr
		select.push(options.textExpr)

	if options.title && _.isArray(options.title)
		select = select.concat(options.title)

	return _.uniq(select)

getExpand = (options)->
	objectFields = Creator.getObject(Session.get("object_name")).fields
	expand = []
	_.forEach options.title, (fname)->
		f = objectFields[fname]
		if (f.type == 'lookup' || f.type == 'master_detail')
			if _.isString(f.reference_to)
				re_object_name_field = Creator.getObject(f.reference_to)?.NAME_FIELD_KEY
				if re_object_name_field
					expand.push("#{fname}($select=#{re_object_name_field})")
			else
				expand.push("#{fname}($select=name)")
	if expand.length < 1
		return
	return expand;

_dataSource = (options) ->
	filter = Creator.getODataFilter(Session.get("list_view_id"), Session.get('object_name'))
	url = "/api/odata/v4/#{Steedos.spaceId()}/#{Session.get('object_name')}"
	expand = getExpand(options)
	dataSource = {
		store:
			type: "odata"
			version: 4
			url: Steedos.absoluteUrl(url)
			deserializeDates: false
			withCredentials: false
			onLoaded: (a,b,c)->
			onLoading: (loadOptions)->
				# 注意这里的startDate、endDate是取的第一天上班时间及最后一天下班时间，且取的是utc时间的8点到17点59分
				# _dataSource===startDate===== Mon Jan 28 2019 08:00:00 GMT+0800 (中国标准时间)
				# _dataSource===endDate===== Sun Mar 10 2019 17:59:00 GMT+0800 (中国标准时间)
				startDate = loadOptions.dxScheduler.startDate
				endDate = loadOptions.dxScheduler.endDate
				_f = [
					[[ options.endDateExpr, ">=", startDate], 'and', [ options.startDateExpr, "<=", endDate]]
				]

				# _f中的时区问题需要通过formatFiltersToDev统一处理
				_f = Creator.formatFiltersToDev(_f, Session.get('object_name'))

				if loadOptions.filter && _.isArray(loadOptions.filter)
					loadOptions.filter = [loadOptions.filter, 'and', _f]
				else
					loadOptions.filter = _f
			beforeSend: (request) ->
				request.headers['X-User-Id'] = Meteor.userId()
				request.headers['X-Space-Id'] = Steedos.spaceId()
				request.headers['X-Auth-Token'] = Accounts._storedLoginToken()
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
		select: _getSelect(options)
		expand: expand || ["owner($select=name)"]
		filter: filter
	}
	return dataSource

_getAppointmentTemplate = (options)->
	appointmentTemplate = (data)->
		title = data[options.textExpr || 'name'];
		if options.title && _.isArray(options.title) && options.title.length > 0
			title = ''
			fields = Creator.getObject().fields;
			_.each options.title, (t)->
				f = fields[t]
				fvalue = data[t]
				if fvalue
					if (f.type == 'lookup' || f.type == 'master_detail')
						if _.isArray(fvalue)
							fvalue = _.pluck(fvalue, '_NAME_FIELD_VALUE').join(',')
						else
							fvalue = fvalue?['_NAME_FIELD_VALUE']
					else if f.type == 'select'
						f_options = f.options

						if _.isFunction(f_options)
							f_options = f_options()

						f_option = _.find f_options, (o)->
							return o.value == fvalue

						fvalue = f_option?.label || ''

					else if f.type == 'datetime'
						fvalue = DevExpress.localization.formatDate(new Date(fvalue), 'yyyy-MM-dd hh:mm a')
				else
					fvalue = ''

				title += "#{f.label || t}: #{fvalue}&#10;"
		return $("""
				<div style='height: 100%;' title='#{title}'>
					<div class='dx-scheduler-appointment-title'>#{data[options.textExpr || 'name']}</div>
					<div class='dx-scheduler-appointment-content-details' style='white-space: nowrap;'>
						<div class='dx-scheduler-appointment-content-date'>#{DevExpress.localization.formatDate(new Date(data[options.startDateExpr]), 'hh:mm a')}</div>
						<div class='dx-scheduler-appointment-content-date'> - </div>
						<div class='dx-scheduler-appointment-content-date'>#{DevExpress.localization.formatDate(new Date(data[options.endDateExpr]), 'hh:mm a')}</div>
					</div>
				</div>
			""");

	return appointmentTemplate;

getPermission = (data)->
	permission = Creator.getRecordPermissions(Session.get('object_name'), data, Meteor.userId())
	if data
		actions = Creator.getActions()

		editAction = _.find actions, (action)->
			return action.name == 'standard_edit'

		if _.isFunction(editAction.visible)
			editAction._visible = editAction.visible(Session.get('object_name'), data._id, permission)
		else
			editAction._visible = editAction.visible

		deleteAction = _.find actions, (action)->
			return action.name == 'standard_delete'

		if _.isFunction(deleteAction.visible)
			deleteAction._visible = deleteAction.visible(Session.get('object_name'), data._id, permission)
		else
			deleteAction._visible = deleteAction.visible

	return {
		allowCreate: permission.allowCreate,
		allowEdit: permission.allowEdit && editAction?._visible,
		allowDelete: permission.allowDelete && deleteAction?._visible
	}

_getTooltipTemplate = (data, options) ->

	permission = getPermission(data)

	deleteBtn = ""

	if permission.allowDelete
		deleteBtn = """
			<div class="dx-button dx-button-normal dx-widget dx-button-has-icon delete" role="button" aria-label="trash" tabindex="0">
				<i class="dx-icon dx-icon-trash"></i>
			</div>
		"""

	editBtn = """
		<div class="dx-button dx-button-normal dx-widget dx-button-has-text read dx-button-default" role="button" aria-label="查看" tabindex="0">
			<span class="dx-button-text">查看</span>
		</div>
	"""

	if permission.allowEdit
		editBtn = """
			<div class="dx-button dx-button-normal dx-widget dx-button-has-text edit dx-button-default" role="button" aria-label="编辑" tabindex="0">
				<span class="dx-button-text">编辑</span>
			</div>
		"""
	titleView = ""
	fields = Creator.getObject().fields;
	_.each options.title, (key)->
		if key != options.textExpr && key != options.startDateExpr && key != options.endDateExpr
			f = fields[key]
			fvalue = data[key]
			if fvalue
				if (f.type == 'lookup' || f.type == 'master_detail')
					if _.isArray(fvalue)
						fvalueHtml = [];
						_.each fvalue, (item)->
							fvalueHtml.push "<a onclick=\"window.open('#{Creator.getObjectUrl(item['reference_to._o'], item._id)}','_blank','width=800, height=600, left=50, top= 50, toolbar=no, status=no, menubar=no, resizable=yes, scrollbars=yes');return false\" href='#'>#{item['_NAME_FIELD_VALUE']}</a>"
						fvalue = fvalueHtml.join(',')
					else
						if !_.isEmpty(fvalue)
							fvalue = "<a onclick=\"window.open('#{Creator.getObjectUrl(fvalue['reference_to._o'], fvalue._id)}','_blank','width=800, height=600, left=50, top= 50, toolbar=no, status=no, menubar=no, resizable=yes, scrollbars=yes');return false\" href='#'>#{fvalue['_NAME_FIELD_VALUE']}</a>"
				else if f.type == 'select'
					f_options = f.options

					if _.isFunction(f_options)
						f_options = f_options()

					f_option = _.find f_options, (o)->
						return o.value == fvalue

					fvalue = f_option?.label || ''

				else if f.type == 'datetime'
					fvalue = DevExpress.localization.formatDate(new Date(fvalue), 'yyyy-MM-dd hh:mm a')
			else
				fvalue = ''
			titleView += "<div class='dx-scheduler-appointment-tooltip-title'>#{f.label || t}: #{fvalue}</div>"

#	if !permission.allowEdit
#		return false
#
	action = """
		<div class="action">
			<div class="dx-scheduler-appointment-tooltip-buttons">
				#{deleteBtn}
				#{editBtn}
			</div>
		</div>
	"""
	str = """
		<div class='meeting-tooltip'>
			<div class="dx-scheduler-appointment-tooltip-title">#{data[options.textExpr || 'name']}</div>
			<div class='dx-scheduler-appointment-tooltip-date'>
				#{moment(data[options.startDateExpr]).tz("Asia/Shanghai").format("MMM D, h:mm A")} - #{moment(data[options.endDateExpr]).tz("Asia/Shanghai").format("MMM D, h:mm A")}
			</div>
			<div class="dx-scheduler-appointment-tooltip-titles">
				#{titleView}
			</div>
			#{action}
		</div>
	"""
	return $(str)

_readData = (data) ->
	object_name = Session.get('object_name');
	action_collection_name = Creator.getObject(object_name).label
	Session.set("action_collection", "Creator.Collections.#{object_name}")
	Session.set("action_collection_name", action_collection_name)
	Session.set("action_save_and_insert", false)
	Session.set("cmDoc", data)
	Meteor.defer ->
		dxSchedulerInstance.hideAppointmentTooltip()
		window.open(Creator.getObjectUrl(object_name, data._id) ,'_blank','width=800, height=800, left=300, top=20,toolbar=no, status=no, menubar=no, resizable=yes, scrollbars=yes')


_executeAction = (action_name, data)->
	actions = Creator.getActions()
	action = _.find actions, (item)->
		return item.name == action_name
	if action
		objectName = Session.get("object_name")
		object = Creator.getObject(objectName)
		collection_name = object.label
		Session.set("action_fields", undefined)
		Session.set("action_collection", "Creator.Collections.#{objectName}")
		Session.set("action_collection_name", collection_name)
		Session.set("action_save_and_insert", false)
		dxSchedulerInstance.hideAppointmentTooltip()

		if action_name == 'standard_delete'
			Creator.executeAction objectName, action, data._id, null, null, ()->
				dxSchedulerInstance.repaint()
		else
			Creator.executeAction objectName, action, data._id

_newData = (e, options)->
	cellData = e.cellData

	doc = {
		"#{options.startDateExpr}" : cellData.startDate
		"#{options.endDateExpr}" : cellData.endDate
	}

	if cellData.groups
		_.extend doc, cellData.groups
	Session.set("cmDoc", doc)
	_executeAction 'standard_new' , doc

_editData = (data)->
	_executeAction 'standard_edit' , data

_deleteData = (data)->
	_executeAction 'standard_delete' , data

setResource = (data, fieldName, value)->
	Creator.odata.update Session.get("object_name"), data._id, {"#{fieldName}" : value}, ()->
		dxSchedulerInstance.repaint()

getAppointmentContextMenuItems = (e, options)->
	menuItems = []

	permission = getPermission(e.targetedAppointmentData)

	if permission.allowDelete
		menuItems.push text: '删除', onItemClick: (itemE)->
			_deleteData(itemE.targetedAppointmentData)

	if permission.allowEdit
		menuItems.unshift text: '编辑', onItemClick: (itemE)->
			_editData(itemE.targetedAppointmentData)

		fields = Creator.getObject(Session.get("object_name"))?.fields
		if fields
			_.each options.groups, (g)->
				f = fields[g]
				if f
					menuItems.push { text: "设置#{f.label}", beginGroup: true, disabled: true }
		if options.resources && options.resources.length > 0 && options.resources[0].dataSource
			fieldExpr = options.resources[0].fieldExpr
			_.each options.resources[0].dataSource, (ds)->
				ds.onItemClick = (e, clickEvent)->
					setResource(e.targetedAppointmentData, fieldExpr, clickEvent.itemData.id)
				menuItems.push ds
	return menuItems

getAppointmentMenuTemplate = (itemData) ->
	template = $('<div></div>');

	if(itemData.color)
		template.append("<div class='item-badge' style='background-color:" + itemData.color + ";'></div>");

	template.append(itemData.text);

	if(itemData.text == "New Appointment until the end of the week")
		template.append('<hr />');

	return template;

groupCell = (e, options) ->
	scheduler = e.component;
	if(scheduler.option("groups"))
		scheduler.option("crossScrollingEnabled", false);
		scheduler.option("groups", undefined);
	else
		scheduler.option("crossScrollingEnabled", true);
		scheduler.option("groups", options.groups);

showCurrentDate = (e) ->
	scheduler = e.component;
	scheduler.option("currentDate", new Date());

getCellContextMenuItems = (options)->
	if options.groups
		menuItems = [
			{ text: '分组/取消分组', beginGroup: true, onItemClick: groupCell },
			{ text: '去今天', onItemClick: showCurrentDate }
		]
	else
		menuItems = [
			{ text: '去今天', beginGroup: true, onItemClick: showCurrentDate }
		]


	permission = getPermission()
	if permission.allowCreate
		menuItems.unshift { text: '新建', onItemClick: _newData }

	return menuItems

Template.creator_calendarNew.onCreated ->
	AutoForm.hooks creatorAddForm:
		onSuccess: (formType,result)->
			if $("#creator-scheduler").length < 1
				return;
			dxSchedulerInstance.repaint()
	,false
	AutoForm.hooks creatorEditForm:
		onSuccess: (formType,result)->
			if $("#creator-scheduler").length < 1
				return;
			dxSchedulerInstance.repaint()
	,false

Template.creator_calendarNew.onRendered ->
	self = this
	view = Creator.getListView(Session.get("object_name"), Session.get("list_view_id"))
	self.autorun (c)->
		object_name = Session.get("object_name");
		if $("#creator-scheduler").length < 1
			return;
		if Steedos.spaceId()

			cellContextMenuItems = getCellContextMenuItems(view.options)
			dxSchedulerConfig = {
				dataSource: _dataSource(view.options)
				views: [{
					type: "day",
					maxAppointmentsPerCell:"unlimited"
				}, {
					type:"week",
					maxAppointmentsPerCell:"unlimited"
				}, "month", "agenda"]
				currentView: "month"
				currentDate: new Date()
				firstDayOfWeek: 1
				startDayHour: 8
				endDayHour: 18
				textExpr: 'name'
				endDateExpr: view.options.endDateExpr
				startDateExpr: view.options.startDateExpr
				timeZone: "Asia/Shanghai"
				height: "100%"
				crossScrollingEnabled: true
				cellDuration: 30
				recurrenceEditMode: "series"
				editing: {
					allowAdding: false,
					allowDragging: false,
					allowResizing: false,
					allowDeleting: false,
					allowUpdating: false,
				},
				appointmentTemplate: _getAppointmentTemplate(view.options)
				dataCellTemplate: null
				onCellClick: (e) ->
					e.cancel = true
					permission = getPermission()
					if permission.allowCreate
						_newData(e, view.options)
				onAppointmentClick: (e) ->
					if e.event.currentTarget.className.includes("dx-list-item")
						e.cancel = true

				onAppointmentDblClick: (e) ->
					e.cancel = true

				onAppointmentUpdated: (e)->
					dxSchedulerInstance.option("dataSource", _dataSource(view.options))

				dropDownAppointmentTemplate: (data, index, container) ->
					markup = _getTooltipTemplate(data, view.options);
					markup.find(".read").dxButton({
						text: "查看详细",
						type: "default",
						onClick: (e) ->
							_readData(data)
					});

					markup.find(".edit").dxButton({
						text: "编辑",
						type: "default",
						onClick: (e) ->
							_editData(data)
					});

					markup.find(".delete").dxButton({
						onClick: () ->
							_deleteData(data)
					})

					return markup;
				appointmentTooltipTemplate: (data, index, container) ->
					markup = _getTooltipTemplate(data, view.options);
					markup.find(".read").dxButton({
						text: "查看详细",
						type: "default",
						onClick: () ->
							_readData(data)
					});

					markup.find(".edit").dxButton({
						text: "编辑",
						type: "default",
						onClick: () ->
							_editData(data)
					});

					markup.find(".delete").dxButton({
						onClick: () ->
							_deleteData(data)
					})

					return markup;

				onAppointmentContextMenu: (e) ->
					contextMenuEvent = e;
					$("#creator-scheduler-appointment-context-menu").dxContextMenu({
						dataSource: getAppointmentContextMenuItems(contextMenuEvent, view.options),
						width: 200,
						target: ".dx-scheduler-appointment",
						itemTemplate: (itemData) ->
							template = getAppointmentMenuTemplate(itemData);
							return template;
						,
						onItemClick: (e) ->
							if(!e.itemData.items && e.itemData.onItemClick)
								e.itemData.onItemClick(contextMenuEvent, e);

					});
				onCellContextMenu: (e)->
					contextMenuEvent = e;

					$("#creator-scheduler-context-menu").dxContextMenu({
						dataSource: cellContextMenuItems,
						width: 200,
						target: ".dx-scheduler-date-table-cell",
						onItemClick: (e) ->
							e.itemData.onItemClick(contextMenuEvent, view.options)
					})
			}

			_.extend(dxSchedulerConfig, view.options)

			module.dynamicImport("devextreme/ui/scheduler").then (dxScheduler)->
				DevExpress.ui.dxScheduler = dxScheduler;
				dxSchedulerInstance =  $("#creator-scheduler").dxScheduler(dxSchedulerConfig).dxScheduler("instance")

			window.dxSchedulerInstance = dxSchedulerInstance;