TabularTables.steedosContactsMobileOrganizations = new Tabular.Table({
	name: "steedosContactsMobileOrganizations",
	collection: db.organizations,
	createdRow:(row,data,index)->
		row.dataset.id = data._id
	columns: [
		{
			data: "name",
			orderable: false,
			render: (val, type, doc) ->
				return """
					<div class='contacts-organizations-mobile-avatar'><i class="ion ion-android-folder"></i></div>
					<div class='contacts-organizations-mobile-name text-overflow'>#{doc.name}</div>
				"""
		},
		{
			data: "parent",
			title: "",
			orderable: false,
			visible: false
		},
		{
			data: "sort_no",
			title: "",
			orderable: true,
			visible: false
		},
		{
			data: "name",
			title: "",
			orderable: true,
			visible: false
		}

	],

	dom: "tp",
	order:[[2,"desc"],[3,"asc"]],
	extraFields: ["_id", "name", "parent", "sort_no", "space", "hidden"],
	lengthChange: false,
	pageLength: -1,
	limit: 500,
	info: false,
	searching: true,
	responsive:
		details: false
	autoWidth: false,
	changeSelector: (selector, userId) ->
		unless userId
			return {_id: -1}
		space = selector.space
		unless space
			if selector?.$and?.length > 0
				space = selector.$and.getProperty('space')[0]
		unless space
			return {_id: -1}
		space_user = db.space_users.findOne({user: userId,space:space}, {fields: {_id: 1}})
		unless space_user
			return {_id: -1}
		return selector
	pagingType: "numbers"

});