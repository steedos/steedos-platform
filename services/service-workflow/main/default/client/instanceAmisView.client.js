/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2023-07-03 18:46:55
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-07-10 17:22:10
 * @Description: 
 */
; (function () {
        
    try {

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
            'input-datetime',
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

        function getFormInputFields(formSchema, inputFields) {

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
                        getFormInputFields(bodyItem, inputFields);
                    }
                }

            })
            return inputFields;
        }

        const getAmisSchema = function(ins, formReadonly){
            const form = db.forms.findOne({_id: ins.form},{fields:{amis_schema: 1}})
            const amisSchema = _.isString(form.amis_schema) ? JSON.parse(form.amis_schema) : ( form.amis_schema || {});
    
            delete amisSchema.data;
    
            // if(amisSchema.data){
            //     delete amisSchema.data.context;
            //     delete amisSchema.data.app_id;
            //     delete amisSchema.data.tab_id;
            //     delete amisSchema.data.object_name;
            //     delete amisSchema.data.dataComponentId;
            //     delete amisSchema.data.record_id;
            //     delete amisSchema.data.record;
            //     delete amisSchema.data.permissions;
            // }
            const formSchema = getInstanceFormSchema(amisSchema) || {};
            formSchema.id='instanceForm';
            if(formReadonly){
                formSchema.static = true;
            }else{
                if(Session.get("box") === 'draft' || Session.get("box") === 'pending'){
                    const formChange = {
                        "actionType": "custom",
                        "script": "Session.set('instance_form_values', {instanceId: event.data.instanceId, values: JSON.parse(JSON.stringify(event.data))});Session.set('instance_next_user_recalculate', new Date().getTime())"
                    }; //
                    if(formSchema.onEvent?.change && formSchema.onEvent.change.actions){
                        formSchema.onEvent.change.actions.push(formChange)
                    }else{
                        formSchema.onEvent = Object.assign({}, formSchema.onEvent, {
                            change: {
                                actions: [formChange]
                            }
                        })
                    }
                }   
            }

            const permissions = WorkflowManager.getInstanceFieldPermission();
            const fields = getFormInputFields(formSchema, []);

            for (const field of fields) {
                if(formReadonly || permissions[field.name] != 'editable'){
                    if(field.type == 'steedos-field'){
                        field.readonly = true;
                        field.static = true;
                        if(field.config){
                            field.config = Object.assign({}, _.isString(field.config) ? JSON.parse(field.config) : field.config, {readonly: true, static: true})
                            field.config.amis = Object.assign({}, _.isString(field.config.amis) ? JSON.parse(field.config.amis) : field.config.amis, {static: true})
                        }
                    }else{
                        field.static = true;
                    }
                }
            }

            console.log(`amisSchema`, amisSchema)
            return amisSchema;
        }


        if(!Steedos.Workflow){
            Steedos.Workflow = {}
        }
        Steedos.Workflow.instanceAmisView = {
            onCreated: function(ctx){
                console.log(`Steedos.Workflow.instanceAmisView: onCreated`, ctx)
            },
            onRendered: function(ctx){
                console.log(`Steedos.Workflow.instanceAmisView: onRendered`, ctx)
                const root = $("#instanceAmisView")[0];
                const ins = WorkflowManager.getInstance();

                const amisSchema = getAmisSchema(ins, ctx.data.readonly);

                const page = {
                    name: "instanceAmisView",
                    render_engine: "amis",
                    schema: {
                        type: "service",
                        body: amisSchema,
                        id: "instanceAmisView",
                        data: {
                            instanceId: ins._id,
                        }
                    }
                }
        
                const instanceValues = WorkflowManager_format.getAutoformSchemaValues();
                _.each(instanceValues, (value, key) => {
                    if(_.isObject(value) && !_.isArray(value)){
                        instanceValues[key] = value.id
                    }
                })
                Session.set("instance_form_values", {instanceId: ins._id, values: instanceValues});
                Steedos.Page.render(root, page, {
                    ...instanceValues
                });
            }
        }
    } catch (error) {
        console.error(error)
    };
})();




