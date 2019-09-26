TabularTables.steedosContactsOrganizations = new Tabular.Table({
	name: "steedosContactsOrganizations",
	collection: db.space_users,
	createdRow:(row,data,index)->
		row.dataset.id = data._id
		row.dataset.user = data.user
		if Steedos.isSpaceAdmin() || (Session.get('contacts_is_org_admin') && !Session.get("contact_list_search"))
			$(row).addClass("drag-source").attr "draggable",true
		# else
		# 	hidden_users = SteedosContacts.getHiddenUsers(Session.get("spaceId"))
		# 	if hidden_users.indexOf(data.user) > -1
		# 		$(row).addClass("hidden-user")

	columns: [
		{
			data: "name",
			orderable: false,
			render: (val, type, doc) ->
				colorClass = if !doc.user_accepted then 'text-muted' else ''
				if doc.invite_state == 'pending'
					colorClass = 'invite-pending'
				else if doc.invite_state == 'refused'
					colorClass = 'invite-refused'
				return "<div class='contacts-name #{colorClass} nowrap'>" + doc.name + "</div>"
		},
		{
			data: "mobile",
			orderable: false,
			render: (val, type, doc) ->
				colorClass = if !doc.user_accepted then 'text-muted' else ''
				if doc.invite_state == 'pending'
					colorClass = 'invite-pending'
				else if doc.invite_state == 'refused'
					colorClass = 'invite-refused'
				return "<div class='contacts-mobile #{colorClass} nowrap'>" + (doc.mobile || "") + "</div>"
		},
		{
			data: "work_phone",
			orderable: false,
			render: (val, type, doc) ->
				colorClass = if !doc.user_accepted then 'text-muted' else ''
				if doc.invite_state == 'pending'
					colorClass = 'invite-pending'
				else if doc.invite_state == 'refused'
					colorClass = 'invite-refused'
				return "<div class='contacts-work_phone #{colorClass} nowrap'>" + (doc.work_phone || "") + "</div>"
		},
		{
			data: "company",
			orderable: false,
			render: (val, type, doc) ->
				colorClass = if !doc.user_accepted then 'text-muted' else ''
				if doc.invite_state == 'pending'
					colorClass = 'invite-pending'
				else if doc.invite_state == 'refused'
					colorClass = 'invite-refused'
				return "<div class='contacts-position #{colorClass} nowrap'>" + (doc.company || "") + "</div>"
		},
		{
			data: "position",
			orderable: false,
			render: (val, type, doc) ->
				colorClass = if !doc.user_accepted then 'text-muted' else ''
				if doc.invite_state == 'pending'
					colorClass = 'invite-pending'
				else if doc.invite_state == 'refused'
					colorClass = 'invite-refused'
				return "<div class='contacts-position #{colorClass} nowrap'>" + (doc.position || "") + "</div>"
		},
		{
			data: "email",
			orderable: false,
			render: (val, type, doc) ->
				colorClass = if !doc.user_accepted then 'text-muted' else ''
				if doc.invite_state == 'pending'
					colorClass = 'invite-pending'
				else if doc.invite_state == 'refused'
					colorClass = 'invite-refused'
				return "<div class='contacts-email #{colorClass} nowrap'>" + (doc.email || "") + "</div>"
		},
		{
			title: "",
			orderable: false,
			width: "20px",
			render: (val, type, doc) ->
				# debugger
				if Steedos.isSpaceAdmin()
					modifyPassword = """
						<li>
							<a data-id="#{doc._id}" data-user="#{doc.user}" class="contacts-tableau-modify-password">
								#{t("contacts_tableau_modify_password")}
							</a>
						</li>
					"""
				else
					modifyPassword = ""


				if Steedos.isSpaceAdmin() || Session.get('contacts_is_org_admin')
					if doc.invite_state == "pending" or doc.invite_state == "refused"
						html = """
							<div class="edit-person">
								<div class="btn-group">
									<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
										<span class="ion ion-android-more-vertical"></span>
									</button>
									<ul class="dropdown-menu dropdown-menu-right" role="menu">
										<li>
											<a data-id="#{doc._id}" data-user="#{doc.user}" class="contacts-tableau-delete-user">
												#{t("contacts_delete")}
											</a>
										</li>
									</ul>
								</div>
							</div>

						"""
					else
						html = """
							<div class="edit-person">
								<div class="btn-group">
									<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
										<span class="ion ion-android-more-vertical"></span>
									</button>
									<ul class="dropdown-menu dropdown-menu-right" role="menu">
										<li>
											<a data-id="#{doc._id}" data-user="#{doc.user}" class="contacts-tableau-edit-user">
												#{t("contacts_edit")}
											</a>
										</li>
										<li>
											<a data-id="#{doc._id}" data-user="#{doc.user}" class="contacts-tableau-modify-username">
												#{t("contacts_tableau_modify_username")}
											</a>
										</li>
										#{modifyPassword}
										<li>
											<a data-id="#{doc._id}" data-user="#{doc.user}" class="contacts-tableau-delete-user">
												#{t("contacts_delete")}
											</a>
										</li>
									</ul>
								</div>
							</div>
						"""
				else
					html = """
						<div class="edit-person"></div>
					"""
				return html
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
	order:[[7,"desc"],[8,"asc"]],
	extraFields: ["_id", "name", "email", "organizations", "sort_no", "user_accepted", "user", "organization", "invite_state"],
	lengthChange: false,
	pageLength: 15,
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