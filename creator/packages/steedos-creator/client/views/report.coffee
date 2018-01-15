Template.creator_report.helpers



Template.creator_report.onRendered ->
	DevExpress.localization.locale("zh")
	$ ->
		report_id = Session.get "report_id"
		unless report_id
			return
		reportObject = Creator.Reports[report_id]
		objectName = reportObject.object_name
		objectFields = Creator.getObject(objectName).fields
		Meteor.call "report_data",{object_name: objectName, space:Session.get("spaceId")}, (error, result)->
			if error
				console.error('report_data method error:', error)
				return
			
			reportFields = []
			reportData = result
			_.each reportObject.rows, (row)->
				rowField = objectFields[row]
				caption = rowField.label
				unless caption
					caption = objectName + "_" + row
				reportFields.push 
					caption: caption
					width: 100
					dataField: row
					area: 'row'
			_.each reportObject.columns, (column)->
				columnField = objectFields[column]
				caption = columnField.label
				unless caption
					caption = objectName + "_" + column
				reportFields.push 
					caption: caption
					width: 100
					dataField: column
					area: 'column'
			_.each reportObject.values, (value)->
				unless value.field
					return
				unless value.operation
					return
				valueField = objectFields[value.field]
				caption = value.label
				unless caption
					caption = valueField.label
				unless caption
					caption = objectName + "_" + value.field
				reportFields.push 
					caption: caption
					dataField: value.field
					# dataType: valueField.type
					summaryType: value.operation
					area: 'data'

			pivotGridChart = $('#pivotgrid-chart').dxChart(
				commonSeriesSettings: type: 'bar'
				tooltip:
					enabled: true
				size: height: 300
				adaptiveLayout: width: 450).dxChart('instance')
			pivotGrid = $('#pivotgrid').dxPivotGrid(
				allowSortingBySummary: true
				allowFiltering: true
				showBorders: true
				showColumnGrandTotals: true
				showRowGrandTotals: true
				showRowTotals: true
				showColumnTotals: true
				fieldChooser:
					enabled: true
					height: 600
				dataSource:
					fields: reportFields
					# fields: [
					# 	# {
					# 	# 	caption: 'Region'
					# 	# 	width: 320
					# 	# 	dataField: 'region'
					# 	# 	area: 'row'
					# 	# 	sortBySummaryField: 'Total'
					# 	# }
					# 	# {
					# 	# 	caption: 'City'
					# 	# 	dataField: 'city'
					# 	# 	width: 150
					# 	# 	area: 'row'
					# 	# }
					# 	{
					# 		dataField: 'date'
					# 		# dataType: 'date'
					# 		area: 'column'
					# 	}
					# 	# {
					# 	# 	groupName: 'date'
					# 	# 	groupInterval: 'month'
					# 	# 	visible: false
					# 	# }
					# 	{
					# 		caption: 'Total'
					# 		dataField: 'amount'
					# 		dataType: 'number'
					# 		summaryType: 'count'
					# 		# format: 'currency'
					# 		area: 'data'
					# 	}
					# ]
					store: reportData).dxPivotGrid('instance')
			pivotGrid.bindChart pivotGridChart,
				dataFieldsDisplayMode: 'splitPanes'
				alternateDataFields: false
			return
