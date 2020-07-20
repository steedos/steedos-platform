Template.make_holidays_modal.onRendered ->
	# 设置dxOverlay的zIndex值，解决dxOverlay弹出窗口被modal窗口覆盖的问题
	# 比如弹出的时间、日期控件，popup控件等
	# 因modal的z-index值为2000，所以这里要比它大
	DevExpress.ui.dxOverlay.baseZIndex(2100)
Template.make_holidays_modal.onDestroyed ->
	# 还原dxOverlay原来默认的zIndex值
	DevExpress.ui.dxOverlay.baseZIndex(1500)

Template.make_holidays_modal.helpers
	schema: ->
		s = new SimpleSchema({
			makeHolidaysSelectYear: {
				type: Date,
				optional: true,
				autoform: {
					label: "指定年份",
					outFormat: 'yyyy',
					disabled: false,
					is_range: false,
					omit: false,
					readonly: false,
					afFieldInput: {
						type: "dx-date-box"
						timezoneId: "utc"
						dxDateBoxOptions:
							type: "date"
							displayFormat: "yyyy"
							dateSerializationFormat: "yyyy"
							acceptCustomValue: false
							pickerType: "calendar"
							calendarOptions:
								zoomLevel: "decade"
								minZoomLevel: "decade"
								maxZoomLevel: "decade"
					}
				}
			}
		})
		return s

Template.make_holidays_modal.events
	'click .btn-confirm': (event, t) ->
		year = AutoForm.getFormValues('makeHolidaysSelectYear').insertDoc.makeHolidaysSelectYear
		if year
			$("body").addClass("loading")
			Meteor.call 'makeHolidays', Session.get('spaceId'), moment(year).format('YYYY'),  (error, result)->
				$("body").removeClass("loading")
				Modal.hide(t)
				if result
					toastr.success("操作已成功！")
					
		else
			Modal.hide(t)
