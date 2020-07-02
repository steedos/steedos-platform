Creator.Objects.flows.actions.export = {
	label: "导出流程"
	visible: true
	on: "record"
	todo: (object_name, record_id, fields)->
		flow = Creator.getCollection(object_name).findOne(record_id)
		if flow
			window.open("/api/workflow/export/form?form=#{flow.form}", '_blank')
}