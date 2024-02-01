Steedos.StandardObjects = {
    Base: {
        Actions:{
            standard_query:{
                visible: function () {
                    if(Session.get('record_id')){
                        return false;
                    }
                    return true;
                },
            },
            standard_new:{
                visible: function (object_name, record_id, record_permissions, props) {
                    var permissions = Creator.getPermissions(object_name);
                    if (permissions) {
                        if (!permissions["allowCreate"]) return false;
                    }
                    // 在相关页，且主表对象enable_lock_detail为true，且主表记录已锁定(locked=true)时不显示子表新增按钮
                    const _isRelated = props._isRelated
                    if(_isRelated){
                        const _master = props._master
                        const { record: masterReocrd, object_name: masterObjectName } = _master
                        const obj = Creator.getObject(masterObjectName)
                        if (obj && obj.enable_lock_detail && masterReocrd.locked) {
                            return false;
                        }
                    }
                    return true;
                }
            },
            standard_edit:{
                visible: function (object_name, record_id, record_permissions) {
                    var permissions = Creator.getPermissions(object_name);
                    if (permissions && permissions["allowEdit"] != true) {
                        return false;
                    }
                    var perms, record;
                    perms = {};
                    if (record_permissions) {
                        perms = record_permissions;
                    } else {
                        record = Creator.getObjectRecord(object_name, record_id);
                        record_permissions = Creator.getRecordPermissions(object_name, record, Meteor.userId());
                        if (record_permissions) {
                            perms = record_permissions;
                        }
                    }
                    return perms["allowEdit"];
                }
            },
            standard_delete:{
                visible: function (object_name, record_id, record_permissions) {
                    var permissions = Creator.getPermissions(object_name);
                    if (permissions && permissions["allowDelete"] != true) {
                        return false;
                    }
                    var perms, record;
                    perms = {};
                    if (record_permissions) {
                        perms = record_permissions;
                    } else {
                        record = Creator.getObjectRecord(object_name, record_id);
                        record_permissions = Creator.getRecordPermissions(object_name, record, Meteor.userId());
                        if (record_permissions) {
                            perms = record_permissions;
                        }
                    }
                    return perms["allowDelete"];
                }
            },
            standard_delete_many:{
                visible: function (object_name, record_id, record_permissions) {
                    if(Steedos.isMobile()){
                        return false;
                    }
                    if(Session.get('record_id')){
                        return false;
                    }
                    var object = Creator.getObject(object_name);
                    var perms = object && object.permissions;
                    return perms && perms["allowDelete"];
                },
                todo: function () {
                    var object_name = this.object_name;
                    var list_view_id = Session.get("list_view_id") || "all";
                    var listViewName = "listview_" + object_name + "_" + list_view_id;
                    Creator.executeAction(object_name, {todo: 'standard_delete'}, null, null, listViewName);
                }
            },
            standard_approve:{
                visible: function (object_name, record_id, record_permissions, props) {
                    if (!Session.get("record_id")) {
                        /*只在详细界面显示这个action*/
                        return false;
                    }
                    var object_workflow, record;
                    if (record_permissions && !record_permissions["allowEdit"]) {
                        return false;
                    }
                    record = props.record;
                    // record_permissions = Creator.getRecordPermissions(object_name, record, Meteor.userId());
                    // if (record_permissions && !record_permissions["allowEdit"]) {
                    //     return false;
                    // }
                    object_workflow = _.find(Creator.object_workflows, function (ow) {
                        return ow.object_name === object_name && (!ow.sync_direction || ow.sync_direction == 'both' || ow.sync_direction == 'obj_to_ins');
                    });
                    if (!object_workflow) {
                        return false;
                    }
                    if (record && record.instances && record.instances.length > 0) {
                        return false;
                    }else if(record && !_.has(record,'instances') ){
						// 如果record存在，且record的instances字段不存在，则再查询一次
						var queryResult = Steedos.authRequest("/graphql", {
							type: 'POST',
							async: false,
							data: JSON.stringify({
								query: `{record:${object_name}__findOne(id: "${record_id}"){instances}}`
							}),
							contentType: 'application/json',
							error: function () { }
						});
						var recordDoc = queryResult && queryResult.data && queryResult.data.record;
						if (recordDoc && recordDoc.instances && recordDoc.instances.length > 0) {
							return false;
						}
					}
                    return true;
                },
                todo: function () {
                    return window.Modal.show('initiate_approval', {
                        object_name: this.object_name,
                        record_id: this.record_id
                    });
                }
            },
            standard_view_instance:{
                visible: function (object_name, record_id, record_permissions, props) {
                    if (!Session.get("record_id")) {
                        /*只在详细界面显示这个action*/
                        return false;
                    }
                    var record = props.record;
                    if (record && !_.isEmpty(record.instances)) {
                        return true;
                    }else if(record && !_.has(record,'instances') ){
						// 如果record存在且record的instances字段不存在，则再查询一次
						var queryResult = Steedos.authRequest("/graphql", {
							type: 'POST',
							async: false,
							data: JSON.stringify({
								query: `{record:${object_name}__findOne(id: "${record_id}"){instances}}`
							}),
							contentType: 'application/json',
							error: function () { }
						});
						var recordDoc = queryResult && queryResult.data && queryResult.data.record;
						if (recordDoc && recordDoc.instances && recordDoc.instances.length > 0) {
							return true;
						}
					}
                    return false;
                },
                todo: function () {
                    console.log(this)
                    var record = this.record.record;
                    var data, instanceId, uobj, url;
                    if (!record.instances || !record.instances[0]) {
                        // 如果record存在且record的instances字段不存在，则再查询一次
                        var queryResult = Steedos.authRequest("/graphql", {
                            type: 'POST',
                            async: false,
                            data: JSON.stringify({
                                query: `{record:${this.object_name}__findOne(id: "${this.record_id}"){instances}}`
                            }),
                            contentType: 'application/json',
                            error: function () { }
                        });
                        var recordDoc = queryResult && queryResult.data && queryResult.data.record;
                        if (recordDoc && recordDoc.instances && recordDoc.instances.length > 0) {
                            instanceId = recordDoc.instances[0]._id;
                        }
                    } else {
                        instanceId = record.instances[0]._id;
                    }
                    if (!instanceId) {
                        console.error('instanceId not exists');
                        return;
                    }
                    Steedos.authRequest(Steedos.absoluteUrl(`api/workflow/instance/check_is_removed/${instanceId}`), {
                        type: 'POST',
                        async: false,
                        data: JSON.stringify({
                            objectName: this.object_name,
                            recordId: this.record_id
                        }),
                        contentType: 'application/json',
                        success: function (res) {
                            Steedos.openWindow(Steedos.absoluteUrl(`api/workflow/instance/${instanceId}`))
                        },
                        error: function (res) {
                            // toastr.error('未找到申请单，可能已被删除，请重新发起审批。');
                            FlowRouter.reload();
                        }
                    });
                }
            },
            standard_follow:{
                visible: function (object_name, record_id, record_permissions) {
                    if (Creator.getObject(object_name)) {
                        return Creator.getObject(object_name).enable_follow
                    }
                    return false;
                },
                todo: function () {
                    var follow = Creator.getCollection("follows").findOne({ object_name: Session.get("object_name") });
                    if (follow) {
                        Creator.odata.delete('follows', follow._id, function () { });
                    } else {
                        Creator.odata.insert('follows', { object_name: Session.get("object_name") });
                    }
                }
            },
            standard_submit_for_approval:{
                visible: function (object_name, record_id) {
                    return Steedos.ProcessManager.allowSubmit(object_name, record_id);
                },
                todo: function (object_name, record_id) {
                    Steedos.ProcessManager.submit(object_name, record_id);
                }
            },
            standard_import_data:{
                visible: function(objectName){
                    var allowCreate = Creator.baseObject.actions.standard_new.visible.apply(this, arguments);
                    var objectName = objectName || this.objectName || FlowRouter.current().params.object_name;
                    if(!window._hasImportTemplates){
                        window._hasImportTemplates = {};
                    }
                    if(_.has(window._hasImportTemplates, objectName)){
                        return window._hasImportTemplates[objectName];
                    }
                    if(allowCreate){
                        var hasImportTemplates = Steedos.authRequest("/graphql", {
                            type: 'POST',
                            async: false,
                            data: JSON.stringify({
                                query: `{records: queue_import(filters: [["object_name", "=", "${objectName}"]]){_id}}`
                            }),
                            contentType: 'application/json',
                            error: function () { }
                        });

                        if(hasImportTemplates && hasImportTemplates.data && hasImportTemplates.data.records && hasImportTemplates.data.records.length > 0){
                            window._hasImportTemplates[objectName] = true;
                            return true;
                        }
                    }
                    window._hasImportTemplates[objectName] = false;
                    return false;
                },
                todo: function(object_name){
                    // const objectName = "queue_import_history";
                    // const object = Creator.getObject(objectName);
                    // const initialValues = {object_name: object_name};
                    // const objectSchema = {
                    //     fields: window.lodash.cloneDeep(object.fields)
                    // };
                    // objectSchema.fields.object_name.hidden = true;
                    // SteedosUI.showModal(stores.ComponentRegistry.components.ObjectForm, {
                    //     name: `${objectName}_standard_new_form`,
                    //     // objectApiName: objectName,
                    //     objectSchema: objectSchema,
                    //     title: '新建 ' + object.label,
                    //     initialValues: initialValues,
                    //     onFinish: async (values = {}) => {
                    //         return new Promise((resolve, reject) => {
                    //             try {
                    //                 stores.API.insertRecord(objectName, Object.assign({}, values, initialValues)).then((result)=>{
                    //                     if(result && result.length > 0){
                    //                         const record_id = result[0]._id;
                    //                         $("body").addClass("loading");
                    //                         $.ajax({
                    //                             url: Steedos.absoluteUrl("/api/data/initiateImport"),
                    //                             type: "post",
                    //                             data: {
                    //                             importObjectHistoryId: record_id
                    //                             },
                    //                             xhrFields: {
                    //                             withCredentials: true
                    //                             },
                    //                             success: function(res){
                    //                                 $("body").removeClass("loading");
                    //                                 SteedosUI.reloadRecord(objectName, record_id);
                    //                                 FlowRouter.reload();
                    //                                 toastr.success(TAPi18n.__("queue_import_action_import_execute_success"));
                    //                             },
                    //                             error: function(res){
                    //                                 $("body").removeClass("loading");
                    //                                 toastr.error(res.responseJSON.message);
                    //                             }
                    //                         });
                    //                         FlowRouter.reload();
                    //                         resolve(true);
                    //                     }
                    //                     resolve(false);
                    //                 }).catch(function(e){
                    //                     console.log(e)
                    //                     toastr.error(e.message)
                    //                     resolve(false);
                    //                 })
                    //             } catch (error) {
                    //                 console.error(`e2`, error);
                    //                 reject(false);
                    //             }
                    //         })
                    //     }
                    // }, null, {iconPath: '/assets/icons'})
                }
            },
            standard_export_excel:{
                visible: function(objectName,  record_id, record_permissions, props){
                    return !props._isRelated && record_permissions.allowExport;
                }
            }
        },
        Fields: {
            companyId:{
                defaultValue: function(){
                    if(Meteor.isClient){
                        return Steedos.getUserCompanyId()
                    }
                },
                optionsFunction: function (values) {
                    var object = Creator.getObject(values._object_name);
                    if(!object){
                        console.error("未找到当前对象：" + values._object_name);
                        return [];
                    }
                    var perms = object.permissions;
                    var options, result, companys, queryFilters;
                    result = [];
                    options = {
                      $select: 'name'
                    };

                    if(perms.modifyAllRecords){
                        /* 如果当前用户对当前业务对象的权限为 modifyAllRecords，那选择分部时可以能从所有分部中选择。*/
                    }
                    else{
                        /* 如果当前用户对当前业务对象的权限为 modifyCompanyRecords，那选择分部时只能从当前用户所属分部中选择。此规则只用于前端限制, 服务端有触发器给记录处理company_id*/
                        var company_ids =  [];

                        /* 防止规则改动导致旧系统对象编辑异常，先放开此判断 */
                        if(true || perms.modifyCompanyRecords){
                            company_ids = Creator.USER_CONTEXT.user.company_ids
                        }

                        /* 如果当前用户对当前业务对象的有修改指定分部，则允许选择指定分部。*/
                        var modifyAssignCompanysRecords = perms.modifyAssignCompanysRecords || [];
                        company_ids = window._.uniq(company_ids.concat(modifyAssignCompanysRecords));

                        if(!company_ids.length){
                            console.warn("当前用户不属于任何分部，无权修改该字段。");
                            queryFilters = ["_id", "=", -1];
                        }else{
                            queryFilters = ["_id", "in", company_ids];
                        }
                    }
                    var customFilters = this.filters;
                    if(!_.isEmpty(customFilters)){
                        if(_.isEmpty(queryFilters)){
                            queryFilters = customFilters;
                        }
                        else{
                            queryFilters = [customFilters, 'and', queryFilters];
                        }
                    }
                    if(!_.isEmpty(queryFilters) && this.template && this.template.data && this.template.data._value && this.template.data._value.length){
                        var _value = this.template.data._value;
                        /*
                            this.template.data._value为原来数据库中返回的选项值，需要始终能兼容返回
                            values.company_id 及 this.template.data.value为当前用户选中的选项，能选中肯定是本来就在列表中的，所以不需要兼容返回
                        */
                        queryFilters = [queryFilters, 'or', ["_id", "=", _value]];
                    }
                    if(!_.isEmpty(queryFilters)){
                        var odataFilter = SteedosFilters.formatFiltersToODataQuery(queryFilters);
                        options.$filter = odataFilter;
                    }
                    companys = Creator.odata.query('company', options, true);
                    companys.forEach(function (item) {
                        result.push({
                        label: item.name,
                        value: item._id
                        });
                    });
                    return result;
                }
            },
            companyIds:{
                defaultValue: function(){
                    if(Meteor.isClient){
                        var companyId = Steedos.getUserCompanyId();
                        if(companyId){
                            return [companyId]
                        }
                        else{
                            return []
                        }
                    }
                },
                optionsFunction: function (values) {
                    var object = Creator.getObject(values._object_name);
                    if(!object){
                        console.error("未找到当前对象：" + values._object_name);
                        return [];
                    }
                    var perms = object.permissions;
                    var options, result, companys, queryFilters;
                    result = [];
                    options = {
                      $select: 'name'
                    };

                    if(perms.modifyAllRecords){
                        /* 如果当前用户对当前业务对象的权限为 modifyAllRecords，那选择分部时可以能从所有分部中选择。*/
                    }
                    else{
                        /* 如果当前用户对当前业务对象的权限为 modifyCompanyRecords，那选择分部时只能从当前用户所属分部中选择。此规则只用于前端限制, 服务端有触发器给记录处理company_id*/
                        var company_ids =  [];

                        /* 防止规则改动导致旧系统对象编辑异常，先放开此判断 */
                        if(true || perms.modifyCompanyRecords){
                            company_ids = Creator.USER_CONTEXT.user.company_ids
                        }

                        /* 如果当前用户对当前业务对象的有修改指定分部，则允许选择指定分部。*/
                        var modifyAssignCompanysRecords = perms.modifyAssignCompanysRecords || [];
                        company_ids = window._.uniq(company_ids.concat(modifyAssignCompanysRecords));

                        if(!company_ids.length){
                            console.warn("当前用户不属于任何分部，无权修改该字段。");
                            queryFilters = ["_id", "=", -1];
                        }else{
                            queryFilters = ["_id", "in", company_ids];
                        }
                    }
                    var customFilters = this.filters;
                    if(!_.isEmpty(customFilters)){
                        if(_.isEmpty(queryFilters)){
                            queryFilters = customFilters;
                        }
                        else{
                            queryFilters = [customFilters, 'and', queryFilters];
                        }
                    }
                    if(!_.isEmpty(queryFilters) && this.template && this.template.data && this.template.data._value && this.template.data._value.length){
                        var _value = this.template.data._value;
                        /*
                            this.template.data._value为原来数据库中返回的选项值，需要始终能兼容返回
                            values.company_ids 及 this.template.data.value为当前用户选中的选项，能选中肯定是本来就在列表中的，所以不需要兼容返回
                        */
                        queryFilters = [queryFilters, 'or', ["_id", "in", _value]];
                    }
                    if(!_.isEmpty(queryFilters)){
                        var odataFilter = SteedosFilters.formatFiltersToODataQuery(queryFilters);
                        options.$filter = odataFilter;
                    }
                    companys = Creator.odata.query('company', options, true);
                    companys.forEach(function (item) {
                        result.push({
                            label: item.name,
                            value: item._id
                        });
                    });
                    return result;
                }
            }
        }
    }
}
