Creator.getObjectSchema = (obj) ->
	schema = {}

	fieldsArr = []

	_.each obj.fields , (field, field_name)->
		if !_.has(field, "name")
			field.name = field_name
		fieldsArr.push field

	_.each _.sortBy(fieldsArr, "sort_no"), (field)->

		field_name = field.name

		fs = {}
		if field.regEx
			fs.regEx = field.regEx
		fs.autoform = {}
		fs.autoform.multiple = field.multiple
		fs.autoform.reference_to = field.reference_to

		autoform_type = field.autoform?.type

		if field.type == "text" or field.type == "phone"
			fs.type = String
			if field.multiple
				fs.type = [String]
				fs.autoform.type = "tags"
		else if field.type == "[text]" or field.type == "[phone]"
			fs.type = [String]
			fs.autoform.type = "tags"
		else if field.type == 'code'
			fs.type = String
			fs.autoform.type = "widearea"
			fs.autoform.rows = field.rows || 12
			if field.language
				fs.autoform.language = field.language
		else if field.type == "textarea"
			fs.type = String
			fs.autoform.type = "widearea"
			fs.autoform.rows = field.rows || 6
		else if field.type == "password"
			fs.type = String
			fs.autoform.type = "password"
		else if field.type == "date"
			fs.type = Date
			if Meteor.isClient
				if Steedos.isMobile() || Steedos.isPad()
					# 这里用afFieldInput而不直接用autoform的原因是当字段被hidden的时候去执行dxDateBoxOptions参数会报错
					fs.autoform.afFieldInput =
						type: "steedos-date-mobile"
						dateMobileOptions:
							type: "date"
				else
					fs.autoform.outFormat = 'yyyy-MM-dd';
					# 这里用afFieldInput而不直接用autoform的原因是当字段被hidden的时候去执行dxDateBoxOptions参数会报错
					fs.autoform.afFieldInput =
						type: "dx-date-box"
						timezoneId: "utc"
						dxDateBoxOptions:
							type: "date"
							displayFormat: "yyyy-MM-dd"

		else if field.type == "datetime"
			fs.type = Date
			if Meteor.isClient
				if Steedos.isMobile() || Steedos.isPad()
					# 这里用afFieldInput而不直接用autoform的原因是当字段被hidden的时候去执行dxDateBoxOptions参数会报错
					fs.autoform.afFieldInput =
						type: "steedos-date-mobile"
						dateMobileOptions:
							type: "datetime"
				else
					# 这里用afFieldInput而不直接用autoform的原因是当字段被hidden的时候去执行dxDateBoxOptions参数会报错
					fs.autoform.afFieldInput =
						type: "dx-date-box"
						dxDateBoxOptions:
							type: "datetime"
							displayFormat: "yyyy-MM-dd HH:mm"
		else if field.type == "[Object]"
			fs.type = [Object]
		else if field.type == "html"
			fs.type = String
			fs.autoform.afFieldInput =
				type: "summernote"
				class: 'editor'
				settings:
					height: 200
					dialogsInBody: true
					toolbar:  [
						['font1', ['style']],
						['font2', ['bold', 'underline', 'italic', 'clear']],
						['font3', ['fontname']],
						['color', ['color']],
						['para', ['ul', 'ol', 'paragraph']],
						['table', ['table']],
						['insert', ['link', 'picture']],
						['view', ['codeview']]
					]
					fontNames: ['Arial', 'Comic Sans MS', 'Courier New', 'Helvetica', 'Impact', '宋体','黑体','微软雅黑','仿宋','楷体','隶书','幼圆']

		else if (field.type == "lookup" or field.type == "master_detail")
			fs.type = String
			fs.autoform.showIcon = field.showIcon
			if field.multiple
				fs.type = [String]

			if !field.hidden

				fs.autoform.filters = field.filters

				fs.autoform.dependOn = field.depend_on

				if field.beforeOpenFunction
					fs.beforeOpenFunction = field.beforeOpenFunction

				fs.filtersFunction = if field.filtersFunction then field.filtersFunction else Creator.evaluateFilters

				if field.optionsFunction
					fs.optionsFunction = field.optionsFunction

				if field.reference_to

					if Meteor.isClient
						if field.createFunction && _.isFunction(field.createFunction)
							fs.createFunction = field.createFunction
						else
							if _.isString(field.reference_to)
								_ref_obj = Creator.Objects[field.reference_to]
								if _ref_obj?.permissions?.allowCreate
									fs.autoform.create = true
									fs.createFunction = (lookup_field)->
										Modal.show("CreatorObjectModal", {
											collection: "Creator.Collections.#{Creator.getCollection(field.reference_to)._name}",
											formId: "new#{field.reference_to.replace('.','_')}",
											object_name: "#{field.reference_to}",
											operation: "insert",
											onSuccess: (operation, result)->
												object = Creator.getObject(result.object_name)
												if result.object_name == "objects"
													lookup_field.addItems([{label: result.value.label, value: result.value.name, icon: result.value.icon}], result.value.name)
												else
													lookup_field.addItems([{label: result.value[object.NAME_FIELD_KEY] || result.value.label || result.value.name, value: result._id}], result._id)
										})
								else
									fs.autoform.create = false

					if _.isBoolean(field.create)
						fs.autoform.create = field.create

					if field.reference_sort
						fs.autoform.optionsSort = field.reference_sort

					if field.reference_limit
						fs.autoform.optionsLimit = field.reference_limit

					if field.reference_to == "users"
						fs.autoform.type = "selectuser"
						if !field.hidden && !field.omit
							# is_company_limited表示过滤数据时是否只显示本单位下的数据
							# is_company_limited可以被改写覆盖成true/false或其他function
							if field.is_company_limited == undefined
								# 未定义is_company_limited属性时默认处理逻辑：
								# 对当前对象有viewAllRecords权限则不限制所属单位列表查看权限，否则只显示当前所属单位
								# 注意不是reference_to对象的viewAllRecords权限，而是当前对象的
								if Meteor.isClient
									permissions = obj.permissions?.get()
									isUnLimited = permissions?.viewAllRecords
									if _.include(["organizations", "users", "space_users"], obj.name)
										# 如果字段所属对象是用户或组织，则是否限制显示所属单位部门与modifyAllRecords权限关联
										isUnLimited = permissions?.modifyAllRecords
									if isUnLimited
										fs.autoform.is_company_limited = false
									else
										fs.autoform.is_company_limited = true
							else if _.isFunction field.is_company_limited
								if Meteor.isClient
									# 传入当前对象的权限，在函数中根据权限计算是否要限制只查看本单位
									fs.autoform.is_company_limited = field.is_company_limited(obj.permissions)
								else
									# 服务端用不到is_company_limited
									fs.autoform.is_company_limited = true
							else
								fs.autoform.is_company_limited = field.is_company_limited
						else
							fs.autoform.is_company_limited = field.is_company_limited
					else if field.reference_to == "organizations"
						fs.autoform.type = "selectorg"
						if !field.hidden && !field.omit
							# is_company_limited表示过滤数据时是否只显示本单位下的数据
							# is_company_limited可以被改写覆盖成true/false或其他function
							if field.is_company_limited == undefined
								# 未定义is_company_limited属性时默认处理逻辑：
								# 对当前对象有viewAllRecords权限则不限制所属单位列表查看权限，否则只显示当前所属单位
								# 注意不是reference_to对象的viewAllRecords权限，而是当前对象的
								if Meteor.isClient
									permissions = obj.permissions?.get()
									isUnLimited = permissions?.viewAllRecords
									if _.include(["organizations", "users", "space_users"], obj.name)
										# 如果字段所属对象是用户或组织，则是否限制显示所属单位部门与modifyAllRecords权限关联
										isUnLimited = permissions?.modifyAllRecords
									if isUnLimited
										fs.autoform.is_company_limited = false
									else
										fs.autoform.is_company_limited = true
							else if _.isFunction field.is_company_limited
								if Meteor.isClient
									# 传入当前对象的权限，在函数中根据权限计算是否要限制只查看本单位
									fs.autoform.is_company_limited = field.is_company_limited(obj.permissions)
								else
									# 服务端用不到is_company_limited
									fs.autoform.is_company_limited = true
							else
								fs.autoform.is_company_limited = field.is_company_limited
						else
							fs.autoform.is_company_limited = field.is_company_limited
					else
						if typeof(field.reference_to) == "function"
							_reference_to = field.reference_to()
						else
							_reference_to = field.reference_to

						if _.isArray(_reference_to)
							fs.type = Object
							fs.blackbox = true
							fs.autoform.objectSwitche = true

							schema[field_name + ".o"] = {
								type: String
								autoform: {omit: true}
							}

							schema[field_name + ".ids"] = {
								type: [String]
								autoform: {omit: true}
							}

						else
							_reference_to = [_reference_to]

						_object = Creator.Objects[_reference_to[0]]
						if _object and _object.enable_tree
							fs.autoform.type = "selectTree"
						else
							fs.autoform.type = "steedosLookups"
							fs.autoform.optionsMethod = field.optionsMethod || "creator.object_options"

							if Meteor.isClient
								fs.autoform.optionsMethodParams = ()->
									return {space: Session.get("spaceId")}
								fs.autoform.references = []
								_reference_to.forEach (_reference)->
									_object = Creator.Objects[_reference]
									if _object
										fs.autoform.references.push {
											object: _reference
											label: _object?.label
											icon: _object?.icon
											link: ()->
												return "/app/#{Session.get('app_id')}/#{_reference}/view/"
										}
									else
										fs.autoform.references.push {
											object: _reference
											link: ()->
												return "/app/#{Session.get('app_id')}/#{_reference}/view/"
										}

				else
					fs.autoform.type = "steedosLookups"
					fs.autoform.defaultIcon = field.defaultIcon

		else if field.type == "select"
			fs.type = String
			if field.multiple
				fs.type = [String]
				fs.autoform.type = "steedosLookups"
				fs.autoform.showIcon = false
				fs.autoform.options = field.options
			else
				fs.autoform.type = "select"
				fs.autoform.options = field.options
				fs.autoform.firstOption = ""
		else if field.type == "currency"
			fs.type = Number
			fs.autoform.type = "steedosNumber"
			fs.autoform.precision = field.precision || 18
			if field?.scale
				fs.autoform.scale = field.scale
				fs.decimal = true
			else if field?.scale != 0
				fs.autoform.scale = 2
				fs.decimal = true
		else if field.type == "number"
			fs.type = Number
			fs.autoform.type = "steedosNumber"
			fs.autoform.precision = field.precision || 18
			if field?.scale
				fs.autoform.scale = field.scale
				fs.decimal = true
		else if field.type == "boolean"
			fs.type = Boolean
			fs.autoform.type = "steedos-boolean-checkbox"
		else if field.type == "reference"
			fs.type = String
		else if field.type == "checkbox"
			fs.type = [String]
			fs.autoform.type = "select-checkbox"
			fs.autoform.options = field.options
		else if field.type == "file" and field.collection
			if field.multiple
				fs.type = [String]
				schema[field_name + ".$"] =
					autoform:
						type: 'fileUpload'
						collection: field.collection
			else
				fs.type = String
				fs.autoform.type = 'fileUpload'
				fs.autoform.collection = field.collection
		else if field.type == "filesize"
			fs.type = Number
			fs.autoform.type = 'filesize'
		else if field.type == "Object" || field.type == "object"
			fs.type = Object
		else if field.type == "grid"
			fs.type = Array
			fs.autoform.editable = true
			fs.autoform.type = "steedosGrid"

			schema[field_name + ".$"] =
				type: Object
		else if field.type == "image"
			if field.multiple
				fs.type = [String]
				schema[field_name + ".$"] =
					autoform:
						type: 'fileUpload'
						collection: 'images'
						accept: 'image/*'
			else
				fs.type = String
				fs.autoform.type = 'fileUpload'
				fs.autoform.collection = 'images'
				fs.autoform.accept = 'image/*'
		else if field.type == "avatar"
			if field.multiple
				fs.type = [String]
				schema[field_name + ".$"] =
					autoform:
						type: 'fileUpload'
						collection: 'avatars'
						accept: 'image/*'
			else
				fs.type = String
				fs.autoform.type = 'fileUpload'
				fs.autoform.collection = 'avatars'
				fs.autoform.accept = 'image/*'
		else if field.type == "audio"
			if field.multiple
				fs.type = [String]
				schema[field_name + ".$"] =
					autoform:
						type: 'fileUpload'
						collection: 'audios'
						accept: 'audio/*'
			else
				fs.type = String
				fs.autoform.type = 'fileUpload'
				fs.autoform.collection = 'audios'
				fs.autoform.accept = 'audio/*'
		else if field.type == "video"
			if field.multiple
				fs.type = [String]
				schema[field_name + ".$"] =
					autoform:
						type: 'fileUpload'
						collection: 'videos'
						accept: 'video/*'
			else
				fs.type = String
				fs.autoform.type = 'fileUpload'
				fs.autoform.collection = 'videos'
				fs.autoform.accept = 'video/*'
		else if field.type == "location"
			fs.type = Object
			fs.autoform.type = "location"
			fs.autoform.system = field.system || "wgs84"
			fs.blackbox = true
		else if field.type == "markdown"
			fs.type = String
			fs.autoform.type = "steedos-markdown"
		else if field.type == 'url'
			fs.type = String
			# fs.regEx = SimpleSchema.RegEx.Url
			fs.autoform.type = 'steedosUrl'
		else if field.type == 'email'
			fs.type = String
			fs.regEx = SimpleSchema.RegEx.Email
			fs.autoform.type = 'steedosEmail'
		else if field.type == 'autonumber'
			fs.type = String
		else
			fs.type = field.type

		if field.label
			fs.label = field.label

		if field.allowedValues
			fs.allowedValues = field.allowedValues

		if !field.required
			fs.optional = true

		if field.unique
			fs.unique = true

		if field.omit
			fs.autoform.omit = true

		if field.group
			fs.autoform.group = field.group

		if field.is_wide
			fs.autoform.is_wide = true

		if field.hidden
			fs.autoform.type = "hidden"

		if (field.type == "select") or (field.type == "lookup") or (field.type == "master_detail")
			if typeof(field.filterable) == 'undefined'
				field.filterable = true
		if field.name == 'name' || field.is_name
			if typeof(field.searchable) == 'undefined'
				field.searchable = true

		if autoform_type
			fs.autoform.type = autoform_type

		if field.defaultValue
			if Meteor.isClient and Creator.Formular.checkFormula(field.defaultValue)
				fs.autoform.defaultValue = ()->
					return Creator.Formular.run(field.defaultValue, {userId: Meteor.userId(), spaceId: Session.get("spaceId")})
			else
				fs.autoform.defaultValue = field.defaultValue
				if !_.isFunction(field.defaultValue)
					fs.defaultValue = field.defaultValue

		if field.readonly
			fs.autoform.readonly = true

		if field.disabled
			fs.autoform.disabled = true

		if field.inlineHelpText
			fs.autoform.inlineHelpText = field.inlineHelpText

		if field.blackbox
			fs.blackbox = true

		# 只有生产环境才重建索引
		if Meteor.isProduction
			if field.index
				fs.index = field.index
			else if field.sortable
				fs.index = true

		schema[field_name] = fs

	return schema


Creator.getFieldDisplayValue = (object_name, field_name, field_value)->
	html = field_value
	object = Creator.getObject(object_name)
	if !object
		return ""
	field = object.fields(field_name)
	if !field
		return ""

	if field.type == "datetime"
		html = moment(this.val).format('YYYY-MM-DD H:mm')
	else if field.type == "date"
		html = moment(this.val).format('YYYY-MM-DD')

	return html

Creator.checkFieldTypeSupportBetweenQuery = (field_type)->
	return ["date", "datetime", "currency", "number"].includes(field_type)

Creator.pushBetweenBuiltinOptionals = (field_type, operations)->
	builtinValues = Creator.getBetweenBuiltinValues(field_type)
	if builtinValues
		_.forEach builtinValues, (builtinItem, key)->
			operations.push({label: builtinItem.label, value: key})

Creator.getBetweenBuiltinValues = (field_type, is_check_only)->
	# 过滤器字段类型对应的内置选项
	if ["date", "datetime"].includes(field_type)
		return Creator.getBetweenTimeBuiltinValues(is_check_only, field_type)

Creator.getBetweenBuiltinValueItem = (field_type, key)->
	# 过滤器字段类型对应的内置选项
	if ["date", "datetime"].includes(field_type)
		return Creator.getBetweenTimeBuiltinValueItem(field_type, key)

Creator.getBetweenBuiltinOperation = (field_type, value)->
	# 根据过滤器的过滤值，获取对应的内置运算符
	# 比如value为last_year，返回between_time_last_year
	unless _.isString(value)
		return
	betweenBuiltinValues = Creator.getBetweenBuiltinValues(field_type)
	unless betweenBuiltinValues
		return
	result = null
	_.each betweenBuiltinValues, (item, operation)->
		if item.key == value
			result = operation
	return result

# 如果只是为判断operation是否存在，则没必要计算values，传入is_check_only为true即可
Creator.getBetweenTimeBuiltinValues = (is_check_only, field_type)->
	# 过滤器时间字段类型对应的内置选项
	return {
		"between_time_last_year": if is_check_only then true else Creator.getBetweenTimeBuiltinValueItem(field_type, "last_year"),
		"between_time_this_year": if is_check_only then true else Creator.getBetweenTimeBuiltinValueItem(field_type, "this_year"),
		"between_time_next_year": if is_check_only then true else Creator.getBetweenTimeBuiltinValueItem(field_type, "next_year"),
		"between_time_last_quarter": if is_check_only then true else Creator.getBetweenTimeBuiltinValueItem(field_type, "last_quarter"),
		"between_time_this_quarter": if is_check_only then true else Creator.getBetweenTimeBuiltinValueItem(field_type, "this_quarter"),
		"between_time_next_quarter": if is_check_only then true else Creator.getBetweenTimeBuiltinValueItem(field_type, "next_quarter"),
		"between_time_last_month": if is_check_only then true else Creator.getBetweenTimeBuiltinValueItem(field_type, "last_month"),
		"between_time_this_month": if is_check_only then true else Creator.getBetweenTimeBuiltinValueItem(field_type, "this_month"),
		"between_time_next_month": if is_check_only then true else Creator.getBetweenTimeBuiltinValueItem(field_type, "next_month"),
		"between_time_last_week": if is_check_only then true else Creator.getBetweenTimeBuiltinValueItem(field_type, "last_week"),
		"between_time_this_week": if is_check_only then true else Creator.getBetweenTimeBuiltinValueItem(field_type, "this_week"),
		"between_time_next_week": if is_check_only then true else Creator.getBetweenTimeBuiltinValueItem(field_type, "next_week"),
		"between_time_yestday": if is_check_only then true else Creator.getBetweenTimeBuiltinValueItem(field_type, "yestday"),
		"between_time_today": if is_check_only then true else Creator.getBetweenTimeBuiltinValueItem(field_type, "today"),
		"between_time_tomorrow": if is_check_only then true else Creator.getBetweenTimeBuiltinValueItem(field_type, "tomorrow"),
		"between_time_last_7_days": if is_check_only then true else Creator.getBetweenTimeBuiltinValueItem(field_type, "last_7_days"),
		"between_time_last_30_days": if is_check_only then true else Creator.getBetweenTimeBuiltinValueItem(field_type, "last_30_days"),
		"between_time_last_60_days": if is_check_only then true else Creator.getBetweenTimeBuiltinValueItem(field_type, "last_60_days"),
		"between_time_last_90_days": if is_check_only then true else Creator.getBetweenTimeBuiltinValueItem(field_type, "last_90_days"),
		"between_time_last_120_days": if is_check_only then true else Creator.getBetweenTimeBuiltinValueItem(field_type, "last_120_days"),
		"between_time_next_7_days": if is_check_only then true else Creator.getBetweenTimeBuiltinValueItem(field_type, "next_7_days"),
		"between_time_next_30_days": if is_check_only then true else Creator.getBetweenTimeBuiltinValueItem(field_type, "next_30_days"),
		"between_time_next_60_days": if is_check_only then true else Creator.getBetweenTimeBuiltinValueItem(field_type, "next_60_days"),
		"between_time_next_90_days": if is_check_only then true else Creator.getBetweenTimeBuiltinValueItem(field_type, "next_90_days"),
		"between_time_next_120_days": if is_check_only then true else Creator.getBetweenTimeBuiltinValueItem(field_type, "next_120_days")
	}

Creator.getQuarterStartMonth = (month)->
	if !month
		month = new Date().getMonth()
	
	if month < 3
		return 0
	else if month < 6
		return 3
	else if month < 9
		return 6
	
	return 9


Creator.getLastQuarterFirstDay = (year,month)->
	if !year
		year = new Date().getFullYear()
	if !month
		month = new Date().getMonth()
	
	if month < 3
		year--
		month = 9
	else if month < 6
		month = 0
	else if month < 9
		month = 3
	else 
		month = 6
	
	return new Date(year, month, 1)
	

Creator.getNextQuarterFirstDay = (year,month)->
	if !year
		year = new Date().getFullYear()
	if !month
		month = new Date().getMonth()
	
	if month < 3
		month = 3
	else if month < 6
		month = 6
	else if month < 9
		month = 9
	else
		year++
		month = 0
	
	return new Date(year, month, 1)

Creator.getMonthDays = (year,month)->
	if month == 11
		return 31
	
	millisecond = 1000 * 60 * 60 * 24
	startDate = new Date(year, month, 1)
	endDate = new Date(year, month+1, 1)
	days = (endDate-startDate)/millisecond
	return days

Creator.getLastMonthFirstDay = (year, month)->
	if !year
		year = new Date().getFullYear()
	if !month
		month = new Date().getMonth()
	
	# 月份为0代表本年的第一月
	if month == 0
		month = 11
		year--
		return new Date(year, month, 1)
	
	# 否则,只减去月份
	month--;
	return new Date(year, month, 1)
	
Creator.getBetweenTimeBuiltinValueItem = (field_type, key)->
	# 过滤器between运算符，现算日期/日期时间类型字段的values值
	now = new Date()
	# 一天的毫秒数
	millisecond = 1000 * 60 * 60 * 24
	yestday = new Date(now.getTime() - millisecond)
	tomorrow = new Date(now.getTime() + millisecond)
	# 一周中的某一天
	week = now.getDay()
	# 减去的天数
	minusDay = if week != 0 then week - 1 else 6
	monday = new Date(now.getTime() - (minusDay * millisecond))
	sunday = new Date(monday.getTime() + (6 * millisecond))
	# 上周日
	lastSunday = new Date(monday.getTime() - millisecond)
	# 上周一
	lastMonday = new Date(lastSunday.getTime() - (millisecond * 6))
	# 下周一
	nextMonday = new Date(sunday.getTime() + millisecond)
	# 下周日
	nextSunday = new Date(nextMonday.getTime() + (millisecond * 6))
	currentYear = now.getFullYear()
	previousYear = currentYear - 1
	nextYear = currentYear + 1
	# 当前月份
	currentMonth = now.getMonth()
	# 计数年、月
	year = now.getFullYear()
	month = now.getMonth()
	# 本月第一天
	firstDay = new Date(currentYear,currentMonth,1)

	# 当为12月的时候年份需要加1
	# 月份需要更新为0 也就是下一年的第一个月
	if currentMonth == 11
		year++
		month++
	else
		month++
	
	# 下月第一天
	nextMonthFirstDay = new Date(year, month, 1)
	# 下月最后一天
	nextMonthFinalDay = new Date(year,month,Creator.getMonthDays(year,month))
	# 本月最后一天
	lastDay = new Date(nextMonthFirstDay.getTime() - millisecond)
	# 上月第一天
	lastMonthFirstDay = Creator.getLastMonthFirstDay(currentYear,currentMonth)
	# 上月最后一天
	lastMonthFinalDay = new Date(firstDay.getTime() - millisecond)
	# 本季度开始日
	thisQuarterStartDay = new Date(currentYear,Creator.getQuarterStartMonth(currentMonth),1)
	# 本季度结束日
	thisQuarterEndDay = new Date(currentYear,Creator.getQuarterStartMonth(currentMonth)+2,Creator.getMonthDays(currentYear,Creator.getQuarterStartMonth(currentMonth)+2))
	# 上季度开始日
	lastQuarterStartDay = Creator.getLastQuarterFirstDay(currentYear,currentMonth)
	# 上季度结束日
	lastQuarterEndDay = new Date(lastQuarterStartDay.getFullYear(),lastQuarterStartDay.getMonth()+2,Creator.getMonthDays(lastQuarterStartDay.getFullYear(),lastQuarterStartDay.getMonth()+2))
	# 下季度开始日
	nextQuarterStartDay = Creator.getNextQuarterFirstDay(currentYear,currentMonth)
	# 下季度结束日
	nextQuarterEndDay = new Date(nextQuarterStartDay.getFullYear(),nextQuarterStartDay.getMonth()+2,Creator.getMonthDays(nextQuarterStartDay.getFullYear(),nextQuarterStartDay.getMonth()+2))
	# 过去7天 
	last_7_days = new Date(now.getTime() - (6 * millisecond))
	# 过去30天
	last_30_days = new Date(now.getTime() - (29 * millisecond))
	# 过去60天
	last_60_days = new Date(now.getTime() - (59 * millisecond))
	# 过去90天
	last_90_days = new Date(now.getTime() - (89 * millisecond))
	# 过去120天
	last_120_days = new Date(now.getTime() - (119 * millisecond))
	# 未来7天 
	next_7_days = new Date(now.getTime() + (6 * millisecond))
	# 未来30天
	next_30_days = new Date(now.getTime() + (29 * millisecond))
	# 未来60天
	next_60_days = new Date(now.getTime() + (59 * millisecond))
	# 未来90天
	next_90_days = new Date(now.getTime() + (89 * millisecond))
	# 未来120天
	next_120_days = new Date(now.getTime() + (119 * millisecond))

	switch key
		when "last_year"
			#去年
			label = t("creator_filter_operation_between_last_year")
			startValue = new Date("#{previousYear}-01-01T00:00:00Z")
			endValue = new Date("#{previousYear}-12-31T23:59:59Z")
		when "this_year"
			#今年
			label = t("creator_filter_operation_between_this_year")
			startValue = new Date("#{currentYear}-01-01T00:00:00Z")
			endValue = new Date("#{currentYear}-12-31T23:59:59Z")
		when "next_year"
			#明年
			label = t("creator_filter_operation_between_next_year")
			startValue = new Date("#{nextYear}-01-01T00:00:00Z")
			endValue = new Date("#{nextYear}-12-31T23:59:59Z")
		when "last_quarter"
			#上季度
			strFirstDay = moment(lastQuarterStartDay).format("YYYY-MM-DD")
			strLastDay = moment(lastQuarterEndDay).format("YYYY-MM-DD")
			label = t("creator_filter_operation_between_last_quarter")
			startValue = new Date("#{strFirstDay}T00:00:00Z")
			endValue = new Date("#{strLastDay}T23:59:59Z")
		when "this_quarter"
			#本季度
			strFirstDay = moment(thisQuarterStartDay).format("YYYY-MM-DD")
			strLastDay = moment(thisQuarterEndDay).format("YYYY-MM-DD")
			label = t("creator_filter_operation_between_this_quarter")
			startValue = new Date("#{strFirstDay}T00:00:00Z")
			endValue = new Date("#{strLastDay}T23:59:59Z")
		when "next_quarter"
			#下季度
			strFirstDay = moment(nextQuarterStartDay).format("YYYY-MM-DD")
			strLastDay = moment(nextQuarterEndDay).format("YYYY-MM-DD")
			label = t("creator_filter_operation_between_next_quarter")
			startValue = new Date("#{strFirstDay}T00:00:00Z")
			endValue = new Date("#{strLastDay}T23:59:59Z")
		when "last_month"
			#上月
			strFirstDay = moment(lastMonthFirstDay).format("YYYY-MM-DD")
			strLastDay = moment(lastMonthFinalDay).format("YYYY-MM-DD")
			label = t("creator_filter_operation_between_last_month")
			startValue = new Date("#{strFirstDay}T00:00:00Z")
			endValue = new Date("#{strLastDay}T23:59:59Z")
		when "this_month"
			#本月
			strFirstDay = moment(firstDay).format("YYYY-MM-DD")
			strLastDay = moment(lastDay).format("YYYY-MM-DD")
			label = t("creator_filter_operation_between_this_month")
			startValue = new Date("#{strFirstDay}T00:00:00Z")
			endValue = new Date("#{strLastDay}T23:59:59Z")
		when "next_month"
			#下月
			strFirstDay = moment(nextMonthFirstDay).format("YYYY-MM-DD")
			strLastDay = moment(nextMonthFinalDay).format("YYYY-MM-DD")
			label = t("creator_filter_operation_between_next_month")
			startValue = new Date("#{strFirstDay}T00:00:00Z")
			endValue = new Date("#{strLastDay}T23:59:59Z")
		when "last_week"
			#上周
			strMonday = moment(lastMonday).format("YYYY-MM-DD")
			strSunday = moment(lastSunday).format("YYYY-MM-DD")
			label = t("creator_filter_operation_between_last_week")
			startValue = new Date("#{strMonday}T00:00:00Z")
			endValue = new Date("#{strSunday}T23:59:59Z")
		when "this_week"
			#本周
			strMonday = moment(monday).format("YYYY-MM-DD")
			strSunday = moment(sunday).format("YYYY-MM-DD")
			label = t("creator_filter_operation_between_this_week")
			startValue = new Date("#{strMonday}T00:00:00Z")
			endValue = new Date("#{strSunday}T23:59:59Z")
		when "next_week"
			#下周
			strMonday = moment(nextMonday).format("YYYY-MM-DD")
			strSunday = moment(nextSunday).format("YYYY-MM-DD")
			label = t("creator_filter_operation_between_next_week")
			startValue = new Date("#{strMonday}T00:00:00Z")
			endValue = new Date("#{strSunday}T23:59:59Z")
		when "yestday"
			#昨天
			strYestday = moment(yestday).format("YYYY-MM-DD")
			label = t("creator_filter_operation_between_yestday")
			startValue = new Date("#{strYestday}T00:00:00Z")
			endValue = new Date("#{strYestday}T23:59:59Z")
		when "today"
			#今天
			strToday = moment(now).format("YYYY-MM-DD")
			label = t("creator_filter_operation_between_today")
			startValue = new Date("#{strToday}T00:00:00Z")
			endValue = new Date("#{strToday}T23:59:59Z")
		when "tomorrow"
			#明天
			strTomorrow = moment(tomorrow).format("YYYY-MM-DD")
			label = t("creator_filter_operation_between_tomorrow")
			startValue = new Date("#{strTomorrow}T00:00:00Z")
			endValue = new Date("#{strTomorrow}T23:59:59Z")
		when "last_7_days"
			#过去7天
			strStartDay = moment(last_7_days).format("YYYY-MM-DD") 
			strEndDay = moment(now).format("YYYY-MM-DD")
			label = t("creator_filter_operation_between_last_7_days")
			startValue = new Date("#{strStartDay}T00:00:00Z")
			endValue = new Date("#{strEndDay}T23:59:59Z")
		when "last_30_days"
			#过去30天
			strStartDay = moment(last_30_days).format("YYYY-MM-DD")
			strEndDay = moment(now).format("YYYY-MM-DD")
			label = t("creator_filter_operation_between_last_30_days")
			startValue = new Date("#{strStartDay}T00:00:00Z")
			endValue = new Date("#{strEndDay}T23:59:59Z")
		when "last_60_days"
			#过去60天
			strStartDay = moment(last_60_days).format("YYYY-MM-DD")
			strEndDay = moment(now).format("YYYY-MM-DD")
			label = t("creator_filter_operation_between_last_60_days")
			startValue = new Date("#{strStartDay}T00:00:00Z")
			endValue = new Date("#{strEndDay}T23:59:59Z")
		when "last_90_days"
			#过去90天
			strStartDay = moment(last_90_days).format("YYYY-MM-DD")
			strEndDay = moment(now).format("YYYY-MM-DD")
			label = t("creator_filter_operation_between_last_90_days")
			startValue = new Date("#{strStartDay}T00:00:00Z")
			endValue = new Date("#{strEndDay}T23:59:59Z")
		when "last_120_days"
			#过去120天
			strStartDay = moment(last_120_days).format("YYYY-MM-DD")
			strEndDay = moment(now).format("YYYY-MM-DD")
			label = t("creator_filter_operation_between_last_120_days")
			startValue = new Date("#{strStartDay}T00:00:00Z")
			endValue = new Date("#{strEndDay}T23:59:59Z")
		when "next_7_days"
			#未来7天
			strStartDay = moment(now).format("YYYY-MM-DD")
			strEndDay = moment(next_7_days).format("YYYY-MM-DD")
			label = t("creator_filter_operation_between_next_7_days")
			startValue = new Date("#{strStartDay}T00:00:00Z")
			endValue = new Date("#{strEndDay}T23:59:59Z")
		when "next_30_days"
			#未来30天
			strStartDay = moment(now).format("YYYY-MM-DD")
			strEndDay = moment(next_30_days).format("YYYY-MM-DD")
			label = t("creator_filter_operation_between_next_30_days")
			startValue = new Date("#{strStartDay}T00:00:00Z")
			endValue = new Date("#{strEndDay}T23:59:59Z")
		when "next_60_days"
			#未来60天
			strStartDay = moment(now).format("YYYY-MM-DD")
			strEndDay = moment(next_60_days).format("YYYY-MM-DD")
			label = t("creator_filter_operation_between_next_60_days")
			startValue = new Date("#{strStartDay}T00:00:00Z")
			endValue = new Date("#{strEndDay}T23:59:59Z")
		when "next_90_days"
			#未来90天
			strStartDay = moment(now).format("YYYY-MM-DD")
			strEndDay = moment(next_90_days).format("YYYY-MM-DD")
			label = t("creator_filter_operation_between_next_90_days")
			startValue = new Date("#{strStartDay}T00:00:00Z")
			endValue = new Date("#{strEndDay}T23:59:59Z")
		when "next_120_days"
			#未来120天
			strStartDay = moment(now).format("YYYY-MM-DD")
			strEndDay = moment(next_120_days).format("YYYY-MM-DD")
			label = t("creator_filter_operation_between_next_120_days")
			startValue = new Date("#{strStartDay}T00:00:00Z")
			endValue = new Date("#{strEndDay}T23:59:59Z")
	
	values = [startValue, endValue]
	if field_type == "datetime"
		# 时间类型字段，内置时间范围应该考虑偏移时区值，否则过滤数据存在偏差
		# 非内置时间范围时，用户通过时间控件选择的范围，会自动处理时区偏差情况
		# 日期类型字段，数据库本来就存的是UTC的0点，不存在偏差
		_.forEach values, (fv)->
			if fv
				fv.setHours(fv.getHours() + fv.getTimezoneOffset() / 60 )
	
	return {
		label: label
		key: key
		values: values
	}

Creator.getFieldDefaultOperation = (field_type)->
	if field_type && Creator.checkFieldTypeSupportBetweenQuery(field_type)
		return 'between'
	else if ["textarea", "text", "code"].includes(field_type)
		return 'contains'
	else
		return "="

Creator.getFieldOperation = (field_type) ->
	# 日期类型: date, datetime  支持操作符: "=", "<>", "<", ">", "<=", ">="
	# 文本类型: text, textarea, html  支持操作符: "=", "<>", "contains", "notcontains", "startswith"
	# 选择类型: lookup, master_detail, select 支持操作符: "=", "<>"
	# 数值类型: currency, number  支持操作符: "=", "<>", "<", ">", "<=", ">="
	# 布尔类型: boolean  支持操作符: "=", "<>"
	# 数组类型: checkbox, [text]  支持操作符: "=", "<>"

	optionals = {
		equal: {label: t("creator_filter_operation_equal"), value: "="},
		unequal: {label: t("creator_filter_operation_unequal"), value: "<>"},
		less_than: {label: t("creator_filter_operation_less_than"), value: "<"},
		greater_than: {label: t("creator_filter_operation_greater_than"), value: ">"},
		less_or_equal: {label: t("creator_filter_operation_less_or_equal"), value: "<="},
		greater_or_equal: {label: t("creator_filter_operation_greater_or_equal"), value: ">="},
		contains: {label: t("creator_filter_operation_contains"), value: "contains"},
		not_contain: {label: t("creator_filter_operation_does_not_contain"), value: "notcontains"},
		starts_with: {label: t("creator_filter_operation_starts_with"), value: "startswith"},
		between: {label: t("creator_filter_operation_between"), value: "between"},
	}

	if field_type == undefined
		return _.values(optionals)

	operations = []

	if Creator.checkFieldTypeSupportBetweenQuery(field_type)
		operations.push(optionals.between)
		Creator.pushBetweenBuiltinOptionals(field_type, operations)
	else if field_type == "text" or field_type == "textarea" or field_type == "html" or field_type == "code"
#		operations.push(optionals.equal, optionals.unequal, optionals.contains, optionals.not_contain, optionals.starts_with)
		operations.push(optionals.contains)
	else if field_type == "lookup" or field_type == "master_detail" or field_type == "select"
		operations.push(optionals.equal, optionals.unequal)
	else if field_type == "currency" or field_type == "number"
		operations.push(optionals.equal, optionals.unequal, optionals.less_than, optionals.greater_than, optionals.less_or_equal, optionals.greater_or_equal)
	else if field_type == "boolean"
		operations.push(optionals.equal, optionals.unequal)
	else if field_type == "checkbox"
		operations.push(optionals.equal, optionals.unequal)
	else if field_type == "[text]"
		operations.push(optionals.equal, optionals.unequal)
	else
		operations.push(optionals.equal, optionals.unequal)

	return operations

###
    先按照有排序号的小的在前，大的在后
    再将没有排序号的显示在
###
Creator.getObjectFieldsName = (object_name)->
	fields = Creator.getObject(object_name)?.fields
	fieldsArr = []

	_.each fields, (field)->
		fieldsArr.push {name: field.name, sort_no: field.sort_no}

	fieldsName = []
	_.each _.sortBy(fieldsArr, "sort_no"), (field)->
		fieldsName.push(field.name)
	return fieldsName
