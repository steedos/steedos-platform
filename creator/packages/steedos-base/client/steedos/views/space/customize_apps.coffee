Template.customize_apps.helpers
	selector:() ->
		spaceId = Steedos.spaceId()
		selector = {
			space: spaceId
		}
		return selector

	insertButtonContent:() ->
		return t('New')

Template.customize_apps.events
	'click #add-customize-apps': (event, template) ->
		$(".customize-apps-add").click();

	'click .datatable-customize-apps tr': (event, template) ->
		dataTable = $(".datatable-customize-apps").DataTable()
		rowData = dataTable.row(event.currentTarget).data()
		doc = db.apps.findOne(rowData._id)
		Session.set "cmDoc", doc
		$(".customize-apps-edit").click()		

	'click #customize-apps-search-btn': (event, template) ->
		dataTable = $(".datatable-customize-apps").DataTable()
		selector = $("input[name='customize-apps-search-key']").val()
		dataTable.search(
			selector
		).draw();

	'keypress #customize-apps-search-key': (event, template) ->
		if event.keyCode == 13
			dataTable = $(".datatable-customize-apps").DataTable()
			selector = $("input[name='customize-apps-search-key']").val()
			console.log selector
			dataTable.search(
				selector
			).draw();