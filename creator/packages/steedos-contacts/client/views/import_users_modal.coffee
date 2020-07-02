Template.import_users_modal.helpers
	import_simple_url: ()->
		return Steedos.absoluteUrl("excel/steedos_import_users_simple.xls")
	row_number: (i)->
		return i + 1;
	items: ()->
		return Template.instance()?.items.get()

Template.import_users_modal.events
	'change #import-file': (event, template) ->

		items = new Array();

		files = event.currentTarget.files;

		if files.length < 1
			return ;

		reader = new FileReader();
		reader.onload = (ev) ->
			try
				data = ev.target.result
				workbook = XLSX.read(data, type: 'binary')
			# 存储获取到的数据
			catch e
				toastr.error(TAPi18n.__("steedos_contacts_import_users_file_error"))
			# 表格的表格范围，可用于判断表头是否数量是否正确
			fromTo = ''
			# 遍历每张表读取
			for sheet of workbook.Sheets
				if workbook.Sheets.hasOwnProperty(sheet)
					fromTo = workbook.Sheets[sheet]['!ref']
					items = items.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]))
			# break; // 如果只取第一张表，就取消注释这行


			items.forEach (item)->
				if _.has(item, "所属部门")
					item.organization = item["所属部门"]?.trim()
					delete item["所属部门"]
				if _.has(item, "用户名")
					item.username = item["用户名"]?.trim()
					delete item["用户名"]
				if _.has(item, "邮箱")
					item.email = item["邮箱"]?.trim()
					delete item["邮箱"]
				if _.has(item, "姓名")
					item.name = item["姓名"]?.trim()
					delete item["姓名"]
				if _.has(item, "职务")
					item.position = item["职务"]?.trim()
					delete item["职务"]
				if _.has(item, "固定电话")
					item.work_phone = item["固定电话"]?.trim()
					delete item["固定电话"]
				if _.has(item, "手机")
					item.phone = item["手机"]?.trim()
					delete item["手机"]
				if _.has(item, "单位")
					item.company = item["单位"]?.trim()
					delete item["单位"]
				# if _.has(item, "状态")
				# 	item.user_accepted = item["状态"]?.trim()
				# 	delete item["状态"]
				if _.has(item, "排序号")
					item.sort_no = item["排序号"]?.trim()
					delete item["排序号"]
				if _.has(item, "密码")
					item.password = item["密码"]?.trim()
					delete item["密码"]

			template.items.set(items)
		reader.readAsBinaryString(files[0]);

	'click #import-user-modal-confirm': (event, template) ->
		if template.items.get().length < 1
			toastr.error(TAPi18n.__("steedos_contacts_import_users_select_file"));
			return

		$("body").addClass("loading")
		Meteor.call("import_users", Session.get("spaceId"), $("#user_pk:checked").val(), template.items.get(), false, (error, result)->
			if error
				$("body").removeClass("loading")
				toastr.error(error.reason);
			else
				$.jstree.reference('#steedos_contacts_org_tree').refresh()
				$("body").removeClass("loading")

				totalCount = template.items.get().length
				errorCount = result.length
				successCount = totalCount - errorCount
				statistics = "<div class='report-title'>共导入数据#{totalCount}条，成功：#{successCount}条，失败：#{errorCount}条</div>"
				errorReport = ""

				if result.length > 0
					errorReport = result.map (e, index) ->
						return "<li>第#{e.line}行：#{e.message}</li>"
					errorReport = "<ul class='export-report'>" + errorReport.join("") + "</ul>"

				text = "<div class='error-report'>#{statistics}#{errorReport}</div>"
				swal
					title: "导入结果"
					text: text
					html: true
					confirmButtonText: t('OK')
					()->
						console.log "swal.end"

				# toastr.success(TAPi18n.__("steedos_contacts_import_users_import_success"))
			# Modal.hide(template)
			# $.jstree.reference('#steedos_contacts_org_tree').refresh()
			# $("body").removeClass("loading")
		);

	# 'click #import-user-modal-check': (event, template) ->
	# 	if template.items.get().length < 1
	# 		toastr.error(TAPi18n.__("steedos_contacts_import_users_select_file"));
	# 		return

	# 	$("body").addClass("loading")
	# 	Meteor.call("import_users", Session.get("spaceId"), $("#user_pk:checked").val(), template.items.get(), true, (error, result)->
	# 		if error
	# 			toastr.error(error.reason);
	# 		else
	# 			console.log result
	# 			toastr.success(TAPi18n.__("steedos_contacts_import_users_check_success"))
	# 		$("body").removeClass("loading")
	# 	);

Template.import_users_modal.onCreated ()->
	self = this;
	self.items = new ReactiveVar([]);

Template.import_users_modal.onRendered ()->
	if !window.XLSX
		$("body").addClass("loading")
#		TODO  此加载函数是禁止浏览器缓存的， 需要调整为按照审批王的发布版本来加载js文件 eg: xxx.js?_v = steedos.viewsion
		$.getScript "/js/xlsx.full.min.js", ()->
			$("body").removeClass("loading")