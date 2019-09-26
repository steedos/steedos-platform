Template.tableau_introduction_modal.onCreated ->

	this.copyTableauUrlClipboard = new Clipboard('#copyTableauUrl');
	this.copyTableauUrlClipboard.on 'success', (e) ->
		toastr.success(t("instance_readonly_view_url_copy_success"))
		e.clearSelection()

Template.tableau_introduction_modal.onRendered ->

Template.tableau_introduction_modal.helpers

	tableauUrl: ()->
		return SteedosTableau.get_workflow_instance_by_flow_connector(Session.get("spaceId"), Session.get("flowId"))

Template.tableau_introduction_modal.events
	'click #copyTableauUrl': ()->
		if !Steedos.isPaidSpace()
			toastr.info("标准版只能统计一个月内的数据")

Template.tableau_introduction_modal.onDestroyed ->
	Session.set "inbox_flow_id", undefined
	this.copyTableauUrlClipboard.destroy();