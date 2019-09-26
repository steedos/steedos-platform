Steedos.subs["InstanceTabular"] = new SubsManager()


_handleListFields = (fields) ->
	ins_fields = new Array();

	fields?.forEach (f)->
		if f.type == 'table'
			console.log 'ignore opinion field in table'
		else if f.type == 'section'
			f?.fields?.forEach (f1)->
				ins_fields.push f1
		else
			ins_fields.push f

	return ins_fields


updateTabularTitle = ()->

# 如果columns有加减，请修改Template.instance_list._tableColumns 函数
instancesListTableTabular = (flowId, fields)->
	options = {
		name: "instances",
		collection: db.instances,
		pub: "instance_tabular",
		onUnload: ()->
			Meteor.setTimeout(Template.instance_list._tableColumns, 150)

		drawCallback: (settings)->
			emptyTd = $(".dataTables_empty")
			if emptyTd.length
				emptyTd[0].colSpan = "6"
			if !Steedos.isMobile() && !Steedos.isPad()
				Meteor.setTimeout(Template.instance_list._tableColumns, 150)
				$(".instance-list").scrollTop(0).ready ->
					$(".instance-list").perfectScrollbar("update")
			else
				$(".instance-list").scrollTop(0)

			title = t "pager_input_hint"
			ellipsisLink = settings.oInstance.parent().find('.paging_numbers .pagination .disabled a')
			ellipsisLink.attr("title", title).css("cursor", "pointer").click ->
				if !$(this).find('input').length
					input = $('<input class="paginate_input form-control input-sm" type="text" style="border: none; padding:0 2px;"/>')
					if Steedos.isMobile()
						input.css({
							width:"52px"
							height: "20px"
						})
					else
						input.css({
							width:"52px"
							height: "16px"
						})
					input.attr("title", title).attr("placeholder", title)
					$(this).empty().append input
					goPage = (index)->
						if index > 0
							pages = Math.ceil(settings.fnRecordsDisplay() / settings._iDisplayLength)
							if index > pages
								# 页码超出索引时跳转到最后一页
								index = pages
							index--
							settings.oInstance.DataTable().page(index).draw('page')
					input.blur (e)->
						currentPage = $(this).val()
						goPage currentPage
						$(this).parent().html '...'
					input.keydown (e)->
						if(e.keyCode.toString() == "13")
							currentPage = $(this).val()
							goPage currentPage

		createdRow: (row, data, dataIndex) ->
			if Meteor.isClient
				if data._id == FlowRouter.current().params.instanceId
					row.setAttribute("class", "selected")
		columns: [
			{
				data: "_id",
				orderable: false
				render: (val, type, doc) ->
					modifiedString = moment(doc.modified).format('YYYY-MM-DD');

					modified = doc.modified
					if Session.get("box") == 'inbox' && doc.state != 'draft'
						modified = doc.start_date || doc.modified

					if Session.get("box") == 'outbox' || Session.get("box") == 'monitor'
						modified = doc.submit_date || doc.submit_date

					modifiedFromNow = Steedos.momentReactiveFromNow(modified);
					flow_name = doc.flow_name
					cc_view = "";
					step_current_name_view = "";
					# 当前用户在cc user中，但是不在inbox users时才显示'传阅'文字
					if doc.is_cc && !doc.inbox_users?.includes(Meteor.userId()) && Session.get("box") == 'inbox'
						cc_view = "<label class='cc-label'>(" + TAPi18n.__("instance_cc_title") + ")</label> "
						step_current_name_view = "<div class='flow-name'>#{flow_name}<span>(#{doc.current_step_name})</span></div>"
					else
						if Session.get("box") != 'draft' && doc.current_step_name
							step_current_name_view = "<div class='flow-name'>#{flow_name}<span>(#{doc.current_step_name})</span></div>"
						else
							step_current_name_view = "<div class='flow-name'>#{flow_name}</div>"

					agent_view = "";
					if doc.agent_user_name && Session.get("box") == 'inbox'
						agent_view = "<label class='cc-label'>(" + TAPi18n.__('process_delegation_rules_description', {userName: doc.agent_user_name}) + ")</label>"

					unread = ''

					if Session.get("box") == 'inbox' && doc.is_read == false
						unread = '<i class="ion ion-record unread"></i>'
					else if Session.get("box") == 'monitor' && doc.is_hidden == true
						unread = '<i class="fa fa-lock"></i>'

					priorityIcon = ""
					priorityIconClass = ""
					priorityValue = doc.values?.priority
					switch priorityValue
						when "特急"
							priorityIconClass = "danger"
						when "紧急"
							priorityIconClass = "warning"
						when "办文"
							priorityIconClass = "muted"
					if priorityIconClass
						instanceNamePriorityClass = "color-priority color-priority-#{priorityIconClass}"

					return """
								<div class='instance-read-bar'>#{unread}</div>
								<div class='instance-name #{instanceNamePriorityClass}'>#{doc.name}#{cc_view}#{agent_view}
									<span>#{doc.applicant_name}</span>
								</div>
								<div class='instance-detail'>#{step_current_name_view}
									<span class='instance-modified' title='#{modifiedString}'>#{modifiedFromNow}</span>
								</div>
							"""
			},
			{
				data: "applicant_organization_name",
				title: t("instances_applicant_organization_name"),
				visible: false,
			},
			{
				data: "name",
				title: t("instances_name"),
				render: (val, type, doc) ->
					cc_view = "";
					step_current_name_view = "";
					# 当前用户在cc user中，但是不在inbox users时才显示'传阅'文字
					if doc.is_cc && !doc.inbox_users?.includes(Meteor.userId()) && Session.get("box") == 'inbox'
						cc_view = "<label class='cc-label'>(" + TAPi18n.__("instance_cc_title") + ")</label> "

					agent_view = "";
					if doc.agent_user_name
						agent_view = "<label class='cc-label'>(" + TAPi18n.__('process_delegation_rules_description', {userName: doc.agent_user_name}) + ")</label>"

					unread = ''

					if Session.get("box") == 'inbox' && doc.is_read == false
						unread = '<i class="ion ion-record unread"></i>'
					else if Session.get("box") == 'monitor' && doc.is_hidden == true
						unread = '<i class="fa fa-lock"></i>'

					priorityIconClass = ""
					priorityValue = doc.values?.priority
					switch priorityValue
						when "特急"
							priorityIconClass = "danger"
						when "紧急"
							priorityIconClass = "warning"
						when "办文"
							priorityIconClass = "muted"
					if priorityIconClass
						instanceNamePriorityClass = "color-priority color-priority-#{priorityIconClass}"
					return """
							<div class='instance-read-bar'>#{unread}</div>
							<div class='instance-name #{instanceNamePriorityClass}'>#{doc.name}#{cc_view}#{agent_view}</div>
						"""
				visible: false,
				orderable: false
			},
			{
				data: "applicant_name",
				title: t("instances_applicant_name"),
				visible: false,
				orderable: false
			},
			{
				data: "submit_date",
				title: t("instances_submit_date"),
				render: (val, type, doc) ->
					if doc.submit_date
						return moment(doc.submit_date).format('YYYY-MM-DD HH:mm');
				,
				visible: false,
				orderable: true
			},
			{
				data: "flow_name",
				title: t("instances_flow"),
				visible: false,
				orderable: false
			},
			{
				data: "current_step_name",
				title: t("instances_step_current_name"),
				render: (val, type, doc) ->
					if doc.state == "completed"
						judge = doc.final_decision || "approved"

					step_current_name = doc.current_step_name || ''

					cc_tag = ''

					if doc.cc_count > 0
						cc_tag = TAPi18n.__('cc_tag')

					return """
						<div class="step-current-state #{judge}">#{step_current_name}#{cc_tag}</div>
					"""
				visible: false,
				orderable: false
			},
			{
				data: "modified",
				title: t("instances_modified"),
				render: (val, type, doc) ->
					return moment(doc.modified).format('YYYY-MM-DD HH:mm');
				,
				visible: false,
				orderable: true
			},
			{
				data: "start_date",
				title: t("instances_start_date"),
				render: (val, type, doc) ->
					if doc.start_date
						return moment(doc.start_date).format('YYYY-MM-DD HH:mm');
				,
				visible: false,
				orderable: true
			},
			{
				data: "my_finish_date",
				render: (val, type, doc) ->
					if doc.my_finish_date
						return moment(doc.my_finish_date).format('YYYY-MM-DD HH:mm');
				,
				visible: false,
				orderable: true
			},
			{
				data: "modified",
				visible: false
			},
			{
				data: "keywords",
				visible: false
			},
			{
				data: "is_archived",
				render: (val, type, doc) ->
					if doc?.values?.record_need && doc.values.record_need == "true"
						if doc?.is_archived
							return t("YES")
						return t("NO")
				visible: false
				orderable: false
			}
		],
		dom: do ->
			# 手机上不显示一页显示多少条记录选项
			if Steedos.isMobile()
				'tp'
			else
				'tpl'
		order: [[4, "desc"]],
		extraFields: ["form", "flow", "inbox_users", "state", "space", "applicant", "form_version",
			"flow_version", "is_cc", "cc_count", "is_read", "current_step_name", "values", "keywords", "final_decision", "flow_name", "is_hidden", "agent_user_name"],
		lengthChange: true,
		lengthMenu: [10,15,20,25,50,100],
		pageLength: 10,
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
			space_user = db.space_users.findOne({user: userId, space: space}, {fields: {_id: 1}})
			unless space_user
				return {_id: -1}
			return selector
		pagingType: "numbers"

	}

	if flowId
		key = "instanceFlow" + flowId

		options.name = key

		TabularTables.instances.fields = fields

		ins_fields = _handleListFields TabularTables.instances.fields

		ins_fields.forEach (f)->
			if f.type != 'table' && f.is_list_display
				options.columns.push
					data: (f.name || f.code),
					title: t(f.name || f.code),
					visible: false,
					orderable: false
					render: (val, type, doc) ->

						values = doc.values || {}

						value = values[f.code]

						switch f.type
							when 'user'
								value = value?.name
							when 'group'
								value = value?.fullname
							when 'date'
								if value
									value = moment(value).format('YYYY-MM-DD')
							when 'dateTime'
								if value
									value = moment(value).format('YYYY-MM-DD HH:mm')
							when 'checkbox'
								if value == true || value == 'true'
									value = TAPi18n.__("form_field_checkbox_yes");
								else
									value = TAPi18n.__("form_field_checkbox_no");
							when 'odata'
								if value
									value = value['@label']

						return value


	return options;

Meteor.startup ()->
	TabularTables.instances = new Tabular.Table instancesListTableTabular()


GetBoxInstancesTabularOptions = (box, flowId, fields)->
	key = "instanceFlow" + box + flowId
	if box == "inbox"
		options = _get_inbox_instances_tabular_options(flowId, fields)
	else if box == "outbox"
		options = _get_outbox_instances_tabular_options(flowId, fields)
	else
		options = instancesListTableTabular(flowId, fields)
		if !flowId
			options.name = "inbox_instances"
	if flowId
		options.name = key
	return options



_get_inbox_instances_tabular_options = (flowId, fields)->
	options = instancesListTableTabular(flowId, fields)

	if !flowId
		options.name = "inbox_instances"

	options.order = [[8, "desc"]]
	options.filteredRecordIds = (table, selector, sort, skip, limit, old_filteredRecordIds, userId, findOptions)->
		aggregate_operation = [
			{
				$match: selector
			},
			{
				$project: {
					name: 1,
					"_approve": '$traces.approves'
				}
			},
			{
				$unwind: "$_approve"
			},
			{
				$unwind: "$_approve"
			},
			{
				$match: {
					'_approve.is_finished': false
					'_approve.handler': userId,
				}
			}
		]
		if sort and sort.length > 0
			s1 = sort[0]
			s1_0 = s1[0]
			s1_1 = s1[1]
			if s1_0 == 'start_date'

				findOptions.sort = [['modified', s1_1]]

				aggregate_operation.push $group: {_id: "$_id", "approve_start_date": {$first: "$_approve.start_date"}}

				ag_sort = 'approve_start_date': if s1_1 == 'asc' then 1 else -1

				aggregate_operation.push $sort: ag_sort
				aggregate_operation.push $skip: skip
				aggregate_operation.push $limit: limit
				filteredRecordIds = new Array()

				aggregate = (table, aggregate_operation, filteredRecordIds, cb) ->
					table.collection.rawCollection().aggregate(aggregate_operation).toArray (err, data) ->
						if err
							throw new Error(err)
						data.forEach (doc) ->
							filteredRecordIds.push doc._id
							return
						if cb
							cb()
						return
					return

				async_aggregate = Meteor.wrapAsync(aggregate)

				async_aggregate table, aggregate_operation, filteredRecordIds

				return filteredRecordIds.uniq()
			else
				return old_filteredRecordIds

	return options

Meteor.startup ()->
	TabularTables.inbox_instances = new Tabular.Table GetBoxInstancesTabularOptions("inbox")


_get_outbox_instances_tabular_options = (flowId, fields)->
	options = instancesListTableTabular(flowId, fields)

	if !flowId
		options.name = "outbox_instances"

	options.order = [[9, "desc"]]
	options.filteredRecordIds = (table, selector, sort, skip, limit, old_filteredRecordIds, userId, findOptions)->
		aggregate_operation = [
			{
				$match: selector
			},
			{
				$project: {
					name: 1,
					"_approve": '$traces.approves'
				}
			},
			{
				$unwind: "$_approve"
			},
			{
				$unwind: "$_approve"
			},
			{
				$match: {
					'_approve.is_finished': true
					$or: [{'_approve.handler': userId},{'_approve.user': userId}]
				}
			}
		]
		if sort and sort.length > 0
			s1 = sort[0]
			s1_0 = s1[0]
			s1_1 = s1[1]
			if s1_0 == 'my_finish_date'

				findOptions.sort = [['modified', s1_1]]

				aggregate_operation.push $group: {_id: "$_id", "approve_finish_date": {$last: "$_approve.finish_date"}}

				ag_sort = 'approve_finish_date': if s1_1 == 'asc' then 1 else -1

				aggregate_operation.push $sort: ag_sort
				aggregate_operation.push $skip: skip
				aggregate_operation.push $limit: limit
				filteredRecordIds = new Array()

				aggregate = (table, aggregate_operation, filteredRecordIds, cb) ->
					table.collection.rawCollection().aggregate(aggregate_operation).toArray (err, data) ->
						if err
							throw new Error(err)
						data.forEach (doc) ->
							filteredRecordIds.push doc._id
							return
						if cb
							cb()
						return
					return

				async_aggregate = Meteor.wrapAsync(aggregate)

				async_aggregate table, aggregate_operation, filteredRecordIds

				return filteredRecordIds.uniq()
			else
				return old_filteredRecordIds

	return options

Meteor.startup ()->
	TabularTables.outbox_instances = new Tabular.Table GetBoxInstancesTabularOptions("outbox")

if Meteor.isClient
	TabularTables.flowInstances = new ReactiveVar()

Meteor.startup ()->
	Tracker.autorun (c) ->
		if Meteor.isClient && !Steedos.isMobile()
			if Session.get("flowId") && Session.get("box") != 'draft'
				Meteor.call "newInstancesListTabular", Session.get("box"), Session.get("flowId"), (error, result) ->
					newInstancesListTabular Session.get("box"), Session.get("flowId"), result
					Template.instance_list._changeOrder()


newInstancesListTabular = (box, flowId, fields)->
	if !fields
		flow = db.flows.findOne({_id: flowId}, {fields: {form: 1}})
		fields = db.forms.findOne({ _id: flow?.form }, { fields: { 'current.fields': 1 } })?.current?.fields

	fields = _handleListFields fields

	if fields?.filterProperty("is_list_display", true)?.length > 0
		key = "instanceFlow" + box + flowId
		if Meteor.isClient
			TabularTables.flowInstances.set(new Tabular.Table GetBoxInstancesTabularOptions(box, flowId, fields))
		else
			new Tabular.Table GetBoxInstancesTabularOptions(box, flowId, fields)
		console.log "new TabularTables ", key

if Meteor.isServer
	Meteor.methods
		newInstancesListTabular: (box, flowId)->
			newInstancesListTabular(box, flowId)

			flow = db.flows.findOne({_id: flowId}, {fields: {form: 1}})
			fields = db.forms.findOne({ _id: flow?.form }, { fields: { 'current.fields': 1 } })?.current?.fields
			return fields


