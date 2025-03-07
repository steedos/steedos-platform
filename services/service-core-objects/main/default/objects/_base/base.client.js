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
                visible: function (object_name, record_id, permissions, props) {
                    if (permissions) {
                        if (!permissions["allowCreate"]) return false;
                    }
                    // 在相关页，且主表对象enable_lock_detail为true，且主表记录已锁定(locked=true)时不显示子表新增按钮
                    const _isRelated = props && props._isRelated;
                    if(_isRelated){
                        const _master = props._master
                        const { record: masterReocrd } = _master;
                        const masterObjectName = _master.objectName || _master.object_name;
                        const obj = getUISchemaSync(masterObjectName)
                        if (obj && obj.enable_lock_detail && masterReocrd.locked) {
                            return false;
                        }
                    }
                    return true;
                }
            },
            standard_edit:{
                visible: function (object_name, record_id, permissions) {
                    if (permissions) {
                        return permissions["allowEdit"];
                    }
                    return false;
                }
            },
            standard_delete:{
                visible: function (object_name, record_id, permissions) {
                    if (permissions) {
                        return permissions["allowDelete"];
                    }
                    return perms["false"];
                }
            },
            standard_delete_many:{
                visible: function (object_name, record_id, permissions) {
                    if(Steedos.isMobile()){
                        return false;
                    }
                    return permissions && permissions["allowDelete"];
                }
            },
            standard_approve:{
                visible: function (object_name, record_id, record_permissions, props) {
                    return false;
                    // if (!Session.get("record_id")) {
                    //     /*只在详细界面显示这个action*/
                    //     return false;
                    // }
                    // var object_workflow, record;
                    // if (record_permissions && !record_permissions["allowEdit"]) {
                    //     return false;
                    // }
                    // record = props.record;
                    // // record_permissions = Creator.getRecordPermissions(object_name, record, Meteor.userId());
                    // // if (record_permissions && !record_permissions["allowEdit"]) {
                    // //     return false;
                    // // }
                    // object_workflow = _.find(Creator.object_workflows, function (ow) {
                    //     return ow.object_name === object_name && (!ow.sync_direction || ow.sync_direction == 'both' || ow.sync_direction == 'obj_to_ins');
                    // });
                    // if (!object_workflow) {
                    //     return false;
                    // }
                    // if (record && record.instances && record.instances.length > 0) {
                    //     return false;
                    // }else if(record && !_.has(record,'instances') ){
					// 	// 如果record存在，且record的instances字段不存在，则再查询一次
					// 	var queryResult = Steedos.authRequest("/graphql", {
					// 		type: 'POST',
					// 		async: false,
					// 		data: JSON.stringify({
					// 			query: `{record:${object_name}__findOne(id: "${record_id}"){instances}}`
					// 		}),
					// 		contentType: 'application/json',
					// 		error: function () { }
					// 	});
					// 	var recordDoc = queryResult && queryResult.data && queryResult.data.record;
					// 	if (recordDoc && recordDoc.instances && recordDoc.instances.length > 0) {
					// 		return false;
					// 	}
					// }
                    // return true;
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
                    var allowCreate = Steedos.Object.base.actions.standard_new.visible.apply(this, arguments);
                    var objectName = objectName;
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
                }
            },
            standard_export_excel:{
                visible: function(objectName,  record_id, record_permissions, props){
                    return !props._isRelated && record_permissions.allowExport;
                }
            }
        }
    }
}
