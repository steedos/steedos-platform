Creator.AuditRecords = {}

getLookupFieldValue = (reference_to, value, space_id)->
	if _.isArray(reference_to) && _.isObject(value)
		reference_to = value.o
		previous_ids = value.ids
	if !_.isArray(previous_ids)
		previous_ids = if value then [value] else []
	reference_to_object = Creator.getObject(reference_to, space_id)
	name_field_key = reference_to_object.NAME_FIELD_KEY
	values = Creator.getCollection(reference_to, space_id).find({_id: {$in: previous_ids}}, {fields: {_id:1, "#{name_field_key}": 1}}).fetch()
	values = Creator.getOrderlySetByIds(values, previous_ids)
	return (_.pluck values, name_field_key).join(',')

getLookupFieldModifier = (field, value, space_id)->
	reference_to = field.reference_to
	if _.isFunction(reference_to)
		reference_to = reference_to()
	if _.isFunction(field.optionsFunction)
		if _.isString(reference_to)
			if value
				return getLookupFieldValue(reference_to, value, space_id)
		else
			return ''
	else
		return getLookupFieldValue(reference_to, value, space_id)

###
字段值转换规则:
1 日期 格式存储为 (String): 2018-01-02
2 时间 格式存储为 (String): 2018-01-02 23:12
2 lookup 和下拉框，都是对应的显示名称 (name | label)
3 boolean 就存是/否
4 多行文本\grid\lookup有optionsFunction并且没有reference_to时 不记录新旧值, 只记录修改时间, 修改人, 修改的字段显示名
###
transformFieldValue = (field, value, options)->

	if _.isNull(value) || _.isUndefined(value)
		return

	utcOffset = options.utcOffset
	space_id = options.space_id

	switch field.type
		when 'date'
			return moment.utc(value).format('YYYY-MM-DD')
		when 'datetime'
			return moment(value).utcOffset(utcOffset).format('YYYY-MM-DD HH:mm')
		when 'boolean'
			if _.isBoolean(value)
				if value
					return '是'
				else
					return '否'
		when 'select'
			if _.isString(value)
				value = [value]
			selected_value = _.map field.options, (option)->
				if _.contains(value, option.value)
					return option.label
			return _.compact(selected_value).join(',')
		when 'checkbox'
			if _.isString(value)
				value = [value]
			selected_value = _.map field.options, (option)->
				if _.contains(value, option.value)
					return option.label
			return _.compact(selected_value).join(',')
		when 'lookup'
			return getLookupFieldModifier(field, value, space_id)
		when 'master_detail'
			return getLookupFieldModifier(field, value, space_id)
		when 'textarea'
			return ''
		when 'code'
			return ''
		when 'html'
			return ''
		when 'markdown'
			return ''
		when 'grid'
			return ''
		else
			return value

# 新建时, 不记录明细
insertRecord = (userId, object_name, new_doc)->
#	if !userId
#		return

	collection = Creator.getCollection("audit_records")
	space_id = new_doc.space
	record_id = new_doc._id
	doc = {
		_id: collection._makeNewID()
		space: space_id
		field_name: "已创建。"
		related_to: {
			o: object_name
			ids: [record_id]
		}
	}
	collection.insert doc

# 修改时, 记录字段变更明细
updateRecord = (userId, object_name, new_doc, previous_doc, modifier)->
#	if !userId
#		return

	space_id = new_doc.space
	record_id = new_doc._id

	fields = Creator.getObject(object_name, space_id)?.fields

	modifierSet = modifier.$set

	modifierUnset = modifier.$unset

	### TODO utcOffset 应该来自数据库,待 #984 处理后 调整

    utcOffset = Creator.getCollection("users").findOne({_id: userId})?.utcOffset

	if !_.isNumber(utcOffset)
		utcOffset = 8
	###

	utcOffset = 8

	options = {utcOffset: utcOffset, space_id: space_id}

	_.each modifierSet, (v, k)->
		field = fields?[k]
		previous_value = previous_doc[k]
		new_value = v

		db_previous_value = null
		db_new_value = null

		switch field.type
			when 'date'
				if new_value?.toString() != previous_value?.toString()
					if new_value
						db_new_value = transformFieldValue(field, new_value, options)
					if previous_value
						db_previous_value = transformFieldValue(field, previous_value, options)
			when 'datetime'
				if new_value?.toString() != previous_value?.toString()
					if new_value
						db_new_value = transformFieldValue(field, new_value, options)
					if previous_value
						db_previous_value = transformFieldValue(field, previous_value, options)
			when 'textarea'
				if previous_value != new_value
					db_previous_value = transformFieldValue(field, previous_value, options)
					db_new_value = transformFieldValue(field, new_value, options)
			when 'code'
				if previous_value != new_value
					db_previous_value = transformFieldValue(field, previous_value, options)
					db_new_value = transformFieldValue(field, new_value, options)
			when 'html'
				if previous_value != new_value
					db_previous_value = transformFieldValue(field, previous_value, options)
					db_new_value = transformFieldValue(field, new_value, options)
			when 'markdown'
				if previous_value != new_value
					db_previous_value = transformFieldValue(field, previous_value, options)
					db_new_value = transformFieldValue(field, new_value, options)
			when 'grid'
				if JSON.stringify(previous_value) != JSON.stringify(new_value)
					db_previous_value = transformFieldValue(field, previous_value, options)
					db_new_value = transformFieldValue(field, new_value, options)
			when 'boolean'
				if previous_value != new_value
					db_previous_value = transformFieldValue(field, previous_value, options)
					db_new_value = transformFieldValue(field, new_value, options)
			when 'select'
				if previous_value?.toString() != new_value?.toString()
					db_previous_value = transformFieldValue(field, previous_value, options)
					db_new_value = transformFieldValue(field, new_value, options)
			when 'checkbox'
				if previous_value?.toString() != new_value?.toString()
					db_previous_value = transformFieldValue(field, previous_value, options)
					db_new_value = transformFieldValue(field, new_value, options)
			when 'lookup'
				if JSON.stringify(previous_value) != JSON.stringify(new_value)
					if previous_value
						db_previous_value = transformFieldValue(field, previous_value, options)
					if new_value
						db_new_value = transformFieldValue(field, new_value, options)
			when 'master_detail'
				if JSON.stringify(previous_value) != JSON.stringify(new_value)
					if previous_value
						db_previous_value = transformFieldValue(field, previous_value, options)
					if new_value
						db_new_value = transformFieldValue(field, new_value, options)
			else
				if new_value != previous_value
					db_previous_value = previous_value
					db_new_value = new_value


		if db_new_value != null || db_previous_value != null
			collection = Creator.getCollection("audit_records")
			doc = {
				_id: collection._makeNewID()
				space: space_id
				field_name: field.label || field.name
				previous_value: db_previous_value
				new_value: db_new_value
				related_to: {
					o: object_name
					ids: [record_id]
				}
			}
			collection.insert doc

	_.each modifierUnset, (v, k)->
		field = fields?[k]
		previous_value = previous_doc[k]
		if previous_value || _.isBoolean(previous_value)
			collection = Creator.getCollection("audit_records")
			db_previous_value = transformFieldValue(field, previous_value, options)
			doc = {
				_id: collection._makeNewID()
				space: space_id
				field_name: field.label || field.name
				previous_value: db_previous_value
				related_to: {
					o: object_name
					ids: [record_id]
				}
			}
			collection.insert doc

Creator.AuditRecords.add = (action, userId, object_name, new_doc, previous_doc, modifier)->
	if action == 'update'
		updateRecord(userId, object_name, new_doc, previous_doc, modifier)
	else if action == 'insert'
		insertRecord(userId, object_name, new_doc)
