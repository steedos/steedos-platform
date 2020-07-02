dxSchedulerInstance = null
# start: moment(start).tz("Asia/Shanghai").format("YYYY-MM-DD HH:mm")
# end: moment(end).tz("Asia/Shanghai").format("YYYY-MM-DD HH:mm")

_editData = (data) ->
	object_name = Session.get('object_name');
	action_collection_name = Creator.getObject(object_name).label
	Session.set("action_collection", "Creator.Collections.#{object_name}")
	Session.set("action_collection_name", action_collection_name)
	Session.set("action_save_and_insert", false)
	Session.set("cmDoc", data)
	Meteor.defer ->
		dxSchedulerInstance.hideAppointmentTooltip()
		$(".creator-edit").click();

_insertData = () ->
	object_name = Session.get("object_name")
	action_collection_name = Creator.getObject(object_name).label
	Session.set("action_collection", "Creator.Collections.#{object_name}")
	Session.set("action_collection_name", action_collection_name)
	Session.set("action_save_and_insert", false)
	Meteor.defer ->
		$(".creator-add").click();

_deleteData = (data) ->
	action = {
		name: "standard_delete",
		todo: "standard_delete"
	}
	action_record_title = data.name
	record_id = data._id
	object_name = Session.get("object_name")
	dxSchedulerInstance.hideAppointmentTooltip()
	Creator.executeAction object_name, action, record_id, action_record_title, 'calendar', ()->
		dxSchedulerInstance.option("dataSource", _dataSource())

_dataSource = () ->
	url = "/api/odata/v4/#{Steedos.spaceId()}/#{Session.get('object_name')}"
	dataSource = {
		store:
			type: "odata"
			version: 4
			url: Steedos.absoluteUrl(url)
			deserializeDates: false
			withCredentials: false
			onLoading: (loadOptions)->
				startDate = loadOptions.dxScheduler.startDate
				endDate = loadOptions.dxScheduler.endDate
				_f = [
					[[ 'end', ">=", startDate], 'and', [ 'start', "<=", endDate]]
				]

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
		expand: ["owner($select=name)"]

	}
	return dataSource

getAppointmentColor = (room) ->
	result = Creator.odata.get('meetingroom',room,'color')
	return result.color

getRoomAdmin = (room) ->
	result = Creator.odata.get('meetingroom',room,'admins')
	return result?.admins || []

getRoomPermission = (room) ->
	result = Creator.odata.get('meetingroom',room,'enable_open')
	return result?.enable_open

getTooltipTemplate = (data) ->
	room = Creator.odata.get('meetingroom', data.room,'color,admins')
	color = room.color
	roomAdmins = room.admins
	if Steedos.isSpaceAdmin() || data.owner._id == Meteor.userId() || roomAdmins.indexOf(Meteor.userId())>-1
		action = """
			<div class="action" style='background-color:" + color + ";'>
				<div class="dx-scheduler-appointment-tooltip-buttons">
					<div class="dx-button dx-button-normal dx-widget dx-button-has-icon delete" role="button" aria-label="trash" tabindex="0">
						<i class="dx-icon dx-icon-trash"></i>
					</div>
					<div class="dx-button dx-button-normal dx-widget dx-button-has-text dx-state-hover edit" role="button" aria-label="打开日程" tabindex="0">
						<span class="dx-button-text">打开日程</span>
					</div>
				</div>
			</div>
		"""
	else
		action = ""
	str = """
		<div class='meeting-tooltip' style='background-color:" + color + ";'>
			<div class="dx-scheduler-appointment-tooltip-title">#{data.name}</div>
			<div class='dx-scheduler-appointment-tooltip-date'>
				#{moment(data.start).tz("Asia/Shanghai").format("MMM D, h:mm A")} - #{moment(data.end).tz("Asia/Shanghai").format("MMM D, h:mm A")}
			</div>
			#{action}
		</div>
	"""
	return $(str)

Template.creator_calendar.onCreated ->
	AutoForm.hooks creatorAddForm:
		onSuccess: (formType,result)->
			dxSchedulerInstance.option("dataSource", _dataSource())
	,false
	AutoForm.hooks creatorEditForm:
		onSuccess: (formType,result)->
			dxSchedulerInstance.option("dataSource", _dataSource())
	,false


Template.creator_calendar.onRendered ->
	Session.set("hideTooltip", false)
	self = this
	self.autorun (c)->
		object_name = Session.get("object_name")
		unless Session.get("object_name") is "meeting"
			return
		if Steedos.spaceId()
			schedulerOptions = {
				dataSource: _dataSource()
				views: [{
					type: "day",
					maxAppointmentsPerCell:"unlimited"
					groups: ["room"]
				}, {
					type:"week",
					maxAppointmentsPerCell:"unlimited"
				}, "month", "agenda"]
				currentView: "day"
				currentDate: new Date()
				firstDayOfWeek: 1
				startDayHour: 8
				endDayHour: 18
				textExpr: "name"
				endDateExpr: "end"
				startDateExpr: "start"
				timeZone: "Asia/Shanghai"
				# showAllDayPanel: false,
				height: "100%"
				# groups: ["room"]
				crossScrollingEnabled: true
				cellDuration: 30
				editing: {
					allowAdding: false,
					allowDragging: true,
					allowResizing: true,
					# allowUpdating: false
				},
				resources: [{
					fieldExpr: "room"
					valueExpr: "_id"
					displayExpr: "name"
					label: "会议室"
					dataSource: {
						store:
							type: "odata"
							version: 4
							url: Steedos.absoluteUrl "/api/odata/v4/#{Steedos.spaceId()}/meetingroom?$orderby=name"
							withCredentials: false
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
						#orderby:'name'
					}
				}],
				appointmentTemplate: (data)->
					return $("""
						<div style='height: 100%;' title='会议标题: #{data.name}&#10;创建人: #{data.owner.name}&#10;联系方式: #{data.phone || ''}'>
							<div class='dx-scheduler-appointment-title'>#{data.name}</div>
							<div class='dx-scheduler-appointment-content-details' style='white-space: nowrap;'>
								<div class='dx-scheduler-appointment-content-date'>#{DevExpress.localization.formatDate(new Date(data.start), 'hh:mm a')}</div>
								<div class='dx-scheduler-appointment-content-date'> - </div>
								<div class='dx-scheduler-appointment-content-date'>#{DevExpress.localization.formatDate(new Date(data.end), 'hh:mm a')}</div>
							</div>
						</div>
					""");
				,
				onAppointmentClick: (e) ->
					if e.event.currentTarget.className.includes("dx-list-item")
						e.cancel = true

				onAppointmentDblClick: (e) ->
					e.cancel = true

				dropDownAppointmentTemplate: (data, index, container) ->
					if Steedos.isSpaceAdmin() || data.owner._id == Meteor.userId()
						$("body").off("click", ".appointment-border")
						$("body").on("click", ".appointment-border", ()->
							_editData(data)
						)
					markup = getTooltipTemplate(data);
					markup.find(".edit").dxButton({
						text: "Edit details",
						type: "default",
						onClick: () ->
							_editData(data)
					});

					markup.find(".delete").dxButton({
						onClick: () ->
							_deleteData(data)
					})
					return markup;

				onCellClick: (e) ->
					cellData = e.cellData
					doc = {
								start: cellData.startDate
								end: cellData.endDate
							}

					if cellData?.groups?.room
						roomAdmins = getRoomAdmin(cellData.groups.room)
						isOpen = getRoomPermission(cellData.groups.room)
						if roomAdmins.indexOf(Meteor.userId())>-1 or isOpen
						# debugger
							if cellData.groups?.room
								doc.room = cellData.groups.room
								if Session.get("cmDoc") and _.isEqual(doc, Session.get("cmDoc"))
									_insertData()
								else
									Session.set("cmDoc", doc)
						else
							toastr.error("此会议室为特约会议室，您暂无权限。")
					else
						if Session.get("cmDoc") and _.isEqual(doc, Session.get("cmDoc"))
							_insertData()
						else
							Session.set("cmDoc", doc)
				onAppointmentUpdating: (e)->
					roomAdmins = getRoomAdmin(e.oldData.room)
					if Steedos.isSpaceAdmin() || e.oldData.owner._id == Meteor.userId() || roomAdmins.indexOf(Meteor.userId())>-1
						newRoom = Creator.odata.get('meetingroom',e.newData.room,'admins,enable_open')
						if newRoom.admins.indexOf(Meteor.userId())>-1 or newRoom.enable_open
							e.cancel = true
							doc = {}
							_.keys(e.newData).forEach (key)->
								if _.indexOf(key, '@') < 0
									if key == 'owner'
										doc[key] = e.newData[key]?._id
									else
										doc[key] = e.newData[key]
							doc['modified'] = new Date()
							Creator.odata.update("meeting", e.newData['_id'], doc, () ->
								dxSchedulerInstance.option("dataSource", _dataSource())
							)
						else
							e.cancel = true
							toastr.error("此会议室为特约会议室，您暂无权限。")
					else
						e.cancel = true;
						toastr.error("您无权限调整此记录");

				onAppointmentUpdated: (e)->
					dxSchedulerInstance.option("dataSource", _dataSource())

				appointmentTooltipTemplate: (data, container) ->
					markup = getTooltipTemplate(data);
					markup.find(".edit").dxButton({
						text: "Edit details",
						type: "default",
						onClick: () ->
							_editData(data)
					});
					markup.find(".delete").dxButton({
						onClick: () ->
							_deleteData(data)
					})
					return markup;
			};
			module.dynamicImport("devextreme/ui/scheduler").then (dxScheduler)->
				DevExpress.ui.dxScheduler = dxScheduler;
				dxSchedulerInstance =  $("#scheduler").dxScheduler(schedulerOptions).dxScheduler("instance")

Template.creator_calendar.helpers Creator.helpers

Template.creator_calendar.helpers
	actions: ()->
		actions = Creator.getActions()
		actions = _.filter actions, (action)->
			if action.on == "list" && action.todo != "standard_query"
				if typeof action.visible == "function"
					return action.visible()
				else
					return action.visible
			else
				return false
		return actions

	list_views: ()->
		Session.get("change_list_views")
		return Creator.getListViews()

	list_view_label: (item)->
		if item
			return item.label || item.name
		else
			return ""

	list_view_url: (list_view)->
		if list_view._id
			list_view_id = String(list_view._id)
		else
			list_view_id = String(list_view.name)

		app_id = Session.get("app_id")
		object_name = Session.get("object_name")
		return Creator.getListViewUrl(object_name, app_id, list_view_id)

Template.creator_calendar.events
	"click .list-action-custom": (event, template) ->
		_insertData()
