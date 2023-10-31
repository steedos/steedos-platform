/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2023-10-28 15:25:17
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-10-30 19:21:46
 * @Description: 
 */
if (Meteor.isClient) {
    // 添加一个名为steedos-field的输入类型
    AutoForm.addInputType("steedos-field", {
        // 模板
        template: "afSteedosField",
        // 输入值
        valueIn: function (val, atts) {
            return val;
        },
        // 输出值
        valueOut: function () {
            const val = this.data("value");
            console.log('valueOut', val);
            if(_.isString(val)){
                if(val.indexOf('/') > -1){
                    return _.last(lodash.split(val, '/'))
                }
                return val
            }

            if(_.isArray(val)){
                return _.map(val, (v)=>{
                    console.log('valueOut--->', v)
                    if(_.isObject(v) && v.value){
                        return v.value
                    }else if(v.indexOf('/') > -1){
                        return _.last(lodash.split(v, '/'))
                    }
                    return v
                })
            }else if(_.isObject(val)){
                if(val.value){
                    return val.value
                }
            }

            return val;
        },
        // 值转换器
        valueConverters: {
            "stringArray": AutoForm.valueConverters.stringToStringArray,
            "number": AutoForm.valueConverters.stringToNumber,
            "numerArray": AutoForm.valueConverters.stringToNumberArray,
            "boolean": AutoForm.valueConverters.stringToBoolean,
            "booleanArray": AutoForm.valueConverters.stringToBooleanArray,
            "date": AutoForm.valueConverters.stringToDate,
            "dateArray": AutoForm.valueConverters.stringToDateArray
        },
        // 上下文调整
        contextAdjust: function (context) {
            if (typeof context.atts.maxlength === 'undefined' && typeof context.max === 'number') {
                context.atts.maxlength = context.max;
            }
            return context;
        }
    });

    // 渲染afSteedosField模板
    Template.afSteedosField.rendered = function () {
        console.log('afSteedosField rendered', this)
        const atts = this.data.atts;
        // 获取值
        let ids = this.data.value;
        let values = [];
        // 判断字段类型
        if(ids){
            if(atts.fieldType === 'image'){
                // 判断是否是字符串
                if(_.isString(ids)){
                    ids = [ids]
                }
                // 遍历值，获取图片链接
                _.each(ids, (id)=>{
                    values.push(window.getImageFieldUrl(Meteor.absoluteUrl(`/api/files/images/${id}`)))
                })
            }else if(atts.fieldType === 'file'){
                if(_.isString(ids)){
                    ids = [ids]
                }
                const res = Steedos.authRequest('/api/v1/cfs_files_filerecord?filters=[["_id","in", '+JSON.stringify(ids)
                +']]&fields=["_id","original"]', {async:false})
                _.each(res.data.items, (file)=>{
                    values.push({
                        value: file._id,
                        name: file.original.name,
                        url: Steedos.absoluteUrl(`/api/files/files/${file._id}`) + "?download=true",
                        state: "uploaded"
                    })
                })
            }else{
                values = ids;
            }
        }else{
            values = ids;
        }
        let disabled = false;
        if(atts.hasOwnProperty("disabled") || atts.hasOwnProperty("readonly")){
            disabled = true;
          }
        $("#"+atts.id).data('value', values);
        const config = JSON.parse(atts.config || "{}");
        const schema = {
            render_engine: 'amis',
            name: "steedos-field-"+atts.id,
            schema: {
                type: 'service',
                name: "steedos-field-"+atts.id,
                body: [
                    {
                        type: 'form',
                        debug: false,
                        "actions": false,
                        "wrapWithPanel": false,
                        id: 'steedosField_' + atts.id,
                        body: [
                            {
                                type: 'steedos-field',
                                field: lodash.defaultsDeep(config,{
                                    name: atts.name,
                                    type: atts.fieldType,
                                    label: false,
                                    is_wide: atts.is_wide,
                                    multiple: atts.multiple,
                                    reference_to: atts.reference_to,
                                    reference_to_field: atts.reference_to_field,
                                    amis: {
                                        value: values,
                                        static: disabled,
                                        disabled: disabled,
                                        disabledOn: undefined
                                    }
                                })
                            }
                        ],
                        onEvent: {
                            change: {
                                actions: [
                                    {
                                        "actionType": "custom",
                                        "script": "console.log('form change event', event);$(\"#"+atts.id+"\").data('value', event.data['"+atts.name+"'])"
                                    }
                                ]
                            }
                        }
                    }
                ]
            }
        };
        
        console.log(`steedos field schema: `, schema);
        // 渲染amis
        Steedos.Page.render($("#"+atts.id)[0], schema, Object.assign({}, {}));
    };
}