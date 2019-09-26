Template.admin_process_delegation_rules.helpers
	selector: ()->
		spaceId = Steedos.spaceId()
		selector = {
			space: spaceId
			from: Meteor.userId()
		}
		return selector

	insertButtonContent: ()->
		return t("Create")

	showCreateBtn: ()->
		return !db.process_delegation_rules.find({space: Steedos.spaceId(), from: Meteor.userId()}).count()

Template.admin_process_delegation_rules.rendered = ->
	table = @$('.dataTable').DataTable();
	this.$("table").wrap("<div class = 'table-responsive'></div>")

Template.admin_process_delegation_rules.events
	'click #addProcessDelegationRules': (event) ->
		Session.set "cmDoc",{}
		$(".process-delegation-rules-insert").click()

	'click .datatable-process-delegation-rules tr': (event) ->
		dataTable = $(event.target).closest('table').DataTable()
		rowData = dataTable.row(event.currentTarget).data()
		if (rowData)
			Session.set 'cmDoc', rowData
			$('.process-delegation-rules-edit').click()

	'click #process-delegation-rules-search-btn': (event) ->
		dataTable = $(".datatable-process-delegation-rules").DataTable()
		selector = $("input[name='process-delegation-rules-search-key']").val()
		dataTable.search(
			selector
		).draw()

	'keypress #process-delegation-rules-search-key': (event, template) ->
		if event.keyCode == 13
			dataTable = $(".datatable-process-delegation-rules").DataTable()
			selector = $("input[name='process-delegation-rules-search-key']").val()
			dataTable.search(
				selector
			).draw()
