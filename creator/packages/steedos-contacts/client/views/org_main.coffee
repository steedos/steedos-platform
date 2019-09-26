Template.org_main.helpers
	subsReady: ->
		return Steedos.subsAddressBook.ready() and Steedos.subsSpace.ready();

	isShowOrg: ->
		unless Steedos.isNotSync()
			return false
		#在个人联系人里不需要判断管理员的权限，在组织架构中需要判断是否有管理员权限
		if /^\/contacts\b/.test(Session.get("router-path"))
			return  true
		else if Steedos.isSpaceAdmin()
			return  true

	data: ->
		return {isDisabled: true, showHiddenOrg: false}

Template.org_main.onRendered ->
		unless Steedos.isNotSync()
			paths = FlowRouter.current().path.match(/\/[^\/]+/)
			if paths?.length
				rootPath = paths[0]
			else
				rootPath = "/admin"
			if rootPath == "/contacts"
				rootPath = "/contacts/books"
			FlowRouter.go rootPath
			toastr.error(t("contacts_organization_permission_alert"));
