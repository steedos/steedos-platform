reference https://github.com/vazco/meteor-universe-selectize

### lookup
- multiple: 多选。 false/true
- defaultValue： 默认值。支持公式，eg: "{user.organization.name}" ，当前用户主部门。String
- reference_to: 关联对象，从关联对象中选择记录。String/Array
- depend_on: 相关项，用于optionsFunction。值为表单上的字段，当depend_on中的字段值发生变化时，会清空当前字段值及选择项。Array
- optionsFunction: 返回options的函数，有一个参数 values, 可以获取当前记录的字段值，eg: values.name 获取当前记录名称。返回的options格式为： [{label: LABEL, value: VALUE}, {label: LABEL1, value: VALUE1, icon: icon},...]，
- defaultIcon: 选项的图标
