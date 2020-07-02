Creator.Objects.flows.actions.import = {
	label: "导入流程"
	visible: true
	on: "list"
	todo: ()->
		Modal.show("admin_import_flow_modal");
}