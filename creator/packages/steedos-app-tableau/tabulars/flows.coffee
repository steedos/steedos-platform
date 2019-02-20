Meteor.startup ()->
	new Tabular.Table
		name: "tableau_flow_list",
		collection: db.flows,
		columns: [
			{data: "name", title: "name"},
	#		{data: "state", title: "state"},
			{
				data: "",
				title: "",
				orderable: false,
				width: '1px',
				render: (val, type, doc) ->

					tableauUrl = CreatorTableau.get_workflow_instance_by_flow_connector doc.space,doc._id

					return '<button type="button" class="btn btn-xs btn-default" id="copyTableauUrl" data-clipboard-text="'+ tableauUrl + '">'+ t("flows_btn_copylink_title") + '</button>'
			}
		]
		extraFields: ["space"]
		lengthChange: false
		pageLength: 10
		info: false
		searching: true
		autoWidth: false