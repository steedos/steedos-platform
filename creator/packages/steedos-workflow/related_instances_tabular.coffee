Meteor.startup ()->
	TabularTables.related_instances_tabular = new Tabular.Table
		name: "related_instances_tabular"
		collection: db.instances
		columns: [
			{
				data: "_id",
				title: '<input type="checkbox" name="reverse" id="reverse">',
				orderable: false,
				width: '1px',
				render: (val, type, doc) ->
					input = '<input type="checkbox" class="related-instances-list-checkbox" name="related_instances_ids" id="related_instances_ids" value="' + doc._id + '"'

					if TabularTables.related_instances_tabular.related_instances?.includes(doc._id)
						input += " checked "

					input += ">"
					return input
			},
			{
				data: "name",
				orderable: false,
				width: '45%',
				render: (val, type, doc) ->
					href = '';
					if Meteor.isClient && (Steedos.isMobile() || Steedos.isCordova())
						href = ''

					absolute = false

					if Meteor.isServer
						absolute = this.absolute
					if absolute
						href = Meteor.absoluteUrl("workflow/space/"+doc.space+"/view/readonly/" + doc._id + '?hide_traces=0')
					else
						href = Steedos.absoluteUrl("workflow/space/"+doc.space+"/view/readonly/" + doc._id + '?hide_traces=0')
					return "<a data-id='#{doc._id}' target='_blank' href='"+href+"'>" + doc.name + "</a>"
			},
			{
				data: "applicant_name",
				title: t("instances_applicant_name"),
				orderable: false
			},
			{
				data: "flow_name",
				title: t("instances_flow"),
				orderable: false
			},
			{
				data: "current_step_name",
				title: t("instances_flow"),
				render: (val, type, doc) ->
					if doc.state == "completed"
						judge = doc.final_decision || "approved"

					step_current_name = doc.current_step_name || ''

					return """
							<div class="step-current-state #{judge}">#{step_current_name}</div>
						"""
			}
		]

		dom: "tp",
		lengthChange: false,
		extraFields: ["state", "final_decision", "space", "keywords"],
		pageLength: 10,
		info: false,
		searching: true,
		responsive:
			details: false
		autoWidth: false,
		changeSelector: (selector, userId) ->
			unless userId
				return {_id: -1}
			#可关联的文件可以跨工作区
			# _.extend selector, {
			# 	$or: [{submitter: userId}, {applicant: userId}, {inbox_users: userId}, {outbox_users: userId},
			# 		{cc_users: userId}]
			# }
			space = selector.space
			delete selector.space
			selector.$or = [{ space: space }, {submitter: userId}, {applicant: userId}, {inbox_users: userId}, {outbox_users: userId},
					{cc_users: userId}]
			return selector