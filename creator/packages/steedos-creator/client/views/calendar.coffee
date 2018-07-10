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
	

getTooltipTemplate = (data) ->
	str = """
		<div class='meeting-tooltip'>
			<div class="dx-scheduler-appointment-tooltip-title">#{data.name}</div>
			<div class='dx-scheduler-appointment-tooltip-date'>
				#{moment(data.start).tz("Asia/Shanghai").format("MMM D, h:mm A")} - #{moment(data.end).tz("Asia/Shanghai").format("MMM D, h:mm A")}
			</div>
			<div class="action">
				<div class="dx-scheduler-appointment-tooltip-buttons">
					<div class="dx-button dx-button-normal dx-widget dx-button-has-icon delete" role="button" aria-label="trash" tabindex="0">
						<div class="dx-button-content">
							<i class="dx-icon dx-icon-trash"></i>
						</div>
					</div>
					<div class="dx-button dx-button-normal dx-widget dx-button-has-text dx-state-hover edit" role="button" aria-label="打开日程" tabindex="0">
						<div class="dx-button-content">
							<span class="dx-button-text">打开日程</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	"""
	return $(str)

Template.creator_calendar.onCreated ->
	AutoForm.hooks creatorAddForm:
		onSuccess: (formType,result)->
			dxSchedulerInstance.repaint()
	,false
	AutoForm.hooks creatorEditForm:
		onSuccess: (formType,result)->
			dxSchedulerInstance.repaint()
	,false


Template.creator_calendar.onRendered ->
	Session.set("hideTooltip", false)
	self = this
	self.autorun (c)->
		object_name = Session.get("object_name")
		if Steedos.spaceId()
			url = "/api/odata/v4/#{Steedos.spaceId()}/#{object_name}"
			dxSchedulerInstance =  $("#scheduler").dxScheduler({
				dataSource: {
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
				views: ["day", "week"]
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
				groups: ["room"]
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
							url: "/api/odata/v4/#{Steedos.spaceId()}/meetingroom?$orderby=name"
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
				onAppointmentDblClick: (e) ->
					e.cancel = true	

				onCellClick: (e) ->
					cellData = e.cellData
					# debugger
					doc = {
						start: cellData.startDate
						end: cellData.endDate
						room: cellData.groups.room
					}
					
					console.log('[onCellClick]', e)
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
					Creator.odata.update("meeting",e.newData['_id'],doc)

				appointmentTooltipTemplate: (data, container) ->
					console.log('[appointmentTooltipTemplate]', data, container)
					markup = getTooltipTemplate(data);
					markup.find(".edit").dxButton({
						text: "Edit details",
						type: "default",
						onClick: () ->
							_editData(data)
					});
					return markup;
			}).dxScheduler("instance")

Template.creator_calendar.helpers Creator.helpers

Template.creator_calendar.helpers
	actions: ()->
		actions: ()->
		actions = Creator.getActions()
		actions = _.filter actions, (action)->
			if action.on == "list"
				if typeof action.visible == "function"
					return action.visible()
				else
					return action.visible
			else
				return false
		return actions

Template.creator_calendar.events 
	"click .list-action-custom": (event, template) ->
		_insertData()

		