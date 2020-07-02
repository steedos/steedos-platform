Creator.formBuilder.utils = {}

Creator.formBuilder.utils.attrString = (attrs)->
	data = []
	_.each attrs, (val, key)->
		if validAttr(key)
			data.push Object.values(safeAttr(key, val)).join('')
	return data.join(' ')

validAttr = (attr)->
	invalid = [
		'values',
		'enableOther',
		'other',
		'label',
		'subtype'
	]
	return !invalid.includes(attr)

safeAttr = (name, value)->
	name = safeAttrName(name)

	if (value)
		if _.isArray(value)
			valString = escapeAttr(value.join(' '))
		else
			if typeof value == 'boolean'
				value = value.toString()
			valString = escapeAttr(value.trim())
	value = if value then "='#{valString}'" else ''
	return {
		name,
		value,
	}

safeAttrName = (name)->
	_safeAttr = {
		className: 'class',
	}
	return _safeAttr[name] || hyphenCase(name)

hyphenCase = (str) ->
	str = str.replace(/[^\w\s\-]/gi, '')
	str = str.replace(/([A-Z])/g, ($1)->
		return '-' + $1.toLowerCase()
	)
	return str.replace(/\s/g, '-').replace(/^-+/g, '')

escapeAttr = (str)->
	match = {
		'"': '&quot;',
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
	}
	replaceTag =  (tag) ->
		return match[tag] || tag;
	return if _.isString(str) then str.replace(/["&<>]/g, replaceTag) else str
