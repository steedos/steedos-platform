/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2023-10-28 15:25:17
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-10-30 10:49:00
 * @Description: 
 */
if (Meteor.isClient) {
    // 添加一个名为steedos-field的输入类型
    AutoForm.addInputType("steedos-field", {
        // 模板
        template: "afSteedosField",
        // 输入值
        valueIn: function (val, atts) {
            console.log('afSteedosField valueIn', val, atts)
            return val;
        },
        // 输出值
        valueOut: function () {
            console.log('afSteedosField valueOut', this)
            return ''
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
        // 获取值
        let ids = this.data.value;
        let values = [];
        // 判断字段类型
        if(this.data.atts.fieldType === 'image'){
            // 判断是否是字符串
            if(_.isString(ids)){
                ids = [ids]
            }
            // 遍历值，获取图片链接
            _.each(ids, (id)=>{
                values.push(window.getImageFieldUrl(Meteor.absoluteUrl(`/api/files/images/${id}`)))
            })
        }else{
            values = ids;
        }

        const schema = {
            render_engine: 'amis',
            name: "steedos-field-"+this.data.atts.id,
            schema: {
                type: 'service',
                name: "steedos-field-"+this.data.atts.id,
                body: [
                    {
                        type: 'form',
                        debug: true,
                        id: 'steedosField_' + this.data.atts.id,
                        body: [
                            {
                                type: 'steedos-field',
                                field: {
                                    name: this.data.atts.name,
                                    type: this.data.atts.fieldType,
                                    label: this.data.atts.title,
                                    is_wide: this.data.atts.is_wide,
                                    multiple: this.data.atts.multiple,
                                    amis: {
                                        value: values,
                                        onEvent: {
                                            change: {
                                                actions: [
                                                    {
                                                        "actionType": "custom",
                                                        "script": "console.log('==steedos-field===',event)"
                                                    }
                                                ]
                                            }
                                        }
                                    }
                                }
                            }
                        ],
                        onEvent: {
                            change: {
                                actions: [
                                    {
                                        "actionType": "custom",
                                        "script": "console.log('==form-field=change==',event)"
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
        Steedos.Page.render($("#"+this.data.atts.id)[0], schema, Object.assign({}, {}));
    };
}