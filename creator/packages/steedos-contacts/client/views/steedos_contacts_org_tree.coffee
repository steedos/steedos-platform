editMenu = (admins, userId, organizationId) ->
	if Steedos.isSpaceAdmin() or _.indexOf(admins, userId) > -1
		html = """
			<div class="pull-right edit-menu">
				<div class="btn-group">
					<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
						<span class="ion ion-android-more-vertical"></span>
					</button>
					<ul class="dropdown-menu dropdown-menu-right" role="menu">
						<li><a data-orgid="#{organizationId}" id="steedos_contacts_org_tree_add_btn">#{t 'add_sub_department'}</a></li>
						<li><a data-orgid="#{organizationId}" id="steedos_contacts_org_tree_edit_btn">#{t 'edit_department'}</a></li>
						<li><a data-orgid="#{organizationId}" id="steedos_contacts_org_tree_remove_btn">#{t 'delete_department'}</a></li>
					</ul>
				</div>
			</div>
		"""
	else
		html = ""
	return html


addEditMenu = ->
	unless $(".jstree-wholerow-clicked").hasClass("added-edit-menu") and $(".jstree-wholerow-clicked").length
		$(".jstree-wholerow-clicked").addClass("added-edit-menu")
		admins = []
		organizationId = $(".jstree-wholerow-clicked").closest("li").attr("id")
		userId = Meteor.userId()
		$(".jstree-wholerow-clicked").parents("li").each ->
			admins = $(this).data("admins")?.split(",").concat(admins)

		html = editMenu(admins, userId, organizationId)

		$(".jstree-wholerow-clicked").after(html)


Template.steedos_contacts_org_tree.helpers
	isEditable: ()->
		return Session.get('contacts_is_org_admin') && !this.isDisabled

	is_admin: ()->
		return Session.get('contacts_is_org_admin')

	isMobile: ()->
		return Steedos.isMobile();

	isFromAdmin: ()->
		currentRoute = FlowRouter.current().path
		if /\/admin/.test(currentRoute)
			return true
		else
			return false

Template.steedos_contacts_org_tree.onRendered ->
	$('[data-toggle="tooltip"]').tooltip()
	$(document.body).addClass('loading')
	showHiddenOrg = this.data?.showHiddenOrg


	$("#steedos_contacts_org_tree").on('changed.jstree', (e, data) ->
		# 清除整个浏览器的文字选中状态，解决edge浏览器中选中文字造成的一些问题，
		# 比如在space user列表选中一些文字，然后切换到其他组织，会发现edge浏览器上无法拖动了（有权限的情况）等
		window.getSelection()?.removeAllRanges()
		if data.selected.length
			Session.set("contact_showBooks", false)
			Session.set("contact_list_search", false);
			Session.set("contacts_orgId", data.selected[0]);

		return
	).on('ready.jstree',(e, data) ->
		ins = data.instance
		rootNode = data.instance.get_node("#")
		if rootNode.children.length
			firstNode = rootNode.children[0]
			ins.select_node(firstNode)

		addEditMenu()
	).on('refresh.jstree',(e, data) ->
		addEditMenu()
	).jstree
		core:
			multiple:false,
			themes: { "stripes" : true, "variant" : "large" },
			data:  (node, cb) ->
				cb(ContactsManager.getOrgNode(node, false));

		plugins: ["wholerow", "search"]

	$("#steedos_contacts_org_tree").on('select_node.jstree', (e, data) ->
		$(".contacts-list-wrapper").hide();
		if $("#contact-list-search-key")
			$("#contact-list-search-key").val("")
			$('#contact-list-search-btn').trigger('click')
	)
	$(document.body).removeClass('loading')

	this.autorun ->
		ContactsManager.checkOrgAdmin();



Template.steedos_contacts_org_tree.events
	'mouseenter .jstree-node': (event, template) ->
		attr = $(event.currentTarget).attr("aria-labelledby") 
		organizationId = $(event.currentTarget).attr("id") 
		admins = $(event.currentTarget).data("admins").split(",")
		userId = Meteor.userId()
		wholerow = $("> .jstree-wholerow", event.currentTarget)
		$(event.currentTarget).parents("li").each ->
			admins = $(this).data("admins").split(",").concat(admins)
		
		unless wholerow.hasClass("added-edit-menu")
			wholerow.addClass("added-edit-menu")
			html = editMenu(admins, userId, organizationId)
			wholerow.after(html)

	'click #search-btn': (event, template) ->
		$('#steedos_contacts_org_tree').jstree(true).search($("#search-key").val())

	'click #steedos_contacts_org_tree_add_btn': (event, template) ->
		orgId = event.target.dataset.orgid
		doc = { parent: orgId }
		AdminDashboard.modalNew 'organizations', doc, ()->
			$.jstree.reference('#steedos_contacts_org_tree').refresh()

	'click #steedos_contacts_org_tree_edit_btn': (event, template) ->
		orgId = event.target.dataset.orgid
		AdminDashboard.modalEdit 'organizations', orgId, ()->
			$.jstree.reference('#steedos_contacts_org_tree').refresh()

	'click #steedos_contacts_org_tree_remove_btn': (event, template) ->
		orgId = event.target.dataset.orgid
		AdminDashboard.modalDelete 'organizations', orgId, ()->
			orgTree = $.jstree.reference('#steedos_contacts_org_tree')
			parent = orgTree.get_parent(orgId)
			orgTree.select_node(parent)
			orgTree.refresh()

	'click #contacts_back': (event, template)->
		$(".contacts-list-wrapper").hide()

	"dragenter #steedos_contacts_org_tree .drag-target": (event, template) ->
		target = $(event.target).closest(".drag-target")
		target.children(".jstree-wholerow").addClass("jstree-wholerow-hovered")
		target.children(".jstree-anchor").addClass("jstree-hovered")

	"dragleave #steedos_contacts_org_tree .drag-target": (event, template) ->
		target = $(event.target).closest(".drag-target")
		target.children(".jstree-wholerow").removeClass("jstree-wholerow-hovered")
		target.children(".jstree-anchor").removeClass("jstree-hovered")

	"dragover #steedos_contacts_org_tree .drag-target": (event, template) ->
		event.preventDefault()

	"drop #steedos_contacts_org_tree .drag-target": (event, template) ->
		target = $(event.target).closest(".drag-target")
		from_org_id = Session.get("contacts_orgId")
		to_org_id = target.attr("id")
		space_user_id = Session.get("dragging_contacts_org_user_id")
		Session.set("dragging_contacts_org_user_id","")
		if from_org_id == to_org_id
			toastr.error t("steedos_contacts_error_equal_move_reject")
			return false

		unless space_user_id
			toastr.error t("steedos_contacts_error_space_user_not_found_dragging")
			return false

		Meteor.call 'move_space_users', from_org_id, to_org_id, space_user_id, (error, is_suc) ->
			if is_suc
				toastr.success t('steedos_contacts_move_suc')
			else
				console.error error
				toastr.error(t(error.reason))

		return false
