Template.tableau_flow_list.helpers
	selector: ->
		return {space: Session.get("spaceId"), is_deleted: false};

Template.tableau_flow_list.events
	'click .btn-back-tableau-info': ()->
		FlowRouter.go '/tableau/info'

Template.tableau_flow_list.onRendered ->
	this.copyTableauUrlClipboard = new Clipboard('#copyTableauUrl');
	this.copyTableauUrlClipboard.on 'success', (e) ->
		toastr.success(t("instance_readonly_view_url_copy_success"))
		e.clearSelection()

Template.tableau_flow_list.onDestroyed ->
	this.copyTableauUrlClipboard.destroy();