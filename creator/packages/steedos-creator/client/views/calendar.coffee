DevExpress.config

Template.creator_calendar.onRendered ->
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
					select: ["_id", "name", "start", "end"]
				}
				views: ["day", "week", "timelineDay"]
				currentView: "day"
				# currentDate: new Date()
				firstDayOfWeek: 0
				startDayHour: 0
				endDayHour: 23
				textExpr: "name"
				endDateExpr: "end"
				startDateExpr: "start"
				timeZone: "Asia/Shanghai"
				# showAllDayPanel: true
				height: 600
				# groups: ["room"]
				crossScrollingEnabled: true
				cellDuration: 30
				editing: { 
					allowAdding: true
				},
				# appointmentTemplate: (data)->
				# 	console.log('[appointmentTemplate]', data)

				# 	return $("<div class='showtime-preview'>sasasasa</div>"); 
				# resources: [{
				# 	fieldExpr: "room",
				# 	dataSource: {
				# 		store: 
				# 			type: "odata"
				# 			version: 4
				# 			url: "/api/odata/v4/#{Steedos.spaceId()}/meetingroom"
				# 			withCredentials: false
				# 			beforeSend: (request) ->
				# 				request.headers['X-User-Id'] = Meteor.userId()
				# 				request.headers['X-Space-Id'] = Steedos.spaceId()
				# 				request.headers['X-Auth-Token'] = Accounts._storedLoginToken()
				# 			errorHandler: (error) ->
				# 				if error.httpStatus == 404 || error.httpStatus == 400
				# 					error.message = t "creator_odata_api_not_found"
				# 				else if error.httpStatus == 401
				# 					error.message = t "creator_odata_unexpected_character"
				# 				else if error.httpStatus == 403
				# 					error.message = t "creator_odata_user_privileges"
				# 				else if error.httpStatus == 500
				# 					if error.message == "Unexpected character at 106" or error.message == 'Unexpected character at 374'
				# 						error.message = t "creator_odata_unexpected_character"
				# 				toastr.error(error.message)
				# 		select: ["_id", "name"]
				# 	}
				# }]
			})



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
	"click #event": (event, template) -> 
		