Creator.formBuilder.validateFormFields = (fields)->
	fieldsCode = Creator.formBuilder.getFieldsCode(fields)
	validate = true
	_.each fields, (field)->
		try
			if !field.code
				throw new Meteor.Error('500', "请填写#{field.name}的字段名")

			if _.filter(fieldsCode, (fc)->
				fc == field.code
			).length > 1
				throw new Meteor.Error('500', "#{field.name}字段名重复")

			if ['table', 'section'].includes(field.type)
				Creator.formBuilder.validateFormFields field.fields

			validate = Creator.formBuilder.validateForFmield field, fields
		catch e
			console.error('validateFormFields', e);
			validate = false
			toastr.error(e.reason)
	return validate
Creator.formBuilder.validateForFmield = (field, fields)->
	switch field.type
		when 'email'
			emailValid(field)
		when 'select'
			optionsValid(field)
		when 'multiSelect'
			optionsValid(field)
		when 'radio'
			optionsValid(field)
		when 'table'
			tableValid(field)
	return hasFormulaFieldValid(field, fields)

########private function#########
optionsValid = (field)->
	if !_.isString(field.options) || !field.options
		throw new Meteor.Error('500', "#{field.name}未设置选择项")

emailValid = (field)->
	if field.default_value
		reg = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/;
		if !reg.test(field.default_value)
			throw new Meteor.Error('500', "#{field.name}默认值不符合邮件地址的规则")

tableValid = (field)->
	if !_.isArray(field.fields) || field.fields.length == 0
		throw new Meteor.Error('500', "#{field.name}未设置列表字段")

#字段公式不是循环引用
hasFormulaFieldValid = (field, fields) ->
	if !field.formula or !fields or field.formula.trim() == ''
		return true
	#校验公式避免循环引用
	fields_has_formula = new Array
	formula_codes = new Array
	#用于存放 表单上的所有 '主表code'+'.'+'字表code'
	i = fields.length - 1
	while i >= 0
		_f = fields[i]
		if _f.formula and _f.formula.trim() != ''
			fields_has_formula.push _f
			formula_codes.push _f.code
		i--
	#将字符串按长度 从短到长排序
	this_code = field.code
	f_formula = field.formula.trim()
	formula_contains_codes = new Array
	j = formula_codes.length - 1
	while j >= 0
		tem_arr = f_formula.split(formula_codes[j])
		if tem_arr.length == 1
#说明公式中不包含此code
			j--
			continue
		else
			tem_formula_str = f_formula
			m = tem_arr.length - 2
			while m >= 0
				code_position = tem_formula_str.search(formula_codes[j])
				pre_char = tem_formula_str.charAt(code_position - 1)
				aft_char = tem_formula_str.charAt(code_position + formula_codes[j].length)
				tem_formula_str = tem_formula_str.slice(code_position + formula_codes[j].length - 1)
				if pre_char.match(/\w/) == null and aft_char.match(/\w/) == null
					if formula_codes[j] != this_code
#去除掉 公式中包含的自身code
						formula_contains_codes.push formula_codes[j]
				m--
		j--
	formula_contains_codes = _.uniq formula_contains_codes
	# 根据field的公式中包含的code查找对应的field集合
	formulas_by_code = new Array
	p = fields_has_formula.length - 1
	while p >= 0
		if _.contains(formula_contains_codes, fields_has_formula[p].code)
			formulas_by_code.push fields_has_formula[p]
		p--

	is_ok = _fieldFormulaValid(formula_codes, formulas_by_code, fields_has_formula, this_code)

	if is_ok == false
		throw new Meteor.Error(500, "#{field.name}公式循环引用")

	return is_ok


_fieldFormulaValid = (formula_codes, formulas_by_code, fields_has_formula, this_code) ->
# 判断找出的field集合中的公式是否包含当前field的code，
# 如果包含则fieldsValid=false，如果不包含则继续查找下一层
	i = formulas_by_code.length - 1
	while i >= 0
		if formulas_by_code[i].formula == null or formulas_by_code[i].code == null
			i--
			continue
		# 提取出公式里的code集合
		f_formula = formulas_by_code[i].formula.trim()
		f_code = formulas_by_code[i].code
		f_contains_codes = new Array
		j = formula_codes.length - 1
		while j >= 0
			tem_arr = f_formula.split(formula_codes[j])
			if tem_arr.length == 1
#说明公式中不包含此code
				j--
				continue
			else
				tem_formula_str = f_formula
				m = tem_arr.length - 2
				while m >= 0
					code_position = tem_formula_str.search(formula_codes[j])
					pre_char = tem_formula_str.charAt(code_position - 1)
					aft_char = tem_formula_str.charAt(code_position + formula_codes[j].length)
					tem_formula_str = tem_formula_str.slice(code_position + formula_codes[j].length - 1)
					if pre_char.match(/\w/) == null and aft_char.match(/\w/) == null
						f_contains_codes.push formula_codes[j]
					m--
			j--
		f_contains_codes = _.uniq f_contains_codes
		if f_contains_codes.length > 0
			if _.contains(f_contains_codes, this_code)
				return false
			else
				fields_has_formula = _.filter fields_has_formula, (_fhf)->
					return _fhf.code != formulas_by_code[i].code
				# 根据field的公式中包含的code查找对应的field集合
				fs_by_code = new Array
				p = fields_has_formula.length - 1
				while p >= 0
					if  _.contains(f_contains_codes, fields_has_formula[p].code)
						fs_by_code.push fields_has_formula[p]
					p--
				return _fieldFormulaValid(formula_codes, fs_by_code, fields_has_formula, this_code)
		i--
