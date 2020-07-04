# 字段配色相关
commonStyle = "border-radius: 10px;padding: 2px 6px;"
_getObjectFieldsColorStyles = (object)->
	# 拿到object中select字段类型options中的color对应的配置，返回相关样式类数组，为空则返回空数组
	result = []
	fields = object.fields
	_.each fields, (field, key) -> 
		options = field.options
		if _.isFunction(options)
			options = options({})
		if field.type == "select" && options?.length
			_.each options, (option) -> 
				if option.color
					color = option.color
					# 支持color中省略#前缀
					if !/^#/.test(color)
						color = "##{color}"
					result.push(".creator-cell-color-#{object.name}-#{key}-#{option.value}{#{commonStyle}background:#{color};}");
	return result

Creator.appendObjectFieldsColorStyles = ()->
	$("#object_fields_color_styles").remove()
	styles = []
	_.each Creator.Objects, (object)->
		styles = _.union styles, _getObjectFieldsColorStyles(object)
	styleCss = $("<style id=\"object_fields_color_styles\" type=\"text/css\">#{styles.join('\r\n')}</style>")
	$('head').append styleCss

