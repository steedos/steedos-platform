const _ = require('lodash');
const workflow = require('@steedos/workflow');
const objectql = require("@steedos/objectql");
const { ObjectId } = require("mongodb");
const AmisInputTypes = [
    //44个表单项
    'input-image',
    'input-number',
    'input-group',
    'input-file',
    'input-text',
    'uuid',
    'checkbox',
    'checkboxes',
    'radios',
    'list-select',
    'input-tag',
    'switch',
    'input-city',
    'input-color',
    'matrix-checkboxes',
    'nested-select',
    'picker',
    'input-repeat',
    'input-rich-text',
    'input-table',
    'input-color',
    'text',
    'combo',
    'chained-select',
    'transfer',
    'input-tree',
    'tree-select',
    'input-excel',
    'input-kv',
    'input-date-range',
    'input-range',
    'input-rating',
    'input-sub-form',
    'input-date',
    'textarea',
    'tabs-transfer',
    'select',
    'fieldset',//section
    'formula',
    'location-picker',
    'input-table',
    'editor',
    'steedos-field',
	'input-password',
	'input-email',
	'input-url'
];

// getInstanceFormSchema() 在用户创建的表单中获取到type为form name为instanceForm的表单，其他的表单不要
function getInstanceFormSchema(amis_schema) {

    if (amis_schema.type === 'form' && amis_schema.name === 'instanceForm') {
        const proper_schema = amis_schema;
        return proper_schema;
    }

    const body = amis_schema.body;

    if (_.isArray(body)) {
        for (const item of body) {
            return getInstanceFormSchema(item);
        }
    }

}

// getInputFiled() 对符合条件的formSchema做解析处理,{},{},{}格式
function getInputFiled(bodyItem) {
    if (!_.isArray(bodyItem)) {
        if (_.includes(AmisInputTypes, bodyItem.type)) {

            return bodyItem;
        }
    }
}

// getFormInputFields() 得到一个存有formSchema.body，即存有用户创建表单内各组建字段的数组
let inputFields = [];
function getFormInputFields(formSchema) {

    _.each(formSchema.body, (bodyItem) => {

        let flag = true;
        // 对符合条件的formSchema做解析处理
        const field = getInputFiled(bodyItem);
        if (field) {
            //进入if说明是表单项
            _.each(inputFields, (item) => {
				// 考虑使用steedos-field组件时 name配置到config的情况
				field.name = field.name || field.config.name;
                // 如果要添加的field重复 无需再添加
				if (field.name === item.name) {
                    flag = false;
                }
            })
            if (flag) {
                inputFields.push(field);
            }
        }else{
            //else schema中有嵌套表单项的元素 对其进行递归
            if(_.isArray(bodyItem.body)){
                getFormInputFields(bodyItem);
            }
        }

    })
    // return inputFields;
}

// getFinalFormFields() 得到最终符合条件的数组
function getFinalFormFields(inputFields) {

    const finalFormFields = [];

    _.each(inputFields, (amisField) => {
        const temp = transformFormFields(amisField);
        finalFormFields.push(temp)
    })

    return finalFormFields
}

// transformFormFieldsOut() 对获取的字段进行转换
function transformFormFields(amisField) {
    let formFieldsItem = {
        _id: new ObjectId().toHexString(),
        code: amisField.name,
        name: amisField.label,
        is_wide: _.includes(amisField.className, "is_wide"),
		default_value: _.get(amisField, 'value', ''),
        is_required: amisField.required == true ? true : false,
        is_multiselect: amisField.multiple == true ? true : false,
		is_list_display: _.includes(amisField.className, "is_list_display"),
        is_searchable: _.includes(amisField.className, "is_searchable")
    }

    switch (amisField.type) {

        case 'input-table':
            formFieldsItem.type = 'table';
			formFieldsItem.is_wide = true;
            formFieldsItem.fields = _.map(amisField.columns, (item) => {
                return transformFormFields(item);
            })
            break
		//对amis设计器表格编辑框行组件的转换
		case 'tpl':
			formFieldsItem.type = 'input'
			break
		case 'image':
			formFieldsItem.type = 'input'
			break
		case 'progress':
			formFieldsItem.type = 'input'
			break
		case 'status':
			formFieldsItem.type = 'input'
			break
		case 'mapping':
			formFieldsItem.type = 'input'
			break
		case 'operation':
			formFieldsItem.type = 'input'
			break
		case 'text':
			formFieldsItem.type = 'input'
			break

        case 'input-kv':
            // 把他们赋值到新属性fields中
            formFieldsItem.type = 'input';
            formFieldsItem.fields = _.map(amisField.items, (item) => {
                return transformFormFields(item);
            })
            break

        case 'combo':
            formFieldsItem.type = 'input';
            // 把他们赋值到新属性fields中
            formFieldsItem.fields = _.map(amisField.items, (item) => {
                return transformFormFields(item);
            })
            break

        case 'input-kv':
            formFieldsItem.type = 'input';
            // 把他们赋值到新属性fields中
            formFieldsItem.fields = _.map(amisField.items, (item) => {
                return transformFormFields(item);
            })
            break

        case 'transfer':
            formFieldsItem.type = 'input';
            // 把他们赋值到新属性fields中
            formFieldsItem.fields = _.map(amisField.options, (item) => {
                return transformFormFields(item);
            })
            break

        case 'tabs-transfer':
            formFieldsItem.type = 'input';
            // 把他们赋值到新属性fields中
            formFieldsItem.fields = _.map(amisField.options, (item) => {
                return transformFormFields(item);
            })
            break

        case 'input-sub-form':
            formFieldsItem.type = 'input';
            // 把他们赋值到新属性fields中
            formFieldsItem.fields = _.map(amisField.form.body, (item) => {
                return transformFormFields(item);
            })
            break
        case 'input-group':
            formFieldsItem.type = 'input'
            formFieldsItem.fields = _.map(amisField.body, (item) => {
                return transformFormFields(item);
            })
            break

        case 'fieldset':
            formFieldsItem.type = 'section'
            formFieldsItem.name = amisField.title
            formFieldsItem.code = 'fieldset'
			formFieldsItem.is_wide = true
			fieldset_item = amisField.body ? amisField.body : amisField.field
            // 把他们赋值到新属性fields中
            formFieldsItem.fields = _.map(fieldset_item, (item) => {
                return transformFormFields(item);
            })
            break

        case 'input-rich-text':
            formFieldsItem.type = 'html'
            break
        case 'input-image':
            formFieldsItem.type = 'input'
            break
        case 'input-number':
            formFieldsItem.type = 'number'
			formFieldsItem.default_value = _.toString(amisField.value)
			formFieldsItem.digits = amisField.precision
            break
        case 'input-text':
            formFieldsItem.type = 'input'
            break
		case 'input-url':
			formFieldsItem.type = 'url'
			break
		case 'input-password':
			formFieldsItem.type = 'password'
			break
		case 'input-email':
            formFieldsItem.type = 'email'
            break
        case 'uuid':
            formFieldsItem.type = 'input'
            formFieldsItem.name = 'UUID'
            break
        case 'list-select':
            formFieldsItem.type = 'select'
            break
        case 'input-tag':
            formFieldsItem.type = 'input'
            break
        case 'input-city':
            formFieldsItem.type = 'input'
            break
        case 'input-color':
            formFieldsItem.type = 'input'
            break
        case 'picker':
            formFieldsItem.type = 'input'
            break
        case 'input-repeat':
            formFieldsItem.type = 'input'
            break
        case 'input-rich-text':
            formFieldsItem.type = 'input'
            break
        case 'textarea':
            formFieldsItem.type = 'input'
			formFieldsItem.is_textarea = true
            break
        case 'chained-select':
            formFieldsItem.type = 'input'
            break
        case 'input-tree':
            formFieldsItem.type = 'select'
            break
        case 'tree-select':
            formFieldsItem.type = 'input'
            break
        case 'input-excel':
            formFieldsItem.type = 'input'
            break
        case 'input-date-range':
            formFieldsItem.type = 'input'
            break
        case 'input-date':
            formFieldsItem.type = 'date'
            break
        case 'formula':
            formFieldsItem.type = 'input'
            formFieldsItem.name = '公式'
            break
        case 'location-picker':
            formFieldsItem.type = 'input'
            break
        case 'checkbox':
            formFieldsItem.type = 'checkbox'
			formFieldsItem.name = amisField.option
			formFieldsItem.code = amisField.name
            break
        case 'checkboxes':
            formFieldsItem.type = 'multiSelect'
			formFieldsItem.name = amisField.label
			formFieldsItem.code = amisField.name
			formFieldsItem.is_multiselect = amisField.multiple
			formFieldsItem.options = _.map(amisField.options, option => `${option.label}:${option.value}`).join('\n');
            break
        case 'matrix-checkboxes':
            formFieldsItem.type = 'input'
            break
        case 'switch':
            formFieldsItem.type = 'switch'
            break
        case 'radios':
            formFieldsItem.type = 'radio'
			formFieldsItem.name = amisField.label
			formFieldsItem.code = amisField.name
			formFieldsItem.options = _.map(amisField.options, option => `${option.label}:${option.value}`).join('\n');
            break
        case 'nested-select':
            formFieldsItem.type = 'input'
            break
        case 'input-range':
            formFieldsItem.type = 'number'
            break
        case 'input-rating':
            formFieldsItem.type = 'number'
            break
        case 'input-file':
            formFieldsItem.type = 'input'
            break
        case 'editor':
            formFieldsItem.type = 'input'
            break
        case 'select':
			if(amisField && amisField.source){
				formFieldsItem.type = 'odata'
		  		formFieldsItem.description = amisField.description
		  		formFieldsItem.detail_url = amisField.detail_url
		  		formFieldsItem.filters = amisField.filters
		  		formFieldsItem.formula = amisField.formula
		  		formFieldsItem.is_list_display = amisField.is_list_display
		  		formFieldsItem.is_multiselect = amisField.is_multiselect
		  		formFieldsItem.is_required = amisField.is_required
		  		formFieldsItem.is_searchable = amisField.is_searchable
		  		// formFieldsItem.is_wide = amisField.is_wide
		  		formFieldsItem.search_field = amisField.search_field
				formFieldsItem._id = amisField._id

				formFieldsItem.url = amisField.source.url.replace('${context.rootUrl}','')
			}else{
				// 反之为按下拉框字段处理
				formFieldsItem.type = 'select'
				formFieldsItem.name = amisField.label
				formFieldsItem.code = amisField.name
				formFieldsItem.options = _.map(amisField.options, option => `${option.label}:${option.value}`).join('\n');
			}
            break
        case 'steedos-field':

			// 从新表单用steedos-field创建user,group组件的情况
			if(amisField.config){
				let tempConfig = amisField.config;

				let steedosField = {
					_id: amisField.id,
					code: tempConfig.name || amisField.name,
					name: tempConfig.label,
					default_value: _.get(amisField, 'value', ''),
					is_multiselect: amisField.multiple == true ? true : false,
					is_required: amisField.required == true ? true : false,

					is_wide: _.includes(amisField.className, "is_wide"),
					is_list_display: _.includes(amisField.className, "is_list_display"),
					is_searchable: _.includes(amisField.className, "is_searchable"),
				}

				if (tempConfig.reference_to === "organizations") {
					steedosField.type = 'group'
				}else if(tempConfig.reference_to === "space_users"){
					//  && tempConfig.reference_to_field === 'user'
					steedosField.type = 'user'
				}
				return steedosField

			}else if(amisField.field){
				// 在旧表单设置后 打开新表单 再进行设计更改 保存转换格式
				let tempField = JSON.parse(amisField.field)
				let steedosField = {
					_id: amisField.id,
					code: tempField.name || amisField.name,
					name: tempField.label,
					default_value: _.get(amisField, 'value', ''),
					is_multiselect: amisField.multiple == true ? true : false,
					is_required: amisField.required == true ? true : false,

					is_wide: _.includes(amisField.className, "is_wide"),
					is_list_display: _.includes(amisField.className, "is_list_display"),
					is_searchable: _.includes(amisField.className, "is_searchable"),
				}

				if (tempField.reference_to === "organizations") {
					steedosField.type = 'group'
				}else if(tempField.reference_to === "space_users"){
					//  && tempField.reference_to_field === 'user'
					steedosField.type = 'user'
				}
				return steedosField

			}

    }

    return formFieldsItem
}




module.exports = {
    listenTo: 'forms',

    afterUpdate: async function () {

        // 判断doc中是否有amis_schema字段
        if (_.has(this.doc, 'amis_schema')) {

            const amis_schema = JSON.parse(this.doc.amis_schema);
            // 在amis_schema中提取符合条件的amis_schema,若不符合则返回空
            const formSchema = getInstanceFormSchema(amis_schema);

            if (!formSchema) {
                return;
            }
            // 得到符合条件但未进行数据处理的数组

            getFormInputFields(formSchema);

            // 先通过id得到forms对象存下来
            const form = await objectql.getObject('forms').findOne(this.id);
            delete form.historys;


            // 数据库更新操作：将forms表current的fields字段更新为最终数组
            form.current.fields = getFinalFormFields(inputFields);
            inputFields = []

            // 以下为将解析字段存储的功能,为将解析字段存储至数据库forms表的功能
            let updatedForms = [];
            let updatedFlows = [];
            let userId = this.userId;
            let spaceId = this.spaceId;
            let roles = this.roles;
            // 执行者的身份校验
            workflow.desingerManager.checkSpaceUserBeforeUpdate(spaceId, userId, roles);
            // 更新表单
            workflow.desingerManager.updateForm(this.id, form, updatedForms, updatedFlows, userId);
        }

    },

}
