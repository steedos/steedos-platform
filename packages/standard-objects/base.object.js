
const objectql = require("@steedos/objectql");
const wrapAsync = objectql.wrapAsync;

const objectWebhooksPreSend = function (userId, doc, object_name, action) {
    var spaceId = doc.space;
    if (spaceId == '{spaceId}') {
        return;
    }
    if (!spaceId) {
        // console.error('not found spaceId');
        return;
    }
    var actionUserInfo, obj, owCollection, redirectUrl;
    if (!ObjectWebhooksQueue) {
        console.error('not found ObjectWebhooksQueue');
        return;
    }
    owCollection = Creator.getCollection('object_webhooks');
    if (!owCollection) {
        console.error('not found collection object_webhooks');
        return;
    }

    obj = Creator.getObject(object_name);
    actionUserInfo = Creator.getCollection('users').findOne(userId, {
        fields: {
            name: 1
        }
    });
    redirectUrl = Creator.getObjectAbsoluteUrl(object_name, doc._id, "-");
    owCollection.find({
        object_name: object_name,
        active: true,
        events: action,
        space: spaceId
    }).forEach(function (oh) {
        var data;
        data = {};
        if (_.isEmpty(oh.fields)) {
            data = doc;
        } else {
            _.each(oh.fields, function (fieldName) {
                var objField, refCollection, refFilterFields, refNameFieldKey, refObj, refRecord;
                objField = obj.fields[fieldName];
                if (objField.type === 'lookup' && _.isString(objField.reference_to) && !objField.multiple) {
                    refCollection = Creator.getCollection(objField.reference_to);
                    refObj = Creator.getObject(objField.reference_to);
                    if (refCollection && refObj) {
                        refNameFieldKey = refObj.NAME_FIELD_KEY;
                        refFilterFields = {};
                        refFilterFields[refNameFieldKey] = 1;
                        refRecord = refCollection.findOne(doc[fieldName], refFilterFields);
                        if (refRecord) {
                            return data[fieldName] = refRecord[refNameFieldKey];
                        }
                    }
                } else {
                    return data[fieldName] = doc[fieldName];
                }
            });
        }
        return ObjectWebhooksQueue.send({
            data: data,
            payload_url: oh.payload_url,
            content_type: oh.content_type,
            action: action,
            actionUserInfo: actionUserInfo,
            objectName: object_name,
            objectDisplayName: obj.label,
            nameFieldKey: obj.NAME_FIELD_KEY,
            redirectUrl: redirectUrl
        });
    });
};

// const fieldFormulaBeforeUpdate = function(userId, doc, fieldNames, modifier, options){
//     wrapAsync(objectql.fieldFormulaTriggers.beforeUpdate, Object.assign({userId: userId, spaceId: doc.space, id: doc._id, doc: modifier.$set, previousDoc: doc, object_name: this.object_name}))
// }

// const fieldFormulaBeforeInsert = function(userId, doc){
//     wrapAsync(objectql.fieldFormulaTriggers.beforeInsert, Object.assign({userId: userId, spaceId: doc.space, doc: doc, object_name: this.object_name}))
// }

// const fieldFormulaAfterUpdate = function(userId, doc, fieldNames, modifier, options){
//     wrapAsync(objectql.fieldFormulaTriggers.afterUpdate, Object.assign({userId: userId, spaceId: doc.space, id: doc._id, doc: doc, previousDoc: this.previous, object_name: this.object_name}))
// }

const getUserObjectPermission = function(obj, userSession){
    let getSessionFn = function () {
      return obj.getUserObjectPermission(userSession);
    }
    return wrapAsync(getSessionFn, {});
}

module.exports = {
    extend: 'base',
    actions: {
        standard_query: {
            label: "Search",
            visible: true,
            on: "list",
            todo: "standard_query"
        },
        standard_new: {
            label: "New",
            visible: function () {
                var permissions;
                permissions = Creator.getPermissions();
                if (permissions) {
                    return permissions["allowCreate"];
                }
            },
            on: "list",
            todo: "standard_new"
        },
        standard_open_view: {
            label: "Open",
            visible: false,
            on: "list_item",
            todo: "standard_open_view"
        },
        standard_edit: {
            label: "Edit",
            sort: 0,
            visible: function (object_name, record_id, record_permissions) {
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
            },
            on: "record",
            todo: "standard_edit"
        },
        standard_delete: {
            label: "Delete",
            visible: function (object_name, record_id, record_permissions) {
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
            },
            on: "record_more",
            todo: "standard_delete"
        },
        standard_delete_many: {
            label: "Delete",
            visible: function (object_name, record_id, record_permissions) {
                var object = Creator.getObject(object_name);
                var perms = object && object.permissions.get();
                return perms && perms["allowDelete"];
            },
            on: "list",
            todo: function () {
                object_name = this.object_name;
                list_view_id = Session.get("list_view_id") || "all";
                listViewName = "listview_" + object_name + "_" + list_view_id;
                Creator.executeAction(object_name, {todo: 'standard_delete'}, null, null, listViewName);
            }
        },
        standard_approve: {
            label: "Initiate Approval",
            visible: function (object_name, record_id, record_permissions) {
                if (!Session.get("record_id")) {
                    /*只在详细界面显示这个action*/
                    return false;
                }
                var object_workflow, record;
                if (record_permissions && !record_permissions["allowEdit"]) {
                    return false;
                }
                record = Creator.getObjectRecord(object_name, record_id);
                record_permissions = Creator.getRecordPermissions(object_name, record, Meteor.userId());
                if (record_permissions && !record_permissions["allowEdit"]) {
                    return false;
                }
                object_workflow = _.find(Creator.object_workflows, function (ow) {
                    return ow.object_name === object_name;
                });
                if (!object_workflow) {
                    return false;
                }
                if (record && record.instances && record.instances.length > 0) {
                    return false;
                }
                return true;
            },
            on: "record_only",
            todo: function () {
                return window.Modal.show('initiate_approval', {
                    object_name: this.object_name,
                    record_id: this.record_id
                });
            }
        },
        standard_view_instance: {
            label: "View Instance",
            visible: function (object_name, record_id, record_permissions) {
                if (!Session.get("record_id")) {
                    /*只在详细界面显示这个action*/
                    return false;
                }
                var record;
                record = Creator.getObjectRecord(object_name, record_id);
                if (record && !_.isEmpty(record.instances)) {
                    return true;
                }
                return false;
            },
            on: "record_only",
            todo: function () {
                var data, instanceId, uobj, url;
                if (!this.record.instances || !this.record.instances[0]) {
                    toastr.error('申请单已删除');
                    Template.creator_view.currentInstance.onEditSuccess();
                    return;
                }
                instanceId = this.record.instances[0]._id;
                if (!instanceId) {
                    console.error('instanceId not exists');
                    return;
                }
                uobj = {};
                uobj['X-User-Id'] = Meteor.userId();
                uobj['X-Auth-Token'] = Accounts._storedLoginToken();
                data = {
                    object_name: this.object_name,
                    record_id: this.record_id,
                    space_id: Session.get("spaceId")
                };
                url = Steedos.absoluteUrl() + ("api/workflow/view/" + instanceId + "?") + $.param(uobj);
                data = JSON.stringify(data);
                $(document.body).addClass('loading');
                return $.ajax({
                    url: url,
                    type: 'POST',
                    async: true,
                    data: data,
                    dataType: 'json',
                    processData: false,
                    contentType: 'application/json',
                    success: function (responseText, status) {
                        $(document.body).removeClass('loading');
                        if (responseText.errors) {
                            responseText.errors.forEach(function (e) {
                                toastr.error(e.errorMessage);
                            });
                            Template.creator_view.currentInstance.onEditSuccess();
                            return;
                        } else if (responseText.redirect_url) {
                            if (Meteor.settings.public.webservices && Meteor.settings.public.webservices.workflow && Meteor.settings.public.webservices.workflow.url) {
                                Steedos.openWindow(responseText.redirect_url);
                            } else {
                                Steedos.openWindow(Steedos.absoluteUrl(responseText.redirect_url));
                            }

                        }
                    },
                    error: function (xhr, msg, ex) {
                        $(document.body).removeClass('loading');
                        toastr.error(msg);
                        Template.creator_view.currentInstance.onEditSuccess();
                    }
                });
            }
        },
        standard_follow: {
            label: "Follow",
            visible: function () {
                if (Creator.getObject()) {
                    return Creator.getObject().enable_follow
                }
                return false;
            },
            on: "list",
            todo: function () {
                var follow = Creator.getCollection("follows").findOne({ object_name: Session.get("object_name") });
                if (follow) {
                    Creator.odata.delete('follows', follow._id, function () { });
                } else {
                    Creator.odata.insert('follows', { object_name: Session.get("object_name") });
                }
            }
        },
        standard_submit_for_approval: {
            visible: function (object_name, record_id) {
                return Steedos.ProcessManager.allowSubmit(object_name, record_id);
            },
            on: "record_only",
            todo: function (object_name, record_id) {
                Steedos.ProcessManager.submit(object_name, record_id);
            }
        }
    },

    triggers: {
        // "before.insert.server.default": {
        //     on: "server",
        //     when: "before.insert",
        //     todo: function (userId, doc) {
        //         doc.created = new Date();
        //         doc.modified = new Date();
        //         if (userId) {
        //             if (!doc.owner) {
        //                 doc.owner = userId;
        //             }
        //             if (doc.owner === '{userId}') {
        //                 doc.owner = userId;
        //             }
        //             doc.created_by = userId;
        //             doc.modified_by = userId;
        //         }
        //         var extras = ["spaces", "company", "organizations", "users", "space_users"];
        //         if (extras.indexOf(this.object_name) < 0 && doc.space) {
        //             /* company_ids/company_id默认值逻辑*/
        //             if (!doc.company_id || !doc.company_ids) {
        //                 var su;
        //                 if (userId) {
        //                     su = Creator.getCollection("space_users").findOne({ space: doc.space, user: userId }, {
        //                         fields: { company_id: 1 }
        //                     });
        //                 }
        //                 if (!doc.company_id) {
        //                     if (doc.company_ids && doc.company_ids.length) {
        //                         /* 如果用户在界面上指定了company_ids，则取第一个值 */
        //                         doc.company_id = doc.company_ids[0];
        //                     }
        //                     else if (su && su.company_id) {
        //                         doc.company_id = su.company_id;
        //                     }
        //                 }
        //                 if (!doc.company_ids) {
        //                     if (doc.company_id) {
        //                         /* 如果用户在界面上指定了company_id，则取其值输入 */
        //                         doc.company_ids = [doc.company_id];
        //                     }
        //                     else if (su && su.company_id) {
        //                         doc.company_ids = [su.company_id];
        //                     }
        //                 }
        //             }
        //         }
        //     }
        // },
        // "before.update.server.default": {
        //     on: "server",
        //     when: "before.update",
        //     todo: function (userId, doc, fieldNames, modifier, options) {
        //         modifier.$set = modifier.$set || {};
        //         modifier.$unset = modifier.$unset || {};
        //         modifier.$set.modified = new Date();
        //         if (userId) {
        //             modifier.$set.modified_by = userId;
        //         }
        //         var extras = ["spaces", "company", "organizations", "users", "space_users"];
        //         if (extras.indexOf(this.object_name) < 0) {
        //             /* company_ids/company_id级联修改逻辑*/
        //             if (_.has(modifier.$set, "company_ids")) {
        //                 /*
        //                     原则上应该将 company_ids 设置为可编辑，company_id 设置为只读。
        //                     当 company_ids 可编辑时，修改 company_ids 同时更新 company_id = company_ids[0]
        //                 */
        //                 var firstCompanyId = modifier.$set.company_ids ? modifier.$set.company_ids[0] : null;
        //                 if (firstCompanyId) {
        //                     modifier.$set.company_id = firstCompanyId;
        //                 }
        //                 else {
        //                     modifier.$unset.company_id = 1;
        //                 }
        //             }
        //             else if (_.has(modifier.$set, "company_id")) {
        //                 /*
        //                     考虑到兼容老项目，允许将 company_id 设置为可编辑，此时 company_ids 必须只读。
        //                     当 company_id 可编辑时，修改 company_id 同时更新 company_ids = [company_id]
        //                 */
        //                 if (modifier.$set.company_id) {
        //                     modifier.$set.company_ids = [modifier.$set.company_id];
        //                 }
        //                 else {
        //                     modifier.$unset.company_ids = 1;
        //                 }
        //             }
        //         }
        //         if (_.isEmpty(modifier.$unset)) {
        //             delete modifier.$unset;
        //         }
        //     }
        // },
        "before.insert.client.default": {
            on: "client",
            when: "before.insert",
            todo: function (userId, doc) {
                return doc.space = Session.get("spaceId");
            }
        },
        // "after.update.server.audit": {
        //     "on": "server",
        //     when: "after.update",
        //     todo: function (userId, doc, fieldNames, modifier, options) {
        //         var obj, object_name, ref;
        //         object_name = this.object_name;
        //         obj = Creator.getObject(object_name);
        //         if (obj.enable_audit) {
        //             return (ref = Creator.AuditRecords) != null ? ref.add('update', userId, this.object_name, doc, this.previous, modifier) : void 0;
        //         }
        //     }
        // },
        // "after.insert.server.audit": {
        //     "on": "server",
        //     when: "after.insert",
        //     todo: function (userId, doc) {
        //         var obj, object_name, ref;
        //         object_name = this.object_name;
        //         obj = Creator.getObject(object_name);
        //         if (obj.enable_audit) {
        //             return (ref = Creator.AuditRecords) != null ? ref.add('insert', userId, this.object_name, doc) : void 0;
        //         }
        //     }
        // },
        // "after.insert.server.objectwebhooks": {
        //     "on": "server",
        //     when: "after.insert",
        //     todo: function (userId, doc) {
        //         return objectWebhooksPreSend(userId, doc, this.object_name, 'create');
        //     }
        // },
        // "after.update.server.objectwebhooks": {
        //     "on": "server",
        //     when: "after.update",
        //     todo: function (userId, doc, fieldNames, modifier, options) {
        //         return objectWebhooksPreSend(userId, doc, this.object_name, 'update');
        //     }
        // },
        // "after.delete.server.objectwebhooks": {
        //     "on": "server",
        //     when: "after.remove",
        //     todo: function (userId, doc) {
        //         return objectWebhooksPreSend(userId, doc, this.object_name, 'delete');
        //     }
        // },
        // "after.insert.server.autonumber": {
        //     "on": "server",
        //     when: "after.insert",
        //     todo: function (userId, doc) {
        //         var spaceId = doc.space;
        //         if (!spaceId) {
        //             return;
        //         }
        //         var obj, object_name, fields, setObj = {};
        //         object_name = this.object_name;
        //         obj = Creator.getObject(object_name);
        //         fields = obj.fields;
        //         var caculateAutonumber = function (objectName, fieldName, formula, spaceId) {
        //             var padding = function (num, length) {
        //                 var len = (num + "").length;
        //                 var diff = length - len;
        //                 if (diff > 0) {
        //                     return Array(diff + 1).join("0") + num;
        //                 }
        //                 return num;
        //             };
        //             var anColl = Creator.getCollection('autonumber');
        //             var date_from, date_to;
        //             var selector = {
        //                 object_name: objectName,
        //                 field_name: fieldName,
        //                 space: spaceId
        //             };
        //             var m = moment();
        //             var yyyy = m.format('YYYY'),
        //                 yy = m.format('YY'),
        //                 mm = m.format('MM'),
        //                 dd = m.format('DD');
        //             var hasYear = formula.indexOf('{YYYY}') > -1;
        //             var hasMonth = formula.indexOf('{MM}') > -1;
        //             var hasDay = formula.indexOf('{DD}') > -1;
        //             if (hasYear && hasMonth && hasDay) {
        //                 date_from = m.startOf("day").toDate();
        //                 date_to = m.endOf("day").toDate();
        //             } else if (hasYear && hasMonth) {
        //                 date_from = m.startOf("month").toDate();
        //                 date_to = m.endOf("month").toDate();
        //             } else if (hasYear) {
        //                 date_from = m.startOf("year").toDate();
        //                 date_to = m.endOf("year").toDate();
        //             }
        //             if (date_from && date_to) {
        //                 selector.date_from = date_from;
        //                 selector.date_to = date_to;
        //             } else {
        //                 selector.date_from = null;
        //                 selector.date_to = null;
        //             }
        //             var anData = anColl.findOne(selector),
        //                 anId;
        //             if (anData) {
        //                 anId = anData._id;
        //                 anColl.update(anId, {
        //                     $inc: {
        //                         current_no: 1
        //                     }
        //                 });
        //             } else {
        //                 anId = anColl._makeNewID();
        //                 var insertObj = {
        //                     _id: anId,
        //                     object_name: objectName,
        //                     field_name: fieldName,
        //                     space: spaceId
        //                 };
        //                 if (date_from && date_to) {
        //                     insertObj.date_from = date_from;
        //                     insertObj.date_to = date_to;
        //                 }
        //                 anColl.direct.insert(insertObj);
        //             }
        //             var currentNo = anColl.findOne(anId).current_no;

        //             var numberFormatMethod = function ($1) {
        //                 return padding(currentNo, $1.length - 2);
        //             };
        //             var autonumber = formula.replace(/{YYYY}/g, yyyy).replace(/{YY}/g, yy).replace(/{MM}/g, mm).replace(/{DD}/g, dd).replace(/{[0]+}/g, numberFormatMethod);
        //             return autonumber;
        //         };
        //         _.each(fields, function (f, k) {
        //             if (f.type == 'autonumber' && f.formula) {
        //                 setObj[k] = caculateAutonumber(object_name, k, f.formula, spaceId);
        //             }
        //         });
        //         if (!_.isEmpty(setObj)) {
        //             Creator.getCollection(object_name).direct.update(doc._id, {
        //                 $set: setObj
        //             });
        //         }
        //         return;
        //     }
        // },
        // "before.insert.server.masterDetail": {
        //     on: "server",
        //     when: "before.insert",
        //     todo: function (userId, doc) {
        //         /*子表 master_detail 字段类型新增属性 sharing #1461*/
        //         setDetailOwner(doc, this.object_name, userId);
        //     }
        // },
        // "before.update.server.masterDetail": {
        //     on: "server",
        //     when: "before.update",
        //     todo: function (userId, doc, fieldNames, modifier, options) {
        //         modifier.$set = modifier.$set || {};
        //         /*子表 master_detail 字段类型新增属性 sharing #1461*/
        //         setDetailOwner(_.extend({}, doc, modifier.$set), this.object_name, userId);
        //     }
        // },
        // "after.update.server.masterDetail": {
        //     "on": "server",
        //     when: "after.update",
        //     todo: function (userId, doc, fieldNames, modifier, options) {
        //         /* Master-Detail 规则确认 #189 */
        //         let docOwner = doc.owner;
        //         if (docOwner !== this.previous.owner) {
        //             let object_name = this.object_name;
        //             let docId = doc._id;
        //             const obj = objectql.getObject(object_name);
        //             const details = obj && obj.details;
        //             if(details && details.length){
        //                 /* 如果当前对象存在子表的话，调整所有子表记录的owner以保持一致 */
        //                 _.each(details, (detail)=>{
        //                     const objDetail = objectql.getObject(detail);
        //                     let needToSync = false;
        //                     if(objDetail){
        //                         const detailMasters = objDetail.masters;
        //                         if(detailMasters.length > 1){
        //                             /* 如果子表有多个主表子表关系，则只有当前主对象为该子表首要主对象（即第一个主对象）时才需要同步owner值。 */
        //                             needToSync = detailMasters[0] === object_name;
        //                         }
        //                         else{
        //                             needToSync = true;
        //                         }
        //                     }
        //                     if(needToSync){
        //                         const detialFields = objDetail.fields;
        //                         const refField = _.find(detialFields,(n)=>{ return n.type === "master_detail" && n.reference_to === object_name;});
        //                         if(refField && refField.name){
        //                             let selector = { space: doc.space };
        //                             selector[refField.name] = docId;
        //                             Creator.getCollection(detail).direct.update(selector, { $set: { owner: docOwner } }, { multi: true });
        //                         }
        //                     }
        //                 });
        //             }
        //         }
        //     }
        // },
        // "after.delete.server.object_recent_viewed": {
        //     "on": "server",
        //     when: "after.remove",
        //     todo: function (userId, doc, fieldNames, modifier, options) {
        //         let selector = {
        //             "space": doc.space,
        //             "record.o": this.object_name,
        //             "record.ids": doc._id
        //         };
        //         Creator.getCollection('object_recent_viewed').direct.remove(selector);
        //     }
        // },
        // "before.update.server.processRecordLockCheck": {
        //     on: 'server',
        //     when: 'before.update',
        //     todo: function(userId, doc, fieldNames, modifier, options){

        //     }
        // }
    }
};
function setDetailOwner(doc, object_name, userId) {
    if(!userId){
        return;
    }
    if (object_name.startsWith('cfs.')) {
        return;
    }
    let masterRecordOwner = '';
    const obj = objectql.getObject(object_name);
    const masters = obj && obj.masters;
    if(masters && masters.length){
        /* 
            如果当前修改的对象是其他对象的子表对象，这里有两个逻辑需要处理：
            1.必须至少具体其所有父对象关联记录的只读权限或可编辑权限（是只读还是可编辑取决于子表关系字段上是否勾选了write_requires_master_read属性）才能新建/编辑当前记录 
            2.当前记录的owner强制设置为其关联的首要主对象（即masters中第一个对象）记录的owner值
        */
        _.each(masters, (master, index)=>{
            const objFields = obj.fields;
            const refField = _.find(objFields,(n)=>{ return n.type === "master_detail" && n.reference_to === master;});
            if(refField && refField.name){
                let write_requires_master_read = refField.write_requires_master_read || false; /* 默认对主表有编辑权限才可新建或者编辑子表 */
                let masterAllow = false;
                const objMaster = objectql.getObject(master);
                /* 上面先判断一次对象级权限是因为有可能新建修改子表记录时未选择关联父记录字段值，以下是判断关联父记录的权限 */
                let refFieldValue = doc[refField.name];
                if(refFieldValue && _.isString(refFieldValue)) { /* isString是为排除字段属性multiple:true的情况 */
                    let nameFieldKey = objMaster.NAME_FIELD_KEY;
                    let recordMaster = objMaster.findOne(refFieldValue, {fields:[nameFieldKey, "owner", "space", "locked", "company_id", "company_ids"]});
                    if(recordMaster){
                        if (userId && recordMaster.space){
                            masterAllow = false;
                            let masterRecordPerm = Creator.getRecordPermissions(master, recordMaster, userId, recordMaster.space);
                            if (write_requires_master_read == true) {
                                masterAllow = masterRecordPerm.allowRead;
                            }
                            else if (write_requires_master_read == false) {
                                masterAllow = masterRecordPerm.allowEdit;
                            }
                            if (!masterAllow) {
                                throw new Meteor.Error(400, `缺少当前子对象${object_name}的主对象”${master}“的“${write_requires_master_read ? "只读" : "编辑"}权限”，不能选择主表记录： “${recordMaster[nameFieldKey]}”。`);
                            }

                        }
                        if(index === 0){
                            /* 子表记录owner同步为masters中第一个对象记录的owner值 */
                            masterRecordOwner = recordMaster.owner;
                        }
                    }
                }
            }
        });
    }
    if (masterRecordOwner) {
        /* masterRecordOwner为空说明子表上未选择关联你父记录，此时owner会默认取当前用户的owner */
        doc.owner = masterRecordOwner;
    }
}
