# Variables
# - this.object_name
# - this.field_name
# - this.field
# - this.doc
# - this._id

formatFileSize = (filesize)->
	rev = filesize / 1024.00
	unit = 'KB'

	if rev > 1024.00
		rev = rev / 1024.00
		unit = 'MB'


	if rev > 1024.00
		rev = rev / 1024.00
		unit = 'GB'

	return rev.toFixed(2) + unit

Template.creator_table_cell.onRendered ->
	self = this
	self.autorun ->
		_field = self.data.field
		object_name = self.data.object_name
		this_object = Creator.getObject(object_name)
		record_id = self.data._id
#		record = Creator.getCollection(object_name).findOne(record_id)
		record = self.data.doc
		if record
			if  _field?.type == "grid"
				val = _field.name.split('.').reduce (o, x) ->
								o[x]
						, record

				columns = Creator.getSchema(object_name)._objectKeys[_field.name + ".$."]

				columns = _.map columns, (column)->
					field = this_object.fields[_field.name + ".$." + column]
					if field.hidden
						return undefined
					columnItem =
						cssClass: "slds-cell-edit"
						caption: field.label || column
						dataField: column
						alignment: "left"
						cellTemplate: (container, options) ->
							field_name = _field.name + ".$." + column
							field_name = field_name.replace(/\$\./,"")
							cellOption = {_id: options.data._id, val: options.data[column], record_val: record, doc: options.data, field: field, field_name: field_name, object_name:object_name, hideIcon: true, is_detail_view: true}
							Blaze.renderWithData Template.creator_table_cell, cellOption, container[0]
					return columnItem

				columns = _.compact(columns)
				module.dynamicImport('devextreme/ui/data_grid').then (dxDataGrid)->
					DevExpress.ui.dxDataGrid = dxDataGrid;
					self.$(".cellGridContainer").dxDataGrid
						dataSource: val,
						columns: columns
						showColumnLines: false
						showRowLines: true
						height: "auto"
		
		# 显示额外的其他字段
		if _field.name == "created_by"
			_field.extra_field = "created"
		else if _field.name == "modified_by"
			_field.extra_field = "modified"
		extra_field = _field?.extra_field
		if extra_field and self.data.is_detail_view
			extraContainer = self.$(".cell-extra-field-container")
			unless extraContainer.find(".creator_table_cell").length
				currentDoc = self.data.doc
				unless currentDoc
					return
				if extra_field.indexOf(".") > 0
					# 子表字段取值
					extraKeys = extra_field.split(".")
					extraFirstLevelValue = currentDoc[extraKeys[0]]
					extraVal = extraFirstLevelValue[extraKeys[1]]
				else
					extraVal = currentDoc[extra_field]
				cellOption = {_id: currentDoc._id, val: extraVal, doc: currentDoc, field: this_object.fields[extra_field], field_name: extra_field, object_name:object_name, hideIcon: true, is_detail_view: true}
				Blaze.renderWithData Template.creator_table_cell, cellOption, extraContainer[0]

Template.creator_table_cell.helpers Creator.helpers

Template.creator_table_cell.helpers
	openWindow: ()->
		if Steedos.isMobile()
			return false
		if Template.instance().data?.open_window || Template.instance().data?.is_related
			return true
		object_name = this.object_name
		this_object = Creator.getObject(object_name)
		if this_object?.open_window == true || this.reference_to # 所有的相关链接 改为弹出新窗口 #735
			return true
		else
			return false
	
	itemActionName: ()->
		data = Template.instance().data
		unless data
			return null
		object_name = data.object_name
		isFieldName = data.field_name == Creator.getObject(object_name).NAME_FIELD_KEY
		if object_name == "cms_files" and isFieldName
			return "download"
		else
			return null

	cellData: ()->
		data = []

		val = this.val

		object_name = this.object_name

		this_object = Creator.getObject(object_name)

		this_name_field_key = this_object.NAME_FIELD_KEY
		if object_name == "organizations"
			# 显示组织列表时，特殊处理name_field_key为name字段
			this_name_field_key = "name"

		_field = this.field

		if !_field
			return

		reference_to = this.field?.reference_to

		if _.isFunction(reference_to)
			reference_to = reference_to()

		if _field.type == "grid"
			data.push {isTable: true}
		else if _field.type == "location"
			data.push {value: val?.address || '', id: this._id}
		else if (_field.type == "lookup" || _field.type == "master_detail") && !_.isEmpty(val)
			# 有optionsFunction的情况下，reference_to不考虑数组
			if _.isFunction(_field.optionsFunction) && !_field.reference_to
				_values = this.doc || {}
				_record_val = this.record_val
				_val = val
				if _val
					if _.isArray(_val)
						_val = _val.map (_item)->
							return if _.isObject(_item) then _item._id else _item
					else
						if _.isObject(_val)
							_val = [_val._id]
						else
							_val = [_val]
					selectedOptions = _.filter _field.optionsFunction(_record_val || _values), (_o)->
						return _val.indexOf(_o?.value) > -1
					if selectedOptions
						if val && _.isArray(val) && _.isArray(selectedOptions)
							selectedOptions = Creator.getOrderlySetByIds(selectedOptions, val, "value")
						val = selectedOptions.getProperty("label")
				if reference_to && false
					_.each val, (v)->
						href = Creator.getObjectUrl(reference_to, v)
						data.push {reference_to: reference_to,  rid: v, value: v, id: this._id, href: href}
				else
					data.push {value: val, id: this._id}
			else
				if !_.isArray(val)
					val = if val then [val] else []
				_.each val, (v)->
					reference_to = v["reference_to._o"] || reference_to
					rid = v._id
					rvalue = v['_NAME_FIELD_VALUE']
					if _.isString v
						# 如果未能取到expand数据（包括_id对应记录本身被删除的情况），则直接用_id作为值显示出来，且href能指向正确的url
						rid = v
						rvalue = v
					href = Creator.getObjectUrl(reference_to, rid)
					data.push {reference_to: reference_to, rid: rid, value: rvalue, href: href, id: this._id}

		else if _field.type == "image"
			if typeof val is "string"
				data.push {value: val, id: this._id, isImage: true, baseUrl: Creator.getRelativeUrl("/api/files/images")}
			else
				data.push {value: val, id: this._id, isImages: true, baseUrl: Creator.getRelativeUrl("/api/files/images")}
		else if _field.type == "avatar"
			if typeof val is "string"
				data.push {value: val, id: this._id, isImage: true, baseUrl: Creator.getRelativeUrl("/api/files/avatars")}
			else
				data.push {value: val, id: this._id, isImages: true, baseUrl: Creator.getRelativeUrl("/api/files/avatars")}
		else if _field.type == "code"
			if val
				val = '...'
			else
				val = ''
			data.push {value: val, id: this._id}
		else if _field.type == "password"
			if val
				val = '******'
			else
				val = ''
			data.push {value: val, id: this._id}
		else if _field.type == "url"
			href = val
			if !href?.startsWith("http")
				href = Steedos.absoluteUrl(encodeURI(href))
			data.push({value: val, href: href, id: this._id, isUrl: true})
		else if _field.type == "email"
			data.push({value: val, href: href, id: this._id, isEmail: true})
		else if _field.type == "textarea"
			if val
				val = val.replace(/\n/g, '\n<br>');
				val = val.replace(/ /g, '&nbsp;');
			data.push {value: val, id: this._id, type: _field.type}
		else
			if (val && ["datetime", "date"].indexOf(_field.type) >= 0)
				if this.agreement == "odata"
					# 老的datatable列表界面，现在没有在用了，都用DevExtreme的grid列表代替了
					if _field.type == "datetime"
						if typeof this.val == "string" and /\d+Z$/.test(this.val)
							# "2009-12-11T00:00:00.000Z"这种以Z结尾的值本身就带了时区信息，不需要再add offset了
							val = moment(this.val).format('YYYY-MM-DD H:mm')
						else
							# DevExtreme的grid列表中this.val是Date类型，需要add offset
							utcOffset = moment().utcOffset() / 60
							val = moment(this.val).add(utcOffset, "hours").format('YYYY-MM-DD H:mm')
					else if _field.type == "date"
						if typeof this.val == "string" and /\d+Z$/.test(this.val)
							# "2009-12-11T00:00:00.000Z"这种以Z结尾的值本身就带了时区信息，不需要再add offset了
							# 日期字段类型统一存储为utc的0点，所以显示的时候也需要按utc时间直接显示
							val = moment.utc(this.val).format('YYYY-MM-DD')
						else
							# DevExtreme的grid列表中this.val是Date类型，本身已经做了时区转换，所以不能用utc时间显示
							val = moment(this.val).format('YYYY-MM-DD')
				else
					if _field.type == "datetime"
						val = moment(this.val).format('YYYY-MM-DD H:mm')
					else if _field.type == "date"
						val = moment.utc(this.val).format('YYYY-MM-DD')
			else if (this.val == null)
				val = ""
			else if _field.type == "boolean"
				if this.val
					val = "是"
				else
					val = "否"
			else if _field.type == "select"
				_options = _field.allOptions || _field.options
				_values = this.doc || {}
				_record_val = this.record_val
				if _.isFunction(_field.options)
					_options = _field.options(_record_val || _values)
				if _.isFunction(_field.optionsFunction)
					_options = _field.optionsFunction(_record_val || _values)
				if _.isArray(this.val)
					self_val = this.val
					_val = []
					_.each _options, (_o)->
						if _.indexOf(self_val, _o.value) > -1
							_val.push _o.label
					val = _val.join(",")
				else
					val = _.findWhere(_options, {value: this.val})?.label
				unless val
					val = this.val
			else if _field.type == "lookup"
				if _.isFunction(_field.optionsFunction)
					_values = this.doc || {}
					_val = val
					if _val
						if !_.isArray(_val)
							_val = [_val]
						selectedOptions = _.filter _field.optionsFunction(_values), (_o)->
							return _val.indexOf(_o.value) > -1
						if selectedOptions
							val = selectedOptions.getProperty("label")
			else if _field.type == "filesize"
				val = formatFileSize(val)
			else if ["number", "currency"].indexOf(_field.type) > -1 && _.isNumber(val)
				fieldScale = 0
				if _field.scale
					fieldScale = _field.scale
				else if _field.scale != 0
					fieldScale = if _field.type == "currency" then 2 else 0
				val = Number(val).toFixed(fieldScale)
				reg = /(\d)(?=(\d{3})+\.)/g
				if fieldScale == 0
					reg = /(\d)(?=(\d{3})+\b)/g
				val = val.replace(reg, '$1,')
			else if _field.type == "markdown"
				if !_.isEmpty(val)
					val = Spacebars.SafeString(marked(val))
			else if _field.type == "html"
				if !_.isEmpty(val)
					val = Spacebars.SafeString(val)

			if this.parent_view != 'record_details' && this.field_name == this_name_field_key
				href = Creator.getObjectUrl(this.object_name, this._id)

			data.push({value: val, href: href, id: this._id})

		return data;

	editable: ()->
		if !this.field
			return false
		safeField = Creator.getRecordSafeField(this.field, this.doc, this.object_name);

		if safeField.omit or safeField.readonly
			return false

		if safeField.type == "filesize"
			return false

		permission = Creator.getRecordPermissions(this.object_name, this.doc, Meteor.userId())
		if !permission.allowEdit
			return false

		return true

	showEditIcon: ()->
		if this.hideIcon
			return false
		return true

	isMarkdown: (type)->
		return type is "markdown"

	isType: (type) ->
		return this.type is type

	isExtraField: () ->
		fieldName = this.field?.name
		return fieldName == "created_by" or fieldName == "modified_by"


Template.creator_table_cell.events

	'click .list-item-link-action': (event, template) ->
		data = template.data
		unless data
			return false
		objectName = data.object_name
		recordId = data._id
		# name字段链接点击时执行相应action，而不是默认的进入详细界面
		actionName = event.currentTarget.dataset.actionName
		action = Creator.getActions(objectName).find (n)->
			return n.name == actionName
		unless action
			return false
		Creator.executeAction(objectName, action, recordId)