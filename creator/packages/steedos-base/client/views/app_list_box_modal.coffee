Template.app_list_box_modal.helpers
	apps: ()->
		return Steedos.getSpaceApps()

Template.app_list_box_modal.onRendered ->
	$(".app-list-box-modal-body").css("max-height", ($(window).height()-140) + "px");

Template.app_list_box_modal.events

	'click .weui_grids .weui_grid': (event)->
		Steedos.openApp event.currentTarget.dataset.appid
		Modal.hide('app_list_box_modal'); 