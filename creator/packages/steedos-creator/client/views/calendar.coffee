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
	}
	return dataSource

getAppointmentColor = (room) ->
	result = Creator.odata.get('meetingroom',room,'color')
	return result.color
	
getTooltipTemplate = (data) ->
	color = getAppointmentColor(data.room)
	if Steedos.isSpaceAdmin() || data.owner == Meteor.userId()
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
		if Steedos.spaceId()
			dxSchedulerInstance =  $("#scheduler").dxScheduler({
				dataSource: _dataSource()
				views: [{
					type: "day",
					groups: ["room"]
				}, "week", "month"]
				currentView: "day"
				# currentDate: new Date()
				firstDayOfWeek: 0
				startDayHour: 8
				endDayHour: 18
				textExpr: "name"
				endDateExpr: "end"
				startDateExpr: "start"
				timeZone: "Asia/Shanghai"
				showAllDayPanel: false,
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
				onAppointmentClick: (e) ->
					if e.event.currentTarget.className.includes("dx-list-item")
						e.cancel = true

				onAppointmentDblClick: (e) ->
					e.cancel = true	

				dropDownAppointmentTemplate: (data, index, container) ->
					container.addClass('appointment-border')
					if Steedos.isSpaceAdmin() || data.owner == Meteor.userId()
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
					console.log('[dropDownAppointmentTemplate]', data)

				onCellClick: (e) ->
					console.log('[onCellClick]', e)

					cellData = e.cellData
					# debugger
					doc = {
						start: cellData.startDate
						end: cellData.endDate
					}

					if cellData.groups?.room
						doc.room = cellData.groups.room
					
					if Session.get("cmDoc") and _.isEqual(doc, Session.get("cmDoc"))
						_insertData()
					else
						Session.set("cmDoc", doc)
					
				onAppointmentUpdating: (e)->
					e.cancel = true
					doc = {}
					_.keys(e.newData).forEach (key)->
						if _.indexOf(key, '@') < 0
							doc[key] = e.newData[key]
					doc['modified'] = new Date()
					Creator.odata.update("meeting", e.newData['_id'], doc, () -> 
						dxSchedulerInstance.option("dataSource", _dataSource())
					)

				onAppointmentUpdated: (e)->
					dxSchedulerInstance.option("dataSource", _dataSource())

				appointmentTooltipTemplate: (data, container) ->
					console.log('[appointmentTooltipTemplate]', data, container)
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
			}).dxScheduler("instance")

Template.creator_calendar.helpers Creator.helpers

Template.creator_calendar.helpers
	actions: ()->
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

		