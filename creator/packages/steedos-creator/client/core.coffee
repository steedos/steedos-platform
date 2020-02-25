Creator.getLayout = (app_id)->
	if !app_id
		app_id = Session.get("app_id")
	if app_id == "steedos"
		return "steedosLayout"
	else
		if Steedos.isMobile() && false
			return "creatorMobileLayout"
		else
			return "creatorLayout"

Creator.createObject = (object_name,object_data)->
	object = Creator.getObject(object_name)
	collection_name = "Creator.Collections."+object_name
	Session.set("action_collection",collection_name)
	Session.set("action_save_and_insert",true)
	Session.set("action_collection_name",object.label)
	Session.set('action_object_name',object_name)
	Session.set("action_fields",undefined)
	Session.set("cmDoc",object_data)
	Meteor.defer ->
		$(".creator-add").click()

if Meteor.isClient
	# 定义全局变量以Session.get("object_name")为key记录其选中的记录id集合
	Creator.TabularSelectedIds = {}
	Meteor.autorun ->
		list_view_id = Session.get("list_view_id")
		object_name = Session.get("object_name")
		if object_name
			Creator.TabularSelectedIds[object_name] = []

	Creator.remainCheckboxState = (container)->
		# 当Creator.TabularSelectedIds值，把container内的勾选框状态保持住
		checkboxAll = container.find(".select-all")
		unless checkboxAll.length
			return
		currentDataset = checkboxAll[0]?.dataset
		currentObjectName = currentDataset.objectName

		selectedIds = Creator.TabularSelectedIds[currentObjectName]
		unless selectedIds
			return

		checkboxs = container.find(".select-one")
		checkboxs.each (index,item)->
			checked = selectedIds.indexOf(item.dataset.id) > -1
			$(item).prop("checked",checked)

		selectedLength = selectedIds.length
		if selectedLength > 0 and checkboxs.length != selectedLength
			checkboxAll.prop("indeterminate",true)
		else
			checkboxAll.prop("indeterminate",false)
			if selectedLength == 0
				checkboxAll.prop("checked",false)
			else if selectedLength == checkboxs.length
				checkboxAll.prop("checked",true)

	Creator.isListViewFilterEditable = (list_view_obj)->
		# 传入的list_view_obj是自定义视图才有意义，否则请不要调用该函数
		# 当视图不是共享的，或者当前用户本身有权限编辑当前视图时才把过滤条件显示在右侧过滤器中，允许用户修改或删除视图本身的过滤条件
		return !list_view_obj.shared || (list_view_obj.shared && list_view_obj.owner == Steedos.userId())
	### TO DO LIST
		1.支持$in操作符，实现recent视图
		$eq, $ne, $lt, $gt, $lte, $gte
	###
	Creator.getODataFilter = (list_view_id, object_name, filters_set)->
		# filters_set参数是为支持直接把过虑器变更的过虑条件应用到grid列表，而不是非得先保存到视图中才生效
		# 当filters_set存在时优先应用，反之才使用保存到视图中的过虑条件
		userId = Meteor.userId()
		spaceId = Session.get("spaceId")
		custom_list_view = Creator.Collections.object_listviews.findOne(list_view_id)
		if custom_list_view
			isListViewFilterEditable = Creator.isListViewFilterEditable(custom_list_view)
			if !isListViewFilterEditable
				# 视图不可编辑时，把视图本身的过滤条件视为yml文件这样的代码级过滤条件，与用户设置的过滤条件取AND
				code_filters_set = {}
				code_filters_set.filter_scope = custom_list_view.filter_scope
				code_filters_set.filters = custom_list_view.filters
			
			# 这里当isListViewFilterEditable为true且filters_set为空时，没必要也不可以把custom_list_view.filters值设置到filters_set中
			# 没必要是因为list_wrapper.coffee文件中已经处理了，把custom_list_view.filters值设置到Session中了
			# 不可以是因为：自定义视图，当过滤器中删除掉数据库中已经存在的某项过滤条件时，列表请求未删除该条件 #1570
		else
			code_filters_set = {}
			if spaceId and userId
				list_view = Creator.getListView(object_name, list_view_id)
				unless list_view
					return ["_id", "=", -1]

				code_filters_set.filter_scope = list_view.filter_scope
				code_filters_set.filters = list_view.filters

		if Creator.isCloudAdminSpace(spaceId) && _.include(['users', 'space_users', 'spaces'], object_name)
			delete code_filters_set.filters
		
		if code_filters_set
			# 如果过虑器存在临时变更的过虑条件(即过虑器中过虑条件未保存到视图中)，则与代码中配置的过虑条件取AND连接逻辑
			# 反之则直接应用代码中配置的过虑条件
			if filters_set
				if code_filters_set.filter_scope
					# 代码中有配置filter_scope时，以代码中的为准
					filters_set.filter_scope = code_filters_set.filter_scope
				if _.isFunction(filters_set.filters) or filters_set.filters?.length
					if _.isFunction(code_filters_set.filters) or code_filters_set.filters?.length
						# 取AND连接逻辑，这里依赖了Creator.formatFiltersToDev函数中支持任意层的and或or连接的子filter为function的功能
						filters_set.filters = [[filters_set.filters, "and", code_filters_set.filters]]
				else
					filters_set.filters = code_filters_set.filters
			else
				filters_set = code_filters_set

		unless filters_set
			filters_set = {}

		filter_logic = filters_set.filter_logic
		filter_scope = filters_set.filter_scope
		filters = filters_set.filters
		selector = []
		# 整个过虑器是函数的话解析出来
		# filters内部子filter为function时也是支持的，由Creator.formatFiltersToDev函数负责解析
		# 理论上支持两种功能：
		# 1.filters内部任意层支持value为function
		# 2.支持任意层的and或or连接的子filter为function的情况，比如[function(){...},"or",function(){}]
		# 实现上由于后台bootstrap接口返回的function对象需要额外解析转换，见Creator.convertObject函数视图转换部分
		# 否则function部分返回的是null，所以实际上代码中编辑的视图过虑条件只支持：
		# 1.filters内部支持value为function，但是不支持多层，只支持一层
		# 2.and或or连接的子filter为function的情况不支持
		# 要注意的是对于不需要后台接口转换的情况，是完全能支持以上两种任意层function方案的，
		# 比如上面取AND连接逻辑把代码中配置的过虑条件与过滤器中设置的过滤条件合并的代码就使用了第二种功能
		if _.isFunction(filters)
			filters = filters()

		if custom_list_view
			if filter_logic
				format_logic = Creator.formatLogicFiltersToDev(filters, filter_logic)
				if selector.length
					selector.push("and", format_logic)
				else
					selector.push(format_logic)
			else
				if filters and filters.length > 0
					if selector.length > 0
						selector.push "and"

					filters = Creator.formatFiltersToDev(filters, object_name)
					if filters and filters.length > 0
						#兼容[filter1,'or',filters]这种or链接条件，应该改为[[filter1,'or',filters]]，这样下面的selector.push就不会出问题
						filters = [filters] 
					_.each filters, (filter)->
						selector.push filter
		else
			if spaceId and userId
				if object_name == "users" && !Creator.isCloudAdminSpace(spaceId)
					selector.push ["_id", "=", userId]
				if filters
					filters = Creator.formatFiltersToDev(filters, object_name)
					if filters and filters.length > 0
						#兼容[filter1,'or',filters]这种or链接条件，应该改为[[filter1,'or',filters]]，这样下面的selector.push就不会出问题
						filters = [filters]
						if selector.length > 0
							selector.push "and"
						_.each filters, (filter)->
							if object_name != 'spaces' || (filter.length > 0 && filter[0] != "_id")
								selector.push filter
		# 指定过虑条件为mine时要额外加上相关过虑条件
		if filter_scope == "mine"
			if selector.length > 0
				selector.push "and"
			selector.push ["owner", "=", userId]
		
		# permissions = Creator.getPermissions(object_name)
		# if permissions.viewAllRecords
		# 	# 有所有权限则不另外加过虑条件
		# else if permissions.viewCompanyRecords
		# 	# 限制查看本单位时另外加过虑条件
		# 	if selector.length > 0
		# 		selector.push "and"
		# 	userCompanyIds = Creator.getUserCompanyIds()
		# 	if userCompanyIds && userCompanyIds.length
		# 		companyIdsFilters = Creator.formatFiltersToDev(["company_id", "=", userCompanyIds], object_name)
		# 		selector.push companyIdsFilters
		# 	else 
		# 		selector.push ["company_id", "=", -1]
		# else if permissions.allowRead
		# 	# 只是时allowRead另外加过虑条件，限制为只能看自己的记录
		# 	if selector.length > 0
		# 		selector.push "and"
		# 	selector.push ["owner", "=", userId]
		# else
		# 	# 没有权限时不应该显示任何记录
		# 	if selector.length > 0
		# 		selector.push "and"
		# 	selector.push ["id", "=", "-1"]

		if selector.length == 0
			return undefined
		return selector

	Creator.getODataRelatedFilter = (object_name, related_object_name, record_id, list_view_id)->
		unless record_id
			# record_id为空说明不是在记录详细界面，不存在相关列表
			return undefined
		spaceId = Steedos.spaceId()
		userId = Meteor.userId()
		related_lists = Creator.getRelatedList(object_name, record_id)
		related_field_name = ""
		selector = []
		addSelector = (select)->
			if selector.length > 0
				selector.push('and')
			selector.push(select)
		_.each related_lists, (obj)->
			if obj.object_name == related_object_name
				related_field_name = obj.related_field_name

		related_field_name = related_field_name.replace(/\./g, "/")
		if list_view_id
			custom_list_view = Creator.getListView(related_object_name, list_view_id)
			if custom_list_view
				filter_logic = custom_list_view.filter_logic
				filter_scope = custom_list_view.filter_scope
				filters = custom_list_view.filters

				if filter_logic
					format_logic = Creator.formatLogicFiltersToDev(filters, filter_logic)
					addSelector(format_logic)
				else
					if filters and filters.length > 0
						filters = _.map filters, (obj)->
							if _.isObject(obj) && !_.isArray(obj)
								if Meteor.isClient
									if _.isString(obj?._value)
										return [obj.field, obj.operation, Creator.eval("(#{obj._value})")()]
								return [obj.field, obj.operation, obj.value]
							else
								return obj
						filters = Creator.formatFiltersToDev(filters, related_object_name)
						if filters and filters.length > 0
							#兼容[filter1,'or',filters]这种or链接条件，应该改为[[filter1,'or',filters]]，这样下面的selector.push就不会出问题
							filters = [filters] 
						_.each filters, (filter)->
							addSelector filter

		if related_object_name == "cfs.files.filerecord"
			addSelector(["metadata/space", "=", spaceId])

		if related_object_name == "cms_files"
			addSelector(["parent/o", "=", object_name])
			addSelector(["parent/ids", "=", record_id])
		else if object_name == "objects"
			record_object_name = Creator.getObjectRecord().name
			addSelector([related_field_name, "=", record_object_name])
		else

			related_object_fields = Creator.getObject(related_object_name)?.fields

			if related_object_fields
				related_field = related_object_fields[related_field_name]

			if related_field && (related_field.type == 'master_detail' or related_field.type == 'lookup')
				if _.isFunction(related_field.reference_to)
					if _.isArray(related_field.reference_to())
						addSelector(["#{related_field_name}.ids", "=", record_id])
					else
						addSelector([related_field_name, "=", record_id])

				else if _.isArray(related_field.reference_to)
					addSelector(["#{related_field_name}.ids", "=", record_id])
				else
					addSelector([related_field_name, "=", record_id])
			else if related_field && (related_field.type == 'grid')
				addSelector(["#{related_field_name}.o", "=", object_name])
				addSelector(["#{related_field_name}.ids", "=", record_id])
			else
				addSelector([related_field_name, "=", record_id])

		# 指定过虑条件为mine时要额外加上相关过虑条件
		if filter_scope == "mine"
			addSelector ["owner", "=", userId]
			
		# permissions = Creator.getPermissions(related_object_name, spaceId, userId)
		# if permissions.viewAllRecords
		# 	# 有所有权限则不另外加过虑条件
		# else if permissions.viewCompanyRecords
		# 	# 限制查看本单位时另外加过虑条件
		# 	if selector.length > 0
		# 		selector.push "and"
		# 	userCompanyIds = Creator.getUserCompanyIds()
		# 	if userCompanyIds && userCompanyIds.length
		# 		companyIdsFilters = Creator.formatFiltersToDev(["company_id", "=", userCompanyIds], related_object_name)
		# 		addSelector companyIdsFilters
		# 	else
		# 		addSelector ["company_id", "=",-1]
		# else if permissions.allowRead
		# 	# 只是时allowRead另外加过虑条件，限制为只能看自己的记录
		# 	addSelector ["owner", "=", userId]
		# else
		# 	# 没有权限时不应该显示任何记录
		# 	addSelector ["1", "=", "-1"]

		if selector.length == 0
			return undefined
		return selector

	Creator.getJsReportUrlQuery = ()->
		urlQuery = "?space_id=#{Steedos.getSpaceId()}"
		filter_items = Tracker.nonreactive ()->
			return Session.get("filter_items")
		if filter_items
			filterQuery = encodeURI JSON.stringify(filter_items)
			urlQuery += "&user_filters=#{filterQuery}"
		return urlQuery;

	Creator.getJsReportViewUrl = (report_id)->
		url = Creator.getRelativeUrl("/plugins/jsreport/web/viewer_db/#{report_id}")
		url += Creator.getJsReportUrlQuery()
		return url;
	
	Creator.getJsReportExcelUrl = (report_id)->
		url = Creator.getRelativeUrl("/plugins/jsreport/api/report_db/#{report_id}/excel")
		url += Creator.getJsReportUrlQuery()
		return url;
	
	Creator.getJsReportPdfUrl = (report_id)->
		url = Creator.getRelativeUrl("/plugins/jsreport/api/report_db/#{report_id}/pdf")
		url += Creator.getJsReportUrlQuery()
		return url;
	
	Creator.objectOdataSelectFields = (object)->
		_fields = object.fields
		_keys = _.keys(_fields)
		_keys = _keys.filter (k)->
			if k.indexOf(".") < 0
				return true
			else
				return false
		return _keys.join(",")

	Creator.objectOdataExpandFields = (object, columns)->
		expand_fields = []
		fields = object.fields
		unless columns
			columns = _.keys(fields)
		_.each columns, (n)->
			if fields[n]?.type == "master_detail" || fields[n]?.type == "lookup"
				if fields[n].reference_to
					ref = fields[n].reference_to
					if _.isFunction(ref)
						ref = ref()
				else
					ref = fields[n].optionsFunction({}).getProperty("value")

				if !_.isArray(ref)
					ref = [ref]

				ref = _.map ref, (o)->
					key = Creator.getObject(o)?.NAME_FIELD_KEY || "name"
					return key

				ref = _.compact(ref)

				ref = _.uniq(ref)

				ref = ref.join(",")
				if ref && n.indexOf("$") < 0
					if n.indexOf(".") < 0
						expand_fields.push(n)
					else
						expand_fields.push(n.replace('.', '/'))
	#		else if fields[n].type == 'grid'
	#			expand_fields.push(n)
		return expand_fields.join(",")
	
	Creator.relatedObjectFileUploadHandler = (event, gridContainerWrap)->
		dataset = event.currentTarget.dataset
		parent = dataset?.parent
		targetObjectName = dataset?.targetObjectName
		files = event.currentTarget.files
		i = 0
		record_id = Session.get("record_id")
		object_name = Session.get("object_name")
		spaceId = Session.get("spaceId")
		dxDataGridInstance = gridContainerWrap.find(".gridContainer.#{targetObjectName}").dxDataGrid().dxDataGrid('instance')
		while i < files.length
			file = files[i]
			if !file.name
				continue
			fileName = file.name
			if [
					'image.jpg'
					'image.gif'
					'image.jpeg'
					'image.png'
				].includes(fileName.toLowerCase())
				fileName = 'image-' + moment(new Date).format('YYYYMMDDHHmmss') + '.' + fileName.split('.').pop()
			# Session.set 'filename', fileName
			# $('.loading-text').text TAPi18n.__('workflow_attachment_uploading') + fileName + '...'
			fd = new FormData
			fd.append 'Content-Type', cfs.getContentType(fileName)
			fd.append 'file', file
			fd.append 'record_id', record_id
			fd.append 'object_name', object_name
			fd.append 'space', spaceId
			fd.append 'owner', Meteor.userId()
			fd.append 'owner_name', Meteor.user().name
			if parent
				fd.append 'parent', parent
			$(document.body).addClass 'loading'
			$.ajax
				url: Steedos.absoluteUrl('s3/')
				type: 'POST'
				async: true
				data: fd
				dataType: 'json'
				processData: false
				contentType: false
				success: (responseText, status) ->
					fileObj = undefined
					$(document.body).removeClass 'loading'
					if responseText.errors
						responseText.errors.forEach (e) ->
							toastr.error e.errorMessage
							return
						return
					toastr.success TAPi18n.__('Attachment was added successfully')
					Template.creator_grid.refresh dxDataGridInstance
					return
				error: (xhr, msg, ex) ->
					$(document.body).removeClass 'loading'
					if ex
						msg = ex
					if msg == "Request Entity Too Large"
						msg = "creator_request_oversized"
					toastr.error t(msg)
					return
			i++
		$(event.target).val("")

	Creator.getIsFiltering = ()->
		filter_items = Session.get("filter_items")
		isFiltering = false;
		_.every filter_items, (filter_item)->
			if filter_item.value
				isFiltering = true;
			return !isFiltering;
		return isFiltering
	

# 切换工作区时，重置下拉框的选项
Meteor.startup ->
	Tracker.autorun ()->
		if Session.get("spaceId")
			_.each Creator.Objects, (obj, object_name)->
				if Creator.getCollection(object_name)
					_.each obj.fields, (field, field_name)->
						if field.type == "master_detail" or field.type == "lookup"
							_schema = Creator.getCollection(object_name)?._c2?._simpleSchema?._schema
							_schema?[field_name]?.autoform?.optionsMethodParams?.space = Session.get("spaceId")


Meteor.startup ->
	$(document).on "click", (e)->
		if $(e.target).closest(".slds-table td").length < 1
			$(".slds-table").addClass("slds-no-cell-focus")
		else
			$(".slds-table").removeClass("slds-no-cell-focus")


	$(window).resize ->
		if $(".list-table-container table.dataTable").length
			$(".list-table-container table.dataTable thead th").each ->
				width = $(this).outerWidth()
				$(".slds-th__action", this).css("width", "#{width}px")

	$(document).keydown (e) ->
		if e.keyCode == "13" or e.key == "Enter"
			if $(".modal").length > 1
				return;
			if e.target.tagName != "TEXTAREA" or $(e.target).closest("div").hasClass("bootstrap-tagsinput")
				if Session.get("cmOperation") == "update"
					e.preventDefault()
					e.stopPropagation()
					$(".creator-auotform-modals .btn-update").click()
				else if Session.get("cmOperation") == "insert"
					e.preventDefault()
					e.stopPropagation()
					$(".creator-auotform-modals .btn-insert").click()
