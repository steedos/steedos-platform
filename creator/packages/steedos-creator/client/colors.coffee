# 字段配色相关
commonStyle = "border-radius: 10px;padding: 1px 6px;display: inline-block;"

# hex: {String}, "#333", "#AF0382"
hexToRgb = (hex) ->
	hex = hex.slice(1)
	if hex.length == 3
		hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]
	return {
		r: Number.parseInt(hex.slice(0, 2), 16)
		g: Number.parseInt(hex.slice(2, 4), 16)
		b: Number.parseInt(hex.slice(4, 6), 16)
	}

_pickTextColorBasedOnBgColorSimple = (bgColor, lightColor, darkColor) ->
	rgb = hexToRgb(bgColor)
	{r,g,b} = rgb
	return if r * 0.299 + g * 0.587 + b * 0.114 > 186 then darkColor else lightColor

_pickTextColorBasedOnBgColorAdvanced = (bgColor, lightColor, darkColor) ->
	rgb = hexToRgb(bgColor)
	{r,g,b} = rgb
	uicolors = [
		r / 255
		g / 255
		b / 255
	]
	c = uicolors.map((col) ->
		if col <= 0.03928
			return col / 12.92
		((col + 0.055) / 1.055) ** 2.4
	)
	L = 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]
	return if L > 0.179 then darkColor else lightColor

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
					fontColor = _pickTextColorBasedOnBgColorAdvanced(color, '#fff', '#333')
					result.push(".creator-cell-color-#{object.name}-#{key}-#{option.value}{#{commonStyle}background:#{color};color:#{fontColor};}");
	return result

Creator.appendObjectFieldsColorStyles = ()->
	$("#object_fields_color_styles").remove()
	styles = []
	_.each Creator.Objects, (object)->
		styles = _.union styles, _getObjectFieldsColorStyles(object)
	# styles.push(".creator-cell-multiple-color{margin-right:2px;}");
	styles.push """
		.creator-cell-multiple-color{
			margin-right:1px;
		}
		@media (max-width:767px) {
			.creator-cell-multiple-color{
				margin-right:4px;
			}
		}
	"""
	styleCss = $("<style id=\"object_fields_color_styles\" type=\"text/css\">#{styles.join('\r\n')}</style>")
	$('head').append styleCss

