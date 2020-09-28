
// const objectql = require("@steedos/objectql");
// const wrapAsync = objectql.wrapAsync;

const objectWebhooksPreSend = function (userId, doc, object_name, action) {
    var spaceId = doc.space;
    if (spaceId == '{spaceId}') {
        return;
    }
    if (!spaceId) {
        console.error('not found spaceId');
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
            on: "record",
            todo: function () {
                return Modal.show('initiate_approval', {
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
            on: "record",
            todo: function () {
                var data, instanceId, uobj, url;
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
            on: "record_only_more",
            todo: function(object_name, record_id){
                Steedos.ProcessManager.submit(object_name, record_id);
            }
        }
    },

    triggers: {
        "before.insert.server.default": {
            on: "server",
            when: "before.insert",
            todo: function (userId, doc) {
                doc.created = new Date();
                doc.modified = new Date();
                if (userId) {
                    if (!doc.owner) {
                        doc.owner = userId;
                    }
                    if (doc.owner === '{userId}') {
                        doc.owner = userId;
                    }
                    doc.created_by = userId;
                    doc.modified_by = userId;
                }
                var extras = ["spaces", "company", "organizations", "users", "space_users"];
                if (extras.indexOf(this.object_name) < 0 && doc.space) {
                    /* company_ids/company_id默认值逻辑*/
                    if (!doc.company_id || !doc.company_ids) {
                        var su;
                        if (userId) {
                            su = Creator.getCollection("space_users").findOne({ space: doc.space, user: userId }, {
                                fields: { company_id: 1 }
                            });
                        }
                        if (!doc.company_id) {
                            if (doc.company_ids && doc.company_ids.length) {
                                /* 如果用户在界面上指定了company_ids，则取第一个值 */
                                doc.company_id = doc.company_ids[0];
                            }
                            else if (su && su.company_id) {
                                doc.company_id = su.company_id;
                            }
                        }
                        if (!doc.company_ids) {
                            if (doc.company_id) {
                                /* 如果用户在界面上指定了company_id，则取其值输入 */
                                doc.company_ids = [doc.company_id];
                            }
                            else if (su && su.company_id) {
                                doc.company_ids = [su.company_id];
                            }
                        }
                    }
                }
            }
        },
        "before.update.server.default": {
            on: "server",
            when: "before.update",
            todo: function (userId, doc, fieldNames, modifier, options) {
                modifier.$set = modifier.$set || {};
                modifier.$unset = modifier.$unset || {};
                modifier.$set.modified = new Date();
                if (userId) {
                    modifier.$set.modified_by = userId;
                }
                var extras = ["spaces", "company", "organizations", "users", "space_users"];
                if (extras.indexOf(this.object_name) < 0) {
                    /* company_ids/company_id级联修改逻辑*/
                    if (_.has(modifier.$set, "company_ids")) {
                        /*
                            原则上应该将 company_ids 设置为可编辑，company_id 设置为只读。
                            当 company_ids 可编辑时，修改 company_ids 同时更新 company_id = company_ids[0]
                        */
                        var firstCompanyId = modifier.$set.company_ids ? modifier.$set.company_ids[0] : null;
                        if (firstCompanyId) {
                            modifier.$set.company_id = firstCompanyId;
                        }
                        else {
                            modifier.$unset.company_id = 1;
                        }
                    }
                    else if (_.has(modifier.$set, "company_id")) {
                        /*
                            考虑到兼容老项目，允许将 company_id 设置为可编辑，此时 company_ids 必须只读。
                            当 company_id 可编辑时，修改 company_id 同时更新 company_ids = [company_id]
                        */
                        if (modifier.$set.company_id) {
                            modifier.$set.company_ids = [modifier.$set.company_id];
                        }
                        else {
                            modifier.$unset.company_ids = 1;
                        }
                    }
                }
                if (_.isEmpty(modifier.$unset)) {
                    delete modifier.$unset;
                }
            }
        },
        "before.insert.client.default": {
            on: "client",
            when: "before.insert",
            todo: function (userId, doc) {
                return doc.space = Session.get("spaceId");
            }
        },
        "after.update.server.audit": {
            "on": "server",
            when: "after.update",
            todo: function (userId, doc, fieldNames, modifier, options) {
                var obj, object_name, ref;
                object_name = this.object_name;
                obj = Creator.getObject(object_name);
                if (obj.enable_audit) {
                    return (ref = Creator.AuditRecords) != null ? ref.add('update', userId, this.object_name, doc, this.previous, modifier) : void 0;
                }
            }
        },
        "after.insert.server.audit": {
            "on": "server",
            when: "after.insert",
            todo: function (userId, doc) {
                var obj, object_name, ref;
                object_name = this.object_name;
                obj = Creator.getObject(object_name);
                if (obj.enable_audit) {
                    return (ref = Creator.AuditRecords) != null ? ref.add('insert', userId, this.object_name, doc) : void 0;
                }
            }
        },
        "after.insert.server.objectwebhooks": {
            "on": "server",
            when: "after.insert",
            todo: function (userId, doc) {
                return objectWebhooksPreSend(userId, doc, this.object_name, 'create');
            }
        },
        "after.update.server.objectwebhooks": {
            "on": "server",
            when: "after.update",
            todo: function (userId, doc, fieldNames, modifier, options) {
                return objectWebhooksPreSend(userId, doc, this.object_name, 'update');
            }
        },
        "after.delete.server.objectwebhooks": {
            "on": "server",
            when: "after.remove",
            todo: function (userId, doc) {
                return objectWebhooksPreSend(userId, doc, this.object_name, 'delete');
            }
        },
        "after.insert.server.autonumber": {
            "on": "server",
            when: "after.insert",
            todo: function (userId, doc) {
                var spaceId = doc.space;
                if (!spaceId) {
                    return;
                }
                var obj, object_name, fields, setObj = {};
                object_name = this.object_name;
                obj = Creator.getObject(object_name);
                fields = obj.fields;
                var caculateAutonumber = function (objectName, fieldName, formula, spaceId) {
                    var padding = function (num, length) {
                        var len = (num + "").length;
                        var diff = length - len;
                        if (diff > 0) {
                            return Array(diff + 1).join("0") + num;
                        }
                        return num;
                    };
                    var anColl = Creator.getCollection('autonumber');
                    var date_from, date_to;
                    var selector = {
                        object_name: objectName,
                        field_name: fieldName,
                        space: spaceId
                    };
                    var m = moment();
                    var yyyy = m.format('YYYY'),
                        yy = m.format('YY'),
                        mm = m.format('MM'),
                        dd = m.format('DD');
                    var hasYear = formula.indexOf('{YYYY}') > -1;
                    var hasMonth = formula.indexOf('{MM}') > -1;
                    var hasDay = formula.indexOf('{DD}') > -1;
                    if (hasYear && hasMonth && hasDay) {
                        date_from = m.startOf("day").toDate();
                        date_to = m.endOf("day").toDate();
                    } else if (hasYear && hasMonth) {
                        date_from = m.startOf("month").toDate();
                        date_to = m.endOf("month").toDate();
                    } else if (hasYear) {
                        date_from = m.startOf("year").toDate();
                        date_to = m.endOf("year").toDate();
                    }
                    if (date_from && date_to) {
                        selector.date_from = date_from;
                        selector.date_to = date_to;
                    } else {
                        selector.date_from = null;
                        selector.date_to = null;
                    }
                    var anData = anColl.findOne(selector),
                        anId;
                    if (anData) {
                        anId = anData._id;
                        anColl.update(anId, {
                            $inc: {
                                current_no: 1
                            }
                        });
                    } else {
                        anId = anColl._makeNewID();
                        var insertObj = {
                            _id: anId,
                            object_name: objectName,
                            field_name: fieldName,
                            space: spaceId
                        };
                        if (date_from && date_to) {
                            insertObj.date_from = date_from;
                            insertObj.date_to = date_to;
                        }
                        anColl.direct.insert(insertObj);
                    }
                    var currentNo = anColl.findOne(anId).current_no;

                    var numberFormatMethod = function ($1) {
                        return padding(currentNo, $1.length - 2);
                    };
                    var autonumber = formula.replace(/{YYYY}/g, yyyy).replace(/{YY}/g, yy).replace(/{MM}/g, mm).replace(/{DD}/g, dd).replace(/{[0]+}/g, numberFormatMethod);
                    return autonumber;
                };
                _.each(fields, function (f, k) {
                    if (f.type == 'autonumber' && f.formula) {
                        setObj[k] = caculateAutonumber(object_name, k, f.formula, spaceId);
                    }
                });
                if (!_.isEmpty(setObj)) {
                    Creator.getCollection(object_name).direct.update(doc._id, {
                        $set: setObj
                    });
                }
                return;
            }
        },
        "before.insert.server.masterDetail": {
            on: "server",
            when: "before.insert",
            todo: function (userId, doc) {
                /*子表 master_detail 字段类型新增属性 sharing #1461*/
                setDetailOwner(doc, this.object_name, userId);
            }
        },
        "before.update.server.masterDetail": {
            on: "server",
            when: "before.update",
            todo: function (userId, doc, fieldNames, modifier, options) {
                modifier.$set = modifier.$set || {};
                /*子表 master_detail 字段类型新增属性 sharing #1461*/
                setDetailOwner(modifier.$set, this.object_name, userId);
            }
        },
        "after.update.server.masterDetail": {
            "on": "server",
            when: "after.update",
            todo: function (userId, doc, fieldNames, modifier, options) {
                /* Master-Detail 规则确认 #189 */
                let docOwner = doc.owner;
                if (docOwner !== this.previous.owner) {
                    let object_name = this.object_name;
                    let docId = doc._id;
                    let objField = {};
                    /* 当主表的owner改变，调整所有子表的owner以保持一致 */
                    _.each(Creator.Objects, function (obj) {
                        let objName = obj.name;
                        if (objField[objName]) {
                            return;
                        }
                        _.each(obj.fields, function (f, k) {
                            if (f.type === 'master_detail' && f.reference_to === object_name) {
                                objField[objName] = k;
                            }
                        });
                    });
                    _.each(objField, function (fieldName, objName) {
                        let selector = { space: doc.space };
                        selector[fieldName] = docId;
                        Creator.getCollection(objName).direct.update(selector, { $set: { owner: docOwner } }, { multi: true });
                    });

                }
            }
        },
        "after.delete.server.object_recent_viewed": {
            "on": "server",
            when: "after.remove",
            todo: function (userId, doc, fieldNames, modifier, options) {
                let selector = {
                    "space": doc.space,
                    "record.o": this.object_name,
                    "record.ids": doc._id
                };
                Creator.getCollection('object_recent_viewed').direct.remove(selector);
            }
        },
        // "before.update.server.processRecordLockCheck": {
        //     on: 'server',
        //     when: 'before.update',
        //     todo: function(userId, doc, fieldNames, modifier, options){

        //     }
        // }
    }
};
function setDetailOwner(doc, object_name, userId) {
    let obj = Creator.getObject(object_name);
    let masterRecordOwner = '';
    _.each(obj.fields, function (f, k) {
        if (f.type === 'master_detail' && doc[k] && f.reference_to) { /* 如果本次修改的是master_detail字段 */
            let masterObjectName = f.reference_to;
            let masterCollection = Creator.getCollection(masterObjectName);
            let masterId = doc[k];
            if (masterId && _.isString(masterId)) { /* 排除字段属性multiple:true的情况 */
                let masterObject = Creator.getObject(masterObjectName);
                let nameFieldKey = masterObject.NAME_FIELD_KEY;
                let masterRecord = masterCollection.findOne(doc[k]);
                if (masterRecord) {
                    if (userId && masterRecord.space) { /* 新增和修改子表记录中的master_detial字段时需要根据sharing校验是否有权限新增和修改 */
                        let sharing = f.sharing || 'masterWrite'; /* 默认对主表有编辑权限才可新建或者编辑子表 */
                        let masterAllow = false;
                        let masterRecordPerm = Creator.getRecordPermissions(masterObjectName, masterRecord, userId, masterRecord.space);
                        if (sharing == 'masterRead') {
                            masterAllow = masterRecordPerm.allowRead;
                        }
                        else if (sharing == 'masterWrite') {
                            masterAllow = masterRecordPerm.allowEdit;
                        }
                        if (!masterAllow) {
                            throw new Meteor.Error(400, `不能选择主表记录： ${masterRecord[nameFieldKey]}。`);
                        }
                    }
                    masterRecordOwner = masterRecord.owner;
                }
            }
        }
    });
    if (masterRecordOwner) {
        doc.owner = masterRecordOwner;
    }
}
