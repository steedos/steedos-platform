Template.report_settings.onRendered ->
	settings = Session.get("report_settings")
	if settings.grouping
		this.$(".cbx-grouping").prop("checked",true)
	if settings.totaling
		this.$(".cbx-totaling").prop("checked",true)
	if settings.counting
		this.$(".cbx-counting").prop("checked",true)


Template.report_settings.helpers

		 

Template.report_settings.events 

	'click .btn-settings-apply': (event, template)->
		Session.set("report_settings",{
			grouping: template.$(".cbx-grouping").is(":checked")
			totaling: template.$(".cbx-totaling").is(":checked")
			counting: template.$(".cbx-counting").is(":checked")
		})
		Modal.hide(template)
		Meteor.defer ->
			Template.creator_report.renderReport()