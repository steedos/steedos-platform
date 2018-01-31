Template.report_settings.onRendered ->
	settings = Template.instance().data.report_settings.get()
	if settings.grouping
		this.$(".cbx-grouping").prop("checked",true)
	if settings.totaling
		this.$(".cbx-totaling").prop("checked",true)
	if settings.counting
		this.$(".cbx-counting").prop("checked",true)


Template.report_settings.helpers
	showGroupingMenu: ->
		options = Template.instance().data.options
		if _.isEmpty options
			return true
		return options.indexOf("grouping") > -1
	
	showTotalingMenu: ->
		options = Template.instance().data.options
		if _.isEmpty options
			return true
		return options.indexOf("totaling") > -1
	
	showCountingMenu: ->
		options = Template.instance().data.options
		if _.isEmpty options
			return true
		return options.indexOf("counting") > -1

		 

Template.report_settings.events 

	'click .btn-settings-apply': (event, template)->
		settings = template.data.report_settings
		settings.set {
			grouping: template.$(".cbx-grouping").is(":checked")
			totaling: template.$(".cbx-totaling").is(":checked")
			counting: template.$(".cbx-counting").is(":checked")
		}
		Modal.hide(template)
		Meteor.defer ->
			Template.creator_report.renderReport()