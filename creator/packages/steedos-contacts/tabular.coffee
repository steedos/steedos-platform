TabularTables.contacts = new Tabular.Table({
	name: "contacts",
	collection: db.space_users,
	columns: [
		{
			data: "_id",
			title: '<input type="checkbox" name="reverse" id="reverse">',
			orderable: false,
			width: '30px',
			render: (val, type, doc) ->
				input = '<input type="checkbox" class="contacts-list-checkbox" name="contacts_ids" id="contacts_ids" value="' + doc._id + '" data-name="' + doc.name + '" data-email="' + doc.email + '"'

				if TabularTables.contacts.customData?.defaultValues?.getProperty("email").includes(doc.email)
					input += " checked "

				input += ">"
				return input
		},
		{
			data: "name",
			orderable: false,
			render: (val, type, doc) ->
				return "<div class='contacts-name contacts-info nowrap' data-id='#{doc._id}'>" + doc.name + "</div>"
		},
		{
			data: "email",
			orderable: false,
			render: (val, type, doc) ->
				return "<div class='contacts-email contacts-info nowrap' data-id='#{doc._id}'>" + (doc.email || "") + "</div>"
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

#select:
#  style: 'single'
	dom: "tp",
	order:[[3,"desc"],[4,"asc"]],
	extraFields: ["_id", "name", "email", "sort_no", "organizations", "user"],
	lengthChange: false,
	pageLength: 50,
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

#scrollY:        '400px',
#scrollCollapse: true,
	pagingType: "numbers"

});
