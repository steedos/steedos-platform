
Template.mobile_apps_modal.helpers
	apps: ()->
		return Creator.getVisibleApps()

	app_url: ()->
		if this?.url
			return Creator.getRelativeUrl(this.url);
		else if this._id
			return Creator.getRelativeUrl("/app/#{this._id}/");
	isActive: ()->
		if this._id == Session.get("app_id")
			return true;
		return false;

Template.mobile_apps_modal.events
	"click .app-item": (event, template) ->
		# Session.set("app_id", this.app_id)
		Modal.hide(template)

