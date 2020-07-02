TabularTables.steedosContactsMobileUsers = new Tabular.Table({
	name: "steedosContactsMobileUsers",
	collection: db.space_users,
	createdRow:(row,data,index)->
		row.dataset.id = data._id
	columns: [
		{
			data: "name",
			orderable: false,
			render: (val, type, doc) ->
				colorClass = if !doc.user_accepted then 'text-muted' else ''
				avatarURL = Steedos.absoluteUrl("avatar/#{doc.user}");
				return """
					<div class='contacts-users-mobile-avatar'><img src="#{avatarURL}" class="user-image" /></div>
					<div class='contacts-users-mobile-name #{colorClass} text-overflow'>#{doc.name}</div>
				"""
		},
		{
			data: "mobile",
			orderable: false,
			visible: false
		},
		{
			data: "work_phone",
			orderable: false,
			visible: false
		},
		{
			data: "email",
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
	order:[[4,"desc"],[5,"asc"]],
	extraFields: ["_id", "name", "email", "organizations", "sort_no", "user_accepted", "user", "organization", "space"],
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