Template.batch_instances.helpers
	dataFormat: (date)->
		if !date
			return ''
		return moment(date).format('YYYY-MM-DD HH:mm')

	success: (approveId)->
		return Template.instance().data.submitted.includes(approveId)